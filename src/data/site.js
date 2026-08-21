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
 */
const runMode = process.env.ELEVENTY_RUN_MODE || "";
const isLocal =
  process.env.GLOSSARY_LOCAL === "1" || runMode === "serve" || runMode === "watch";

const origin =
  process.env.SITE_ORIGIN || (isLocal ? "http://localhost:8080" : "https://spike.sh");
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
