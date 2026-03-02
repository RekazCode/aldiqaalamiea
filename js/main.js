/* ═══════════════════════════════════════════════════════════════
   AL-DIQQA AL-LAMI'A — Landing Page Interactions
   Sticky header, modals, carousel, smooth scroll, lazy-load,
   intersection-observer animations, form handling
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── DOM References ───────────────────────────
  const header       = document.getElementById('header');
  const hamburger    = document.getElementById('hamburger');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const navMenu      = document.getElementById('navMenu');

  // Modals
  const productModal    = document.getElementById('productModal');
  const productBackdrop = document.getElementById('productBackdrop');
  const closeProductBtn = document.getElementById('closeProductModal');

  // Note: testimonials carousel removed — no related DOM refs

  // ═══════════════════════════════════════════════
  // 1. STICKY HEADER — Condensed on scroll
  // ═══════════════════════════════════════════════
  let lastScroll = 0;

  function handleScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollY > 80) {
      header.classList.add('header--condensed');
    } else {
      header.classList.remove('header--condensed');
    }

    // Update active nav link based on section in view
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__link');

    sections.forEach(section => {
      const top = section.offsetTop - 150;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        const id = section.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ═══════════════════════════════════════════════
  // 2. MOBILE HAMBURGER MENU
  // ═══════════════════════════════════════════════
  hamburger.addEventListener('click', () => {
    const isOpen = mobileOverlay.classList.contains('active');
    mobileOverlay.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-overlay__link').forEach(link => {
    link.addEventListener('click', () => {
      mobileOverlay.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ═══════════════════════════════════════════════
  // 3. MODALS
  // ═══════════════════════════════════════════════
  function openModal(modal) {
    modal.classList.add('modal--active');
    document.body.style.overflow = 'hidden';
    // Focus trap — focus first input
    setTimeout(() => {
      const firstInput = modal.querySelector('input, textarea, button:not(.modal__close)');
      if (firstInput) firstInput.focus();
    }, 300);
  }

  function closeModal(modal) {
    modal.classList.remove('modal--active');
    document.body.style.overflow = '';
  }

  // Product modal
  closeProductBtn.addEventListener('click', () => closeModal(productModal));
  productBackdrop.addEventListener('click', () => closeModal(productModal));

  // ESC to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(productModal);
    }
  });

  // ═══════════════════════════════════════════════
  // 4. PRODUCT QUICK-VIEW DATA
  // ═══════════════════════════════════════════════
  const productData = {
    gold: {
      title: 'مجموعة الذهب',
      desc: 'تشكيلة واسعة من الحلي والمجوهرات الذهبية بمختلف العيارات، مصنوعة من أجود أنواع الذهب المعتمد.',
      specs: ['عيار 18 قيراط', 'عيار 21 قيراط', 'عيار 24 قيراط', 'سبائك ذهبية بأوزان مختلفة', 'تصاميم كلاسيكية وعصرية'],
      bg: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)'
    },
    silver: {
      title: 'مجموعة الفضة',
      desc: 'فضة إيطالية وتركية عالية النقاء، قطع مصممة بحرفية لتناسب جميع الأذواق.',
      specs: ['فضة إيطالية 925', 'فضة تركية عالية الجودة', 'أطقم كاملة', 'قطع فردية مميزة', 'نقش وحفر مخصص'],
      bg: 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)'
    },
    gems: {
      title: 'أحجار كريمة',
      desc: 'مجموعة منتقاة من الأحجار الكريمة النادرة والمعتمدة من مختبرات عالمية.',
      specs: ['زمرد طبيعي', 'ياقوت أحمر وأزرق', 'ألماس مختبري ومعتمد', 'عقيق يماني', 'أحجار نادرة حسب الطلب'],
      bg: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)'
    }
  };

  // Collection tiles → open product modal
  document.querySelectorAll('.collection-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const key = tile.dataset.modal;
      const data = productData[key];
      if (!data) return;

      document.getElementById('productModalTitle').textContent = data.title;
      document.getElementById('productDesc').textContent = data.desc;
      document.getElementById('productImage').style.background = data.bg;

      const specsList = document.getElementById('productSpecs');
      specsList.innerHTML = data.specs.map(s => `<li>${s}</li>`).join('');

      openModal(productModal);
    });

    // Keyboard accessibility
    tile.setAttribute('tabindex', '0');
    tile.setAttribute('role', 'button');
    tile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tile.click();
      }
    });
  });

  // Testimonials carousel removed — static testimonials were deleted from HTML

  // ═══════════════════════════════════════════════
  // 6. SCROLL ANIMATIONS (Intersection Observer)
  // ═══════════════════════════════════════════════
  const animateElements = document.querySelectorAll(
    '.trust-item, .collection-tile, .about__content, .about__visual, .service-card, .contact__info'
  );

  animateElements.forEach(el => el.classList.add('fade-in'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animateElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    animateElements.forEach(el => el.classList.add('visible'));
  }

  // ═══════════════════════════════════════════════
  // 7. FORM HANDLING
  // ═══════════════════════════════════════════════
  function validateArabicForm(form) {
    let valid = true;
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--color-error)';
        valid = false;
      }
    });
    return valid;
  }

  function showSuccess(form, message) {
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = message || 'تم الإرسال بنجاح ✓';
    btn.style.background = 'var(--color-success)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  }

  // Contact form and quick-quote handlers removed (form elements were deleted from markup)

  // ═══════════════════════════════════════════════
  // 8. SMOOTH SCROLL FOR ANCHOR LINKS
  // ═══════════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ═══════════════════════════════════════════════
  // 9. LAZY LOAD IMAGES (for future real images)
  // ═══════════════════════════════════════════════
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ═══════════════════════════════════════════════
  // 10. PERFORMANCE: Debounce resize handler
  // ═══════════════════════════════════════════════
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initCarousel();
    }, 250);
  });

})();
