#!/usr/bin/env node
/**
 * Captures the glossary in light and dark, on a phone and a desktop viewport,
 * against the local preview server. Handy for reviewing the design without
 * running the site by hand.
 *
 *   npm run preview      # in one terminal
 *   node scripts/screenshots.js
 */
const puppeteer = require("puppeteer-core");
const { Launcher } = require("chrome-launcher");
const fs = require("fs");
const path = require("path");

const BASE = process.env.LH_BASE || "http://localhost:8080";
const OUT = path.join(__dirname, "..", "reports", "screenshots");

const SHOTS = [
  { name: "index-mobile-light", url: "/", w: 412, h: 900, dark: false },
  { name: "index-mobile-dark", url: "/", w: 412, h: 900, dark: true },
  { name: "index-desktop-light", url: "/", w: 1280, h: 900, dark: false },
  { name: "index-desktop-dark", url: "/", w: 1280, h: 900, dark: true },
  { name: "term-mobile-light", url: "/acknowledge/", w: 412, h: 900, dark: false },
  { name: "term-desktop-light", url: "/acknowledge/", w: 1280, h: 1000, dark: false },
  { name: "term-desktop-dark", url: "/acknowledge/", w: 1280, h: 1000, dark: true },
  { name: "index-mobile-list", url: "/#letter-C", w: 412, h: 900, dark: false },
  {
    name: "index-desktop-filtered",
    url: "/?q=escalation",
    w: 1280, h: 900, dark: false,
  },
  {
    name: "term-desktop-palette",
    url: "/acknowledge/",
    w: 1280, h: 900, dark: false,
    before: async (page) => {
      await page.keyboard.press("Slash");
      await page.type("#palette-input", "post");
      await new Promise((r) => setTimeout(r, 400));
    },
  },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: Launcher.getFirstInstallation(),
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });

  for (const shot of SHOTS) {
    const page = await browser.newPage();
    await page.setViewport({
      width: shot.w,
      height: shot.h,
      deviceScaleFactor: 2,
      isMobile: shot.w < 700,
      hasTouch: shot.w < 700,
    });
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: shot.dark ? "dark" : "light" },
    ]);
    await page.goto(BASE + shot.url, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    if (shot.before) await shot.before(page);

    const file = path.join(OUT, shot.name + ".png");
    await page.screenshot({ path: file });
    console.log("wrote", path.relative(process.cwd(), file));
    await page.close();
  }

  await browser.close();
})();
