
document.addEventListener('DOMContentLoaded', () => {
  const cfg = window.NEXORA_CONFIG || {};
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  document.querySelectorAll('[data-email]').forEach(el => {
    const email = cfg.email || 'hello@nexora.ai';
    el.textContent = email;
    el.href = 'mailto:' + email;
  });
  document.querySelectorAll('[data-location]').forEach(el => el.textContent = cfg.location || 'India');
  document.querySelectorAll('[data-social="linkedin"]').forEach(el => el.href = cfg.linkedin || '#');
  document.querySelectorAll('[data-social="instagram"]').forEach(el => el.href = cfg.instagram || '#');

  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.primary-nav');
  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('.mega-parent > .nav-link, .simple-parent > .nav-link').forEach(link => {
      link.addEventListener('click', e => {
        if (window.matchMedia('(max-width: 850px)').matches) {
          const parent = link.parentElement;
          if (!parent.classList.contains('open')) {
            e.preventDefault();
            parent.classList.add('open');
          }
        }
      });
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 850px)').matches && !a.parentElement.classList.contains('mega-parent') && !a.parentElement.classList.contains('simple-parent')) {
        nav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    }));
  }

  const backTop = document.querySelector('.back-top');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 30);
    if (backTop) backTop.classList.toggle('visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Subtle scroll reveal for content blocks.
  const revealTargets = document.querySelectorAll('.pillar-card,.feature-card,.solution-card,.service-row,.industry-card,.steps-grid article,.partner-grid article,.insight-grid article,.outcome-grid article,.principle-grid article');
  revealTargets.forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:0.08});
    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  // Contact form: mailto fallback. Connect a backend endpoint for production submissions.
  const form = document.getElementById('enquiry-form');
  if (form) {
    const params = new URLSearchParams(window.location.search);
    const interest = params.get('interest');
    if (interest) {
      const select = form.querySelector('[name="interest"]');
      if (select) {
        const option = Array.from(select.options).find(o => o.text.toLowerCase().includes(interest.toLowerCase()));
        if (option) select.value = option.value;
      }
    }
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const feedback = form.querySelector('.form-feedback');
      if (!form.reportValidity()) return;
      const email = cfg.email || 'hello@nexora.ai';
      const subject = encodeURIComponent('NEXORA.AI website enquiry — ' + (data.interest || 'New enquiry'));
      const body = encodeURIComponent(
        'Name: ' + data.name + '\nEmail: ' + data.email + '\nCompany: ' + (data.company || '-') +
        '\nPhone: ' + (data.phone || '-') + '\nInterest: ' + data.interest + '\n\nProject details:\n' + data.message
      );
      if (cfg.contactMode === 'endpoint' && cfg.formEndpoint) {
        try {
          const response = await fetch(cfg.formEndpoint, {
            method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
          });
          if (!response.ok) throw new Error('Request failed');
          feedback.textContent = 'Thank you. Your enquiry has been submitted.';
          form.reset();
        } catch (err) {
          feedback.textContent = 'We could not submit the form. Please email ' + email + ' directly.';
        }
      } else {
        feedback.textContent = 'Your email app will open with the enquiry prepared. Please review and press Send to complete the enquiry.';
        window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
      }
    });
  }

  // Make dropdown menus keyboard-friendly.
  document.querySelectorAll('.nav-entry > a').forEach(link => {
    link.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') {
        const menu = link.parentElement.querySelector('.mega-menu,.simple-menu');
        const first = menu && menu.querySelector('a');
        if (first) { e.preventDefault(); first.focus(); }
      }
    });
  });
});
