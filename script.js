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


// ==========================================
// PROJECT FLASHCARD POPUP CONTENT
// ==========================================

   /* =========================================================
   PROJECT FLASHCARD POPUPS
========================================================= */

const projectCardData = {

  /* ================= DASTAAN ================= */

  "dastaan-idea": {
    icon: "🌱",
    label: "DASTAAN · THE IDEA",
    title: "Traditional roots, modern direction.",
    text:
      "Dastaan was created around the idea of taking authentic Himachali apparel and presenting it as a contemporary brand for modern customers."
  },

  "dastaan-role": {
    icon: "👥",
    label: "DASTAAN · MY ROLE",
    title: "More than just a brand idea.",
    text:
      "I worked as a Co-Founder and contributed to brand building, team coordination, customer engagement, sales and business planning."
  },

  "dastaan-sales": {
    icon: "📈",
    label: "DASTAAN · SALES",
    title: "The idea became revenue.",
    text:
      "The project generated ₹1,00,000+ in revenue through customer engagement, sales handling and business planning."
  },

  "dastaan-vocal": {
    icon: "🇮🇳",
    label: "DASTAAN · VOCAL FOR LOCAL",
    title: "Keeping local craftsmanship visible.",
    text:
      "Dastaan supported the Vocal for Local movement by promoting authentic Himachali products and giving traditional craftsmanship a modern platform."
  },


  /* ================= STRESS ================= */

  "stress-tna": {
    icon: "🔎",
    label: "STRESS MANAGEMENT · IDENTIFY",
    title: "Start with the people.",
    text:
      "I conducted a Training Needs Assessment involving 10+ Anganwadi workers to understand workplace challenges and identify areas where training could help."
  },

  "stress-design": {
    icon: "🎯",
    label: "STRESS MANAGEMENT · DESIGN",
    title: "Turning needs into a program.",
    text:
      "The findings were used to design a Stress Management and Employee Well-Being program focused on practical and relevant workplace support."
  },

  "stress-delivery": {
    icon: "🎲",
    label: "STRESS MANAGEMENT · DELIVERY",
    title: "Learning through interaction.",
    text:
      "The session used interactive activities and practical coping techniques so participants could connect the concepts with their everyday experiences."
  },

  "stress-impact": {
    icon: "💬",
    label: "STRESS MANAGEMENT · IMPACT",
    title: "Well-being at the centre.",
    text:
      "The project focused on improving awareness of stress management, communication, employee engagement and overall workplace well-being."
  },


  /* ================= ATTENDANCE APP ================= */

  "app-problem": {
    icon: "⚠️",
    label: "HR ATTENDANCE APP · PROBLEM",
    title: "A manual process needed a better way.",
    text:
      "The project started by looking at attendance management and the inefficiencies involved in maintaining and handling attendance information manually."
  },

  "app-analysis": {
    icon: "🔍",
    label: "HR ATTENDANCE APP · ANALYSIS",
    title: "Understand the workflow first.",
    text:
      "I analyzed HR operations, attendance requirements and workflows to understand how a digital solution could make the process more efficient."
  },

  "app-solution": {
    icon: "💻",
    label: "HR ATTENDANCE APP · SOLUTION",
    title: "An HR process became a digital product.",
    text:
      "The outcome was a digital attendance management application designed to make attendance tracking and data management easier."
  },

  "app-result": {
    icon: "💰",
    label: "HR ATTENDANCE APP · RESULT",
    title: "A project with a real commercial outcome.",
    text:
      "The HR attendance application was successfully sold for ₹18,000, turning the project from a concept into a real digital solution."
  }

};


/* OPEN POPUP */

function openProjectCard(cardId) {

  const card = projectCardData[cardId];

  if (!card) return;

  const popup = document.getElementById("projectPopup");

  document.getElementById("popupIcon").textContent = card.icon;

  document.getElementById("popupLabel").textContent = card.label;

  document.getElementById("popupTitle").textContent = card.title;

  document.getElementById("popupText").textContent = card.text;

  popup.classList.add("active");

  popup.setAttribute("aria-hidden", "false");

  document.body.classList.add("project-popup-open");

}


/* CLOSE POPUP */

function closeProjectCard() {

  const popup = document.getElementById("projectPopup");

  popup.classList.remove("active");

  popup.setAttribute("aria-hidden", "true");

  document.body.classList.remove("project-popup-open");

}


/* ESC KEY */

document.addEventListener("keydown", function(event) {

  if (event.key === "Escape") {

    closeProjectCard();

  }

});
/* =====================================================
   PROJECT POPUPS
   ===================================================== */

const projectInformation = {

    dastaan: {

        label: "DASTAAN • BRAND BUILDING",

        title: "Building a traditional brand into a modern business.",

        description:
        "Dastaan was created to bring authentic Himachali apparel to modern customers through branding, customer engagement and business planning. The project generated ₹1,00,000+ in revenue and also supported the Vocal for Local movement.",

        role:
        "Co-Founder",

        approach:
        "Branding • Team Coordination • Customer Engagement • Sales",

        impact:
        "₹1,00,000+ Revenue"
    },


    wellbeing: {

        label: "HR • EMPLOYEE WELL-BEING",

        title: "From identifying stress to designing training.",

        description:
        "I conducted a Training Needs Assessment with 10+ Anganwadi workers to understand stress-related workplace challenges and used the findings to design an employee well-being and stress-management program.",

        role:
        "Training & Development",

        approach:
        "TNA • Facilitation • Communication • Training Design",

        impact:
        "10+ Workers Engaged"
    },


    attendance: {

        label: "HR • DIGITAL SOLUTION",

        title: "Turning an HR process into a digital solution.",

        description:
        "I developed a digital attendance management solution to simplify manual HR attendance processes, improve data handling and support more efficient workforce management.",

        role:
        "HR Solution Developer",

        approach:
        "HR Operations • Attendance • Digital Workflow",

        impact:
        "₹18,000 App Sold"
    }

};


/* ---------- OPEN ---------- */

function openProject(projectName) {

    const project = projectInformation[projectName];

    if (!project) return;

    document.getElementById("modalLabel").textContent =
        project.label;

    document.getElementById("modalTitle").textContent =
        project.title;

    document.getElementById("modalDescription").textContent =
        project.description;

    document.getElementById("modalRole").textContent =
        project.role;

    document.getElementById("modalApproach").textContent =
        project.approach;

    document.getElementById("modalImpact").textContent =
        project.impact;


    document
        .getElementById("projectModal")
        .classList
        .add("active");

    document.body.style.overflow = "hidden";
}


/* ---------- CLOSE ---------- */

function closeProject() {

    document
        .getElementById("projectModal")
        .classList
        .remove("active");

    document.body.style.overflow = "";
}


/* ---------- ESC KEY ---------- */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closeProject();
    }

});
