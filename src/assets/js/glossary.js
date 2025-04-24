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
        
        // Clear search input when clicking a letter
        const searchInput = document.getElementById('glossary-search');
        if (searchInput) {
          searchInput.value = '';
        }
        
        // Show all glossary cards
        const cards = document.querySelectorAll('.glossary-card');
        cards.forEach(card => {
          card.closest('.col-lg-4').style.display = '';
        });
        
        // Show all letter groups
        const letterGroups = document.querySelectorAll('.letter-group');
        letterGroups.forEach(group => {
          group.style.display = '';
        });
        
        // Hide the no results message
        const noResultsEl = document.getElementById('no-results');
        if (noResultsEl) {
          noResultsEl.style.display = 'none';
        }
        
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
  
  // Search functionality
  const searchInput = document.getElementById('glossary-search');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      
      // Get all letter groups and the no results message
      const letterGroups = document.querySelectorAll('.letter-group');
      const noResultsEl = document.getElementById('no-results');
      
      if (searchTerm === '') {
        // If search is empty, show all cards and letter groups
        document.querySelectorAll('.col-lg-4').forEach(column => {
          column.style.display = '';
        });
        
        letterGroups.forEach(group => {
          group.style.display = '';
        });
        
        // Hide the no results message
        if (noResultsEl) {
          noResultsEl.style.display = 'none';
        }
        
        // Clear active state from letter nav
        const filterLinks = document.querySelectorAll('.alphabet-filter .letter-nav a');
        filterLinks.forEach(link => link.classList.remove('active'));
        return;
      }
      
      // Keep track of which letter groups have visible cards
      const letterGroupsWithVisibleCards = new Set();
      
      // Process all cards
      document.querySelectorAll('.glossary-card').forEach(card => {
        const cardTitle = card.querySelector('h2').textContent.toLowerCase();
        const cardContent = card.querySelector('p').textContent.toLowerCase();
        const cardColumn = card.closest('.col-lg-4');
        const letterGroup = card.closest('.letter-group');
        
        if (cardTitle.includes(searchTerm) || cardContent.includes(searchTerm)) {
          // Show matching cards
          cardColumn.style.display = ''; 
          // Mark this letter group as having visible cards
          if (letterGroup) {
            letterGroupsWithVisibleCards.add(letterGroup.id);
          }
        } else {
          // Hide non-matching cards
          cardColumn.style.display = 'none';
        }
      });
      
      // Show/hide letter groups based on whether they have visible cards
      let totalVisibleCards = 0;
      
      letterGroups.forEach(group => {
        // Count visible cards in this group after filtering
        const visibleCards = Array.from(group.querySelectorAll('.col-lg-4')).filter(
          col => col.style.display !== 'none'
        ).length;
        
        totalVisibleCards += visibleCards;
        
        if (visibleCards > 0) {
          group.style.display = '';
        } else {
          group.style.display = 'none';
        }
      });
      
      // Show/hide the "no results" message
      if (noResultsEl) {
        if (totalVisibleCards === 0) {
          noResultsEl.style.display = 'block';
        } else {
          noResultsEl.style.display = 'none';
        }
      }
      
      // Clear active state from letter nav
      const filterLinks = document.querySelectorAll('.alphabet-filter .letter-nav a');
      filterLinks.forEach(link => link.classList.remove('active'));
    });
  }
});