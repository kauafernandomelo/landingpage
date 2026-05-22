/* ============================================
   BRASA URBANA — script.js
   Interações, animações e comportamentos
   ============================================ */

(function () {
  'use strict';

  /* ============================================
     1. NAVBAR — sticky + scroll escuro
  ============================================ */
  const navbar  = document.getElementById('navbar');
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');

  // Sticky com sombra no scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ============================================
     2. MENU MOBILE — toggle hamburger
  ============================================ */
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);

    // Anima as barras do ícone
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Fechar menu ao clicar em link
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });

  // Fechar menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  /* ============================================
     3. TABS DO CARDÁPIO
  ============================================ */
  const tabBtns     = document.querySelectorAll('.tab-btn');
  const menuCards   = document.querySelectorAll('.menu-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Ativa tab clicada
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-cat');

      // Filtra os cards com animação
      menuCards.forEach((card, i) => {
        const cardCat = card.getAttribute('data-cat');

        if (cat === 'todos' || cardCat === cat) {
          card.classList.remove('hidden');
          // Stagger de entrada
          card.style.animationDelay = `${i * 0.06}s`;
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
              card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, i * 60);
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ============================================
     4. ANIMAÇÕES DE SCROLL — IntersectionObserver
  ============================================ */
  // Adiciona classe fade-in nos elementos principais
  const animatables = [
    '.promo-card',
    '.menu-card',
    '.diferencial-item',
    '.review-card',
    '.stat-item',
    '.section-header',
    '.hero__content',
    '.hero__visual',
    '.cta-final__container'
  ].join(', ');

  document.querySelectorAll(animatables).forEach((el, i) => {
    el.classList.add('fade-in');
    // Adiciona stagger baseado na posição
    const delay = Math.min((i % 4) * 0.1, 0.4);
    el.style.transitionDelay = `${delay}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* ============================================
     5. SCROLL SUAVE — links âncora
  ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navHeight = navbar.offsetHeight;
      const targetY   = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  /* ============================================
     6. EFEITO HOVER NOS CARDS — tilt suave
  ============================================ */
  document.querySelectorAll('.menu-card, .promo-card, .diferencial-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -4;
      const rotY   = ((x - cx) / cx) *  4;

      card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.35s ease, box-shadow 0.35s ease';
    });
  });

  /* ============================================
     7. CONTADOR ANIMADO — stats
  ============================================ */
  function animateCounter(el, start, end, suffix, duration) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.round(start + (end - start) * eased);

      el.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Observa os números das stats
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;

        if (el.classList.contains('stat-num')) {
          const text = el.textContent.trim();

          if (text.includes('4.9'))       animateCounter(el, 4.0, 4.9, '',  1200);
          else if (text.includes('10k'))  { el.textContent = '0k+'; animateCounter({ textContent: '' }, 0, 10, 'k+', 1200); setTimeout(() => el.textContent = '10k+', 1200); }
          else if (text.includes('98'))   animateCounter(el, 80, 98, '%',  1000);
        }

        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num').forEach(el => statsObserver.observe(el));

  /* ============================================
     8. TICKER — pausa no hover
  ============================================ */
  const ticker = document.querySelector('.ticker__track');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => {
      ticker.style.animationPlayState = 'paused';
    });
    ticker.addEventListener('mouseleave', () => {
      ticker.style.animationPlayState = 'running';
    });
  }

  /* ============================================
     9. BOTÕES — ripple effect no clique
  ============================================ */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect   = btn.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: 0; height: 0;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        left: ${x}px; top: ${y}px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: ripple-anim 0.5s ease-out forwards;
      `;

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Adiciona keyframe de ripple via JS
  if (!document.querySelector('#ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple-anim {
        to {
          width: 200px;
          height: 200px;
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /* ============================================
     10. LOG — confirma carregamento
  ============================================ */
  console.log('%c🔥 Brasa Urbana', 'color: #D62B2B; font-size: 18px; font-weight: bold;');
  console.log('%cHambúrguer de verdade. Sabor de respeito.', 'color: #888; font-size: 12px;');

})();