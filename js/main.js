/**
 * SMIT BHANUSHALI — PORTFOLIO
 * main.js — All interactive features
 * ============================================================
 * Sections:
 *  1.  Theme Toggle (dark/light, localStorage)
 *  2.  Boot Sequence Animation
 *  3.  Scroll Progress Bar
 *  4.  Navbar Scroll Behaviour & Active Link
 *  5.  Mobile Hamburger Menu
 *  6.  Hero Typewriter Effect (role titles)
 *  7.  Hero Canvas — Particle Network Background
 *  8.  Terminal Window Animation
 *  9.  Scroll-Reveal (Intersection Observer)
 *  10. Animated Counters (About stats)
 *  11. Skill Progress Bars (scroll-triggered)
 *  12. Cursor-Reactive Glow (Skills & Projects)
 *  13. Contact Form — Validation & Confetti
 *  14. Smooth Scroll (anchor links)
 * ============================================================
 */

'use strict';

/* ============================================================
   UTILITIES
============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   1. THEME TOGGLE (Removed)
   Site is strictly dark mode by design.
============================================================ */

/* ============================================================
   2. BOOT SEQUENCE ANIMATION
============================================================ */
(function bootSequence() {
  const overlay = $('#boot-overlay');
  const bootText = $('#boot-text');
  const progress = $('#boot-progress');
  const statusEl = $('#boot-status');

  if (!overlay || prefersReducedMotion) {
    overlay?.classList.add('hidden');
    return;
  }

  const steps = [
    { text: 'Initializing cloud runtime...', status: 'Connecting to cluster', pct: 15 },
    { text: '$ kubectl apply -f portfolio/', status: 'Applying manifests', pct: 40 },
    { text: '$ terraform init', status: 'Provisioning resources', pct: 65 },
    { text: '$ docker build -t yv-portfolio .', status: 'Building container', pct: 85 },
    { text: 'Deploy status: ✓ READY', status: 'Deploying portfolio... 100%', pct: 100 },
  ];

  let stepIdx = 0;

  function runStep() {
    if (stepIdx >= steps.length) {
      // Done — fade out overlay
      setTimeout(() => overlay.classList.add('hidden'), 300);
      return;
    }
    const s = steps[stepIdx++];
    // Clear & type text
    bootText.textContent = '';
    typeBootText(s.text, () => {
      progress.style.width = s.pct + '%';
      if (statusEl) statusEl.textContent = s.status;
      setTimeout(runStep, stepIdx < steps.length ? 220 : 400);
    });
  }

  function typeBootText(str, cb) {
    let i = 0;
    const interval = setInterval(() => {
      bootText.textContent += str[i++];
      if (i >= str.length) { clearInterval(interval); cb?.(); }
    }, 25);
  }

  // Start after a tiny delay
  setTimeout(runStep, 200);
})();

/* ============================================================
   3. SCROLL PROGRESS BAR
============================================================ */
(function scrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;

  function update() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }

  window.addEventListener('scroll', update, { passive: true });
})();

/* ============================================================
   4. NAVBAR SCROLL BEHAVIOUR & ACTIVE LINK
============================================================ */
(function navbar() {
  const nav = $('#navbar');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  // Scrolled class
  function onScroll() {
    nav?.classList.toggle('scrolled', window.scrollY > 20);
    highlightActive();
  }

  function highlightActive() {
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) currentId = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === currentId);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ============================================================
   5. MOBILE HAMBURGER MENU
============================================================ */
(function hamburger() {
  const btn = $('#hamburger');
  const links = $('#nav-links');

  btn?.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    btn.classList.toggle('open');
    links?.classList.toggle('open');
  });

  // Close on link click
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      btn?.setAttribute('aria-expanded', 'false');
      btn?.classList.remove('open');
      links?.classList.remove('open');
    });
  });
})();

/* ============================================================
   6. HERO TYPEWRITER EFFECT
============================================================ */
(function typewriter() {
  const el = $('#typed-role');
  if (!el || prefersReducedMotion) {
    if (el) el.textContent = 'DevOps Engineer';
    return;
  }

  const roles = [
    '.NET Cloud Engineer',
    'Software Engineer',
    'Strategic Analytical Thinker',
    'Research & Development',
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let timeout;

  function tick() {
    const current = roles[roleIdx];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        timeout = setTimeout(tick, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        timeout = setTimeout(tick, 350);
        return;
      }
    }

    timeout = setTimeout(tick, deleting ? 55 : 85);
  }

  setTimeout(tick, 1600); // start after boot
})();

