/**
 * Spike Glossary — keyboard layer.
 *
 * Pure progressive enhancement: every page is complete, readable and navigable
 * before this file runs (it is loaded `defer`). Nothing here is required to
 * read a definition — it adds live filtering, an arrow-key cursor, the command
 * palette and the theme toggle on top of working HTML.
 *
 * Shortcuts (all of them are shown on-screen, per SPIKE-THEME.md §7):
 *   /  or  ⌘K / Ctrl+K   focus search (index) / open the palette (term page)
 *   ↑ ↓                  move the active term
 *   Enter                open the active term
 *   Home / End           jump to the first / last term
 *   ← →                  previous / next term (term pages)
 *   Esc                  clear the filter, or close the palette
 */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function isTyping(el) {
    if (!el) return false;
    var tag = el.tagName;
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      el.isContentEditable
    );
  }

  /* ====================================================================
       Theme toggle. The `dark` class is set by an inline head script before
       first paint, so this only has to keep the control and the browser UI
       colour in sync.
       ==================================================================== */
  (function themeToggle() {
    // Two instances live in the header: one in the desktop actions, one in
    // the mobile sheet. Both stay in sync with each other and the meta tag.
    var btns = doc.querySelectorAll("#theme-toggle, #theme-toggle-mobile");
    if (!btns.length) return;
    var meta = doc.getElementById("theme-color");

    // The header's own `.header-dark` treatment (frosted-black chrome,
    // white mobile "log in" outline) was built for scrolling over a dark
    // hero section — this site has none, so it's otherwise unused.
    // Driving it from the global theme switch instead gives one
    // full-page dark mode rather than a light header floating over a
    // dark page.
    var siteHeader = doc.getElementById("site-header");
    var menuToggleBtn = doc.getElementById("mobile-menu-toggle");
    var mobileLoginLight = doc.getElementById("mobile-cta-login-light");
    var mobileLoginDark = doc.getElementById("mobile-cta-login-dark");

    function sync() {
      var dark = root.classList.contains("dark");
      Array.prototype.forEach.call(btns, function (btn) {
        btn.setAttribute("aria-pressed", dark ? "true" : "false");
      });
      if (meta) meta.setAttribute("content", dark ? "#161618" : "#fcfbf9");
      if (siteHeader) siteHeader.classList.toggle("header-dark", dark);
      if (menuToggleBtn) menuToggleBtn.classList.toggle("is-dark", dark);
      if (mobileLoginLight)
        mobileLoginLight.classList.toggle("hidden-important", dark);
      if (mobileLoginDark)
        mobileLoginDark.classList.toggle("hidden-important", !dark);
    }

    sync();
    Array.prototype.forEach.call(btns, function (btn) {
      btn.addEventListener("click", function () {
        var dark = root.classList.toggle("dark");
        try {
          localStorage.setItem("spike-theme", dark ? "dark" : "light");
        } catch (e) {
          /* private mode — the choice just won't persist */
        }
        sync();
      });
    });
  })();

  /* ====================================================================
       Header — ported close to verbatim from spike-header-standalone.html:
       scroll-linked compaction + dark/light flip over `data-header-theme`
       sections, the desktop mega-dropdown, and the mobile hamburger sheet.
       ==================================================================== */
  (function header() {
    var siteHeader = doc.getElementById("site-header");
    var menuToggle = doc.getElementById("mobile-menu-toggle");
    var mobileLoginLight = doc.getElementById("mobile-cta-login-light");
    var mobileLoginDark = doc.getElementById("mobile-cta-login-dark");

    if (siteHeader) {
      var darkSections = doc.querySelectorAll('[data-header-theme="dark"]');
      var activeDarkSections = [];
      var reduceMotionQuery = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      var desktop = window.matchMedia("(min-width: 64rem)");
      // Hero-triggered flip (data-header-theme="dark") is independent of
      // the global light/dark theme switch — either can put the header
      // in its dark treatment, so the two are OR'd together below
      // rather than one clobbering the other on the next scroll tick.
      var heroDark = false;
      var lastScrolled = null;
      var lastIsDark = null;
      var lastProgress = -1;

      var SHRINK_DISTANCE = 100;
      var easeOutCubic = function (t) {
        return 1 - Math.pow(1 - t, 3);
      };

      var applyHeaderProgress = function () {
        if (!desktop.matches) {
          if (lastProgress === 0) return;
          lastProgress = 0;
          root.style.setProperty("--header-progress", "0");
          return;
        }
        var travelled = Math.min(
          1,
          Math.max(0, window.scrollY / SHRINK_DISTANCE),
        );
        var progress = reduceMotionQuery.matches
          ? window.scrollY > 0
            ? 1
            : 0
          : easeOutCubic(travelled);
        var rounded = Math.round(progress * 1000) / 1000;
        if (rounded === lastProgress) return;
        lastProgress = rounded;
        root.style.setProperty("--header-progress", String(rounded));
      };

      var applyHeaderChrome = function () {
        var scrolled = window.scrollY > 0;
        var isDark = heroDark || root.classList.contains("dark");
        if (scrolled === lastScrolled && isDark === lastIsDark) return;
        lastScrolled = scrolled;
        lastIsDark = isDark;

        siteHeader.classList.toggle("header-dark", isDark);
        if (menuToggle) menuToggle.classList.toggle("is-dark", isDark);
        if (mobileLoginLight)
          mobileLoginLight.classList.toggle("hidden-important", isDark);
        if (mobileLoginDark)
          mobileLoginDark.classList.toggle("hidden-important", !isDark);
      };

      if (darkSections.length) {
        var headerHeight = siteHeader.offsetHeight;
        var bandMargin = function () {
          return Math.max(0, window.innerHeight - headerHeight);
        };

        var observer = null;
        var createObserver = function () {
          if (observer) observer.disconnect();
          activeDarkSections = [];
          observer = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                var i = activeDarkSections.indexOf(entry.target);
                if (entry.isIntersecting) {
                  if (i === -1) activeDarkSections.push(entry.target);
                } else if (i !== -1) {
                  activeDarkSections.splice(i, 1);
                }
              });
              heroDark = activeDarkSections.length > 0;
              applyHeaderChrome();
            },
            { rootMargin: "0px 0px -" + bandMargin() + "px 0px", threshold: 0 },
          );
          darkSections.forEach(function (section) {
            observer.observe(section);
          });

          darkSections.forEach(function (section) {
            var rect = section.getBoundingClientRect();
            if (
              rect.top < headerHeight &&
              rect.bottom > 0 &&
              activeDarkSections.indexOf(section) === -1
            ) {
              activeDarkSections.push(section);
            }
          });
          heroDark = activeDarkSections.length > 0;
        };

        createObserver();
        window.addEventListener("resize", createObserver);
      }

      applyHeaderChrome();
      applyHeaderProgress();

      var recomputeProgress = function () {
        lastProgress = -1;
        applyHeaderProgress();
      };
      reduceMotionQuery.addEventListener("change", recomputeProgress);
      desktop.addEventListener("change", recomputeProgress);

      var scrollTicking = false;
      window.addEventListener(
        "scroll",
        function () {
          if (scrollTicking) return;
          scrollTicking = true;
          requestAnimationFrame(function () {
            applyHeaderProgress();
            applyHeaderChrome();
            scrollTicking = false;
          });
        },
        { passive: true },
      );
    }

    /* ---- desktop mega-dropdown: hover/focus swaps panel + sidebar --- */
    var dropdown = doc.querySelector(".mega-dropdown");
    if (dropdown) {
      var triggers = dropdown.querySelectorAll("[data-trigger]");
      var panels = dropdown.querySelectorAll("[data-panel]");
      var sidebars = dropdown.querySelectorAll("[data-sidebar]");

      var showPanel = function (name) {
        panels.forEach(function (p) {
          p.classList.toggle("is-active", p.dataset.panel === name);
        });
        sidebars.forEach(function (s) {
          s.classList.toggle("is-hidden", s.dataset.sidebar !== name);
        });
        triggers.forEach(function (t) {
          t.setAttribute("aria-expanded", String(t.dataset.trigger === name));
        });
      };

      triggers.forEach(function (trigger) {
        trigger.addEventListener("mouseenter", function () {
          showPanel(trigger.dataset.trigger);
        });
        trigger.addEventListener("focus", function () {
          showPanel(trigger.dataset.trigger);
        });
      });

      showPanel("products");
    }

    /* ---- mobile menu: hamburger toggle + accordion sections --------- */
    var toggle = doc.getElementById("mobile-menu-toggle");
    var menu = doc.getElementById("mobile-menu");
    var iconOpen = doc.getElementById("mobile-menu-icon-open");
    var iconClose = doc.getElementById("mobile-menu-icon-close");

    if (toggle && menu && iconOpen && iconClose) {
      var labelOpen = toggle.dataset.labelOpen || "";
      var labelClose = toggle.dataset.labelClose || "";

      var setOpen = function (open) {
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? labelClose : labelOpen);
        menu.classList.toggle("is-open", open);
        menu.setAttribute("aria-hidden", String(!open));
        if (open) doc.documentElement.style.overflow = "hidden";
        else doc.documentElement.style.overflow = "";

        iconOpen.classList.toggle("is-open", open);
        iconClose.classList.toggle("is-open", open);

        if (!open) {
          var collapseAccordions = function () {
            if (menu.getAttribute("aria-hidden") !== "true") return;
            menu
              .querySelectorAll("[data-mobile-trigger]")
              .forEach(function (t) {
                t.setAttribute("aria-expanded", "false");
              });
            menu.querySelectorAll("[data-mobile-panel]").forEach(function (p) {
              p.classList.remove("is-open");
            });
          };
          if (reduceMotion) collapseAccordions();
          else
            menu.addEventListener("transitionend", collapseAccordions, {
              once: true,
            });
        }
      };

      toggle.addEventListener("click", function () {
        setOpen(toggle.getAttribute("aria-expanded") !== "true");
      });

      doc.addEventListener("keydown", function (e) {
        if (
          e.key === "Escape" &&
          toggle.getAttribute("aria-expanded") === "true"
        ) {
          setOpen(false);
          toggle.focus();
        }
      });

      window
        .matchMedia("(min-width: 64rem)")
        .addEventListener("change", function (e) {
          if (e.matches) setOpen(false);
        });

      menu
        .querySelectorAll("[data-mobile-trigger]")
        .forEach(function (trigger) {
          trigger.addEventListener("click", function () {
            var key = trigger.dataset.mobileTrigger;
            var panel = menu.querySelector('[data-mobile-panel="' + key + '"]');
            var isOpen = trigger.getAttribute("aria-expanded") === "true";
            trigger.setAttribute("aria-expanded", String(!isOpen));
            if (panel) panel.classList.toggle("is-open", !isOpen);
          });
        });
    }
  })();

  /* ====================================================================
       Index: live filter + arrow-key cursor over the term cards.
       ==================================================================== */
  var listEl = doc.getElementById("term-list");
  var input = doc.getElementById("q");

  var focusSearch = null; // filled in by whichever surface this page has

  if (listEl && input) {
    var form = doc.getElementById("search-form");
    var countEl = doc.getElementById("result-count");
    var emptyEl = doc.getElementById("no-results");
    var clearBtn = doc.getElementById("clear-search");

    // The DOM is snapshotted once — 549 cards are expensive to re-query on
    // every keystroke — but not until someone actually interacts. Doing it
    // at load would land in the same task as the document's first layout
    // and show up as blocking time for a reader who never searches.
    var sections = [];
    var visible = [];
    var allCards = [];
    var total = Number(listEl.dataset.count) || 0;
    var indexed = false;

    function buildIndex() {
      if (indexed) return;
      indexed = true;

      Array.prototype.forEach.call(
        listEl.querySelectorAll(".letter"),
        function (sec) {
          var items = Array.prototype.map.call(
            sec.querySelectorAll(".terms > li"),
            function (li) {
              var a = li.querySelector(".term-card");
              allCards.push(a);
              return { li: li, a: a, key: (a.dataset.k || "").toLowerCase() };
            },
          );
          sections.push({ el: sec, items: items });
        },
      );

      total = allCards.length;
      visible = allCards.slice();
    }

    var announceTimer = 0;
    function announce(n, q) {
      if (!countEl) return;
      clearTimeout(announceTimer);
      announceTimer = setTimeout(function () {
        countEl.textContent = q
          ? n + (n === 1 ? " term matches" : " terms match") + " “" + q + "”"
          : total + " terms";
      }, 350);
    }

    function apply(raw) {
      buildIndex();
      var q = raw.trim().toLowerCase();
      var shownTotal = 0;
      visible = [];

      for (var s = 0; s < sections.length; s++) {
        var sec = sections[s];
        var shown = 0;
        for (var i = 0; i < sec.items.length; i++) {
          var it = sec.items[i];
          var hide = q !== "" && it.key.indexOf(q) === -1;
          if (it.li.hidden !== hide) it.li.hidden = hide;
          if (!hide) {
            shown++;
            visible.push(it.a);
          }
        }
        var hideSec = shown === 0;
        if (sec.el.hidden !== hideSec) sec.el.hidden = hideSec;
        shownTotal += shown;
      }

      if (emptyEl) emptyEl.hidden = shownTotal !== 0;
      if (clearBtn) clearBtn.hidden = q === "";
      announce(shownTotal, raw.trim());
    }

    var frame = 0;
    input.addEventListener("input", function () {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(function () {
        frame = 0;
        apply(input.value);
      });
    });

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (visible.length) window.location.href = visible[0].href;
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        input.value = "";
        apply("");
        input.focus();
      });
    }

    var toolbarWrap = doc.querySelector(".toolbar-wrap");

    focusSearch = function () {
      buildIndex();
      input.focus();
      input.select();
      // From the top of the page the sticky toolbar (and every result below
      // it) can still be a screen down, under the hero — scroll it flush to
      // the top so results are actually visible right away. A no-op once
      // it's already docked there, which `scroll-behavior: smooth` (see
      // §3) makes gentle rather than a jump-cut either way.
      if (toolbarWrap) toolbarWrap.scrollIntoView({ block: "start" });
    };

    // Warm the snapshot up the moment the reader shows any intent, so the
    // first keystroke is never the thing that pays for it.
    input.addEventListener("focus", buildIndex, { once: true });

    /* ---- the active-term cursor ------------------------------------ */
    var active = null;
    listEl.addEventListener("focusin", function (e) {
      var card = e.target.closest && e.target.closest(".term-card");
      if (!card) return;
      if (active && active !== card) active.classList.remove("is-active");
      active = card;
      card.classList.add("is-active");
    });
    listEl.addEventListener("focusout", function () {
      if (active) {
        active.classList.remove("is-active");
        active = null;
      }
    });

    function goTo(card) {
      if (!card) return;
      card.focus({ preventScroll: true });
      card.scrollIntoView({ block: "nearest", behavior: "auto" });
    }

    // The homepage list is a single column of ledger rows, so this is 1 —
    // but it's read live rather than hardcoded so the row-stepping below
    // still holds if the list ever goes multi-column again.
    function columnCount(card) {
      var grid = card.closest(".terms");
      if (!grid) return 1;
      var tracks = getComputedStyle(grid).gridTemplateColumns.split(" ");
      return tracks.length || 1;
    }

    // The cards a letter section is actually showing right now, in DOM
    // order — filtered-out (`hidden`) items don't hold a grid slot, so the
    // survivors are exactly what the grid is laying out into rows.
    function sectionCards(s) {
      var items = sections[s].items;
      var out = [];
      for (var i = 0; i < items.length; i++) {
        if (!items[i].li.hidden) out.push(items[i].a);
      }
      return out;
    }

    function findInSections(card) {
      for (var s = 0; s < sections.length; s++) {
        var cards = sectionCards(s);
        var i = cards.indexOf(card);
        if (i !== -1) return { section: s, index: i, cards: cards };
      }
      return null;
    }

    // Up/down by row, *within the current letter section's own grid* — each
    // `.terms` is a separate grid that restarts its own row layout. Crossing
    // a section boundary lands on the nearest column of the next/previous
    // section's edge row.
    function stepRow(card, dir) {
      var pos = findInSections(card);
      if (!pos) return null;
      var cols = columnCount(card);
      var col = pos.index % cols;
      var target = pos.index + dir * cols;

      if (target >= 0 && target < pos.cards.length) return pos.cards[target];

      for (var s = pos.section + dir; s >= 0 && s < sections.length; s += dir) {
        var cards = sectionCards(s);
        if (!cards.length) continue;
        if (dir > 0) return cards[Math.min(col, cards.length - 1)];
        var lastRowStart = cards.length - (cards.length % cols || cols);
        return cards[Math.min(lastRowStart + col, cards.length - 1)];
      }
      return null;
    }

    doc.addEventListener("keydown", function (e) {
      if (e.defaultPrevented || e.altKey) return;
      var t = e.target;

      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        focusSearch();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;

      if (e.key === "/" && !isTyping(t)) {
        e.preventDefault();
        focusSearch();
        return;
      }

      if (t === input) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          buildIndex();
          goTo(visible[0]);
        } else if (e.key === "Escape") {
          if (input.value) {
            input.value = "";
            apply("");
          } else {
            input.blur();
          }
        }
        return;
      }

      if (isTyping(t)) return;

      var card = t.closest && t.closest(".term-card");
      if (!card) return;
      buildIndex();

      if (e.key === "ArrowDown") {
        e.preventDefault();
        var down = stepRow(card, 1);
        if (down) goTo(down);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        var up = stepRow(card, -1);
        if (up) goTo(up);
        else focusSearch();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(visible[0]);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(visible[visible.length - 1]);
      } else if (e.key === "Escape") {
        card.blur();
      }
    });

    /* ---- mobile search: under 40rem the inline toolbar search is hidden
           entirely (see the max-width:39.999rem rules in glossary.css) and
           reached instead through the #mobile-search-toggle FAB, which opens
           the #palette overlay — same dropdown-results-over-a-scrim pattern
           term pages use for Cmd+K, just without the keyboard-shortcut
           footer. Wired up below, once the palette's own `open` exists. */

    /* ---- deep link: /?q=alert (the WebSite SearchAction target) ----- */
    try {
      var q0 = new URLSearchParams(window.location.search).get("q");
      if (q0) {
        input.value = q0;
        apply(q0);
        focusSearch();
      }
    } catch (e) {
      /* no URLSearchParams — the unfiltered list is a fine fallback */
    }

    /* ---- highlight the letter you're currently reading --------------
           Wired up on the first scroll, never at load: observing 26 sections
           forces a full layout of a very long page, and until the reader has
           scrolled there is nothing for it to highlight anyway. */
    if ("IntersectionObserver" in window) {
      window.addEventListener(
        "scroll",
        function () {
          buildIndex();

          var links = {};
          Array.prototype.forEach.call(
            doc.querySelectorAll(".az__list a[data-letter]"),
            function (a) {
              links[a.dataset.letter] = a;
            },
          );

          // The vertical rail carries the same targets — spy it in step
          // with the toolbar strip.
          var railLinks = {};
          Array.prototype.forEach.call(
            doc.querySelectorAll(".charnav a[data-charnav]"),
            function (a) {
              railLinks[a.dataset.charnav] = a;
            },
          );
          var currentRail = null;

          // Document order, so "which section am I reading" can be
          // answered as "the topmost one still in the band" rather
          // than "whichever entry the observer happened to report
          // last" — entries arrive in arbitrary order, which is how
          // jumping to H could leave the marker sitting on G.
          var order = sections.map(function (s) {
            return s.el;
          });
          var inBand = [];
          var current = null;

          // The band has to start *below* the sticky header and
          // search bar; a percentage from the viewport top counts
          // the pixels they're covering, so the section tucked
          // behind them still registered as the one being read.
          var headerEl = doc.getElementById("site-header");
          var barEl = doc.querySelector(".toolbar-wrap");
          var stack =
            (headerEl ? headerEl.offsetHeight : 0) +
            (barEl ? barEl.offsetHeight : 0);

          var io = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                var at = inBand.indexOf(entry.target);
                if (entry.isIntersecting) {
                  if (at === -1) inBand.push(entry.target);
                } else if (at !== -1) {
                  inBand.splice(at, 1);
                }
              });

              if (!inBand.length) return;

              var topmost = inBand.reduce(function (a, b) {
                return order.indexOf(a) <= order.indexOf(b) ? a : b;
              });

              var rail = railLinks[topmost.id];
              if (rail && rail !== currentRail) {
                if (currentRail) currentRail.removeAttribute("aria-current");
                rail.setAttribute("aria-current", "true");
                currentRail = rail;
              }

              var link = links[topmost.id];
              if (!link || link === current) return;
              if (current) current.removeAttribute("aria-current");
              link.setAttribute("aria-current", "true");
              current = link;
            },
            { rootMargin: "-" + (stack + 8) + "px 0px -55% 0px" },
          );

          sections.forEach(function (s) {
            io.observe(s.el);
          });
        },
        { once: true, passive: true },
      );
    }
  }

  /* ====================================================================
       Term pages: a ⌘K palette over the full term list, fetched lazily on
       first open so it costs nothing at load.

       The homepage also carries one, marked data-scope="mobile" (see
       src/index.hbs / palette.hbs): there it's reached only through the
       #mobile-search-toggle FAB below 40rem, not Cmd+K or "/", and it must
       never touch `focusSearch` or the global shortcuts further down —
       those still belong to the homepage's own inline, live-filtering
       search on every width the FAB isn't shown at.
       ==================================================================== */
  var palette = doc.getElementById("palette");

  if (palette) {
    var paletteMobileOnly = palette.dataset.scope === "mobile";
    var panelInput = doc.getElementById("palette-input");
    var results = doc.getElementById("palette-results");
    var scrim = palette.querySelector(".palette__scrim");
    var openBtn = doc.getElementById("open-palette");
    var mobileToggleBtn = doc.getElementById("mobile-search-toggle");
    var src = palette.dataset.src;

    var terms = null;
    var fetching = false;
    var matches = [];
    var sel = 0;
    var lastFocus = null;

    var note = doc.getElementById("palette-note");

    function render() {
      var q = panelInput.value.trim().toLowerCase();
      matches = [];

      if (terms) {
        for (var i = 0; i < terms.length && matches.length < 12; i++) {
          if (!q || terms[i][0].toLowerCase().indexOf(q) !== -1)
            matches.push(terms[i]);
        }
      }

      var html = "";
      for (var j = 0; j < matches.length; j++) {
        html +=
          '<li class="palette__opt" role="option" id="palette-opt-' +
          j +
          '" aria-selected="' +
          (j === 0 ? "true" : "false") +
          '" data-href="' +
          esc(palette.dataset.base + "/" + matches[j][1] + "/") +
          '">' +
          esc(matches[j][0]) +
          "</li>";
      }
      results.innerHTML = html;

      note.hidden = matches.length > 0;
      if (note.hidden === false) {
        note.textContent = terms
          ? "No terms match “" + q + "”"
          : "Loading terms…";
      }

      sel = 0;
      syncSel();
    }

    function esc(s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    }

    function syncSel() {
      var opts = results.querySelectorAll('[role="option"]');
      for (var i = 0; i < opts.length; i++) {
        opts[i].setAttribute("aria-selected", i === sel ? "true" : "false");
      }
      if (opts[sel]) {
        panelInput.setAttribute("aria-activedescendant", opts[sel].id);
        opts[sel].scrollIntoView({ block: "nearest" });
      } else {
        panelInput.removeAttribute("aria-activedescendant");
      }
    }

    function load() {
      if (terms || fetching || !src) return;
      fetching = true;
      fetch(src)
        .then(function (r) {
          return r.json();
        })
        .then(function (data) {
          terms = data;
          fetching = false;
          if (!palette.hidden) render();
        })
        .catch(function () {
          fetching = false;
          terms = [];
          if (!palette.hidden) render();
        });
    }

    function open() {
      if (!palette.hidden) return;
      lastFocus = doc.activeElement;
      palette.hidden = false;
      doc.body.style.overflow = "hidden";
      panelInput.value = "";
      panelInput.setAttribute("aria-expanded", "true");
      load();
      render();
      panelInput.focus();
    }

    function close() {
      if (palette.hidden) return;
      palette.hidden = true;
      doc.body.style.overflow = "";
      panelInput.setAttribute("aria-expanded", "false");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function activate() {
      if (matches[sel]) {
        window.location.href =
          palette.dataset.base + "/" + matches[sel][1] + "/";
      }
    }

    if (openBtn) openBtn.addEventListener("click", open);
    if (mobileToggleBtn) mobileToggleBtn.addEventListener("click", open);
    if (scrim) scrim.addEventListener("click", close);

    panelInput.addEventListener("input", render);

    panelInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (matches.length) sel = (sel + 1) % matches.length;
        syncSel();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (matches.length) sel = (sel - 1 + matches.length) % matches.length;
        syncSel();
      } else if (e.key === "Enter") {
        e.preventDefault();
        activate();
      } else if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab") {
        // The dialog is modal and holds a single focusable field.
        e.preventDefault();
      }
    });

    results.addEventListener("click", function (e) {
      var opt = e.target.closest && e.target.closest("[data-href]");
      if (opt) window.location.href = opt.dataset.href;
    });

    // The homepage's mobile-only instance is reached solely by tapping the
    // FAB above — Cmd+K, "/" and `focusSearch` stay with the homepage's own
    // inline search (see the "Index: live filter" block above), which is
    // still what desktop/tablet widths use.
    if (!paletteMobileOnly) {
      focusSearch = open;

      /* ---- page-level shortcuts on term pages ---------------------- */
      var prev = doc.querySelector('[data-pager="prev"]');
      var next = doc.querySelector('[data-pager="next"]');

      doc.addEventListener("keydown", function (e) {
        if (e.defaultPrevented || e.altKey || !palette.hidden) return;
        var t = e.target;

        if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
          e.preventDefault();
          open();
          return;
        }
        if (e.metaKey || e.ctrlKey || e.shiftKey || isTyping(t)) return;

        if (e.key === "/") {
          e.preventDefault();
          open();
        } else if (e.key === "ArrowLeft" && prev) {
          window.location.href = prev.href;
        } else if (e.key === "ArrowRight" && next) {
          window.location.href = next.href;
        }
      });
    }
  }

  /* ====================================================================
       Sticky-bar height. Every in-page anchor (the A–Z jump, the letter
       headings, the term-page sidebar) offsets itself by --toolbar-h to
       clear the sticky search bar. That height isn't a constant — the
       index's toolbar is two rows and the A–Z strip wraps at narrow
       widths, while a term page's slim bar is one row — so the CSS
       fallback is only ever right by accident. Measure it instead, and
       re-measure when a resize changes the wrapping.
       ==================================================================== */
  (function stickyBarHeight() {
    var bar = doc.querySelector(".toolbar-wrap");
    if (!bar) return;

    var last = -1;
    function measure() {
      // offsetHeight, not getBoundingClientRect(), so a compacting
      // transform on an ancestor can't scale the number.
      var h = bar.offsetHeight;
      if (!h || h === last) return;
      last = h;
      root.style.setProperty("--toolbar-h", h + "px");
    }

    measure();

    if ("ResizeObserver" in window) {
      new ResizeObserver(measure).observe(bar);
    } else {
      window.addEventListener("resize", measure, { passive: true });
    }
  })();

  /* ====================================================================
       A–Z jump accuracy.

       The letter sections carry `content-visibility: auto`, so any section
       that hasn't been near the viewport yet reports its *estimated*
       contain-intrinsic-size rather than a real height. The browser adds
       those estimates up to decide where a `#letter-Z` link should land, and
       every one that guessed low shifts the target — which is why clicking Z
       used to drop you at Y.

       So: animate toward a destination recalculated on every frame while the
       content renders, then correct any remaining drift once it settles.
       ==================================================================== */
  (function letterJump() {
    var links = doc.querySelectorAll(
      '.az__list a[href^="#letter-"], .charnav a[href^="#letter-"]',
    );
    if (!links.length) return;
    var activeJump = 0;

    function settle(target, jumpId) {
      var passes = 0;
      var settled = 0;

      (function pass() {
        if (jumpId !== activeJump) return;

        // Read this on every pass: the site header compacts while
        // scrolling, which changes the section's scroll margin.
        var want = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        var delta = target.getBoundingClientRect().top - want;

        // Require two stable frames. A section becoming visible can
        // replace several intrinsic-size estimates after this frame,
        // moving the target again even when it is aligned right now.
        if (Math.abs(delta) < 1) {
          settled++;
        } else {
          settled = 0;
          window.scrollBy({ top: delta, left: 0, behavior: "instant" });
        }
        passes++;

        // A temporary bottom clamp is not terminal: rendering the
        // newly visible deferred sections can increase scrollHeight
        // on the next frame, especially when jumping straight to Z.
        if (settled < 2 && passes < 24) requestAnimationFrame(pass);
      })();
    }

    function jump(target) {
      var jumpId = ++activeJump;
      if (reduceMotion) {
        settle(target, jumpId);
        return;
      }

      var startY = window.scrollY;
      var started = null;
      var duration = 850;

      function animate(now) {
        if (jumpId !== activeJump) return;
        if (started === null) started = now;

        var progress = Math.min((now - started) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var want = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        var destination =
          window.scrollY + target.getBoundingClientRect().top - want;
        var nextY = startY + (destination - startY) * eased;

        window.scrollTo({ top: nextY, left: 0, behavior: "instant" });
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          settle(target, jumpId);
        }
      }

      requestAnimationFrame(animate);
    }

    Array.prototype.forEach.call(links, function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");
        var target = doc.getElementById(href.slice(1));
        if (!target) return;
        e.preventDefault();

        // Mark it straight away rather than waiting for the scroll
        // observer to catch up mid-jump. Both faces of the A–Z (the
        // toolbar strip and the vertical rail) point at the same
        // `#letter-X`, so light up every link for this target, not just
        // the one that was clicked.
        Array.prototype.forEach.call(links, function (other) {
          if (other.getAttribute("href") === href) {
            other.setAttribute("aria-current", "true");
          } else {
            other.removeAttribute("aria-current");
          }
        });

        jump(target);
        // Keep the URL shareable even though the default was stopped.
        if (window.history && history.replaceState) {
          history.replaceState(null, "", href);
        }
      });
    });
  })();

  /* ====================================================================
       Right-edge A–Z rail: pointer dock-magnify + a Monoton "flag" bubble
       that tracks the cursor down the rail. Ported from the `.scrubber` in
       design-explorations/glossary-homepage-concepts.html. The rail's
       navigation (click → animated jump) and the current-letter highlight
       are wired above; this is only the hover flourish, and only where the
       rail is actually shown (>=78rem).
       ==================================================================== */
  (function charnavFlag() {
    var rail = doc.querySelector(".charnav");
    var flag = doc.querySelector(".charnav__flag");
    if (!rail || !flag) return;

    var cells = Array.prototype.slice.call(
      rail.querySelectorAll("ul > li > a, ul > li > span"),
    );
    if (!cells.length) return;

    var wide = window.matchMedia("(min-width: 78rem)");
    var raf = 0;

    // Peak extra scale right under the pointer, and how far (px) the effect
    // reaches. Scale only — no positional nudging — so the rail column never
    // reflows and there's nothing to "shift". Kept small: at the rail's ~16px
    // pitch the fixed glyph centres keep even the enlarged letters clear of
    // each other, and the flag bubble is what actually reads out the letter.
    var PEAK = 0.6;
    var REACH = 38;

    // Resting mid-Y of each cell, cached so last frame's transforms can't
    // feed into this frame's measurements. The rail is `position: fixed`, so
    // this only goes stale on resize.
    var rest = null;
    function measure() {
      rest = cells.map(function (c) {
        var r = c.getBoundingClientRect();
        return { el: c, mid: r.top + r.height / 2, left: r.left };
      });
    }
    window.addEventListener("resize", function () {
      rest = null;
    });

    function onMove(ev) {
      if (raf) return;
      var y = ev.clientY;
      raf = requestAnimationFrame(function () {
        raf = 0;
        if (!wide.matches) return;
        if (!rest) measure();

        var focus = null;
        var focusD = Infinity;

        rest.forEach(function (g) {
          var d = Math.abs(y - g.mid);
          if (d < focusD) {
            focusD = d;
            focus = g;
          }
          if (!reduceMotion) {
            var s = Math.max(0, 1 - d / REACH);
            g.el.style.transform = s ? "scale(" + (1 + s * PEAK) + ")" : "";
            g.el.style.color = s > 0.5 ? "var(--heading-foreground)" : "";
          }
        });

        if (!focus) return;
        flag.textContent = (focus.el.textContent || "").trim().charAt(0);
        flag.style.top = focus.mid + "px";
        flag.style.right = window.innerWidth - focus.left + 14 + "px";
        flag.classList.add("is-visible");
      });
    }

    function onLeave() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      cells.forEach(function (c) {
        c.style.transform = "";
        c.style.color = "";
      });
      flag.classList.remove("is-visible");
    }

    rail.addEventListener("pointerenter", measure);
    rail.addEventListener("pointermove", onMove);
    rail.addEventListener("pointerleave", onLeave);

    // Only light the rail up while the term list actually owns the screen —
    // i.e. it still crosses the vertical middle of the viewport. That keeps
    // it off the hero above the list and off the FAQ / footer below it.
    // (An IntersectionObserver can't express this: the list is ~40 000px
    // tall, so it "intersects" almost any band almost all the time.)
    var list = doc.getElementById("term-list");
    if (list) {
      var visRaf = 0;
      var syncVis = function () {
        visRaf = 0;
        var r = list.getBoundingClientRect();
        var mid = window.innerHeight / 2;
        rail.classList.toggle("is-live", r.top < mid && r.bottom > mid);
      };
      var queueVis = function () {
        if (!visRaf) visRaf = requestAnimationFrame(syncVis);
      };
      window.addEventListener("scroll", queueVis, { passive: true });
      window.addEventListener("resize", queueVis);
      syncVis();
    }
  })();

  /* ====================================================================
       FAQ accordion. The CSS (see glossary.css) animates *opening* by
       flipping `.faq__answer-wrap`'s grid-template-rows once `[open]`
       lands — but a native <details> closes by having the browser yank
       its content to `display: none` the instant `open` is removed,
       before any transition gets a chance to run. Intercept the close,
       animate it by hand, and only then let the attribute actually go.
       ==================================================================== */
  (function faqAccordion() {
    var items = doc.querySelectorAll(".faq__item");
    if (!items.length || reduceMotion) return;

    Array.prototype.forEach.call(items, function (item) {
      var summary = item.querySelector(".faq__question");
      var wrap = item.querySelector(".faq__answer-wrap");
      if (!summary || !wrap) return;

      summary.addEventListener("click", function (e) {
        if (!item.open) return; // opening: the browser's default action + CSS handle it
        e.preventDefault();
        wrap.addEventListener(
          "transitionend",
          function () {
            item.open = false;
            wrap.style.gridTemplateRows = "";
          },
          { once: true },
        );
        wrap.style.gridTemplateRows = "0fr";
      });
    });
  })();

  /* ====================================================================
       Newsletter (Loops). Without JS the form still posts normally; this only
       keeps the reader on the page and reports the result in a live region.
       ==================================================================== */
  (function subscribe() {
    var form = doc.getElementById("subscribe-form");
    if (!form) return;
    var email = doc.getElementById("subscribe-email");
    var msg = doc.getElementById("subscribe-msg");
    var button = form.querySelector("button");

    function say(text, isError) {
      msg.textContent = text;
      msg.hidden = false;
      msg.classList.toggle("subscribe__msg--err", !!isError);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Loops rate-limits to one signup a minute; fail fast and locally.
      try {
        var last = Number(localStorage.getItem("loops-form-timestamp") || 0);
        if (last + 60000 > Date.now()) {
          say("Too many signups — please try again in a minute.", true);
          return;
        }
        localStorage.setItem("loops-form-timestamp", String(Date.now()));
      } catch (x) {
        /* storage blocked — let the server do the rate limiting */
      }

      button.disabled = true;
      say("Subscribing…");

      fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:
          "source=Glossary&userGroup=Glossary&email=" +
          encodeURIComponent(email.value),
      })
        .then(function (r) {
          if (!r.ok) throw new Error("Request failed");
          form.reset();
          say("Thank you — you’re subscribed.");
        })
        .catch(function () {
          say("Something went wrong. Please try again.", true);
        })
        .finally(function () {
          button.disabled = false;
        });
    });
  })();

  /* Smooth in-page jumps only when the reader hasn't asked us not to. */
  if (reduceMotion) root.style.scrollBehavior = "auto";
})();
