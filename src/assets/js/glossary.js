document.addEventListener('DOMContentLoaded', function() {
  // Get all filter links
  const filterLinks = document.querySelectorAll('.alphabet-filter .letter-nav a');
  
  if (filterLinks.length > 0) {
    // Add click event to filter links
    filterLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all links
        filterLinks.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        this.classList.add('active');
        
        const letter = this.getAttribute('href').replace('#', '');
        
        // Smooth scroll to the letter group
        if (letter !== 'all') {
          const targetElement = document.getElementById(letter);
          if (targetElement) {
            const offsetTop = targetElement.offsetTop - 100; // Adjust for header height
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        } else {
          // Scroll to top if "all" is selected
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
        
        // Update URL hash
        history.pushState(null, null, letter === 'all' ? window.location.pathname : `#${letter}`);
      });
    });
    
    // Check if there's a hash in the URL on page load
    if (window.location.hash) {
      const letter = window.location.hash.replace('#', '');
      const activeLink = document.querySelector(`.alphabet-filter .letter-nav a[href="#${letter}"]`);
      
      if (activeLink) {
        // Trigger a click on the active link
        activeLink.click();
      }
    }
  }
});