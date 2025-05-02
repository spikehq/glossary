const fs = require("fs");
const path = require("path");

const sitemapPath = path.join(__dirname, "_site", "sitemap.xml");
const srcPath = path.join(__dirname, "src");
const baseUrl = "https://spike.sh/glossary";
const lastmod = "2025-05-01";
const changefreq = "yearly";

function getMarkdownSlugs(directory) {
    return fs.readdirSync(directory)
        .filter(file => file.endsWith(".md"))
        .map(file => path.basename(file, ".md"));
}

function buildSitemapXml(slugs) {
    // Start with homepage
    const urls = [
`  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>1</priority>
    <changefreq>${changefreq}</changefreq>
  </url>`
    ];

    // Add all slugs
    for (const slug of slugs) {
        urls.push(
`  <url>
    <loc>${baseUrl}/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.8</priority>
    <changefreq>${changefreq}</changefreq>
  </url>`
        );
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

function generateSitemap() {
    const slugs = getMarkdownSlugs(srcPath);
    const xml = buildSitemapXml(slugs);
    fs.writeFileSync(sitemapPath, xml);
    console.log(`✅ Sitemap written to ${sitemapPath}`);
}

generateSitemap();
