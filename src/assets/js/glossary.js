$(document).ready(function() {
  // Debug output for card links
  const $cardLinks = $('.glossary-card .card-link');
  
  if ($cardLinks.length > 0) {
    console.log('Found card links:', $cardLinks.length);
    
    $cardLinks.each(function() {
      console.log('Card link:', $(this).attr('href'), 'Slug:', $(this).data('slug'));
    });
  }
  
  // Use the simplest approach possible to detect when element is sticky
  const $alphabetFilter = $('.alphabet-filter');
  
  if ($alphabetFilter.length > 0) {
    // Create a marker div just before the alphabet filter
    const $marker = $('<div>', { id: 'sticky-marker' });
    // Position it right where the filter starts
    $marker.insertBefore($alphabetFilter);
    
    // Function to check if we've scrolled past the marker
    function checkSticky() {
      const markerTop = $marker.offset().top;
      const scrollTop = $(window).scrollTop();
      
      // If we scrolled past the marker, add sticky class
      if (scrollTop >= markerTop) {
        $alphabetFilter.addClass('is-sticky');
      } else {
        $alphabetFilter.removeClass('is-sticky');
      }
    }
    
    // Check on scroll
    $(window).on('scroll', checkSticky);
    // Initial check
    checkSticky();
  }
  
  // Get all filter links
  const $filterLinks = $('.alphabet-filter .letter-nav a');
  
  if ($filterLinks.length > 0) {
    // Add click event to filter links
    $filterLinks.on('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links
      $filterLinks.removeClass('active');
      // Add active class to clicked link
      $(this).addClass('active');
      
      const letter = $(this).attr('href').replace('#', '');
      
      // Clear search input when clicking a letter
      const $searchInput = $('#glossary-search');
      $searchInput.val('');
      
      // Show all glossary cards
      $('.glossary-card').closest('.col-lg-4').show();
      
      // Show all letter groups
      $('.letter-group').show();
      
      // Hide the no results message
      $('#no-results').hide();
      
      // Smooth scroll to the letter group
      if (letter !== 'all') {
        const $targetElement = $('#' + letter);
        if ($targetElement.length > 0) {
          const offsetTop = $targetElement.offset().top - 100; // Adjust for header height
          $('html, body').animate({
            scrollTop: offsetTop
          }, 300);
        }
      } else {
        // Scroll to top if "all" is selected
        $('html, body').animate({
          scrollTop: 0
        }, 300);
      }
      
      // Update URL hash
      history.pushState(null, null, letter === 'all' ? window.location.pathname : `#${letter}`);
    });
    
    // Check if there's a hash in the URL on page load
    if (window.location.hash) {
      const letter = window.location.hash.replace('#', '');
      const $activeLink = $(`.alphabet-filter .letter-nav a[href="#${letter}"]`);
      
      if ($activeLink.length > 0) {
        // Trigger a click on the active link
        $activeLink.trigger('click');
      }
    }
  }
  
  // Search functionality
  const $searchInput = $('#glossary-search');
  if ($searchInput.length > 0) {
    $searchInput.on('input', function() {
      const searchTerm = $(this).val().toLowerCase().trim();
      
      // Get all letter groups and the no results message
      const $letterGroups = $('.letter-group');
      const $noResultsEl = $('#no-results');
      
      if (searchTerm === '') {
        // If search is empty, show all cards and letter groups
        $('.col-lg-4').show();
        $letterGroups.show();
        
        // Hide the no results message
        $noResultsEl.hide();
        
        // Clear active state from letter nav
        $('.alphabet-filter .letter-nav a').removeClass('active');
        return;
      }
      
      // Reset visibility state
      let totalVisibleCards = 0;
      
      // Process all cards
      $('.glossary-card').each(function() {
        const $card = $(this);
        const $cardColumn = $card.closest('.col-lg-4');
        const $letterGroup = $card.closest('.letter-group');
        const cardTitle = $card.find('h2').text().toLowerCase();
        const cardContent = $card.find('p').text().toLowerCase();
        
        if (cardTitle.includes(searchTerm) || cardContent.includes(searchTerm)) {
          // Show matching cards
          $cardColumn.show();
          totalVisibleCards++;
        } else {
          // Hide non-matching cards
          $cardColumn.hide();
        }
      });
      
      // Show/hide letter groups based on whether they have visible cards
      $letterGroups.each(function() {
        const $group = $(this);
        // Count visible cards in this group
        const visibleCards = $group.find('.col-lg-4:visible').length;
        
        if (visibleCards > 0) {
          $group.show();
        } else {
          $group.hide();
        }
      });
      
      // Show/hide the "no results" message
      if (totalVisibleCards === 0) {
        $noResultsEl.show();
      } else {
        $noResultsEl.hide();
      }
      
      // Clear active state from letter nav
      $('.alphabet-filter .letter-nav a').removeClass('active');
    });
  }
});