// ============================================
//  RIVER TRADING LTD - Main JavaScript
// ============================================

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ---- NAVBAR: Scroll shrink + active link ----
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');
  const categoryPageFiles = new Set([
    'cat-agriculture.html',
    'cat-chemical.html',
    'cat-construction.html',
    'cat-electrical.html',
    'cat-handtools.html',
    'cat-sanitary.html',
    'party-supplies.html',
    'safety-equipment.html',
    'salon-assets.html',
    'special-products.html',
    'tailoring.html'
  ]);
  if (categoryPageFiles.has(window.location.pathname.split('/').pop())) {
    document.querySelector('.subcat-nav')?.remove();
  }

  const whatsappButton = document.createElement('a');
  whatsappButton.className = 'whatsapp-float';
  whatsappButton.href = 'https://wa.me/250788386303?text=' + encodeURIComponent('Hello River Trading team, I would like to chat with you.');
  whatsappButton.target = '_blank';
  whatsappButton.rel = 'noopener noreferrer';
  whatsappButton.setAttribute('aria-label', 'Chat with River Trading on WhatsApp');
  whatsappButton.title = 'Chat with us on WhatsApp';
  const stylesheet = document.querySelector('link[rel="stylesheet"][href*="style.css"]');
  const whatsappIcon = document.createElement('img');
  whatsappIcon.src = new URL('../images/whatsapp-icon-round.png', stylesheet.href).href;
  whatsappIcon.alt = '';
  whatsappIcon.setAttribute('aria-hidden', 'true');
  whatsappButton.appendChild(whatsappIcon);
  document.body.appendChild(whatsappButton);

  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (scrollTopBtn) {
      if (window.scrollY > 60) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Highlight active nav link based on section in view
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      const link = document.querySelector(`.nav-menu a[href="#${sec.id}"]`);
      if (link) {
        if (top <= 100 && top > -sec.offsetHeight + 100) {
          document.querySelectorAll('.nav-menu a').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });

  // ---- SCROLL TO TOP ----
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: motionPreference.matches ? 'auto' : 'smooth' });
    });
  }

  // ---- HAMBURGER MENU ----
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    if (!navMenu.id) navMenu.id = 'primary-navigation';
    hamburger.setAttribute('aria-controls', navMenu.id);

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open') ? 'true' : 'false');
    });

    // Close on regular link click (not dropdown toggles)
    navMenu.querySelectorAll('a:not(.has-dropdown > a)').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        // also close all dropdowns
        navMenu.querySelectorAll('li.has-dropdown').forEach(d => d.classList.remove('open'));
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navMenu.classList.contains('open')) {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        navMenu.querySelectorAll('li.has-dropdown').forEach(d => d.classList.remove('open'));
        hamburger.focus();
      }
    });
  }

  // ---- DROPDOWN MENUS ----
  const dropdownParents = document.querySelectorAll('.nav-menu li.has-dropdown');

  dropdownParents.forEach(parent => {
    const trigger = parent.querySelector(':scope > a');

    // Desktop: hover is handled by CSS
    // Click: toggle open class (works for both mobile tap and desktop click)
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = parent.classList.contains('open');
      // Close all others first
      dropdownParents.forEach(p => p.classList.remove('open'));
      if (!isOpen) parent.classList.add('open');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      dropdownParents.forEach(p => p.classList.remove('open'));
    }
  });

  // ---- LANDING PHOTOS: build the hero slides from the shared list ----
  // js/landing-photos.js holds every photo in one place. The static markup keeps
  // three slides as a no-JS fallback; when the list loads we rebuild so the hero
  // cycles through ALL of them, one after another, at the 3s cadence below.
  const landingPhotos = Array.isArray(window.RIVER_PHOTOS) ? window.RIVER_PHOTOS : [];
  const sliderEl       = document.querySelector('.slider');
  const dotsWrap       = document.querySelector('.slider-dots');
  const arrowPrev      = document.querySelector('.slider-arrow.prev');

  if (sliderEl && landingPhotos.length > 0) {
    // Remove the static fallback slides, then rebuild one per photo.
    sliderEl.querySelectorAll('.slide').forEach(el => el.remove());

    landingPhotos.forEach((photo, i) => {
      const slide = document.createElement('div');
      slide.className = 'slide slide-' + ((i % 3) + 1) + (i === 0 ? ' active' : '');
      slide.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');

      const visual = document.createElement('div');
      visual.className = 'slide-visual';

      const img = document.createElement('img');
      img.alt = photo.alt || '';
      img.decoding = 'async';
      img.dataset.src = photo.src;
      if (i === 0) {
        img.fetchPriority = 'high';
        img.src = photo.src;
      }
      // Missing file → hide the img so the gradient behind it shows instead.
      img.onerror = function () { this.style.display = 'none'; };

      visual.appendChild(img);
      slide.appendChild(visual);
      sliderEl.insertBefore(slide, arrowPrev);
    });

    // Rebuild the dots to match the new slide count.
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      landingPhotos.forEach((photo, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1) + ': ' + (photo.alt || 'product photo'));
        dotsWrap.appendChild(dot);
      });
    }
  }

  // ---- IMAGE SLIDER ----
  const slides    = document.querySelectorAll('.slide');
  const dots      = document.querySelectorAll('.dot');
  const prevBtn   = document.querySelector('.slider-arrow.prev');
  const nextBtn   = document.querySelector('.slider-arrow.next');

  let current  = 0;
  let autoPlay = null;

  // Company lines shown under the hero title — each one rotates with its slide
  const HERO_LINES = [
    '— Quality and Good Service —',
    '— Tools · Lubricants · Cleaning Products · Hardware —',
    '— Trusted by homes, businesses & industries since 2020 —'
  ];
  const heroSub = document.querySelector('.hero-subtitle');
  const heroViewport = document.querySelector('.slider');

  function loadSlideImage(index) {
    const image = slides[index] && slides[index].querySelector('img[data-src]');
    if (image) {
      image.src = image.dataset.src;
      delete image.dataset.src;
    }
  }

  function setHeroLine(i) {
    if (!heroSub) return;
    heroSub.classList.add('swap');                       // fade out
    setTimeout(() => {
      heroSub.textContent = HERO_LINES[i % HERO_LINES.length];
      heroSub.classList.remove('swap');                  // fade back in
    }, 250);
  }

  function goToSlide(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    loadSlideImage(current);
    loadSlideImage((current + 1) % slides.length);
    setHeroLine(current);
  }

  function startAutoPlay() {
    if (!autoPlay && !motionPreference.matches && !document.hidden) {
      autoPlay = setInterval(() => goToSlide(current + 1), 3000);
    }
  }

  function stopAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = null;
  }

  if (slides.length > 0) {
    loadSlideImage(0);
    loadSlideImage(1 % slides.length);
    startAutoPlay();

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoPlay(); goToSlide(current - 1); startAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoPlay(); goToSlide(current + 1); startAutoPlay(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { stopAutoPlay(); goToSlide(i); startAutoPlay(); });
    });

    if (heroViewport) {
      heroViewport.addEventListener('mouseenter', stopAutoPlay);
      heroViewport.addEventListener('mouseleave', startAutoPlay);
      heroViewport.addEventListener('focusin', stopAutoPlay);
      heroViewport.addEventListener('focusout', event => {
        if (!heroViewport.contains(event.relatedTarget)) startAutoPlay();
      });
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoPlay();
      else startAutoPlay();
    });
  }

  // ---- PHOTO STRIP (home page) — the same shared photo list ----
  // One image every 3s, same cadence as the hero, so both advance together.
  // The set is duplicated in the DOM: when the first set has scrolled fully
  // past, the transform snaps back to the identical second set — no visible jump.
  const stripTrack = document.querySelector('.strip-track');
  let startStripMotion = null;
  let stopStripMotion = null;

  if (stripTrack && landingPhotos.length > 0) {
    const CELL_W = 220;   // must match .strip-cell width in index.html
    const GAP    = 16;    // must match .strip-track gap in index.html
    const STEP   = CELL_W + GAP;

    const buildCell = (photo) => {
      const cell = document.createElement('div');
      cell.className = 'strip-cell';
      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = '';
      img.loading = 'lazy';
      img.onerror = function () { this.style.display = 'none'; };
      cell.appendChild(img);
      return cell;
    };

    landingPhotos.forEach(p => stripTrack.appendChild(buildCell(p)));
    landingPhotos.forEach(p => stripTrack.appendChild(buildCell(p)));

    const SET_W = landingPhotos.length * STEP;
    let stripOffset = 0;
    let stripTimer  = null;

    const advanceStrip = () => {
      stripOffset += STEP;
      if (stripOffset >= SET_W) stripOffset -= SET_W;   // seamless wrap
      stripTrack.style.transform = 'translateX(' + (-stripOffset) + 'px)';
    };

    const startStrip = () => {
      if (!stripTimer && !motionPreference.matches && !document.hidden) {
        stripTimer = setInterval(advanceStrip, 3000);
      }
    };
    const stopStrip  = () => { clearInterval(stripTimer); stripTimer = null; };
    startStripMotion = startStrip;
    stopStripMotion = stopStrip;

    startStrip();

    // Let people look at a photo: pause on hover, resume on leave.
    const stripViewport = stripTrack.closest('.strip-viewport') || stripTrack;
    stripViewport.addEventListener('mouseenter', stopStrip);
    stripViewport.addEventListener('mouseleave', startStrip);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopStrip(); else startStrip();
    });
  }

  motionPreference.addEventListener('change', event => {
    if (event.matches) {
      stopAutoPlay();
      if (stopStripMotion) stopStripMotion();
    } else {
      startAutoPlay();
      if (startStripMotion) startStripMotion();
    }
  });

  // ---- COUNTER ANIMATION ----
  const counters = document.querySelectorAll('.num[data-target]');

  if (motionPreference.matches) {
    counters.forEach(el => {
      el.textContent = (el.dataset.target || '0') + (el.dataset.suffix || '');
    });
  }

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let count = 0;
        const step  = Math.ceil(target / 60);
        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          el.textContent = count + suffix;
        }, 25);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  if (!motionPreference.matches) counters.forEach(c => countObserver.observe(c));

  // ---- SCROLL REVEAL ----
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  if (motionPreference.matches) {
    reveals.forEach(el => el.classList.add('visible'));
  } else {
    reveals.forEach(el => revealObserver.observe(el));
  }

  // Also trigger immediately for any elements already in viewport on load
  // (handles direct anchor navigation like #who-we-are)
  setTimeout(() => {
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      }
    });
  }, 100);

});
