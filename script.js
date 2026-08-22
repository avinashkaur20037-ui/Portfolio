/* ============================================================
   AVINASH KAUR — PORTFOLIO SCRIPT
   Vanilla JS, no build step, no dependencies.
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav background on scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu(){
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }
  function openMobileMenu(){
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }
  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });
  document.querySelectorAll('[data-nav-mobile]').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  // Close mobile menu with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ---------- Active nav link + sliding indicator ---------- */
  const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  const navLinksContainer = document.getElementById('navLinks');
  const indicator = document.getElementById('navIndicator');
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function moveIndicatorTo(link){
    if (!link || !indicator || !navLinksContainer) return;
    const containerRect = navLinksContainer.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    indicator.style.width = rect.width + 'px';
    indicator.style.transform = `translateX(${rect.left - containerRect.left - 6}px)`;
  }

  function setActiveLink(id){
    navLinks.forEach(link => {
      const match = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', match);
      if (match) moveIndicatorTo(link);
    });
  }

  // Initial indicator placement (after fonts/layout settle)
  window.addEventListener('load', () => {
    const active = navLinks.find(l => l.classList.contains('active')) || navLinks[0];
    moveIndicatorTo(active);
  });
  window.addEventListener('resize', () => {
    const active = navLinks.find(l => l.classList.contains('active'));
    moveIndicatorTo(active);
  });

  if ('IntersectionObserver' in window && sections.length){
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          setActiveLink(entry.target.id);
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => navObserver.observe(section));
  }

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window){
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: no IntersectionObserver support — just show everything
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Skills tabs ---------- */
  const tabs = document.querySelectorAll('.skills__tab');
  const panels = document.querySelectorAll('[data-panel]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });

      panels.forEach(panel => {
        panel.hidden = panel.dataset.panel !== target;
      });
    });
  });

  /* ---------- Animated stat counter (e.g. 400+ workers' records) ---------- */
  const counters = document.querySelectorAll('[data-count]');
  function animateCounter(el){
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (counters.length){
    if ('IntersectionObserver' in window){
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting){
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(el => counterObserver.observe(el));
    } else {
      counters.forEach(el => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
    }
  }

  /* ---------- Subtle cursor glow (desktop / fine-pointer only) ---------- */
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (supportsHover){
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.opacity = '0';
    document.body.appendChild(glow);

    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      glow.style.opacity = '1';
    });

    function loop(){
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  }

  /* ---------- Contact form (front-end only, no backend required) ----------
     Opens the visitor's email client with a pre-filled message.
     To connect this to a real backend or form service later (e.g. Formspree,
     EmailJS, Netlify Forms), replace the body of handleContactSubmit below. */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm){
    contactForm.addEventListener('submit', handleContactSubmit);
  }

  function handleContactSubmit(e){
    e.preventDefault();

    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !message){
      formStatus.textContent = 'Please fill in every field before sending.';
      return;
    }

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    const mailtoUrl = `mailto:avinashkaur20037@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;
    formStatus.textContent = 'Opening your email app to send this message…';
  }

  /* ---------- Close mobile menu when a hash link is clicked from anywhere ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) closeMobileMenu();
    });
  });

});
/* =====================================================
   INTERNSHIP POPUPS
===================================================== */

const internshipData = {

    payroll: {
        icon: "₹",
        title: "Payroll Support",
        text: "Assisted with payroll-related HR activities, employee attendance information and documentation required for salary processing."
    },

    documents: {
        icon: "▤",
        title: "HR Documentation",
        text: "Prepared and maintained HR documents, including employee records, an Exit Interview Form and an SOP."
    },

    compliance: {
        icon: "✓",
        title: "Statutory Compliance",
        text: "Learned and supported HR compliance activities related to PF, ESI, labour laws and statutory requirements."
    },

    attendance: {
        icon: "◷",
        title: "Attendance Management",
        text: "Worked with attendance and leave-related records and supported the maintenance of HR registers."
    },

    records: {
        icon: "♙",
        title: "Employee Records",
        text: "Reviewed and verified records of 400+ workers and helped identify and correct employee information in HR records."
    }

};


function openInternshipPopup(type) {

    const data = internshipData[type];

    if (!data) return;

    document.getElementById("popupIcon").textContent = data.icon;

    document.getElementById("popupTitle").textContent = data.title;

    document.getElementById("popupText").textContent = data.text;

    document
        .getElementById("internshipPopup")
        .classList.add("active");

}


function closeInternshipPopup() {

    document
        .getElementById("internshipPopup")
        .classList.remove("active");

}


/* Close popup when clicking outside */

document
    .getElementById("internshipPopup")
    ?.addEventListener("click", function(event) {

        if (event.target === this) {

            closeInternshipPopup();

        }

    });


/* Close popup with ESC */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeInternshipPopup();

    }

});
/* =====================================================
   CREATIVE PROJECT POPUPS
   ===================================================== */

const projectDetails = {

    /* ================= DASTAAN ================= */

    "dastaan-main": {
        title: "Dastaan — Brand Building Project",
        text: "Dastaan was a brand-building project focused on transforming traditional Himachali apparel into a modern, appealing brand. The project involved brand building, team coordination, customer engagement, sales and business planning, ultimately generating ₹1,00,000+ in revenue."
    },

    "dastaan-role": {
        title: "My Role",
        text: "Worked as a Co-Founder, contributing to brand building, team coordination, customer engagement, sales activities and business planning."
    },

    "dastaan-customers": {
        title: "Customer Engagement",
        text: "Focused on understanding customer preferences, communicating the value of Himachali products and building meaningful customer relationships."
    },

    "dastaan-sales": {
        title: "Sales Handling",
        text: "Contributed to sales activities and customer interactions that helped the project generate ₹1,00,000+ in revenue."
    },

    "dastaan-vocal": {
        title: "Vocal for Local",
        text: "The project supported the Vocal for Local movement by promoting authentic Himachali products, local craftsmanship and locally made products."
    },

    "dastaan-team": {
        title: "Team Activities",
        text: "Worked collaboratively with the team across branding, customer engagement, sales and business planning activities."
    },

    "dastaan-planning": {
        title: "Business Planning",
        text: "Contributed to planning around branding, customer engagement, sales and overall business activities."
    },


    /* ================= STRESS ================= */

    "stress-main": {
        title: "Stress Management & Employee Well-Being",
        text: "This project followed a complete HR training journey — identifying needs through a Training Needs Assessment, understanding workplace challenges, designing a well-being program and delivering interactive activities and practical coping techniques to 10+ Anganwadi workers."
    },

    "stress-tna": {
        title: "Training Needs Assessment",
        text: "Conducted a Training Needs Assessment with 10+ Anganwadi workers to understand their training and workplace well-being requirements."
    },

    "stress-engagement": {
        title: "Employee Engagement",
        text: "Focused on engaging participants through interactive activities and practical learning rather than relying only on theoretical training."
    },

    "stress-facilitation": {
        title: "Facilitation",
        text: "Supported the delivery of interactive training activities designed around stress management and employee well-being."
    },

    "stress-communication": {
        title: "Communication",
        text: "Used communication and interactive learning techniques to make the training accessible and engaging for participants."
    },

    "stress-wellbeing": {
        title: "Workplace Well-Being",
        text: "The project focused on practical stress-management approaches and creating greater awareness around employee well-being."
    },


    /* ================= ATTENDANCE APP ================= */

    "app-main": {
        title: "Golden Oak Shimla — HR Attendance App",
        text: "Analyzed HR attendance processes and workflows and transformed the problem of manual attendance management into a digital attendance solution. The application was successfully sold for ₹18,000."
    },

    "app-hr": {
        title: "HR Operations",
        text: "The project focused on understanding HR operations and how attendance management fits into everyday HR workflows."
    },

    "app-attendance": {
        title: "Attendance Management",
        text: "The application was designed to make attendance management more organized and efficient through a digital approach."
    },

    "app-workflow": {
        title: "Workflow Analysis",
        text: "Analyzed existing attendance-related workflows to identify opportunities for a more efficient digital process."
    },

    "app-digital": {
        title: "Digital Transformation",
        text: "Converted a manual HR process into a digital solution, supporting improved operational efficiency, data management and attendance accuracy."
    }

};


function openProject(projectId) {

    const project = projectDetails[projectId];

    if (!project) return;

    document.getElementById("popupTitle").textContent =
        project.title;

    document.getElementById("popupText").textContent =
        project.text;

    document.getElementById("projectPopup")
        .classList.add("active");

    document.body.style.overflow = "hidden";
}


function closeProject() {

    document.getElementById("projectPopup")
        .classList.remove("active");

    document.body.style.overflow = "";
}


/* Close popup using ESC */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closeProject();
    }

});
