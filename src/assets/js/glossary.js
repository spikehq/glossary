document.addEventListener('DOMContentLoaded', function() {
  // Debug output for card links
  const cardLinks = document.querySelectorAll('.glossary-card .card-link');
  
  if (cardLinks.length > 0) {
    console.log('Found card links:', cardLinks.length);
    
    cardLinks.forEach(link => {
      console.log('Card link:', link.getAttribute('href'), 'Slug:', link.getAttribute('data-slug'));
    });
  }
  
  // Use the simplest approach possible to detect when element is sticky
  const alphabetFilter = document.querySelector('.alphabet-filter');
  
  if (alphabetFilter) {
    // Create a marker div just before the alphabet filter
    const marker = document.createElement('div');
    marker.id = 'sticky-marker';
    // Position it right where the filter starts
    alphabetFilter.parentNode.insertBefore(marker, alphabetFilter);
    
    // Function to check if we've scrolled past the marker
    function checkSticky() {
      const markerRect = marker.getBoundingClientRect();
      // If the marker is at or above the top of the viewport, 
      // the filter is sticky
      if (markerRect.top <= 0) {
        alphabetFilter.classList.add('is-sticky');
      } else {
        alphabetFilter.classList.remove('is-sticky');
      }
    }
    
    // Check on scroll
    window.addEventListener('scroll', checkSticky);
    // Initial check
    checkSticky();
  }
  
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