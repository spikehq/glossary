const handlebarsPlugin = require("@11ty/eleventy-plugin-handlebars");
const markdownIt = require("markdown-it");
const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

const site = require("./src/data/site.js");

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/* --------------------------------------------------------------------------
   Assets. There is no Sass step and no CSS request: the shared theme tokens
   and the glossary's own styles are concatenated, minified, and inlined into
   every page (see layouts/base.hbs). The keyboard layer is bundled to a single
   deferred file. Both go through esbuild, which is the only build dependency.
   -------------------------------------------------------------------------- */
const CSS_SOURCES = ["brand/spike-theme.css", "src/assets/css/glossary.css"];
const JS_ENTRY = "src/assets/js/glossary.js";

let cssCache = null;

function buildCss() {
  if (cssCache) return cssCache;

  const source = CSS_SOURCES.map((file) =>
    fs.readFileSync(path.join(__dirname, file), "utf8")
  ).join("\n");

  // Font URLs live inside the stylesheet, so they need the same path prefix
  // every other asset gets.
  const resolved = source.split("__BASE__").join(site.base);

  cssCache = esbuild.transformSync(resolved, { loader: "css", minify: true }).code.trim();
  return cssCache;
}

/* Fonts. The three @fontsource-variable families ship a "latin" subset of
   ~250 codepoints each; this glossary uses barely a hundred. Since decoding
   and shaping a variable font is the single most expensive thing on the
   index's main thread, each face is subset at build time to exactly the
   characters the built site contains — which takes Inter from 48 KB to a
   fraction of that, and takes most of the blocking time with it.

   The character set is read back out of the rendered HTML, so adding a term
   with an accent or a new symbol simply widens the subset on the next build.
   Anything that still ends up missing falls back to the next family in the
   stack rather than rendering as tofu. */
const FONT_FACES = [
  {
    source:
      "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
    output: "assets/fonts/inter-latin.woff2",
    // Body copy runs 400–600; there is no 700 Inter anywhere in the design, so
    // the axis is clamped and the unused masters go with it.
    weights: { min: 400, max: 600 },
  },
  {
    source:
      "node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2",
    output: "assets/fonts/instrument-sans-latin.woff2",
    weights: { min: 400, max: 700 }, // h2 at 500 up to the hero h1 at 700
  },
  {
    source:
      "node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
    output: "assets/fonts/geist-mono-latin.woff2",
    weights: { min: 400, max: 500 },
  },
];

// Always kept, whatever the content happens to use today.
const BASE_CHARS =
  " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`" +
  "abcdefghijklmnopqrstuvwxyz{|}~" +
  " –—‘’“”„…•·×÷°©®™→←↑↓↵⌘⇧≈≠≤≥€£";

function collectCharacters(outputDir) {
  const seen = new Set(BASE_CHARS);

  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "assets") walk(full);
      } else if (/\.(html|json|webmanifest)$/.test(entry.name)) {
        for (const ch of fs.readFileSync(full, "utf8")) seen.add(ch);
      }
    }
  };

  walk(outputDir);
  seen.delete("\n");
  seen.delete("\r");
  seen.delete("\t");
  return Array.from(seen).join("");
}