/* ============================================================
   7. HERO CANVAS — PARTICLE NETWORK BACKGROUND
============================================================ */
(function heroCanvas() {
  const canvas = $('#hero-canvas');
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;
  const PARTICLE_COUNT = 60;
  const MAX_DIST = 130;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.5,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dark = isDark();
    const nodeFill = dark ? 'rgba(50,108,229,0.55)' : 'rgba(0,120,212,0.3)';
    const lineBase = dark ? '50,108,229' : '0,120,212';

    // Draw grid dots (subtle)
    const spacing = 60;
    for (let x = 0; x < canvas.width; x += spacing) {
      for (let y = 0; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 0.7, 0, Math.PI * 2);
        ctx.fillStyle = dark ? 'rgba(50,108,229,0.08)' : 'rgba(0,120,212,0.05)';
        ctx.fill();
      }
    }

    // Update + draw particles
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Draw node
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = nodeFill;
      ctx.fill();

      // Draw edges
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * (dark ? 0.25 : 0.15);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${lineBase},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });

    animFrame = requestAnimationFrame(draw);
  }

  init();
  draw();

  window.addEventListener('resize', () => {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }, { passive: true });
})();

/* ============================================================
   8. HERO TERMINAL INTERACTIVITY
============================================================ */
(function heroTerminal() {
  const tBody = $('#hero-terminal-body');
  const buttons = $$('.ht-cmd-btn');
  if (!tBody) return;

  const PROMPT = '<span class="t-prompt">smit@cloud_engineer:~$</span>';
  let isTyping = false;

  const outputs = {
    neofetch: `
<span class="t-ascii">
       /\\___/\\
      /       \\     <span class="t-blue">OS:</span> Windows 11 Pro build 22631
     /   _   _ \\    <span class="t-blue">Host:</span> Custom-PC (India)
    /    _|_    \\   <span class="t-blue">Kernel:</span> Windows NT 10.0.22631
   /___/     \\___\\  <span class="t-blue">Uptime:</span> 12 days, 4 hours
</span>`,
    about: `
<div class="t-row">
  <span class="t-cyan">Smit Bhanushali — .NET Cloud Engineer</span>
  <span class="t-dim">Location: Vadodara, Gujarat, India</span>
</div>
<span class="t-cmd">A Strategic Analytical Thinker and Software Engineer experienced in building scalable backend systems, cloud architectures, and REST APIs using .NET, Azure, and SQL Server.</span>`,
    skills: `
<div class="t-row"><span class="t-cyan">Core Competencies:</span></div>
<div class="t-row"><span class="t-blue">Backend:</span> C#, ASP.NET Core, Entity Framework</div>
<div class="t-row"><span class="t-blue">Cloud & Serverless:</span> Azure Functions, Logic Apps, APIM</div>
<div class="t-row"><span class="t-blue">Databases:</span> SQL Server, Azure Cosmos DB</div>
<div class="t-row"><span class="t-blue">Testing & Tools:</span> xUnit, LocalStack, Git, GitHub</div>
<div class="t-row"><span class="t-blue">Concepts:</span> CQRS, Mediator Pattern, Event-driven architecture</div>`,
    projects: `
<div class="t-row"><span class="t-cyan">Featured Cloud Projects:</span></div>
<br>
<div class="t-row"><span class="t-green">1. Serverless Event-Driven Architecture</span> (Azure Functions, Logic Apps, APIM)</div>
<div class="t-row"><span class="t-dim">- Reduced processing latency from hours to seconds with robust security (OAuth 2.0).</span></div>
<br>
<div class="t-row"><span class="t-green">2. High-Performance E-Commerce Backend</span> (ASP.NET Core, SQL Server)</div>
<div class="t-row"><span class="t-dim">- Integrated Amazon SP-API and optimized database queries for efficient workflows.</span></div>
<br>
<div class="t-row"><span class="t-green">3. Scalable Reporting Engine</span> (ASP.NET Web API, EF Core)</div>
<div class="t-row"><span class="t-dim">- Applied dependency injection and async programming to improve throughput.</span></div>`
  };

  const bootSequence = [
    { cmd: 'neofetch', out: outputs['neofetch'] }
  ];

  function scrollToBottom() {
    tBody.scrollTop = tBody.scrollHeight;
  }

  function typeCommand(cmd, outputHtml, cb) {
    isTyping = true;
    const line = document.createElement('div');
    line.className = 't-row';
    line.innerHTML = `${PROMPT} <span class="t-cmd"></span>`;
    tBody.appendChild(line);
    scrollToBottom();

    const cmdSpan = line.querySelector('.t-cmd');
    let i = 0;

    const iv = setInterval(() => {
      cmdSpan.textContent += cmd[i++];
      if (i >= cmd.length) {
        clearInterval(iv);
        setTimeout(() => {
          if (outputHtml) {
            const outNode = document.createElement('div');
            outNode.className = 't-row';
            outNode.innerHTML = outputHtml;
            tBody.appendChild(outNode);
            scrollToBottom();
          }
          isTyping = false;
          cb?.();
        }, 150);
      }
    }, Math.max(10, 45 - (cmd.length * 1.5)));
  }

  function runBootSequence() {
    if (prefersReducedMotion) return;
    let step = 0;

    function doStep() {
      if (step >= bootSequence.length) {
        const finalPrompt = document.createElement('div');
        finalPrompt.className = 't-row';
        finalPrompt.innerHTML = `${PROMPT} <span class="term-cursor" style="display:inline-block;width:6px;height:12px;background:#C9D1D9;animation:blink 1s infinite"></span>`;
        tBody.appendChild(finalPrompt);
        scrollToBottom();
        return;
      }

      const { cmd, out } = bootSequence[step];
      typeCommand(cmd, out, () => {
        step++;
        setTimeout(doStep, 400);
      });
    }

    setTimeout(doStep, 1000);
  }

  // Handle Button Clicks
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isTyping) return;

      const cmd = btn.dataset.cmd;

      // Remove trailing cursor if exists
      const cursor = tBody.querySelector('.term-cursor');
      if (cursor) cursor.remove();

      if (cmd === 'clear') {
        tBody.innerHTML = '';
        const finalPrompt = document.createElement('div');
        finalPrompt.className = 't-row';
        finalPrompt.innerHTML = `${PROMPT} <span class="term-cursor" style="display:inline-block;width:6px;height:12px;background:#C9D1D9;animation:blink 1s infinite"></span>`;
        tBody.appendChild(finalPrompt);
        return;
      }

      // Auto-clear terminal output so only one block is visible
      tBody.innerHTML = '';

      typeCommand(cmd, outputs[cmd], () => {
        const finalPrompt = document.createElement('div');
        finalPrompt.className = 't-row';
        finalPrompt.innerHTML = `${PROMPT} <span class="term-cursor" style="display:inline-block;width:6px;height:12px;background:#C9D1D9;animation:blink 1s infinite"></span>`;
        tBody.appendChild(finalPrompt);
        scrollToBottom();
      });
    });
  });

  // Start sequence
  runBootSequence();
})();

