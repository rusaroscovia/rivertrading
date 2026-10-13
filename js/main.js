// ============================================
//  RIVER TRADING LTD - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- NAVBAR: Scroll shrink + active link ----
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      scrollTopBtn.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      scrollTopBtn.classList.remove('visible');
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- HAMBURGER MENU ----
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close on regular link click (not dropdown toggles)
    navMenu.querySelectorAll('a:not(.has-dropdown > a)').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        // also close all dropdowns
        navMenu.querySelectorAll('li.has-dropdown').forEach(d => d.classList.remove('open'));
      });
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

  // ---- IMAGE SLIDER ----
  const slides    = document.querySelectorAll('.slide');
  const dots      = document.querySelectorAll('.dot');
  const prevBtn   = document.querySelector('.slider-arrow.prev');
  const nextBtn   = document.querySelector('.slider-arrow.next');

  let current  = 0;
  let autoPlay = null;

  function goToSlide(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAutoPlay() {
    autoPlay = setInterval(() => goToSlide(current + 1), 5000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlay);
  }

  if (slides.length > 0) {
    startAutoPlay();

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoPlay(); goToSlide(current - 1); startAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoPlay(); goToSlide(current + 1); startAutoPlay(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { stopAutoPlay(); goToSlide(i); startAutoPlay(); });
    });
  }

  // ---- COUNTER ANIMATION ----
  const counters = document.querySelectorAll('.num[data-target]');

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

  counters.forEach(c => countObserver.observe(c));

  // ---- SCROLL REVEAL ----
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => revealObserver.observe(el));

});
