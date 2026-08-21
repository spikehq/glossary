#!/usr/bin/env node
/**
 * Runs Lighthouse (mobile profile) against the local preview server and prints
 * the four category scores plus every audit that did not pass.
 *
 *   npm run preview          # in one terminal — builds and serves _site
 *   npm run lighthouse       # in another
 *
 * Reports are written to reports/lighthouse-<page>.html / .json.
 */
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const BASE = process.env.LH_BASE || "http://localhost:8080";
const PAGES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [["index", "/"], ["term", "/acknowledge/"]].map((p) => p.join("="));

const OUT = path.join(__dirname, "..", "reports");
fs.mkdirSync(OUT, { recursive: true });

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const summary = [];

for (const page of PAGES) {
  const [name, urlPath] = page.includes("=") ? page.split("=") : ["page", page];
  const url = BASE + urlPath;
  const out = path.join(OUT, `lighthouse-${name}`);
  const base = out + ".report";

  console.log(`\n▶ ${url}`);
  execFileSync(
    process.execPath,
    [
      require.resolve("lighthouse/cli/index.js"),
      url,
      "--quiet",
      "--output=json",
      "--output=html",
      `--output-path=${base}`,
      "--chrome-flags=--headless=new --no-sandbox --disable-gpu",
      "--only-categories=" + CATEGORIES.join(","),
    ],
    { stdio: ["ignore", "inherit", "inherit"] }
  );

  const report = JSON.parse(fs.readFileSync(`${base}.report.json`, "utf8"));

  for (const id of CATEGORIES) {
    const cat = report.categories[id];
    console.log(`  ${cat.title.padEnd(16)} ${Math.round(cat.score * 100)}`);
  }

  const failed = Object.values(report.audits).filter(
    (a) => a.score !== null && a.score < 1 && a.scoreDisplayMode !== "informative"
  );
  if (failed.length) {
    console.log("  failing / imperfect audits:");
    for (const a of failed) {
      console.log(`    - [${a.score}] ${a.id}: ${a.title}`);
    }
  }

  const metrics = report.audits.metrics && report.audits.metrics.details.items[0];
  if (metrics) {
    console.log(
      `  FCP ${metrics.firstContentfulPaint}ms  LCP ${metrics.largestContentfulPaint}ms  TBT ${metrics.totalBlockingTime}ms  CLS ${report.audits["cumulative-layout-shift"].numericValue}`
    );
  }

  summary.push({
    name,
    urlPath,
    scores: CATEGORIES.map((id) => Math.round(report.categories[id].score * 100)),
    metrics: metrics && {
      fcp: Math.round(metrics.firstContentfulPaint),
      lcp: Math.round(metrics.largestContentfulPaint),
      tbt: Math.round(metrics.totalBlockingTime),
      cls: report.audits["cumulative-layout-shift"].numericValue,
    },
    version: report.lighthouseVersion,
  });
}

/* A small committed record of the run, so the scores are readable without
   opening a 1 MB report. */
const lines = [
  "# Lighthouse — mobile profile",
  "",
  `Lighthouse ${summary[0] ? summary[0].version : ""} · emulated Moto G Power · simulated 4x CPU / Slow 4G`,
  `Production build (\`npm run preview\`), served locally over gzip. Run: ${new Date().toISOString().slice(0, 10)}`,
  "",
  "| Page | Performance | Accessibility | Best Practices | SEO |",
  "|---|---|---|---|---|",
  ...summary.map((s) => `| \`${s.urlPath}\` | ${s.scores.join(" | ")} |`),
  "",
  "| Page | FCP | LCP | TBT | CLS |",
  "|---|---|---|---|---|",
  ...summary.map(
    (s) =>
      `| \`${s.urlPath}\` | ${s.metrics.fcp} ms | ${s.metrics.lcp} ms | ${s.metrics.tbt} ms | ${s.metrics.cls} |`
  ),
  "",
  "Full reports: " +
    summary.map((s) => `[${s.name}](lighthouse-${s.name}.report.report.html)`).join(" · "),
  "",
];

fs.writeFileSync(path.join(OUT, "lighthouse-summary.md"), lines.join("\n"));
console.log("\nwrote reports/lighthouse-summary.md");
