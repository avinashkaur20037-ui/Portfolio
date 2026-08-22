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

const projectFlashcards = {

    // ==========================================
    // DASTAAN — BRAND BUILDING PROJECT
    // ==========================================

    "dastaan-idea": {
        title: "🌱 THE IDEA",
        text: "Dastaan was created to bring traditional Himachali apparel into a modern market while preserving its cultural identity, craftsmanship and local roots."
    },

    "dastaan-role": {
        title: "👥 MY ROLE",
        text: "As a Co-Founder, I contributed to brand building, team coordination, customer engagement, sales handling and business planning."
    },

    "dastaan-journey": {
        title: "🧩 THE JOURNEY",
        text: "The project evolved from an initial idea into a real business experience through branding, teamwork, customer interaction, sales and continuous planning."
    },

    "dastaan-stakeholders": {
        title: "🤝 STAKEHOLDER RELATIONSHIPS",
        text: "I worked on building positive relationships with customers, team members and other stakeholders while understanding their needs and expectations."
    },

    "dastaan-team": {
        title: "👥 TEAM ACTIVITIES",
        text: "Working with the team helped transform the initial concept into a functioning brand through coordination, shared responsibilities and collaborative decision-making."
    },

    "dastaan-customer": {
        title: "💬 CUSTOMER ENGAGEMENT",
        text: "Customer interaction helped us understand preferences, communicate the value of Himachali products and build stronger connections with our target audience."
    },

    "dastaan-sales": {
        title: "📈 SALES HANDLING",
        text: "I gained practical experience in sales planning, customer interaction and converting interest into actual purchases while managing the business journey."
    },

    "dastaan-business": {
        title: "📊 BUSINESS PLANNING",
        text: "The project involved planning around branding, customers, sales and business operations, giving me hands-on exposure to entrepreneurship and management."
    },

    "dastaan-impact": {
        title: "💰 THE IMPACT",
        text: "Dastaan generated ₹1,00,000+ in sales, turning a traditional-product idea into a real business experience and strengthening my skills in entrepreneurship and business management."
    },

    "dastaan-vocal": {
        title: "🇮🇳 VOCAL FOR LOCAL",
        text: "The project supported the Vocal for Local movement by promoting authentic Himachali products and helping connect local craftsmanship with modern customers."
    },


    // ==========================================
    // STRESS MANAGEMENT & EMPLOYEE WELL-BEING
    // ==========================================

    "stress-identify": {
        title: "🔍 STEP 01 — IDENTIFY",
        text: "I began by conducting a Training Needs Assessment with 10+ Anganwadi workers to understand the challenges they were facing in their work environment."
    },

    "stress-understand": {
        title: "🧠 STEP 02 — UNDERSTAND",
        text: "The assessment helped identify stress-related challenges, communication concerns and the specific areas where practical employee well-being support was needed."
    },

    "stress-design": {
        title: "🎯 STEP 03 — DESIGN",
        text: "Based on the findings, I designed a Stress Management and Employee Well-Being training program focused on practical and easy-to-apply techniques."
    },

    "stress-deliver": {
        title: "🎲 STEP 04 — DELIVER",
        text: "The training used interactive activities, practical coping techniques and communication-focused learning to make the session engaging and useful for the participants."
    },

    "stress-impact": {
        title: "📈 THE IMPACT",
        text: "The initiative engaged 10+ Anganwadi workers and created awareness around stress management, communication, coping strategies and workplace well-being."
    },

    "stress-tna": {
        title: "📋 TRAINING NEEDS ASSESSMENT",
        text: "The TNA provided the foundation for the project by identifying the actual training requirements instead of assuming what employees needed."
    },

    "stress-engagement": {
        title: "👥 EMPLOYEE ENGAGEMENT",
        text: "Interactive learning activities encouraged participants to actively take part in the session and connect the concepts with their own workplace experiences."
    },

    "stress-facilitation": {
        title: "🎤 FACILITATION",
        text: "The session required planning and facilitating learning activities in a simple, practical format so that participants could easily understand and apply the concepts."
    },

    "stress-communication": {
        title: "💬 COMMUNICATION",
        text: "Communication was included as an important part of the training because effective communication can support healthier workplace relationships and reduce workplace stress."
    },

    "stress-wellbeing": {
        title: "💚 WORKPLACE WELL-BEING",
        text: "The overall focus was to promote healthier ways of managing stress while encouraging emotional well-being and practical coping strategies."
    },


    // ==========================================
    // GOLDEN OAK SHIMLA — HR ATTENDANCE APP
    // ==========================================

    "attendance-problem": {
        title: "⚠️ THE PROBLEM",
        text: "The project focused on the challenges of managing attendance through manual and inefficient processes, which can make HR tracking and record management more difficult."
    },

    "attendance-analyze": {
        title: "🔎 WHAT I ANALYZED",
        text: "I looked at HR operations, attendance requirements and existing workflows to understand where a digital solution could improve efficiency and data management."
    },

    "attendance-solution": {
        title: "💻 THE SOLUTION",
        text: "The project developed a digital attendance management solution designed to simplify attendance tracking, organize records and support smoother HR operations."
    },

    "attendance-impact": {
        title: "⚡ THE IMPACT",
        text: "The solution helped improve the efficiency of attendance tracking, data management and overall accuracy while supporting a more organized HR workflow."
    },

    "attendance-efficiency": {
        title: "⚙️ OPERATIONAL EFFICIENCY",
        text: "Moving attendance processes toward a digital system helped create a more structured workflow and reduced dependence on inefficient manual handling."
    },

    "attendance-data": {
        title: "📊 DATA MANAGEMENT",
        text: "A digital approach made attendance information easier to organize and manage, supporting better access to HR records and employee attendance data."
    },

    "attendance-accuracy": {
        title: "🎯 ATTENDANCE ACCURACY",
        text: "The system was designed to make attendance records more organized and accurate, helping HR teams work with cleaner and more reliable information."
    },

    "attendance-digital": {
        title: "🚀 DIGITAL TRANSFORMATION",
        text: "The project demonstrated how an everyday HR process can be converted into a digital workflow to improve efficiency and simplify administrative work."
    },

    "attendance-sale": {
        title: "💰 THE RESULT",
        text: "The HR Attendance App was successfully sold for ₹18,000, turning the project from an academic concept into a practical digital solution with commercial value."
    }

};
