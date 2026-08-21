/**
 * Global site data.
 *
 * The glossary is built as a root-relative static site (`/acknowledge/`) but is
 * *served* from https://spike.sh/glossary/. Every absolute URL (canonical, OG,
 * JSON-LD, sitemap) and every internal link is therefore derived from the two
 * values below rather than hardcoded, so a local preview and production can
 * disagree about where the site lives without breaking links.
 *
 *   `origin`  scheme + host          e.g. https://spike.sh
 *   `base`    path prefix, no slash  e.g. /glossary   ('' when served at root)
 *
 * Local mode (origin http://localhost:8080, base '') kicks in automatically for
 * `eleventy --serve`/`--watch`, or explicitly via GLOSSARY_LOCAL=1 for a
 * production-shaped build you can point Lighthouse at. Both are overridable
 * with SITE_ORIGIN / SITE_BASE.
 *
 * Cloudflare Pages preview deploys are also root-relative, not /glossary — a
 * branch preview lives at its own *.pages.dev subdomain (e.g.
 * https://feat-foo.glossary-2sy.pages.dev/), not nested under spike.sh. CF
 * Pages sets CF_PAGES=1, CF_PAGES_BRANCH, and CF_PAGES_URL for every build;
 * only the production-branch build should keep the /glossary prefix, so any
 * other CF Pages branch is treated the same as local (base '', origin the
 * preview's own URL). Without this, every asset link (JS, images, fonts)
 * 404s on a preview and Pages' SPA-style fallback quietly serves back
 * index.html instead, which is why the header's JS-driven behaviour (theme
 * toggle, dropdown, scroll compaction) silently does nothing there.
 */
const runMode = process.env.ELEVENTY_RUN_MODE || "";
const isCfPagesPreview =
  process.env.CF_PAGES === "1" && process.env.CF_PAGES_BRANCH !== "production";
const isLocal =
  process.env.GLOSSARY_LOCAL === "1" ||
  runMode === "serve" ||
  runMode === "watch" ||
  isCfPagesPreview;

const origin =
  process.env.SITE_ORIGIN ||
  (isCfPagesPreview && process.env.CF_PAGES_URL
    ? process.env.CF_PAGES_URL
    : isLocal
      ? "http://localhost:8080"
      : "https://spike.sh");
const base =
  process.env.SITE_BASE !== undefined
    ? process.env.SITE_BASE
    : isLocal
      ? ""
      : "/glossary";

module.exports = {
  name: "Spike",
  origin,
  base,
  url: `${origin}${base}`,

  title: "Incident Response Glossary: 500+ Key Terms Explained | Spike",
  description:
    "Browse 500+ incident response, on-call and SRE terms — each one defined in plain language, with a real example and how it works in Spike.",

  signupUrl: "https://app.spike.sh/signup",
  homeUrl: "https://spike.sh",

  social: {
    x: "https://x.com/spikedhq",
    linkedin: "https://linkedin.com/company/spike-hq",
    reddit: "https://reddit.com/r/spikesh",
    youtube: "https://www.youtube.com/@SpikeHQ",
    github: "https://github.com/spikehq/glossary",
  },

  year: new Date().getFullYear(),
};
