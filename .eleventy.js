const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const handlebarsPlugin = require("@11ty/eleventy-plugin-handlebars");
const markdownIt = require("markdown-it");
const path = require("path");
const sass = require("sass");
const fs = require("fs");

module.exports = function(eleventyConfig) {
  // Add plugins
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(handlebarsPlugin);
  
  // Configure markdown-it
  let mdOptions = {
    html: true,
    breaks: true,
    linkify: true
  };
  
  // Configure markdown lib
  eleventyConfig.setLibrary("md", markdownIt(mdOptions));
  
  // Pass-through copy for assets (except scss)
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  
  // Compile Sass to CSS during build
  eleventyConfig.on('beforeBuild', () => {
    // Create the CSS directory if it doesn't exist
    const cssDir = path.join(__dirname, 'src', 'assets', 'css');
    if (!fs.existsSync(cssDir)) {
      fs.mkdirSync(cssDir, { recursive: true });
    }
    
    // Compile Sass to CSS
    const sassResult = sass.compile(
      path.join(__dirname, 'src', 'assets', 'scss', 'main.scss'),
      { style: "compressed" }
    );
    
    // Write the CSS file
    fs.writeFileSync(
      path.join(cssDir, 'style.css'),
      sassResult.css
    );
  });
  
  // Pass-through the compiled CSS
  eleventyConfig.addPassthroughCopy("src/assets/css");
  
  // Custom collection for glossary items
  eleventyConfig.addCollection("glossaryItems", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/glossary/*.md")
      .sort((a, b) => a.data.title.localeCompare(b.data.title));
  });
  
  // Create alphabet list collection
  eleventyConfig.addCollection("alphabetList", function() {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  });
  
  // Create featured items collection
  eleventyConfig.addCollection("featuredItems", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/glossary/*.md")
      .filter(item => item.data.featured)
      .sort((a, b) => a.data.title.localeCompare(b.data.title));
  });

  // Helper functions
  eleventyConfig.addFilter("firstLetter", function(str) {
    if (str) return str.charAt(0).toUpperCase();
    return '';
  });
  
  // Add Handlebars specific helper
  eleventyConfig.addHandlebarsHelper("firstLetter", function(str) {
    if (str) return str.charAt(0).toUpperCase();
    return '';
  });
  
  // Add current year data for templates
  eleventyConfig.addShortcode("year", () => {
    return new Date().getFullYear();
  });
  
  // Add Handlebars helper for year
  eleventyConfig.addHandlebarsHelper("year", () => {
    return new Date().getFullYear();
  });
  
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "data"
    },
    templateFormats: ["hbs", "md", "html"],
    markdownTemplateEngine: "hbs",
    htmlTemplateEngine: "hbs",
    dataTemplateEngine: "hbs"
  };
};