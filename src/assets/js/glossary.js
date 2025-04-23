document.addEventListener('DOMContentLoaded', function() {
  // Get all filter links
  const filterLinks = document.querySelectorAll('.alphabet-filter a');
  // Get all glossary items
  const glossaryItems = document.querySelectorAll('.glossary-list .glossary-item');
  
  if (filterLinks.length > 0 && glossaryItems.length > 0) {
    // Add click event to filter links
    filterLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all links
        filterLinks.forEach(l => l.parentElement.classList.remove('active'));
        // Add active class to clicked link
        this.parentElement.classList.add('active');
        
        const letter = this.getAttribute('href').replace('#', '');
        
        // Show/hide glossary items based on filter
        glossaryItems.forEach(item => {
          const parentCol = item.closest('.col');
          if (letter === 'all') {
            parentCol.style.display = '';
          } else {
            const itemLetter = item.getAttribute('data-letter');
            parentCol.style.display = itemLetter === letter ? '' : 'none';
          }
        });
        
        // Update URL hash
        window.location.hash = letter;
      });
    });
    
    // Check if there's a hash in the URL on page load
    if (window.location.hash) {
      const letter = window.location.hash.replace('#', '');
      const activeLink = document.querySelector(`.alphabet-filter a[href="#${letter}"]`);
      
      if (activeLink) {
        // Trigger a click on the active link
        activeLink.click();
      } else {
        // Default to "All" if hash doesn't match any link
        document.querySelector('.alphabet-filter a[href="#all"]').click();
      }
    } else {
      // By default, show all items and make "All" link active
      document.querySelector('.alphabet-filter a[href="#all"]').click();
    }
  }
});