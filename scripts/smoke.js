#!/usr/bin/env node
/**
 * Functional smoke test for the keyboard layer, against the local preview
 * server. Not a unit-test suite — it drives the real pages the way a keyboard
 * user would and asserts what they'd expect to happen.
 *
 *   npm run preview     # in one terminal
 *   node scripts/smoke.js
 */
const puppeteer = require("puppeteer-core");
const { Launcher } = require("chrome-launcher");

const BASE = process.env.LH_BASE || "http://localhost:8080";

let failures = 0;
function check(name, ok, detail) {
  console.log(
    `${ok ? "  ok  " : "  FAIL"}  ${name}${ok || !detail ? "" : "  → " + detail}`,
  );
  if (!ok) failures++;
}

const active = (page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    return {
      tag: el.tagName,
      id: el.id,
      cls: el.className,
      text: (el.textContent || "").trim().slice(0, 40),
      href: el.getAttribute ? el.getAttribute("href") : null,
    };
  });

(async () => {
  const browser = await puppeteer.launch({
    executablePath: Launcher.getFirstInstallation(),
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });

  const errors = [];
  const page = await browser.newPage();
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  // Headless Chrome reports a dark preference by default; pin it so the theme
  // assertions below have a known starting point.
  await page.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: "light" },
  ]);

  /* ---------------------------------------------------------------- index */
  console.log("\nIndex — search and arrow-key navigation");
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });

  await page.keyboard.press("Slash");
  check("`/` focuses the search box", (await active(page)).id === "q");

  await page.type("#q", "alert fat");
  await new Promise((r) => setTimeout(r, 500));

  const visibleCards = await page.$$eval(
    ".terms > li:not([hidden]) .term-card",
    (a) => a.map((el) => el.textContent.trim().split("\n")[0]),
  );
  check(
    "typing filters the list",
    visibleCards.length === 1,
    `${visibleCards.length} shown`,
  );
  check(
    "the surviving card is the right one",
    /Alert Fatigue/.test(visibleCards[0] || ""),
  );

  const visibleSections = await page.$$eval(
    ".letter:not([hidden])",
    (a) => a.length,
  );
  check(
    "empty letter sections collapse",
    visibleSections === 1,
    `${visibleSections} sections`,
  );

  const status = await page.$eval("#result-count", (el) => el.textContent);
  check(
    "the live region reports the count",
    /1 term matches/.test(status),
    status,
  );

  await page.keyboard.press("ArrowDown");
  const first = await active(page);
  check(
    "`↓` from the search box enters the list",
    first.cls.includes("term-card"),
    first.tag,
  );
  check(
    "the active card is marked",
    first.cls.includes("is-active"),
    first.cls,
  );

  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 300));

  await page.click("#q");
  await page.keyboard.press("Escape");
  const cleared = await page.$eval("#q", (el) => el.value);
  check("`Esc` clears the filter", cleared === "", JSON.stringify(cleared));
  const allBack = await page.$$eval(
    ".terms > li:not([hidden])",
    (a) => a.length,
  );
  check("all terms come back", allBack === 549, String(allBack));

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  const third = await active(page);
  check(
    "`↓` steps through cards",
    third.href === "/actionable-alert/",
    third.href,
  );

  await page.keyboard.press("ArrowUp");
  const second = await active(page);
  check("`↑` steps back", second.href === "/acknowledge-time/", second.href);

  await page.keyboard.press("Enter");
  await page.waitForNavigation({ waitUntil: "domcontentloaded" });
  check(
    "`Enter` opens the active term",
    page.url().endsWith("/acknowledge-time/"),
    page.url(),
  );

  /* ------------------------------------------------------------ term page */
  console.log("\nTerm page — palette and pager");
  await page.goto(BASE + "/acknowledge/", { waitUntil: "networkidle0" });

  await page.keyboard.press("Slash");
  await new Promise((r) => setTimeout(r, 600));
  check(
    "`/` opens the palette",
    await page.$eval("#palette", (el) => !el.hidden),
  );
  check(
    "focus moves into the palette",
    (await active(page)).id === "palette-input",
  );

  await page.type("#palette-input", "escal");
  await new Promise((r) => setTimeout(r, 300));
  const opts = await page.$$eval("#palette-results [role=option]", (a) =>
    a.map((el) => el.textContent),
  );
  check(
    "the palette filters",
    opts.length > 0 && opts.every((o) => /escal/i.test(o)),
    opts.join(", "),
  );

  await page.keyboard.press("ArrowDown");
  const selected = await page.$eval(
    "#palette-results [aria-selected=true]",
    (el) => el.textContent,
  );
  check("`↓` moves the palette selection", selected === opts[1], selected);

  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 200));
  check(
    "`Esc` closes the palette",
    await page.$eval("#palette", (el) => el.hidden),
  );
  check(
    "focus returns to the page",
    (await active(page)).id !== "palette-input",
  );

  await page.keyboard.down("Control");
  await page.keyboard.press("KeyK");
  await page.keyboard.up("Control");
  await new Promise((r) => setTimeout(r, 200));
  check(
    "`⌘K` / `Ctrl+K` opens the palette too",
    await page.$eval("#palette", (el) => !el.hidden),
  );
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 200));

  await page.keyboard.press("ArrowRight");
  await page.waitForNavigation({ waitUntil: "domcontentloaded" });
  check(
    "`→` goes to the next term",
    page.url().endsWith("/acknowledge-time/"),
    page.url(),
  );

  await page.keyboard.press("ArrowLeft");
  await page.waitForNavigation({ waitUntil: "domcontentloaded" });
  check("`←` goes back", page.url().endsWith("/acknowledge/"), page.url());

  /* ---------------------------------------------------------- A–Z jumps */
  console.log("\nIndex — alphabet jumps");
  for (const letter of ["H", "Z"]) {
    await page.goto(BASE + "/", { waitUntil: "networkidle0" });
    const startY = await page.evaluate(() => window.scrollY);
    await page.$eval(`.az__list a[href="#letter-${letter}"]`, (el) =>
      el.click(),
    );
    await new Promise((r) => setTimeout(r, 100));
    if (letter === "Z") {
      const motion = await page.$eval(`#letter-${letter}`, (el) => ({
        scrollY: window.scrollY,
        remaining: Math.abs(
          el.getBoundingClientRect().top -
            parseFloat(getComputedStyle(el).scrollMarginTop),
        ),
      }));
      check(
        "Z scrolls smoothly",
        motion.scrollY > startY && motion.remaining > 100,
        `${motion.scrollY.toFixed(0)}px moved, ${motion.remaining.toFixed(0)}px remaining`,
      );
    }
    await new Promise((r) => setTimeout(r, 950));
    const landing = await page.$eval(`#letter-${letter}`, (el) => ({
      error: Math.abs(
        el.getBoundingClientRect().top -
          parseFloat(getComputedStyle(el).scrollMarginTop),
      ),
      atBottom:
        Math.abs(
          window.scrollY -
            (document.documentElement.scrollHeight - window.innerHeight),
        ) < 2,
    }));
    check(
      `${letter} lands below the sticky controls`,
      landing.error <= 5 && !landing.atBottom,
      `${landing.error.toFixed(1)}px off${landing.atBottom ? ", at page bottom" : ""}`,
    );
  }

  /* ---------------------------------------------------------------- theme */
  console.log("\nTheme");
  check(
    "the system preference wins before any choice is made",
    !(await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    )),
  );
  await page.click("#theme-toggle");
  check(
    "toggle turns dark mode on",
    await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    ),
  );
  check(
    "the control reports its state",
    (await page.$eval("#theme-toggle", (el) =>
      el.getAttribute("aria-pressed"),
    )) === "true",
  );
  await page.reload({ waitUntil: "networkidle0" });
  check(
    "the choice survives a reload",
    await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    ),
  );

  /* -------------------------------------------------------- deep link + JS */
  console.log("\nDeep link and no-JS fallback");
  await page.goto(BASE + "/?q=escalation", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 400));
  const deepLinked = await page.$$eval(
    ".terms > li:not([hidden])",
    (a) => a.length,
  );
  check(
    "`?q=` pre-filters the index",
    deepLinked > 0 && deepLinked < 20,
    String(deepLinked),
  );

  const noJs = await browser.newPage();
  await noJs.setJavaScriptEnabled(false);
  await noJs.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  const withoutJs = await noJs.$$eval(".term-card", (a) => a.length);
  check(
    "every term still renders without JS",
    withoutJs === 549,
    String(withoutJs),
  );
  const searchShown = await noJs.$eval(
    "#search-form",
    (el) => getComputedStyle(el).display,
  );
  check(
    "the search box hides itself without JS",
    searchShown === "none",
    searchShown,
  );

  /* ------------------------------------------------------------ small phone */
  console.log("\nSmall phone (320px)");
  const phone = await browser.newPage();
  await phone.setViewport({
    width: 320,
    height: 640,
    isMobile: true,
    hasTouch: true,
  });
  for (const path of [
    "/",
    "/computer-security-incident-response-team-csirt/",
  ]) {
    await phone.goto(BASE + path, { waitUntil: "networkidle0" });
    const overflow = await phone.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    check(
      `no horizontal scroll on ${path}`,
      overflow <= 0,
      `${overflow}px over`,
    );
  }
  const small = await phone.$$eval(
    ".terms .term-card",
    (a) => a.filter((el) => el.scrollHeight > el.clientHeight + 1).length,
  );
  check("no index card clips its own name", small === 0, `${small} clipped`);

  check("no console errors", errors.length === 0, errors.join(" | "));

  await browser.close();
  console.log(
    failures ? `\n${failures} check(s) failed` : "\nall checks passed",
  );
  process.exit(failures ? 1 : 0);
})();
