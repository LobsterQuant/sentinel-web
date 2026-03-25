/* ═══════════════════════════════════════════════════════
   SENTINEL — Waitlist Modal + Banner Fix (shared JS)
   Injected into every page via <script src="/shared.js">
═══════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ── 1. Inject modal HTML ────────────────────────────────────────────────────
  var modalHTML =
    '<div class="wl-overlay" id="wlOverlay">' +
      '<div class="wl-modal">' +
        '<button class="wl-close" id="wlClose" aria-label="Close">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
        '<div class="wl-header" id="wlHeader">' +
          '<div class="wl-eyebrow">Early Access</div>' +
          '<div class="wl-title">Join the waitlist.</div>' +
          '<div class="wl-subtitle">Reserve your spot before MiCA enforcement on 1 July 2026.</div>' +
        '</div>' +
        '<form class="wl-form" id="wlForm" action="https://formspree.io/f/xyknapjl" method="POST">' +
          '<div class="wl-field">' +
            '<label for="wlName">Name</label>' +
            '<input type="text" id="wlName" name="name" placeholder="Your full name" required>' +
          '</div>' +
          '<div class="wl-field">' +
            '<label for="wlCompany">Company</label>' +
            '<input type="text" id="wlCompany" name="company" placeholder="Company or project name">' +
          '</div>' +
          '<div class="wl-field">' +
            '<label for="wlEmail">Email</label>' +
            '<input type="email" id="wlEmail" name="email" placeholder="you@company.com" required>' +
          '</div>' +
          '<div class="wl-field">' +
            '<label for="wlPlan">Plan Interest</label>' +
            '<select id="wlPlan" name="plan" required>' +
              '<option value="" disabled selected>Select a plan</option>' +
              '<option value="Individual €99/mo">Individual — €99/mo</option>' +
              '<option value="Professional €499/mo">Professional — €499/mo</option>' +
              '<option value="CASP €1,500/mo">CASP — €1,500/mo</option>' +
            '</select>' +
          '</div>' +
          '<button type="submit" class="wl-submit" id="wlSubmit">Request Early Access</button>' +
        '</form>' +
        '<div class="wl-success" id="wlSuccess">' +
          '<div class="wl-success-icon">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
          '</div>' +
          '<h3>You\u2019re on the list.</h3>' +
          '<p>We\u2019ll be in touch before July 1.<br>Check your inbox for a confirmation.</p>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // ── 2. Modal open / close logic ─────────────────────────────────────────────
  var overlay  = document.getElementById('wlOverlay');
  var closeBtn = document.getElementById('wlClose');
  var form     = document.getElementById('wlForm');
  var header   = document.getElementById('wlHeader');
  var success  = document.getElementById('wlSuccess');
  var submitBtn = document.getElementById('wlSubmit');

  function openModal(e) {
    if (e) e.preventDefault();
    // Reset to form state if previously succeeded
    form.classList.remove('hidden');
    header.classList.remove('hidden');
    success.classList.remove('show');
    form.reset();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  // ── 3. Mobile Nav Menu ──────────────────────────────────────────────────────
  var nav = document.querySelector('nav');
  var navLinks = document.querySelector('.nav-links');
  if (nav && navLinks) {
    // Check if toggle already exists to prevent duplicates
    var mobileNavToggle = document.getElementById('mobileNavToggle');
    if (!mobileNavToggle) {
      mobileNavToggle = document.createElement('button');
      mobileNavToggle.className = 'mobile-nav-toggle';
      mobileNavToggle.id = 'mobileNavToggle';
      mobileNavToggle.setAttribute('aria-label', 'Toggle Navigation');
      mobileNavToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      
      // insert toggle as the first child of nav if possible, or append it
      if (nav.firstChild) {
        nav.insertBefore(mobileNavToggle, nav.firstChild);
      } else {
        nav.appendChild(mobileNavToggle);
      }
    }

    var mobileNavOverlay = document.getElementById('mobileNavOverlay');
    if (!mobileNavOverlay) {
      mobileNavOverlay = document.createElement('div');
      mobileNavOverlay.className = 'mobile-nav-overlay';
      mobileNavOverlay.id = 'mobileNavOverlay';
      document.body.appendChild(mobileNavOverlay);
    }

    var toggleMobileNav = function() {
      navLinks.classList.toggle('open');
      mobileNavOverlay.classList.toggle('active');
    };

    mobileNavToggle.addEventListener('click', toggleMobileNav);
    mobileNavOverlay.addEventListener('click', toggleMobileNav);

    var links = navLinks.querySelectorAll('a');
    links.forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
        mobileNavOverlay.classList.remove('active');
      });
    });
  }

  // ── 4. Intercept CTA buttons ────────────────────────────────────────────────
  // Use event delegation on document for all clicks
  document.addEventListener('click', function(e) {
    var target = e.target;
    // Walk up to find an anchor or button
    while (target && target !== document) {
      if (target.tagName === 'A' || target.tagName === 'BUTTON') {
        var href = target.getAttribute('href') || '';
        
        if (href.indexOf('https://buy.stripe.com') === 0) {
          e.preventDefault();
          window.open(href, '_blank');
          return;
        }
        
        if (href === '#') {
          openModal(e);
          return;
        }
      }
      target = target.parentElement;
    }
  });

  // ── 5. Form submission via Formspree ────────────────────────────────────────
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    var formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(function(response) {
      if (response.ok) {
        form.classList.add('hidden');
        header.classList.add('hidden');
        success.classList.add('show');
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request Early Access';
        alert('Something went wrong. Please try again.');
      }
    })
    .catch(function() {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Request Early Access';
      alert('Network error. Please check your connection and try again.');
    });
  });

})();