/* ============================================================
   9. SCROLL REVEAL (Intersection Observer)
============================================================ */
(function scrollReveal() {
  if (prefersReducedMotion) {
    $$('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

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

  $$('.reveal').forEach(el => observer.observe(el));
})();

/* ============================================================
   10. ANIMATED COUNTERS
============================================================ */
(function animatedCounters() {
  const counters = $$('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        observer.unobserve(el);

        if (prefersReducedMotion) { el.textContent = target + suffix; return; }

        let current = 0;
        const duration = 1800;
        const startTime = performance.now();

        function update(timestamp) {
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const ease = 1 - Math.pow(1 - progress, 3);
          current = Math.round(ease * target);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   11. SKILL PROGRESS BARS (scroll-triggered fill)
============================================================ */
(function progressBars() {
  const bars = $$('.progress-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const w = bar.dataset.width || 0;
          bar.style.width = w + '%';
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach(b => observer.observe(b));
})();

/* ============================================================
   12. CURSOR-REACTIVE GLOW (desktop only)
============================================================ */
(function cursorGlow() {
  if (window.matchMedia('(hover: none)').matches || prefersReducedMotion) return;

  function initSpotlight(spotlightId, gridId) {
    const spotlight = $(`#${spotlightId}`);
    const grid = $(`#${gridId}`);
    if (!spotlight || !grid) return;

    grid.addEventListener('mousemove', (e) => {
      const rect = grid.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlight.style.left = x + 'px';
      spotlight.style.top = y + 'px';
      spotlight.style.opacity = '1';
    });

    grid.addEventListener('mouseleave', () => {
      spotlight.style.opacity = '0';
    });
  }



})();

/* ============================================================
   13. CONTACT FORM — VALIDATION & CONFETTI
============================================================ */
(function contactForm() {
  const form = $('#contact-form');
  if (!form) return;

  const nameInput = $('#form-name');
  const emailInput = $('#form-email');
  const msgInput = $('#form-message');
  const submitBtn = $('#form-submit');
  const confBox = $('#confetti-container');

  const COLORS = ['#FF9900', '#0078D4', '#4285F4', '#326CE5', '#34A853', '#EA4335', '#FBBC05', '#7B42BC'];

  function showError(inputId, msg) {
    const errEl = $(`#error-${inputId}`);
    if (errEl) { errEl.textContent = msg; }
    $(`#form-${inputId}`)?.setAttribute('aria-invalid', 'true');
  }

  function clearError(inputId) {
    const errEl = $(`#error-${inputId}`);
    if (errEl) { errEl.textContent = ''; }
    $(`#form-${inputId}`)?.removeAttribute('aria-invalid');
  }

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function validate() {
    let ok = true;
    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim();
    const msg = msgInput?.value.trim();

    if (!name || name.length < 2) {
      showError('name', 'Please enter your full name (min 2 chars).');
      ok = false;
    } else { clearError('name'); }

    if (!email || !validateEmail(email)) {
      showError('email', 'Please enter a valid email address.');
      ok = false;
    } else { clearError('email'); }

    if (!msg || msg.length < 10) {
      showError('message', 'Message must be at least 10 characters.');
      ok = false;
    } else { clearError('message'); }

    return ok;
  }

  function spawnConfetti() {
    if (!confBox || prefersReducedMotion) return;
    confBox.innerHTML = '';
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('span');
      p.classList.add('confetti-particle');
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const dist = 60 + Math.random() * 80;
      p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
      p.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      p.style.left = '50%';
      p.style.bottom = '24px';
      confBox.appendChild(p);
      setTimeout(() => p.remove(), 1100);
    }
  }

  const termNameOut = $('#term-out-name');
  const termEmailOut = $('#term-out-email');
  const termMsgOut = $('#term-out-msg');
  const curName = $('#cursor-name');
  const curEmail = $('#cursor-email');
  const curMsg = $('#cursor-msg');
  const termStatus = $('#term-status-box');

  function updateTerminal() {
    if (termNameOut) {
      termNameOut.textContent = nameInput.value;
      if (document.activeElement === nameInput) {
        curName.style.display = 'inline-block';
        curEmail.style.display = 'none';
        curMsg.style.display = 'none';
      }
    }
    if (termEmailOut) {
      termEmailOut.textContent = emailInput.value;
      if (document.activeElement === emailInput) {
        curName.style.display = 'none';
        curEmail.style.display = 'inline-block';
        curMsg.style.display = 'none';
      }
    }
    if (termMsgOut) {
      const msgStr = msgInput.value.replace(/\n/g, ' ');
      termMsgOut.textContent = msgStr.length > 50 ? msgStr.substring(0, 50) + '...' : msgStr;
      if (document.activeElement === msgInput) {
        curName.style.display = 'none';
        curEmail.style.display = 'none';
        curMsg.style.display = 'inline-block';
      }
    }
  }

  [nameInput, emailInput, msgInput].forEach(input => {
    input?.addEventListener('input', updateTerminal);
    input?.addEventListener('focus', updateTerminal);
    input?.addEventListener('blur', () => {
      setTimeout(() => {
        if (![nameInput, emailInput, msgInput].includes(document.activeElement)) {
          if (curName) curName.style.display = 'none';
          if (curEmail) curEmail.style.display = 'none';
          if (curMsg) curMsg.style.display = 'none';
        }
      }, 10);
      validate();
    });
  });

  // Pipeline elements
  const pipeHeadIcon = $('#pipeline-header-icon');
  const pipeHeadText = $('#pipeline-header-text');
  const pipeFooter = $('#pipeline-footer');
  const nBuild = $('#node-build');
  const l1 = $('#line-1');
  const nTest = $('#node-test');
  const l2 = $('#line-2');
  const nRelease = $('#node-release');
  const l3 = $('#line-3');
  const nDeploy = $('#node-deploy');

  function resetPipeline() {
    [nBuild, l1, nTest, l2, nRelease, l3, nDeploy].forEach(el => el?.classList.remove('success'));
    if (pipeHeadIcon) {
      pipeHeadIcon.className = 'bx bx-loader-alt bx-spin';
      pipeHeadText.textContent = 'Pipeline Running...';
    }
    if (pipeFooter) pipeFooter.textContent = 'Deploying...';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) {
      if (termStatus) {
        termStatus.textContent = '[ERROR] Validation failed. Missing required parameters.';
        termStatus.className = 'term-status-box error';
      }
      return;
    }

    if (termStatus && nBuild) {
      termStatus.className = 'term-status-box sending';
      termStatus.textContent = '[INFO] Initializing EmailJS payload...\n';
      resetPipeline();

      // Step 1: Build
      nBuild.classList.add('success');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
        submitBtn.disabled = true;
      }

      // Start actual EmailJS call
      // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS IDs
      emailjs.sendForm('service_tf4r8ov', 'template_dgumw0i', form)
        .then(() => {
          // Success! Fast forward pipeline
          termStatus.textContent += '[INFO] Handshake successful...\n';
          l1.classList.add('success');
          nTest.classList.add('success');

          setTimeout(() => {
            l2.classList.add('success');
            nRelease.classList.add('success');
            l3.classList.add('success');
            nDeploy.classList.add('success');

            termStatus.textContent += '[SUCCESS] Payload transmitted securely.';
            termStatus.className = 'term-status-box';
            termStatus.style.color = '#34A853';

            if (pipeHeadIcon) {
              pipeHeadIcon.className = 'bx bx-check-circle';
              pipeHeadText.textContent = 'Pipeline Complete';
            }
            if (pipeFooter) {
              pipeFooter.innerHTML = '<i class="bx bx-check-circle"></i> [SUCCESS] Pipeline execution finished!';
            }

            spawnConfetti();

            if (submitBtn) {
              submitBtn.textContent = 'Message Sent!';
              submitBtn.style.background = 'linear-gradient(135deg, #34A853, #0078D4)';
              setTimeout(() => {
                submitBtn.innerHTML = '<i class="bx bx-send"></i> Send Message';
                submitBtn.style.background = '';
                submitBtn.disabled = false;
              }, 3000);
            }

            setTimeout(() => {
              form.reset();
              ['name', 'email', 'message'].forEach(clearError);
              updateTerminal();
              termStatus.textContent = '';
              termStatus.style.color = '';
            }, 1500);
          }, 400);

        }, (error) => {
          // Error handling
          termStatus.textContent += `[ERROR] Transmission failed: ${error.text}\n`;
          termStatus.className = 'term-status-box error';
          if (pipeHeadIcon) {
            pipeHeadIcon.className = 'bx bx-x-circle';
            pipeHeadText.textContent = 'Pipeline Failed';
          }
          if (submitBtn) {
            submitBtn.innerHTML = '<i class="bx bx-error"></i> Failed';
            submitBtn.style.background = 'linear-gradient(135deg, #EA4335, #B31217)';
            setTimeout(() => {
              submitBtn.innerHTML = '<i class="bx bx-send"></i> Send Message';
              submitBtn.style.background = '';
              submitBtn.disabled = false;
            }, 3000);
          }
        });
    } else {
      // Fallback if no pipeline UI
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
        submitBtn.disabled = true;
      }
      emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form)
        .then(() => {
          spawnConfetti();
          if (submitBtn) {
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #34A853, #0078D4)';
            setTimeout(() => {
              submitBtn.innerHTML = '<i class="bx bx-send"></i> Send Message';
              submitBtn.style.background = '';
              submitBtn.disabled = false;
            }, 3000);
          }
          form.reset();
        }, (error) => {
          alert('Failed to send message: ' + error.text);
          if (submitBtn) {
            submitBtn.innerHTML = '<i class="bx bx-send"></i> Send Message';
            submitBtn.disabled = false;
          }
        });
    }
  });
})();

/* ============================================================
   14. SMOOTH SCROLL for anchor links
     (native scroll-behavior is set in CSS, this handles
      offset for the fixed navbar on older browsers)
============================================================ */
(function smoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href').slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const offset = 80; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
})();

