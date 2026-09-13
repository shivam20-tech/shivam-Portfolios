/**
 * Shivam Mistry — Portfolio Interactive Motion Engine
 * Features: Spring Cursor, Dynamic Scroll Progress, Glass Header, Scroll Reveal, 3D Card Hover
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ── 1. Custom Interactive Cursor ── */
  const dot = document.getElementById('cDot');
  const ring = document.getElementById('cRing');
  let mx = -100, my = -100, rx = -100, ry = -100;
  let isCursorVisible = false;

  // Track cursor position
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!isCursorVisible && dot && ring) {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      isCursorVisible = true;
    }
    if (dot) {
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    }
  });

  // Smooth lerp loop for outer ring
  function cursorLoop() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    if (ring) {
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(cursorLoop);
  }
  requestAnimationFrame(cursorLoop);

  // Hide when pointer leaves viewport
  document.addEventListener('mouseleave', () => {
    if (dot && ring) {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      isCursorVisible = false;
    }
  });

  // Expand ring on interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .project-card, .certificate, .cert-toggle, .chip, .exp-card, .social-icons a, .theme-toggle, .btn, .profile-frame'
  );
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (ring) ring.classList.add('big');
      if (dot) dot.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      if (ring) ring.classList.remove('big');
      if (dot) dot.classList.remove('hovered');
    });
  });

  // Micro click feedback
  document.addEventListener('mousedown', () => {
    if (ring) ring.style.transform += ' scale(0.85)';
  });
  document.addEventListener('mouseup', () => {
    if (ring) ring.style.transform = ring.style.transform.replace(' scale(0.85)', '');
  });

  /* ── 2. Top Scroll Progress & Header Dynamic Blur ── */
  const scrollProgress = document.getElementById('scroll-progress');
  const header = document.querySelector('header');

  function updateScrollState() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Progress bar
    if (scrollProgress && docHeight > 0) {
      const progress = Math.min(Math.max(scrollY / docHeight, 0), 1);
      scrollProgress.style.transform = `scaleX(${progress})`;
    }

    // Dynamic Header
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }
  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState);
  updateScrollState();

  /* ── 3. Dark / Light Mode Toggle ── */
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Load saved preference or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  /* ── 4. Mobile Navigation ── */
  const menuToggle = document.getElementById('menu-toggle');
  const navbar = document.getElementById('navbar');

  if (menuToggle && navbar) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navbar.classList.toggle('active');
      const expanded = navbar.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', expanded);
    });

    // Close mobile nav when clicking any nav link
    document.querySelectorAll('#navbar a').forEach((link) => {
      link.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', false);
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !menuToggle.contains(e.target)) {
        navbar.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', false);
      }
    });
  }

  /* ── 5. Intersection Observer Scroll Reveal ── */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          // Once animated, unobserve for performance
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  /* ── 6. Active Section Navigation Spy ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a');
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((a) => a.classList.remove('active'));
          const activeLink = document.querySelector(`nav a[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    { rootMargin: '-35% 0px -55% 0px' }
  );
  sections.forEach((s) => navObserver.observe(s));

  /* ── 7. Certificates Accordion Toggle ── */
  const certToggleBtn = document.querySelector('.cert-toggle');
  const certsWrap = document.getElementById('certs-wrap');

  window.toggleCerts = function () {
    if (!certsWrap || !certToggleBtn) return;
    certsWrap.classList.toggle('open');
    certToggleBtn.classList.toggle('open');
    const isOpen = certsWrap.classList.contains('open');
    certToggleBtn.setAttribute('aria-expanded', isOpen);
  };

  if (certToggleBtn) {
    certToggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.toggleCerts();
      }
    });
  }

  /* ── 8. Subtle 3D Card Perspective Tilt Effect ── */
  const cards = document.querySelectorAll('.project-card, .exp-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -2.5;
      const rotateY = ((x - centerX) / centerX) * 2.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  console.log('✦ Shivam Mistry — Portfolio loaded with enhanced motion & visual engine.');
});
