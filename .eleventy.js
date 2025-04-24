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
  
  // Compile Sass to CSS only when SCSS files change
  eleventyConfig.on('beforeBuild', () => {
    // Create the CSS directory if it doesn't exist
    const cssDir = path.join(__dirname, 'src', 'assets', 'css');
    if (!fs.existsSync(cssDir)) {
      fs.mkdirSync(cssDir, { recursive: true });
    }
    
    // Only compile if scss files have changed or css doesn't exist
    const cssFile = path.join(cssDir, 'style.css');
    if (!fs.existsSync(cssFile)) {
      console.log("[11ty] Compiling Sass to CSS (first run)");
      // Compile Sass to CSS
      const sassResult = sass.compile(
        path.join(__dirname, 'src', 'assets', 'scss', 'main.scss'),
        { style: "compressed" }
      );
      
      // Write the CSS file
      fs.writeFileSync(cssFile, sassResult.css);
    }
  });
  
  // Pass-through the compiled CSS
  eleventyConfig.addPassthroughCopy("src/assets/css");
  
  // Custom collection for glossary items
  eleventyConfig.addCollection("glossaryItems", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/glossary/**/*.md")
      .sort((a, b) => {
        const titleA = a.data.term || '';
        const titleB = b.data.term || '';
        return titleA.localeCompare(titleB);
      });
  });
  
  // Create alphabet list collection
  eleventyConfig.addCollection("alphabetList", function() {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  });
  
  // Create featured items collection
  eleventyConfig.addCollection("featuredItems", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/glossary/**/*.md")
      .filter(item => item.data.featured)
      .sort((a, b) => {
        const titleA = a.data.term || '';
        const titleB = b.data.term || '';
        return titleA.localeCompare(titleB);
      });
  });
  
  // Handle related items data to include proper slugs
  eleventyConfig.addFilter("processRelated", function(related, glossaryItems) {
    if (!related) return [];
    
    return related.map(item => {
      const glossaryItem = glossaryItems.find(gi => gi.fileSlug === item.slug);
      return {
        title: item.title || (glossaryItem ? glossaryItem.data.term : ""),
        slug: item.slug,
        excerpt: glossaryItem ? glossaryItem.data.excerpt : ""
      };
    });
  });
  
  // Group glossary items by first letter
  eleventyConfig.addCollection("glossaryItemsByLetter", function(collectionApi) {
    const allGlossaryItems = collectionApi.getFilteredByGlob("src/glossary/**/*.md");
    
    // Create an object to store items by letter
    const itemsByLetter = {};
    
    // Initialize all letters
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
      itemsByLetter[letter] = [];
    });
    
    // Add each item to its letter group
    allGlossaryItems.forEach(item => {
      if (item.data.term) {
        const letter = item.data.term.charAt(0).toUpperCase();
        if (itemsByLetter[letter]) {
          // Add simplified item with just what we need
          itemsByLetter[letter].push({
            title: item.data.term,
            excerpt: item.data.excerpt || "",
            slug: item.fileSlug // This is the filename without extension
          });
        }
      }
    });
    
    // Remove empty letters and sort each letter's items by title
    for (const letter in itemsByLetter) {
      if (itemsByLetter[letter].length === 0) {
        delete itemsByLetter[letter];
      } else {
        itemsByLetter[letter].sort((a, b) => 
          a.title.localeCompare(b.title)
        );
      }
    }
    
    return itemsByLetter;
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

  // Truncate helper for excerpts
  eleventyConfig.addFilter("truncate", function(str, length) {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
  });
  
  // Set up a more direct way to configure glossary items
  eleventyConfig.addCollection("glossaryPages", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/glossary/**/*.md").map(item => {
      // Add the layout and permalink directly to each item
      item.data.layout = "layouts/glossary-item.hbs";
      item.data.permalink = `/glossary/${item.fileSlug}/`;
      return item;
    });
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