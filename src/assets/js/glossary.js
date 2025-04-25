// Function to fetch and append header from spike.sh
function fetchAndAppendHeader() {
  // Use fetch with mode=cors and error handling
  // Create an AbortController to handle timeout
  const controller = new AbortController();
  const signal = controller.signal;
  
  // Set a timeout to abort the fetch after 5 seconds
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  fetch('https://spike.sh/header', {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Accept': 'text/html'
    },
    credentials: 'omit',  // Don't send or receive cookies
    signal: signal  // Connect the abort signal
  })
    .then(response => {
      // Clear the timeout since we got a response
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(htmlContent => {
      // Insert the header content directly into the #header div
      document.getElementById('header--spike').innerHTML = htmlContent;
      console.log('Header loaded successfully');
    })
    .catch(error => {
      console.error('Error loading header via fetch:', error);
      console.log('Trying iframe approach as fallback...');
      
      // Try iframe approach as a fallback
      const iframe = document.createElement('iframe');
      iframe.src = 'https://spike.sh/header';
      iframe.style.width = '100%';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.style.display = 'block';
      iframe.height = '80px'; // Default height, will be adjusted
      
      // Listen for iframe load event to adjust height
      iframe.onload = function() {
        try {
          // Try to adjust iframe height based on content
          iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px';
        } catch(e) {
          console.log('Could not adjust iframe height due to cross-origin restrictions');
        }
      };
      
      // Clear and append the iframe
      const headerEl = document.getElementById('header--spike');
      headerEl.innerHTML = '';
      headerEl.appendChild(iframe);
      
      // Set a timeout to check if iframe loaded properly
      setTimeout(function() {
        // If iframe isn't working, show a basic header
        if (iframe.contentWindow && iframe.contentWindow.document.body.children.length === 0) {
          console.log('Iframe failed, using basic header as final fallback');
          document.getElementById('header').innerHTML = `
            <header>
              <div class="header-container">
                <div class="logo">
                  <a href="/">
                    <img src="/assets/images/spike-logo.svg" alt="Spike.sh" width="67" height="24">
                  </a>
                </div>
                <nav class="main-nav">
                  <ul>
                    <li><a href="#">Product</a></li>
                    <li><a href="#">Resources</a></li>
                    <li><a href="#">Customers</a></li>
                    <li><a href="#">Pricing</a></li>
                  </ul>
                </nav>
                <div class="header-actions">
                  <a href="#" class="btn-primary">Get started</a>
                  <a href="#" class="btn-link">Login</a>
                </div>
              </div>
            </header>
          `;
        }
      }, 2000);
    });
}

$(document).ready(function() {
  // Check for featured headings and apply styling
  const $glossaryItem = $('.glossary-item');
  if ($glossaryItem.length > 0) {
    // Get the featuredHeading value from page data
    // This is added via a data attribute from the template
    const featuredHeadingData = $glossaryItem.data('featured-heading');
    
    if (featuredHeadingData) {
      // Convert to array if it's not already - split by comma, pipe, or semicolon
      const featuredHeadings = Array.isArray(featuredHeadingData) 
        ? featuredHeadingData 
        : featuredHeadingData.split(/[,|;]/).map(h => h.trim());
      
      // Find all h2 headings in the content
      $('.glossary-sections h2').each(function() {
        const headingText = $(this).text().trim();
        
        // Check if this heading or a part of it matches any featured heading
        for (const featured of featuredHeadings) {
          if (headingText === featured || headingText.includes(featured)) {
            $(this).addClass('featured-heading');
            break; // No need to continue checking once we've found a match
          }
        }
      });
    }
    
    // Highlight headings that contain "Spike"
    $('.glossary-sections h2').each(function() {
      if ($(this).text().includes('Spike')) {
        $(this).addClass('featured-heading');
      }
    });
    
    // Highlight the active letter in the alphabet navigation
    const $letterNav = $('.letter-nav');
    
    // Get active letter from the data-active-letter attribute
    let activeLetter = $letterNav.data('active-letter');
    
    // If not found, try to determine it from the term attribute
    if (!activeLetter && $glossaryItem.data('term')) {
      const term = $glossaryItem.data('term');
      if (term && typeof term === 'string') {
        activeLetter = term.charAt(0).toUpperCase();
      }
    }
    
    // Apply active class if we have a letter
    if (activeLetter) {
      $letterNav.find(`a[data-letter="${activeLetter}"]`).addClass('active');
    }
  }
  
  // Debug output for card links
  const $cardLinks = $('.glossary-card .card-link');
  
  if ($cardLinks.length > 0) {
    console.log('Found card links:', $cardLinks.length);
    
    $cardLinks.each(function() {
      console.log('Card link:', $(this).attr('href'), 'Slug:', $(this).data('slug'));
    });
  }
  
  // Get all filter links
  const $filterLinks = $('.alphabet-filter .letter-nav a');
  // Get search input element reference for later use
  const $searchInput = $('#glossary-search');
  
  // Improved sticky header functionality
  const $alphabetFilter = $('.alphabet-filter');
  const $mainNavBar = $('.main-navbar');
  
  if ($alphabetFilter.length > 0) {
    // Store some variables for performance
    const alphabetFilterOffsetTop = $alphabetFilter.offset().top;
    const navBarHeight = $mainNavBar.length ? $mainNavBar.outerHeight() : 0;
    let currentState = null;
    let spacingAdded = false;
    
    // Create a spacer div to prevent content jump when filter becomes fixed
    const $spacer = $('<div>', { 
      id: 'alphabet-filter-spacer', 
      css: { height: '0px' } 
    });
    $spacer.insertAfter($alphabetFilter);
        
    // Function to check if we should make the filter sticky
    function checkSticky() {
      const scrollTop = $(window).scrollTop();
      
      if (scrollTop + navBarHeight >= alphabetFilterOffsetTop) {
        if (currentState !== 'sticky') {
          $alphabetFilter.addClass('is-sticky');
          $alphabetFilter.css({
            'position': 'fixed', 
            'top': navBarHeight + 'px', 
            'z-index': 100
          });
          
          // Set spacer height to alphabet filter's height to prevent jump
          if (!spacingAdded) {
            $spacer.css('height', $alphabetFilter.outerHeight() + 'px');
            spacingAdded = true;
          }
          
          currentState = 'sticky';
        }
      } else {
        if (currentState !== 'normal') {
          $alphabetFilter.removeClass('is-sticky');
          $alphabetFilter.css({
            'position': '', 
            'top': '', 
            'z-index': ''
          });
          
          // Reset spacer when not sticky
          $spacer.css('height', '0px');
          spacingAdded = false;
          
          currentState = 'normal';
        }
      }
    }
    
    // Helper function to throttle scroll events
    function throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
    
    // Check on scroll (throttled to improve performance)
    $(window).on('scroll', throttle(function() {
      checkSticky();
      highlightCurrentSection();
    }, 50)); // Throttle to run at most once every 50ms for more responsive behavior
    
    // Also check on window resize since dimensions might change
    $(window).on('resize', throttle(function() {
      // Recalculate positions and heights
      if (currentState === 'sticky') {
        $spacer.css('height', $alphabetFilter.outerHeight() + 'px');
      }
    }, 100));
    
    // Initial check
    checkSticky();
    
    // Initial section highlight with a small delay to ensure DOM is ready
    setTimeout(highlightCurrentSection, 100);
    
    // Function to highlight the current letter section based on scroll position
    function highlightCurrentSection() {
      // Skip this function on glossary item pages - we'll set the active letter manually
      if ($('.glossary-item').length > 0) {
        return;
      }
      
      // Check if $searchInput exists and only update if we're not in a search
      if (!$searchInput || !$searchInput.length || $searchInput.val().trim() === '') {
        const scrollPosition = $(window).scrollTop() + $(window).height() / 2; // Use middle of viewport
        let currentLetterGroup = null;
        
        // Check each letter group to find which one contains the middle of the viewport
        $('.letter-group').each(function() {
          const $group = $(this);
          const groupTop = $group.offset().top;
          const groupBottom = groupTop + $group.outerHeight();
          
          // If the middle of the viewport is within this letter group
          if (scrollPosition >= groupTop && scrollPosition <= groupBottom) {
            currentLetterGroup = $group;
            // Break out of the loop once we've found our letter group
            return false;
          }
        });
        
        // If we didn't find a letter group in the middle of the viewport,
        // fall back to the traditional approach of finding the last group we scrolled past
        if (!currentLetterGroup) {
          $('.letter-group').each(function() {
            if ($(this).offset().top <= scrollPosition) {
              currentLetterGroup = $(this);
            }
          });
        }
        
        // If we found a current letter group
        if (currentLetterGroup) {
          const letter = currentLetterGroup.attr('id');
          
          // Only remove active class if $filterLinks exists
          if (typeof $filterLinks !== 'undefined' && $filterLinks.length > 0) {
            // Remove active class from all navigation links
            $filterLinks.removeClass('active');
          }
          
          // Add active class to the corresponding nav link
          const $letterLink = $(`.alphabet-filter .letter-nav a[href="#${letter}"]`);
          if ($letterLink.length > 0) {
            $letterLink.addClass('active');
          } else {
            // If no letter link found, it might mean we need to activate the "all" link
            // (typically happens when at the top of the page)
            $(`.alphabet-filter .letter-nav a[href="#all"]`).addClass('active');
          }
        } else {
          // If no letter group is in view, activate the "all" link
          if (typeof $filterLinks !== 'undefined' && $filterLinks.length > 0) {
            $filterLinks.removeClass('active');
          }
          $(`.alphabet-filter .letter-nav a[href="#all"]`).addClass('active');
        }
      }
    }
  }
  
  // Improved function to extract hash from URL
  function extractHash(url) {
    try {
      // Handle relative URLs that don't have a domain
      if (!url.includes('://')) {
        url = 'http://example.com' + (url.startsWith('/') ? url : '/' + url);
      }
      
      let parsedUrl = new URL(url);
      return parsedUrl.hash ? parsedUrl.hash.substring(1) : null;
    } catch (e) {
      // Fallback for older browsers or invalid URLs
      const hashIndex = url.indexOf('#');
      return hashIndex !== -1 ? url.substring(hashIndex + 1) : null;
    }
  }
  
  // Use filter links if they exist
  if ($filterLinks && $filterLinks.length > 0) {
    // Add click event to filter links
    $filterLinks.on('click', function(e) {
      e.preventDefault();
      
      // Check if we're on a glossary item page
      const isGlossaryItemPage = $('.glossary-item').length > 0;
      const href = $(this).attr('href');
      
      // If we're on a glossary item page, navigate to the main glossary with the hash
      if (isGlossaryItemPage) {
        // The href might be /#letter or #letter, so handle both cases
        const letterPart = extractHash(href) || '';
        window.location.href = '/' + (letterPart !== 'all' ? '#' + letterPart : '');
        return;
      }
      
      const letter = extractHash(href) || '';
      
      // Clear search input when clicking a letter
      const $searchInput = $('#glossary-search');
      if ($searchInput.length) {
        $searchInput.val('');
      }
      
      // Show all glossary cards
      $('.glossary-card').closest('.col-lg-4').show();
      
      // Show all letter groups
      $('.letter-group').show();
      
      // Hide the no results message
      $('#no-results').hide();
      
      // Smooth scroll to the letter group
      if (letter !== 'all' && letter !== '') {
        const $targetElement = $('#' + letter);
        if ($targetElement.length > 0) {
          // Get current alphabet filter height to use as offset
          let filterHeight = $alphabetFilter.outerHeight() || 0;
          let navHeight = $mainNavBar.length ? $mainNavBar.outerHeight() : 0;
          let totalOffset = filterHeight + navHeight + 40; // extra padding
          
          const offsetTop = $targetElement.offset().top - totalOffset;
          
          // Check if user prefers reduced motion
          const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          
          $('html, body').animate({
            scrollTop: offsetTop
          }, isReduced ? 0 : 300);
        }
      } else {
        // Scroll to top if "all" is selected
        $('html, body').animate({
          scrollTop: 0
        }, 300);
      }
      
      // Update URL hash
      history.pushState(null, null, letter && letter !== 'all' ? `#${letter}` : window.location.pathname);
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
  // Using the already defined $searchInput above
  if ($searchInput.length > 0) {
    $searchInput.on('input', function() {
      const searchTerm = $(this).val().toLowerCase().trim();
      
      // Get all letter groups and the no results message
      const $letterGroups = $('.letter-group');
      const $noResultsEl = $('#no-results');
      
      // First, reset everything to ensure we have a clean state
      $('.col-lg-4').hide(); // Start by hiding all cards
      $letterGroups.hide(); // Hide all letter groups
      
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
      const visibleLetterGroups = new Set();
      
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
          
          // Remember which letter group this belongs to
          if ($letterGroup.length > 0) {
            visibleLetterGroups.add($letterGroup.attr('id'));
          }
        }
      });
      
      // Show letter groups that have visible cards
      visibleLetterGroups.forEach(groupId => {
        $('#' + groupId).show();
      });
      
      // Show/hide the "no results" message
      if (totalVisibleCards === 0) {
        $noResultsEl.show();
      } else {
        $noResultsEl.hide();
      }
      
      // Scroll back to the top when searching and navigation is sticky
      if ($('.alphabet-filter').hasClass('is-sticky')) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      
      // Clear active state from letter nav
      $('.alphabet-filter .letter-nav a').removeClass('active');
    });
  }
});