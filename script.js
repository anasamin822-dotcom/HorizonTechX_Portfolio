/**
 * ANAS® PORTFOLIO — INTERACTION SCRIPTS
 * - Rui-style cursor ink trail simulation ("Move your cursor. Leave a little ink.")
 * - 3D Model Card perspective tilt on mousemove
 * - 3D Render vs Original Photo toggle
 * - Responsive navigation
 * - Contact transmission handler
 */

document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------------------------------------------
     1. INK CANVAS TRAIL SIMULATION (Rui Homage)
     ------------------------------------------------------------- */
  const canvas = document.getElementById("ink-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 60;

    class InkDrop {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4;
        this.baseSize = this.size;
        this.alpha = 0.55;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        // Cyan and violet ink tones
        this.color = Math.random() > 0.4 ? "0, 240, 255" : "142, 82, 255";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.012;
        this.size += 0.35;
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        );
        gradient.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
        gradient.addColorStop(0.6, `rgba(${this.color}, ${this.alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(${this.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    let lastX = 0;
    let lastY = 0;

    window.addEventListener("mousemove", (e) => {
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (dist > 8) {
        particles.push(new InkDrop(e.clientX, e.clientY));
        if (particles.length > maxParticles) particles.shift();
        lastX = e.clientX;
        lastY = e.clientY;
      }
    });

    function animateInk() {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          p.draw();
        }
      }
      requestAnimationFrame(animateInk);
    }
    animateInk();
  }

  /* -------------------------------------------------------------
     2. 3D MODEL CARD PERSPECTIVE TILT
     ------------------------------------------------------------- */
  const modelCard = document.getElementById("model-card");
  if (modelCard && window.matchMedia("(min-width: 1024px)").matches) {
    const parentContainer = modelCard.parentElement;

    parentContainer.addEventListener("mousemove", (e) => {
      const rect = modelCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (-y / (rect.height / 2)) * 10;
      const rotateY = (x / (rect.width / 2)) * 12;

      modelCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(
        2
      )}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    parentContainer.addEventListener("mouseleave", () => {
      modelCard.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  }

  /* -------------------------------------------------------------
     3. 3D RENDER VS REAL PHOTO TOGGLE
     ------------------------------------------------------------- */
  const avatarImg = document.getElementById("hero-avatar-img");
  const avatarToggle = document.getElementById("avatar-toggle");
  const tagTitle = document.querySelector(".model-tag-float .tag-title");
  const modelSpecs = document.querySelector(".mono-specs");

  if (avatarToggle && avatarImg) {
    const buttons = avatarToggle.querySelectorAll(".switch-btn");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");

        const type = btn.getAttribute("data-type");
        avatarImg.style.opacity = "0";

        setTimeout(() => {
          if (type === "3d") {
            avatarImg.src = "anas_3d.jpg";
            if (tagTitle) tagTitle.textContent = "3D DIGITAL TWIN";
            if (modelSpecs) modelSpecs.textContent = "Three.js / GLTF / GSAP";
          } else {
            avatarImg.src = "anas_photo.jpg";
            if (tagTitle) tagTitle.textContent = "STUDIO PORTRAIT";
            if (modelSpecs) modelSpecs.textContent = "Dehradun / 2026";
          }
          avatarImg.style.opacity = "1";
        }, 180);
      });
    });
  }

  /* -------------------------------------------------------------
     4. NAVIGATION TOGGLE (Mobile)
     ------------------------------------------------------------- */
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  menuToggle?.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu?.querySelectorAll(".nav-item").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  /* -------------------------------------------------------------
     5. CONTACT / APPOINTMENT TRANSMISSION FORM
     ------------------------------------------------------------- */
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.querySelector(".form-status");

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const type = formData.get("type");
    const message = formData.get("message");

    const subject = encodeURIComponent(`Portfolio Inquiry: ${type} - ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nInquiry Type: ${type}\n\nProject Scope & Message:\n${message}`
    );

    if (formStatus) {
      formStatus.textContent = "Opening email transmission client…";
    }

    setTimeout(() => {
      window.location.href = `mailto:anasamin822@gmail.com?subject=${subject}&body=${body}`;
      if (formStatus) {
        formStatus.textContent = "Inquiry ready in client. Thank you, Anas will reply shortly!";
      }
    }, 400);
  });

  /* -------------------------------------------------------------
     6. RESUME PREVIEW MODAL (ACCESSIBLE IN-BROWSER VIEWER)
     ------------------------------------------------------------- */
  const resumeModal = document.getElementById("resume-modal");
  const resumeFrame = document.getElementById("resume-iframe");
  const previewButtons = document.querySelectorAll(".btn-preview-resume");
  const closeButtons = document.querySelectorAll("[data-close-modal]");

  function openResumeModal() {
    if (!resumeModal) return;
    if (resumeFrame && resumeFrame.getAttribute("data-src")) {
      if (resumeFrame.src === "about:blank" || !resumeFrame.src) {
        resumeFrame.src = resumeFrame.getAttribute("data-src");
      }
    }
    resumeModal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    const closeBtn = resumeModal.querySelector(".modal-close-btn");
    closeBtn?.focus();
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }

  previewButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openResumeModal();
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      closeResumeModal();
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && resumeModal && !resumeModal.hasAttribute("hidden")) {
      closeResumeModal();
    }
  });

  /* -------------------------------------------------------------
     7. EFFECT 2: TYPEWRITER ROLES (Aceternity UI Homage)
     ------------------------------------------------------------- */
  const typewriterElement = document.getElementById("typewriter");
  if (typewriterElement) {
    // Sourced strictly from existing portfolio & resume content
    const words = [
      "Front-End & 3D Interactive Developer",
      "Computer Science Undergraduate",
      "Creative Developer",
      "Computer Vision AI Engineer"
    ];

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      typewriterElement.textContent = words[0];
    } else {
      let wordIdx = 0;
      let charIdx = 0;
      let isDeleting = false;
      const typeSpeed = 70;
      const deleteSpeed = 35;
      const pauseEnd = 1400;
      const pauseStart = 400;

      function typeLoop() {
        const currentWord = words[wordIdx];

        if (isDeleting) {
          typewriterElement.textContent = currentWord.substring(0, charIdx - 1);
          charIdx--;
        } else {
          typewriterElement.textContent = currentWord.substring(0, charIdx + 1);
          charIdx++;
        }

        let delay = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIdx === currentWord.length) {
          delay = pauseEnd;
          isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
          isDeleting = false;
          wordIdx = (wordIdx + 1) % words.length;
          delay = pauseStart;
        }

        setTimeout(typeLoop, delay);
      }

      typeLoop();
    }
  }

  /* -------------------------------------------------------------
     8. FLOATING DYNAMIC NAVBAR (Aceternity UI Style)
     ------------------------------------------------------------- */
  const siteHeader = document.querySelector(".site-header");
  if (siteHeader) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            const isMenuOpen = navMenu?.classList.contains("is-open");

            // Add background depth & shadow on scroll
            if (currentScrollY > 40) {
              siteHeader.classList.add("nav-scrolled");
            } else {
              siteHeader.classList.remove("nav-scrolled");
            }

            // Hide on scroll down, reveal on scroll up (unless mobile menu is open)
            if (currentScrollY > 120 && !isMenuOpen) {
              if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 6) {
                siteHeader.classList.add("nav-hidden");
              } else if (lastScrollY - currentScrollY > 6) {
                siteHeader.classList.remove("nav-hidden");
              }
            } else {
              siteHeader.classList.remove("nav-hidden");
            }

            lastScrollY = Math.max(0, currentScrollY);
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* -------------------------------------------------------------
     9. EFFECT 4: 3D PROJECT TILT CARDS WITH GLARE (Aceternity UI Homage)
     ------------------------------------------------------------- */
  const projectCards = document.querySelectorAll(".project-editorial-item");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (projectCards.length && isFinePointer && !prefersReduced) {
    projectCards.forEach((card) => {
      let rafId = null;

      card.addEventListener("mousemove", (e) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          // Max 7 degrees tilt for tasteful editorial 3D depth
          const rotateX = ((y - centerY) / centerY) * -7;
          const rotateY = ((x - centerX) / centerX) * 7;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(
            2
          )}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
          card.style.setProperty("--glare-x", `${x}px`);
          card.style.setProperty("--glare-y", `${y}px`);
        });
      });

      card.addEventListener("mouseleave", () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transform =
          "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      });
    });
  }

  /* -------------------------------------------------------------
     10. EFFECT 6: KINETIC TRACING BEAM ON SCROLL (Aceternity UI Homage)
     ------------------------------------------------------------- */
  const beamContainer = document.getElementById("tracing-beam-container");
  const beamGlow = document.getElementById("tracing-beam-glow");
  const beamDot = document.getElementById("tracing-beam-dot");

  if (beamContainer && beamGlow && beamDot && !prefersReduced) {
    let beamTicking = false;

    function updateTracingBeam() {
      const rect = beamContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start tracing when container top enters lower viewport (75%), finish when bottom leaves upper viewport (25%)
      const startTrigger = windowHeight * 0.75;

      const totalDistance = rect.height;
      const currentScroll = startTrigger - rect.top;

      let progress = currentScroll / totalDistance;
      progress = Math.min(Math.max(progress, 0), 1);

      const percent = (progress * 100).toFixed(2);
      beamGlow.style.height = `${percent}%`;
      beamDot.style.top = `${percent}%`;

      if (progress > 0.02 && progress < 0.99) {
        beamDot.classList.add("is-active");
      } else {
        beamDot.classList.remove("is-active");
      }

      beamTicking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!beamTicking) {
          requestAnimationFrame(updateTracingBeam);
          beamTicking = true;
        }
      },
      { passive: true }
    );

    // Initial calculation on page load
    updateTracingBeam();
  }
});

