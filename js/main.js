document.addEventListener('DOMContentLoaded', () => {

  // ===== 1. CURSOR GLOW FOLLOW =====
  const glow = document.getElementById('cursor-glow');
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
  
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Smooth lerp follow instead of instant snap
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    if (glow) {
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
    }
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // ===== 2. PARALLAX TILT VIDEO FRAME =====
  const videoFrame = document.querySelector('.video-frame');
  const videoSection = document.querySelector('.video-section');
  
  if (videoFrame && videoSection) {
    videoSection.addEventListener('mousemove', e => {
      const rect = videoSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      videoFrame.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-2px)`;
    });
    videoSection.addEventListener('mouseleave', () => {
      videoFrame.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
      videoFrame.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    videoSection.addEventListener('mouseenter', () => {
      videoFrame.style.transition = 'transform 0.1s linear';
    });
  }

  // ===== 3. HERO TYPING ANIMATION =====
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const phrases = [
      'Claude → ChatGPT',
      'Gemini → Claude',
      'GPT-4o → Perplexity',
      'Grok → Gemini',
      'Any AI → Any AI'
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function typeLoop() {
      const current = phrases[phraseIdx];
      
      if (!deleting) {
        typingEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(typeLoop, 2000); // pause at full word
          return;
        }
        setTimeout(typeLoop, 80);
      } else {
        typingEl.textContent = current.substring(0, charIdx);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(typeLoop, 400);
          return;
        }
        setTimeout(typeLoop, 40);
      }
    }
    
    // Start after reveal animation completes
    setTimeout(typeLoop, 1200);
  }

  // ===== 4. FLOATING PARTICLES =====
  const particleContainer = document.getElementById('particles');
  if (particleContainer) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 3 + 1;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 20 + 15}s;
        animation-delay: ${Math.random() * -20}s;
        opacity: ${Math.random() * 0.3 + 0.1};
      `;
      particleContainer.appendChild(p);
    }
  }

  // ===== 5. SCROLL REVEAL WITH STAGGER =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll('.reveal')) : [];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 120);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ===== 6. MAGNETIC BUTTONS =====
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0,0)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s';
    });
  });

  // ===== 7. SCROLL PROGRESS BAR =====
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = progress + '%';
    });
  }

  // ===== 8. COUNTER ANIMATION =====
  document.querySelectorAll('.counter').forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const suffix = counter.dataset.suffix || '';
    let current = 0;
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const step = target / 60;
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(interval);
            }
            counter.textContent = Math.floor(current) + suffix;
          }, 16);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counterObserver.observe(counter);
  });

  // ===== 9. WAITLIST FORM =====
  const form = document.getElementById('waitlist-form');
  const success = document.getElementById('waitlist-success');
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('email');
      const email = emailInput.value;
      const btn = form.querySelector('button');
      btn.textContent = 'Joining...';
      btn.disabled = true;

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: 'bb463caa-480f-4fa5-bb33-49d389c808ca',
            subject: 'New ContextShift Waitlist Signup!',
            from_name: 'ContextShift Waitlist',
            email: email,
            message: `New waitlist signup: ${email}`
          })
        });

        const data = await res.json();
        if (data.success) {
          form.style.opacity = '0';
          form.style.transform = 'scale(0.95)';
          form.style.transition = 'all 0.3s';
          setTimeout(() => {
            form.classList.add('hidden');
            success.classList.remove('hidden');
          }, 300);
        } else {
          btn.textContent = 'Try again';
          btn.disabled = false;
        }
      } catch (err) {
        form.style.opacity = '0';
        form.style.transform = 'scale(0.95)';
        form.style.transition = 'all 0.3s';
        setTimeout(() => {
          form.classList.add('hidden');
          success.classList.remove('hidden');
        }, 300);
      }
    });
  }

  // ===== 10. FAQ ACCORDION =====
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.faq-item.active').forEach(o => {
        if (o !== item) o.classList.remove('active');
      });
      item.classList.toggle('active');
    });
  });

  // ===== 11. NAV BACKGROUND ON SCROLL =====
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.background = window.scrollY > 50 
        ? 'rgba(12,12,16,0.8)' 
        : 'rgba(12,12,16,0.5)';
    });
  }

  // ===== 12. SMOOTH SECTION LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