/* ============================================================
   15. SKILL MODAL LOGIC
============================================================ */


/* ============================================================
   11. TECH STACK MODAL
============================================================ */
(function skillModal() {
  const skillData = {
    csharp: { title: 'C#', icon: 'devicon-csharp-plain colored', what: 'A modern, object-oriented, and type-safe programming language developed by Microsoft.', why: 'It is my primary language for building robust and high-performance backend services, APIs, and cloud applications within the .NET ecosystem.' },
    aspnet: { title: 'ASP.NET Core', icon: 'devicon-dotnetcore-plain colored', what: 'A cross-platform, high-performance framework for building modern, cloud-enabled web applications.', why: 'I use it to build scalable REST APIs, microservices, and backend engines with features like Dependency Injection.' },
    efcore: { title: 'Entity Framework', icon: 'bx bx-layer', what: 'A lightweight, extensible, open-source Object-Relational Mapper (ORM) for .NET.', why: 'Speeds up development by allowing me to interact with databases using .NET objects instead of raw SQL.' },
    dapper: { title: 'Dapper', icon: 'bx bx-bolt-circle', what: 'A simple object mapper for .NET.', why: 'I use it for high-performance data access when raw SQL execution speed is prioritized over ORM conveniences.' },
    javascript: { title: 'JavaScript', icon: 'devicon-javascript-plain colored', what: 'The core scripting language of the web for adding interactivity to applications.', why: 'Essential for understanding full-stack workflows, interacting with APIs from the frontend, and writing lightweight serverless functions.' },
    angular: { title: 'Angular', icon: 'devicon-angularjs-plain colored', what: 'A platform and framework for building single-page client applications using HTML and TypeScript.', why: 'I use it to build robust, scalable frontend applications that seamlessly consume my backend APIs.' },
    html: { title: 'HTML5', icon: 'devicon-html5-plain colored', what: 'The standard markup language for documents designed to be displayed in a web browser.', why: 'Used alongside CSS to structure the web interfaces and dashboards.' },
    css: { title: 'CSS3', icon: 'devicon-css3-plain colored', what: 'A style sheet language used for describing the presentation of a document written in HTML.', why: 'Crucial for styling and creating responsive, user-friendly layouts.' },
    mssql: { title: 'SQL Server', icon: 'devicon-microsoftsqlserver-plain colored', what: 'A relational database management system developed by Microsoft.', why: 'My primary database for structured, transactional data storage, heavily optimized via T-SQL queries.' },
    mysql: { title: 'MySQL', icon: 'devicon-mysql-plain colored', what: 'An open-source relational database management system.', why: 'Used for robust relational data modeling across various tech stacks and cloud providers.' },
    cosmosdb: { title: 'Cosmos DB', icon: 'bx bx-data', what: 'A fully managed, globally distributed NoSQL database service on Azure.', why: 'Ideal for applications requiring single-digit millisecond response times and automatic scaling.' },
    mongodb: { title: 'MongoDB', icon: 'devicon-mongodb-plain colored', what: 'A document-oriented NoSQL database program.', why: 'Used for flexible data storage where schemas evolve rapidly or unstructured data is prominent.' },
    dynamodb: { title: 'DynamoDB', icon: 'bx bx-server', what: 'A fully managed NoSQL database service on AWS.', why: 'I use it for seamless scalability and fast, predictable performance in AWS-hosted serverless architectures.' },
    azure: { title: 'Azure', icon: 'devicon-azure-plain colored', what: 'Microsoft\'s public cloud computing platform.', why: 'My primary cloud environment for deploying highly-available, scalable, and secure enterprise applications.' },
    httptrigger: { title: 'HTTP Trigger', icon: 'bx bx-globe', what: 'A mechanism to invoke serverless functions via HTTP requests.', why: 'I use it to build lightweight serverless APIs without provisioning full web servers.' },
    blob: { title: 'Blob Storage', icon: 'bx bx-archive', what: 'Azure\'s object storage solution for the cloud.', why: 'Crucial for storing massive amounts of unstructured data, like documents, images, and backups.' },
    timer: { title: 'Timer Trigger', icon: 'bx bx-timer', what: 'A schedule-based trigger for serverless functions.', why: 'Perfect for orchestrating background jobs, nightly data syncing, and routine maintenance tasks.' },
    aws: { title: 'AWS', icon: 'devicon-amazonwebservices-plain colored', what: 'Amazon Web Services, the world\'s most comprehensive cloud platform.', why: 'I use it for multi-cloud integrations, leveraging services like SP-API, S3, and Lambda.' },
    lambda: { title: 'Lambda Functions', icon: 'bx bx-code-curly', what: 'An event-driven, serverless computing platform provided by AWS.', why: 'I write discrete functions to process data in real-time without managing underlying infrastructure.' },
    s3: { title: 'S3 Bucket', icon: 'bx bx-box', what: 'Amazon Simple Storage Service for object storage.', why: 'My go-to solution in AWS for secure, scalable file storage and asset hosting.' },
    sqs: { title: 'SQS', icon: 'bx bx-envelope', what: 'Amazon Simple Queue Service.', why: 'Essential for decoupling microservices and ensuring reliable, asynchronous message delivery under heavy load.' },
    localstack: { title: 'LocalStack', icon: 'bx bx-layer', what: 'A fully functional local AWS cloud stack.', why: 'I use it to develop and test AWS applications locally, reducing cloud costs and speeding up the dev cycle.' },
    docker: { title: 'Docker', icon: 'devicon-docker-plain colored', what: 'A platform for developing, shipping, and running applications in containers.', why: 'Crucial for packaging applications ensuring they run consistently from local development to production.' },
    swagger: { title: 'Swagger', icon: 'bx bx-book-bookmark', what: 'A suite of tools built around the OpenAPI Specification.', why: 'I integrate it to provide interactive, clear, and standardized documentation for my REST APIs.' },
    scalar: { title: 'Scalar API', icon: 'bx bx-code-alt', what: 'A modern API client and documentation tool.', why: 'Used for elegant API reference generation and improved developer experience when consuming my endpoints.' },
    git: { title: 'Git', icon: 'devicon-git-plain colored', what: 'A distributed version control system.', why: 'Essential for tracking code changes, managing branches, and ensuring clean collaboration across teams.' },
    github: { title: 'GitHub', icon: 'devicon-github-plain colored', what: 'A cloud-based platform for version control and collaboration.', why: 'Used to host code, conduct code reviews, and automate workflows via GitHub Actions.' },
    postman: { title: 'Postman', icon: 'bx bxs-paper-plane', what: 'An API platform for building and using APIs.', why: 'Indispensable for designing, mocking, testing, and documenting RESTful API endpoints.' },
    xunit: { title: 'xUnit', icon: 'bx bxs-flask', what: 'A free, open-source, community-focused unit testing tool for the .NET Framework.', why: 'My go-to testing framework to ensure code reliability, high test coverage, and prevent regressions.' },
    jira: { title: 'Jira', icon: 'devicon-jira-plain colored', what: 'An issue and project tracking software developed by Atlassian.', why: 'I use it for Agile project management, sprint planning, and tracking bug fixes.' },
    vscode: { title: 'VS Code', icon: 'devicon-vscode-plain colored', what: 'A lightweight but powerful source code editor.', why: 'My daily driver for writing, debugging, and testing code across multiple languages and frameworks.' },
    copilot: { title: 'GitHub Copilot', icon: 'bx bx-bot', what: 'An AI pair programmer that offers autocomplete-style suggestions.', why: 'Dramatically speeds up my workflow by generating boilerplate code and suggesting optimizations.' },
    claude: { title: 'Claude', icon: 'bx bx-brain', what: 'An advanced AI assistant by Anthropic.', why: 'I use it for architectural brainstorming, complex debugging, and refactoring large codebases.' },
    chatgpt: { title: 'ChatGPT', icon: 'bx bx-message-rounded-dots', what: 'An AI conversational model by OpenAI.', why: 'My go-to tool for quick syntax checks, generating unit test cases, and exploring new API patterns.' },
    logicapps: { title: 'Logic Apps', icon: 'bx bx-git-branch', what: 'An Azure cloud service that helps schedule, automate, and orchestrate tasks.', why: 'Perfect for integrating systems and building event-driven workflows without writing heavy boilerplate code.' },
    podman: { title: 'Podman', icon: 'bx bx-cube-alt', what: 'A daemonless container engine for developing, managing, and running OCI Containers.', why: 'A secure, rootless alternative to Docker for running isolated microservices.' },
    azuredevops: { title: 'Azure DevOps', icon: 'bx bx-git-repo-forked', what: 'Microsoft\'s suite for planning, collaborating, and shipping code.', why: 'I use it for managing enterprise CI/CD pipelines, Git repositories, and Kanban boards.' },
    snowflake: { title: 'Snowflake', icon: 'bx bx-snowflake', what: 'A fully managed cloud data warehouse.', why: 'Essential for running complex analytical queries on massive datasets integrated from multiple sources.' },
    keyvault: { title: 'Azure Key Vault', icon: 'bx bx-key', what: 'A cloud service for securely storing and accessing secrets.', why: 'Critical for securing API keys, passwords, and cryptographic keys in my backend applications.' },
    gemini: { title: 'Google Gemini', icon: 'bx bx-sparkles', what: 'Google\'s most capable and general AI model.', why: 'I leverage it for advanced reasoning, code generation, and multi-modal problem solving.' },
    apim: { title: 'Azure API Management', icon: 'bx bx-network-chart', what: 'A hybrid, multicloud management platform for APIs across all environments.', why: 'I use it to securely expose, monitor, and manage my backend microservices and REST APIs.' },
    azurequeue: { title: 'Azure Queue Storage', icon: 'bx bx-message-square-dots', what: 'A service for storing large numbers of messages.', why: 'Essential for decoupling application components and building asynchronous, highly scalable workloads.' }
  };

  const cards = document.querySelectorAll('.pyramid-card');
  const modal = document.getElementById('skill-modal');
  if (!modal) return;
  const closeBtn = document.getElementById('skill-modal-close');
  const mIcon = document.getElementById('sm-icon');
  const mTitle = document.getElementById('sm-title');
  const mWhat = document.getElementById('sm-what');
  const mWhy = document.getElementById('sm-why');

  cards.forEach(card => {
    // Force cursor to pointer
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const skillKey = card.getAttribute('data-skill');
      const data = skillData[skillKey];
      if (data) {
        mIcon.className = data.icon;
        // Keep the inline style if bx icon needs color
        const iElem = card.querySelector('i');
        if (iElem && iElem.style.color) {
          mIcon.style.color = iElem.style.color;
        } else {
          mIcon.style.color = '';
        }
        mTitle.textContent = data.title;
        mWhat.textContent = data.what;
        mWhy.textContent = data.why;
        modal.classList.add('active');
      }
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
})();

/* ============================================================
   14. FAANG TIMELINE SCROLL & ACCORDION
============================================================ */
(function initFaangTimeline() {
  const toggles = document.querySelectorAll('.accordion-toggle');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function () {
      this.classList.toggle('active');
      const content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  const progressTrack = document.getElementById('timeline-progress');
  const container = document.querySelector('.career-timeline-container');

  if (progressTrack && container) {
    window.addEventListener('scroll', () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const startPoint = rect.top - (windowHeight / 2);
      const totalHeight = rect.height;

      let percentage = (Math.abs(Math.min(startPoint, 0)) / totalHeight) * 100;
      percentage = Math.max(0, Math.min(percentage, 100));

      progressTrack.style.height = percentage + '%';
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
  });
})();

/* ============================================================
   15. METRICS COUNT-UP ANIMATION
============================================================ */
(function initMetricsCounter() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Find metric values in this card to count up
        const metrics = entry.target.querySelectorAll('.csm-value');
        metrics.forEach(metric => {
          if (metric.dataset.count && !metric.classList.contains('counted')) {
            metric.classList.add('counted');
            let start = 0;
            const target = parseFloat(metric.dataset.count);
            const isDecimal = target % 1 !== 0;
            const duration = 2000;
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;

            const timer = setInterval(() => {
              start += increment;
              if (start >= target) {
                clearInterval(timer);
                start = target;
              }
              const prefix = metric.dataset.prefix || '';
              const suffix = metric.dataset.suffix || '';
              metric.textContent = prefix + (isDecimal ? start.toFixed(1) : Math.floor(start)) + suffix;
            }, stepTime);
          }
        });
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.case-study-card').forEach(item => {
    observer.observe(item);
  });
})();

/* ============================================================
   16. PUBLICATION READ MORE TOGGLE
============================================================ */
(function initPubToggle() {
  const readMoreBtns = document.querySelectorAll('.pub-read-more-btn');
  readMoreBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const abstract = this.previousElementSibling;
      if (abstract.classList.contains('collapsed')) {
        abstract.classList.remove('collapsed');
        this.innerHTML = 'Read less <i class="bx bx-chevron-up"></i>';
      } else {
        abstract.classList.add('collapsed');
        this.innerHTML = 'Read more <i class="bx bx-chevron-down"></i>';
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.premium-cert-card, .premium-pub-card').forEach(item => {
    observer.observe(item);
  });
})();
