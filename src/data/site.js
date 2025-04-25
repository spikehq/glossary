module.exports = {
  title: "Spike Glossary",
  description: "A comprehensive glossary of terms related to incident response and management",
  year: new Date().getFullYear(),
  
  // Custom function to create alphabetized collections
  eleventyComputed: {
    // Create alphabet list for the filter
    alphabetList: collection => {
      return [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    },
    
    // Get the first letter of a title
    firstLetter: data => {
      return data && data.title ? data.title.charAt(0).toUpperCase() : '';
    },
    
    // Group items by first letter of title
    glossaryItemsByLetter: collection => {
      const allGlossaryItems = collection.getFilteredByGlob("./src/*.md");
      
      // Create an object to store items by letter
      const itemsByLetter = {};
      
      // Initialize all letters
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
        itemsByLetter[letter] = [];
      });
      
      // Add each item to its letter group
      allGlossaryItems.forEach(item => {
        if (item.data.title) {
          const letter = item.data.title.charAt(0).toUpperCase();
          if (itemsByLetter[letter]) {
            itemsByLetter[letter].push(item);
          }
        }
      });
      
      // Remove empty letters and sort each letter's items by title
      for (const letter in itemsByLetter) {
        if (itemsByLetter[letter].length === 0) {
          delete itemsByLetter[letter];
        } else {
          itemsByLetter[letter].sort((a, b) => 
            a.data.title.localeCompare(b.data.title)
          );
        }
      }
      
      return itemsByLetter;
    }
  }
};