async function buildFonts(outputDir) {
  const subsetFont = require("subset-font");
  const characters = collectCharacters(outputDir);
  const dir = path.join(outputDir, "assets", "fonts");
  fs.mkdirSync(dir, { recursive: true });

  for (const face of FONT_FACES) {
    const source = fs.readFileSync(path.join(__dirname, face.source));
    const subset = await subsetFont(source, characters, {
      targetFormat: "woff2",
      variationAxes: { wght: face.weights },
    });
    fs.writeFileSync(path.join(__dirname, face.output.replace(/^/, outputDir + "/")), subset);
  }

  return characters.length;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(handlebarsPlugin);

  eleventyConfig.setLibrary(
    "md",
    markdownIt({ html: true, breaks: true, linkify: true })
  );

  /* ---- assets --------------------------------------------------------- */

  eleventyConfig.addPassthroughCopy("src/assets/images");

  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("src/assets/js/");
  eleventyConfig.addWatchTarget("brand/spike-theme.css");

  eleventyConfig.on("eleventy.beforeWatch", () => {
    cssCache = null;
  });

  eleventyConfig.on("eleventy.before", async () => {
    await esbuild.build({
      entryPoints: [JS_ENTRY],
      outfile: path.join(__dirname, "_site/assets/js/glossary.js"),
      bundle: true,
      minify: true,
      target: ["es2019"],
      legalComments: "none",
    });
  });

  // Subsetting needs the rendered HTML, so it runs once the pages exist.
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const count = await buildFonts(dir.output);
    console.log(`[glossary] subset 3 font faces to ${count} characters`);
  });

  eleventyConfig.addGlobalData("inlineCss", () => buildCss());

  /* ---- collections ---------------------------------------------------- */

  const termOf = (item) => String(item.data.term || "").trim();
  const byTerm = (a, b) => termOf(a).localeCompare(termOf(b));

  eleventyConfig.addCollection("glossaryItems", (api) =>
    api.getFilteredByGlob("src/**/*.md").sort(byTerm)
  );

  // Every term page shares one layout and lives at /<slug>/.
  eleventyConfig.addCollection("glossaryPages", (api) =>
    api.getFilteredByGlob("src/**/*.md").map((item) => {
      item.data.layout = "layouts/glossary-item.hbs";
      item.data.permalink = `/${item.fileSlug}/`;
      return item;
    })
  );

  eleventyConfig.addCollection("glossaryItemsByLetter", (api) => {
    const byLetter = {};

    api
      .getFilteredByGlob("src/**/*.md")
      .sort(byTerm)
      .forEach((item) => {
        const term = termOf(item);
        if (!term) return;
        const letter = term.charAt(0).toUpperCase();
        if (LETTERS.indexOf(letter) === -1) return;
        (byLetter[letter] = byLetter[letter] || []).push({
          title: term,
          excerpt: item.data.excerpt || "",
          slug: item.fileSlug,
        });
      });

    return byLetter;
  });

  // A–Z jump nav: every letter, with a count so empty ones can render as
  // disabled rather than silently disappearing.
  eleventyConfig.addCollection("alphabetNav", (api) => {
    const counts = {};
    api.getFilteredByGlob("src/**/*.md").forEach((item) => {
      const letter = termOf(item).charAt(0).toUpperCase();
      counts[letter] = (counts[letter] || 0) + 1;
    });
    return LETTERS.map((letter) => ({ letter, count: counts[letter] || 0 }));
  });

  /* ---- helpers -------------------------------------------------------- */

  // JSON-LD and terms.json need JSON-encoded values, not HTML-escaped ones:
  // entities inside a <script> would not be decoded. Angle brackets are
  // unicode-escaped so a value can never close the script element.
  eleventyConfig.addFilter("json", (value) =>
    JSON.stringify(value === undefined ? null : value)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026")
  );

  eleventyConfig.addFilter("concat", function (...args) {
    return args.slice(0, -1).join("");
  });

  eleventyConfig.addFilter("lower", (value) =>
    String(value || "").toLowerCase()
  );

  eleventyConfig.addFilter("isoDate", (value) =>
    new Date(value || Date.now()).toISOString().slice(0, 10)
  );

  const truncate = (str, length) => {
    if (!str) return "";
    if (str.length <= length) return str;
    const cut = str.slice(0, length);
    const space = cut.lastIndexOf(" ");
    return (space > length * 0.6 ? cut.slice(0, space) : cut).trim() + "…";
  };

  eleventyConfig.addFilter("truncate", truncate);

  // The "How To … With Spike" section of a definition gets a quiet accent, as
  // it did before the redesign. A term can name extra headings to mark up via
  // `featuredHeading` in its front matter.
  eleventyConfig.addFilter("markSpikeSections", (html, featuredHeading) => {
    const extra = String(featuredHeading || "")
      .split(/[,|;]/)
      .map((s) => s.trim())
      .filter(Boolean);

    return String(html || "").replace(/<h2>([\s\S]*?)<\/h2>/g, (match, inner) => {
      const text = inner.replace(/<[^>]*>/g, "");
      const marked = /\bSpike\b/.test(text) || extra.some((h) => text.includes(h));
      return marked ? `<h2 class="prose__spike">${inner}</h2>` : match;
    });
  });

  // Further reading: explicit `related:` front matter wins, otherwise fall back
  // to the terms that follow this one alphabetically.
  eleventyConfig.addFilter("furtherReading", (slug, related, items, count) => {
    const wanted = count || 3;
    const card = (item) => ({
      title: termOf(item),
      slug: item.fileSlug,
      excerpt: item.data.excerpt || "",
    });

    if (Array.isArray(related) && related.length) {
      // `related:` accepts either a bare slug or a { slug } object.
      const picked = related
        .map((entry) => (typeof entry === "string" ? entry : entry && entry.slug))
        .map((slugged) => items.find((item) => item.fileSlug === slugged))
        .filter(Boolean)
        .map(card);
      if (picked.length) return picked.slice(0, wanted);
    }

    const at = items.findIndex((item) => item.fileSlug === slug);
    if (at === -1) return [];
    const out = [];
    for (let i = 1; i <= wanted; i++) out.push(card(items[(at + i) % items.length]));
    return out;
  });

  // Alphabetical neighbours, for the prev/next pager and its ← → shortcuts.
  eleventyConfig.addFilter("termNeighbours", (slug, items) => {
    const at = items.findIndex((item) => item.fileSlug === slug);
    if (at === -1) return { prev: null, next: null };
    const entry = (item) =>
      item ? { title: item.data.term, slug: item.fileSlug } : null;
    return { prev: entry(items[at - 1]), next: entry(items[at + 1]) };
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "data",
    },
    templateFormats: ["hbs", "md"],
    markdownTemplateEngine: "hbs",
    htmlTemplateEngine: "hbs",
    dataTemplateEngine: "hbs",
  };
};
