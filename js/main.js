/* ============================================================
   Stackly Global — Main JS Logic
   ============================================================ */
'use strict';

// ── User Database Seeding ─────────────────────────────────────
function initUserDb() {
  if (!localStorage.getItem('registered_users')) {
    const seedUsers = [
      {
        name: "Srikant Roy",
        email: "donor@stackly.org",
        password: "password",
        role: "Active Donor",
        roleVal: "donor"
      },
      {
        name: "Anand Sen",
        email: "volunteer@stackly.org",
        password: "password",
        role: "Active Volunteer",
        roleVal: "volunteer",
        squad: "Education Squad",
        squadVal: "education",
        availability: "Weekends Only",
        hours: 12
      },
      {
        name: "Neha Mehta",
        email: "auditor@stackly.org",
        password: "password",
        role: "Lead Auditor",
        roleVal: "auditor"
      }
    ];
    localStorage.setItem('registered_users', JSON.stringify(seedUsers));
  }
}

// ── Loader & Initializer ──────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hide');
      setTimeout(() => loader.remove(), 500);
    }, 800);
  }
  
  initUserDb();
  initNavbar();
  initCounters();
  initReveal();
  initSwiper();
  initFilters();
  initDonationWizard();
  initFAQ();
  initForms();
  updateNavLoginState();
  
  if (document.getElementById('calcSlider')) {
    const calcSlider = document.getElementById('calcSlider');
    const updateCalc = () => {
      const v = parseInt(calcSlider.value);
      const amountLabel = document.getElementById('calc-amount-label');
      const schoolLabel = document.getElementById('calc-school');
      const waterLabel = document.getElementById('calc-water');
      const mealsLabel = document.getElementById('calc-meals');
      const donateBtn = document.getElementById('calcDonateBtn');

      if (amountLabel) amountLabel.textContent = '₹' + v.toLocaleString('en-IN');
      if (schoolLabel) schoolLabel.textContent = Math.floor(v / 120) + ' School Days';
      if (waterLabel) waterLabel.textContent = (v * 5.2).toLocaleString('en-IN') + ' Liters';
      if (mealsLabel) mealsLabel.textContent = Math.floor(v / 58) + ' Meals';
      if (donateBtn) donateBtn.href = 'donate.html?amount=' + v;
    };

    calcSlider.addEventListener('input', updateCalc);
    updateCalc();

    // Live flow counter increment
    let flow = 24560.8;
    setInterval(() => {
      flow += (Math.random() * 0.5);
      const el = document.getElementById('homeFlowCounter');
      if (el) el.textContent = flow.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' L';
    }, 2400);
  }
  
  if (document.getElementById('portalSignOut') || document.querySelector('.portal-layout')) {
    initPortalDashboard();
  }
  initFloatingNav();
  initTiltEffect();
  initMagneticButtons();
  initScrollProgress();
  initTextTyping();
  initMouseParallax();
});

// ── Navbar Controller ──────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight Active Link
  const links = navbar.querySelectorAll('.nav-link');
  const path = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile Hamburger Toggle
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('.nav-link, .btn').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on click outside
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
}

// ── Count-up Statistics ───────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length === 0) return;

  const runCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const speed = 2000; // time in ms
    let start = 0;
    const increment = target / (speed / 16); // ~60fps

    const update = () => {
      start += increment;
      if (start < target) {
        el.innerText = Math.floor(start).toLocaleString() + suffix;
        requestAnimationFrame(update);
      } else {
        el.innerText = target.toLocaleString() + suffix;
      }
    };
    update();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ── Intersection Reveal Effects ───────────────────────────────
function initReveal() {
  // Stagger grid elements automatically
  const grids = document.querySelectorAll('.stats-card-grid, .split-layout, .features-grid, .partners-row');
  grids.forEach(grid => {
    const children = grid.querySelectorAll(':scope > *');
    children.forEach((child, index) => {
      // Add stagger delay inline
      if (!child.style.transitionDelay) {
        child.style.transitionDelay = `${index * 0.12}s`;
      }
      // Ensure reveal classes are applied
      if (!child.classList.contains('reveal') && !child.classList.contains('reveal-left') && !child.classList.contains('reveal-right') && !child.classList.contains('reveal-scale')) {
        child.classList.add('reveal');
      }
    });
  });

  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  reveals.forEach(r => observer.observe(r));
}

// ── Initialize Swiper Slider ──────────────────────────────────
function initSwiper() {
  if (typeof Swiper !== 'undefined' && document.getElementById('heroSwiper')) {
    new Swiper('#heroSwiper', {
      loop: true,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      autoplay: { delay: 6000, disableOnInteraction: false },
      speed: 1000,
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      pagination: { el: '.swiper-pagination', clickable: true }
    });
  }
}

// ── Campaign Category Filters ─────────────────────────────────
let filtersInitialized = false;

function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.prog-card');

  if (filterBtns.length === 0 || filtersInitialized) return;
  filtersInitialized = true;

  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCampaigns(btn.getAttribute('data-filter'));
    });
  });

  if (filterParam) {
    const targetBtn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === filterParam);
    if (targetBtn) {
      filterBtns.forEach(b => b.classList.remove('active'));
      targetBtn.classList.add('active');
      filterCampaigns(filterParam);
      
      // Smooth scroll down to the programs section
      setTimeout(() => {
        const filterSection = document.getElementById('filterBar');
        if (filterSection) {
          const y = filterSection.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({top: y, behavior: 'smooth'});
        }
      }, 400);
    } else {
      filterCampaigns('all');
    }
  } else {
    // Initial show all
    filterCampaigns('all');
  }

  // Intercept footer link clicks if we are already on programs.html
  const footerProgLinks = document.querySelectorAll('.footer-link[href^="programs.html?filter="]');
  footerProgLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.location.pathname.includes('programs.html')) {
        e.preventDefault();
        const filterUrl = new URL(link.href, window.location.origin);
        const fParam = filterUrl.searchParams.get('filter');
        if (fParam) {
          window.history.pushState({}, '', link.href);
          const targetBtn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === fParam);
          if (targetBtn) {
            filterBtns.forEach(b => b.classList.remove('active'));
            targetBtn.classList.add('active');
            filterCampaigns(fParam);
            const filterSection = document.getElementById('filterBar');
            if (filterSection) {
              const y = filterSection.getBoundingClientRect().top + window.scrollY - 100;
              window.scrollTo({top: y, behavior: 'smooth'});
            }
          }
        }
      }
    });
  });

  function filterCampaigns(category) {
    cards.forEach(card => {
      if (category === 'all' || card.getAttribute('data-category') === category) {
        card.style.display = 'flex';
        setTimeout(() => card.style.opacity = '1', 50);
      } else {
        card.style.opacity = '0';
        setTimeout(() => card.style.display = 'none', 300);
      }
    });
  }
}

// ── Multi-Step Donation Wizard ────────────────────────────────
let donationData = {
  frequency: 'monthly',
  amount: 1500,
  project: 'all',
  name: '',
  email: ''
};

function initDonationWizard() {
  const steps = document.querySelectorAll('.donate-step');
  if (steps.length === 0) return;

  const nextBtns = document.querySelectorAll('.wizard-next');
  const prevBtns = document.querySelectorAll('.wizard-prev');
  const amtBtns = document.querySelectorAll('.amount-btn');
  const customAmtInput = document.getElementById('customAmount');
  const freqBtns = document.querySelectorAll('.freq-btn');
  const sumValEl = document.getElementById('sum-value');
  const sumImpactEl = document.getElementById('sum-impact');
  
  // Initialize donationData.amount from the active button if present
  const defaultAmtBtn = document.querySelector('.amount-btn.active');
  if (defaultAmtBtn && defaultAmtBtn.getAttribute('data-amount') !== 'custom') {
    donationData.amount = parseFloat(defaultAmtBtn.getAttribute('data-amount'));
  }
  
  // Set default values in summary
  updateDonationSummary();

  // Check URL query parameters for prefilled amount
  const urlParams = new URLSearchParams(window.location.search);
  const amountParam = urlParams.get('amount');
  if (amountParam) {
    const amtVal = parseFloat(amountParam);
    if (amtVal > 0) {
      donationData.amount = amtVal;
      
      // Update amount button visual active states
      amtBtns.forEach(btn => btn.classList.remove('active'));
      let matched = false;
      amtBtns.forEach(btn => {
        if (btn.getAttribute('data-amount') === amountParam) {
          btn.classList.add('active');
          matched = true;
        }
      });
      
      if (!matched && customAmtInput) {
        // Activate custom amount button
        amtBtns.forEach(btn => {
          if (btn.getAttribute('data-amount') === 'custom') {
            btn.classList.add('active');
          }
        });
        customAmtInput.style.display = 'block';
        customAmtInput.value = amtVal;
      }
      
      updateDonationSummary();
    }
  }


  // Step Navigations
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStep = btn.closest('.donate-step');
      const nextStepId = btn.getAttribute('data-next');
      const nextStep = document.getElementById(nextStepId);

      // Validate before going to step 3/4
      if (currentStep.id === 'step1') {
        if (donationData.amount <= 0) {
          alert('Please enter or select a donation amount.');
          return;
        }
      } else if (currentStep.id === 'step2') {
        const selectedProj = document.querySelector('input[name="project-select"]:checked');
        if (selectedProj) {
          donationData.project = selectedProj.value;
        }
      } else if (currentStep.id === 'step3') {
        const nameInput = document.getElementById('donorName').value.trim();
        const emailInput = document.getElementById('donorEmail').value.trim();
        if (!nameInput || !emailInput) {
          alert('Please enter your name and email address.');
          return;
        }
        donationData.name = nameInput;
        donationData.email = emailInput;
      }

      currentStep.classList.remove('active');
      nextStep.classList.add('active');
      updateStepIndicators(parseInt(nextStepId.replace('step', '')));
      updateDonationSummary();

      // Scroll to top of wizard to prevent jumping
      const wizardTop = document.querySelector('.donate-layout');
      if (wizardTop) wizardTop.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStep = btn.closest('.donate-step');
      const prevStepId = btn.getAttribute('data-prev');
      const prevStep = document.getElementById(prevStepId);

      currentStep.classList.remove('active');
      prevStep.classList.add('active');
      updateStepIndicators(parseInt(prevStepId.replace('step', '')));

      const wizardTop = document.querySelector('.donate-layout');
      if (wizardTop) wizardTop.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Amount Selectors
  amtBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amtBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const val = btn.getAttribute('data-amount');
      if (val === 'custom') {
        customAmtInput.style.display = 'block';
        customAmtInput.focus();
        donationData.amount = parseFloat(customAmtInput.value) || 0;
      } else {
        customAmtInput.style.display = 'none';
        donationData.amount = parseFloat(val);
      }
      updateDonationSummary();
    });
  });

  if (customAmtInput) {
    customAmtInput.addEventListener('input', () => {
      donationData.amount = parseFloat(customAmtInput.value) || 0;
      updateDonationSummary();
    });
  }

  // Frequency Selectors
  freqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      freqBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      donationData.frequency = btn.getAttribute('data-freq');
      updateDonationSummary();
    });
  });

  function updateStepIndicators(activeStepNum) {
    for (let i = 1; i <= 4; i++) {
      const dot = document.getElementById(`sdot${i}`);
      const line = document.getElementById(`sline${i - 1}`);
      if (dot) {
        if (i <= activeStepNum) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      }
      if (line) {
        if (i < activeStepNum) {
          line.classList.add('active');
        } else {
          line.classList.remove('active');
        }
      }
    }
  }

  function updateDonationSummary() {
    if (!sumValEl) return;
    const formattedAmount = '₹' + donationData.amount.toLocaleString();
    const cycle = donationData.frequency === 'monthly' ? '/month' : ' one-time';
    sumValEl.innerText = formattedAmount + cycle;

    // Calculate humanitarian impact dynamically
    let schoolingDays = Math.floor(donationData.amount / 120);
    let waterLiters = Math.floor(donationData.amount * 5);
    let healthyMeals = Math.floor(donationData.amount / 60);

    let impactStr = `Fund ${schoolingDays} days of schooling, supply ${waterLiters} liters of clean water, and serve ${healthyMeals} hot nutritious meals.`;
    sumImpactEl.innerText = impactStr;

    // Fill confirm screen details
    const confAmt = document.getElementById('conf-amt');
    const confDetails = document.getElementById('conf-details');
    if (confAmt && confDetails) {
      confAmt.innerText = formattedAmount;
      confDetails.innerHTML = `
        <strong>Allocation:</strong> Stackly Core Projects (${donationData.project.toUpperCase()})<br>
        <strong>Frequency:</strong> ${donationData.frequency.toUpperCase()}<br>
        <strong>Donor:</strong> ${donationData.name} (${donationData.email})
      `;
    }
  }
}

// ── FAQ Accordion ──────────────────────────────────────────────
function initFAQ() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.faq-item');
      const isOpen = item.classList.toggle('open');
      const body = item.querySelector('.faq-body');

      if (isOpen) {
        body.style.maxHeight = body.scrollHeight + 'px';
        header.querySelector('i').className = 'fas fa-chevron-up';
      } else {
        body.style.maxHeight = '0px';
        header.querySelector('i').className = 'fas fa-chevron-down';
      }
    });
  });
}

// ── Form Submissions & Dynamic Redirections ─────────────────────────
function initForms() {
  // Utility for showing/clearing errors
  function showFieldError(inputEl, errorMsg) {
    if (!inputEl) return;
    let group = inputEl.closest('.form-group') || inputEl.parentNode;
    let errorEl = group.querySelector('.field-error-msg');
    
    if (errorMsg) {
      inputEl.classList.add('input-invalid');
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'field-error-msg';
        errorEl.style.display = 'flex';
        errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>${errorMsg}</span>`;
        group.appendChild(errorEl);
      } else {
        errorEl.style.display = 'flex';
        errorEl.querySelector('span').innerText = errorMsg;
      }
    } else {
      inputEl.classList.remove('input-invalid');
      if (errorEl) {
        errorEl.style.display = 'none';
      }
    }
  }

  function clearErrorsOnInput(formEl) {
    formEl.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => showFieldError(input, null));
      input.addEventListener('change', () => showFieldError(input, null));
    });
  }

  // Validator Functions
  function validateName(nameVal, inputEl) {
    if (!nameVal) {
      showFieldError(inputEl, "Please enter your name.");
      return false;
    }
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(nameVal)) {
      showFieldError(inputEl, "Name should accept only alphabetic characters.");
      return false;
    }
    showFieldError(inputEl, null);
    return true;
  }

  function validateEmail(emailVal, inputEl) {
    if (!emailVal) {
      showFieldError(inputEl, "Please enter a valid email address.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      showFieldError(inputEl, "Please enter a valid email address.");
      return false;
    }
    const parts = emailVal.split('@');
    if (parts.length !== 2) {
      showFieldError(inputEl, "Please enter a valid email address.");
      return false;
    }
    const domain = parts[1];
    if (domain.startsWith('.') || domain.endsWith('.') || domain.includes('..') || !domain.includes('.')) {
      showFieldError(inputEl, "Please enter a valid email address.");
      return false;
    }
    const domainParts = domain.split('.');
    if (domainParts.some(part => part.length === 0)) {
      showFieldError(inputEl, "Please enter a valid email address.");
      return false;
    }
    showFieldError(inputEl, null);
    return true;
  }

  function validatePhone(phoneVal, inputEl) {
    if (!phoneVal) {
      showFieldError(inputEl, "Please enter your phone number.");
      return false;
    }
    const numericRegex = /^[0-9]+$/;
    if (!numericRegex.test(phoneVal) || phoneVal.length > 10) {
      showFieldError(inputEl, "Phone number should accept only numeric values and should not allow more than 10 digits.");
      return false;
    }
    showFieldError(inputEl, null);
    return true;
  }

  function validatePassword(passVal, inputEl) {
    if (!passVal) {
      showFieldError(inputEl, "Please enter your password.");
      return false;
    }
    if (passVal.length < 8) {
      showFieldError(inputEl, "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.");
      return false;
    }
    const hasUpper = /[A-Z]/.test(passVal);
    const hasLower = /[a-z]/.test(passVal);
    const hasDigit = /[0-9]/.test(passVal);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>_]/.test(passVal);
    if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
      showFieldError(inputEl, "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.");
      return false;
    }
    showFieldError(inputEl, null);
    return true;
  }

  // 1. Volunteer Form Submission
  const volForm = document.getElementById('volunteerForm');
  if (volForm) {
    clearErrorsOnInput(volForm);
    volForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameEl = document.getElementById('volName');
      const emailEl = document.getElementById('volEmail');
      const phoneEl = document.getElementById('volPhone');
      const squadEl = document.getElementById('volSquad');
      const availEl = document.getElementById('volAvailability');
      const msgEl = document.getElementById('volMessage');

      let isValid = true;
      if (nameEl && !validateName(nameEl.value.trim(), nameEl)) isValid = false;
      if (emailEl && !validateEmail(emailEl.value.trim(), emailEl)) isValid = false;
      if (phoneEl && !validatePhone(phoneEl.value.trim(), phoneEl)) isValid = false;
      
      if (squadEl) {
        if (!squadEl.value) {
          showFieldError(squadEl, "Please select an action squad.");
          isValid = false;
        } else {
          showFieldError(squadEl, null);
        }
      }
      
      if (availEl) {
        if (!availEl.value) {
          showFieldError(availEl, "Please select availability.");
          isValid = false;
        } else {
          showFieldError(availEl, null);
        }
      }

      if (msgEl) {
        if (!msgEl.value.trim()) {
          showFieldError(msgEl, "Please tell us how you would like to help.");
          isValid = false;
        } else {
          showFieldError(msgEl, null);
        }
      }

      if (!isValid) return;

      const name = nameEl.value.trim();
      const email = emailEl.value.trim();
      const squad = squadEl.options[squadEl.selectedIndex].text;
      const squadVal = squadEl.value;
      const availability = availEl.options[availEl.selectedIndex].text;

      // Persist in localStorage
      localStorage.setItem('careportal_logged_in', 'true');
      localStorage.setItem('volunteer_registered', 'true');
      localStorage.setItem('careportal_user_name', name);
      localStorage.setItem('careportal_user_email', email);
      localStorage.setItem('careportal_user_role', 'Active Volunteer');
      localStorage.setItem('volunteer_squad', squad);
      localStorage.setItem('volunteer_squad_val', squadVal);
      localStorage.setItem('volunteer_availability', availability);
      localStorage.setItem('volunteer_hours', '0');

      // Sync to registered_users list
      let users = [];
      try {
        users = JSON.parse(localStorage.getItem('registered_users')) || [];
      } catch (err) {
        users = [];
      }
      const existingUser = users.find(u => u.email === email.toLowerCase());
      if (existingUser) {
        existingUser.squad = squad;
        existingUser.squadVal = squadVal;
        existingUser.availability = availability;
        existingUser.hours = 0;
      } else {
        users.push({
          name: name,
          email: email.toLowerCase(),
          password: 'password', // Default
          role: 'Active Volunteer',
          roleVal: 'volunteer',
          squad: squad,
          squadVal: squadVal,
          availability: availability,
          hours: 0
        });
      }
      localStorage.setItem('registered_users', JSON.stringify(users));

      alert(`Application Submitted! Thank you, ${name}. You have been assigned to the ${squad}. Redirection to your volunteer dashboard...`);
      volForm.reset();
      window.location.href = 'portal.html';
    });
  }

  // 2. Contact Form Submission
  const conForm = document.getElementById('contactForm');
  if (conForm) {
    clearErrorsOnInput(conForm);
    conForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameEl = document.getElementById('conName');
      const emailEl = document.getElementById('conEmail');
      const phoneEl = document.getElementById('conPhone');
      const subEl = document.getElementById('conSubject');
      const msgEl = document.getElementById('conMessage');

      let isValid = true;
      if (nameEl && !validateName(nameEl.value.trim(), nameEl)) isValid = false;
      if (emailEl && !validateEmail(emailEl.value.trim(), emailEl)) isValid = false;
      if (phoneEl && !validatePhone(phoneEl.value.trim(), phoneEl)) isValid = false;
      
      if (subEl) {
        if (!subEl.value.trim()) {
          showFieldError(subEl, "Please enter a subject.");
          isValid = false;
        } else {
          showFieldError(subEl, null);
        }
      }

      if (msgEl) {
        if (!msgEl.value.trim()) {
          showFieldError(msgEl, "Please enter your message.");
          isValid = false;
        } else {
          showFieldError(msgEl, null);
        }
      }

      if (!isValid) return;

      window.location.href = '404.html';
    });
  }

  // 3. Payment Form Hook (Generates Tracking Hash and Saves Donation Metrics)
  const payForm = document.getElementById('paymentForm');
  if (payForm) {
    payForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Generate transaction hash
      const hash = 'st_don_' + Math.random().toString(36).substr(2, 6);
      
      // Save details to localStorage
      localStorage.setItem('careportal_logged_in', 'true');
      localStorage.setItem('last_donation_hash', hash);
      localStorage.setItem('last_donation_amount', donationData.amount);
      localStorage.setItem('last_donation_project', donationData.project);
      localStorage.setItem('last_donation_frequency', donationData.frequency);
      localStorage.setItem('careportal_user_name', donationData.name);
      localStorage.setItem('careportal_user_email', donationData.email);
      localStorage.setItem('careportal_user_role', 'Active Donor');

      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed; inset: 0; z-index: 10000;
        background: rgba(9, 13, 22, 0.92); display: flex; align-items: center; justify-content: center;
        backdrop-filter: blur(15px); padding: 24px;
      `;
      modal.innerHTML = `
        <div class="glass-card" style="max-width: 480px; width: 100%; padding: 40px; text-align: center; border-color: var(--primary);">
          <div style="width:72px; height:72px; background:var(--primary-light); color:var(--primary); border:2px solid var(--primary); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2rem; margin:0 auto 24px; box-shadow:0 0 20px var(--primary-glow);">
            <i class="fas fa-check"></i>
          </div>
          <h2 style="font-family:var(--font-display); font-size:1.6rem; font-weight:800; margin-bottom:12px; text-transform:uppercase;">Donation Successful</h2>
          <p style="color:var(--text-sec); font-size:0.95rem; line-height:1.75; margin-bottom:30px;">
            Thank you! Your donation of <strong style="color:#fff;">₹${donationData.amount.toLocaleString()}</strong> has been processed successfully. Your telemetry tracking hash is: <strong style="color:var(--primary); font-family:var(--font-display);">${hash}</strong>.
          </p>
          <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
            <a href="404.html" class="btn btn-primary btn-sm"><i class="fas fa-satellite"></i> Track Telemetry</a>
            <a href="index.html" class="btn btn-ghost btn-sm">Return Home</a>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    });
  }

  // 4. Newsletter Form
  const newsForms = document.querySelectorAll('.newsletter-form');
  newsForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input').value;
      alert(`Successfully subscribed! Thank you for joining our newsletter feed: ${email}`);
      form.reset();
    });
  });

  // 5. Registration Form Hook (register.html)
  const regForm = document.getElementById('registerForm');
  const regError = document.getElementById('registerError');
  if (regForm && regError) {
    clearErrorsOnInput(regForm);
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      regError.style.display = 'none';

      const nameEl = document.getElementById('regName');
      const emailEl = document.getElementById('regEmail');
      const passEl = document.getElementById('regPassword');
      const confirmPassEl = document.getElementById('regConfirmPassword');

      let isValid = true;
      if (nameEl && !validateName(nameEl.value.trim(), nameEl)) isValid = false;
      if (emailEl && !validateEmail(emailEl.value.trim(), emailEl)) isValid = false;
      if (passEl && !validatePassword(passEl.value, passEl)) isValid = false;

      if (confirmPassEl) {
        if (!confirmPassEl.value) {
          showFieldError(confirmPassEl, "Please enter your password confirmation.");
          isValid = false;
        } else if (passEl.value !== confirmPassEl.value) {
          showFieldError(confirmPassEl, "Passwords do not match. Please verify.");
          isValid = false;
        } else {
          showFieldError(confirmPassEl, null);
        }
      }

      if (!isValid) return;

      const name = nameEl.value.trim();
      const email = emailEl.value.trim().toLowerCase();
      const password = passEl.value;

      let users = [];
      try {
        users = JSON.parse(localStorage.getItem('registered_users')) || [];
      } catch (err) {
        users = [];
      }

      const userExists = users.some(u => u.email === email);
      if (userExists) {
        regError.style.display = 'block';
        regError.innerText = 'This email address is already registered. Please login or use a different email.';
        return;
      }

      users.push({
        name: name,
        email: email,
        password: password
      });
      localStorage.setItem('registered_users', JSON.stringify(users));

      alert('Registration successful! Redirecting to login page...');
      window.location.href = 'login.html?registered=true';
    });
  }

  // 6. Login Form Hook (login.html)
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  if (loginForm && loginError) {
    clearErrorsOnInput(loginForm);
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
      loginError.style.display = 'block';
      loginError.style.color = '#2563EB';
      loginError.style.borderColor = 'rgba(37, 99, 235, 0.2)';
      loginError.style.background = 'rgba(37, 99, 235, 0.05)';
      loginError.innerText = 'Registration successful! Please select your Access Role and authorize session.';
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loginError.style.display = 'none';

      const emailEl = document.getElementById('loginEmail');
      const passEl = document.getElementById('loginPassword');
      const roleSelect = document.getElementById('loginRole');

      let isValid = true;
      if (emailEl && !validateEmail(emailEl.value.trim(), emailEl)) isValid = false;
      
      if (passEl) {
        if (!passEl.value) {
          showFieldError(passEl, "Please enter your password.");
          isValid = false;
        } else {
          showFieldError(passEl, null);
        }
      }

      if (roleSelect) {
        if (!roleSelect.value) {
          showFieldError(roleSelect, "Please select your Access Role to enter the portal.");
          isValid = false;
        } else {
          showFieldError(roleSelect, null);
        }
      }

      if (!isValid) return;

      const email = emailEl.value.trim().toLowerCase();
      const password = passEl.value;
      const selectedRoleVal = roleSelect.value;

      let users = [];
      try {
        users = JSON.parse(localStorage.getItem('registered_users')) || [];
      } catch (err) {
        users = [];
      }

      let matchedUser = users.find(u => u.email === email && u.password === password);

      if (!matchedUser) {
        const emailExists = users.some(u => u.email === email);
        if (!emailExists) {
          matchedUser = {
            name: email.split('@')[0].toUpperCase(),
            email: email,
            password: password
          };
          if (selectedRoleVal === 'volunteer') {
            matchedUser.squad = 'Education Squad';
            matchedUser.squadVal = 'education';
            matchedUser.availability = 'Weekends Only';
            matchedUser.hours = 12;
          }
          users.push(matchedUser);
          localStorage.setItem('registered_users', JSON.stringify(users));
        }
      }

      if (matchedUser) {
        localStorage.setItem('careportal_logged_in', 'true');
        localStorage.setItem('careportal_user_name', matchedUser.name);
        localStorage.setItem('careportal_user_email', matchedUser.email);

        let displayRole = 'Active Supporter';
        if (selectedRoleVal === 'donor') displayRole = 'Active Donor';
        if (selectedRoleVal === 'volunteer') displayRole = 'Active Volunteer';
        if (selectedRoleVal === 'auditor') displayRole = 'Lead Auditor';
        localStorage.setItem('careportal_user_role', displayRole);

        if (selectedRoleVal === 'volunteer') {
          localStorage.setItem('volunteer_registered', 'true');
          localStorage.setItem('volunteer_squad', matchedUser.squad || 'Education Squad');
          localStorage.setItem('volunteer_squad_val', matchedUser.squadVal || 'education');
          localStorage.setItem('volunteer_availability', matchedUser.availability || 'Weekends Only');
          localStorage.setItem('volunteer_hours', matchedUser.hours !== undefined ? matchedUser.hours : '12');
        } else {
          localStorage.removeItem('volunteer_registered');
          localStorage.removeItem('volunteer_squad');
          localStorage.removeItem('volunteer_squad_val');
          localStorage.removeItem('volunteer_availability');
          localStorage.removeItem('volunteer_hours');
        }

        // Direct redirection to dashboard (portal.html) for a premium, fast experience
        window.location.href = 'portal.html';
      } else {
        loginError.style.display = 'block';
        loginError.style.color = 'var(--red)';
        loginError.style.borderColor = 'rgba(239, 68, 68, 0.2)';
        loginError.style.background = 'rgba(239, 68, 68, 0.05)';
        loginError.innerText = 'Invalid email address or security password. Please try again.';
      }
    });
  }

  // Social Login Mock Hooks
  const googleLogin = document.getElementById('googleLogin');
  const githubLogin = document.getElementById('githubLogin');
  const handleSocialLogin = (e) => {
    e.preventDefault();
    window.location.href = '404.html';
  };
  
  if (googleLogin) googleLogin.addEventListener('click', handleSocialLogin);
  if (githubLogin) githubLogin.addEventListener('click', handleSocialLogin);
}

// ── Dynamic Navigation Buttons State ──────────────────────────────
function updateNavLoginState() {
  const isLoggedIn = localStorage.getItem('careportal_logged_in') === 'true';
  const loginBtns = document.querySelectorAll('a[href="login.html"]');

  loginBtns.forEach(btn => {
    if (isLoggedIn) {
      btn.setAttribute('href', 'portal.html');
      btn.innerHTML = `<i class="fas fa-user-astronaut"></i> Portal`;
      btn.classList.add('portal-link');
    } else {
      btn.setAttribute('href', 'login.html');
      btn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`;
      btn.classList.remove('portal-link');
    }
  });
}

// ── StackPortal Dashboard Telemetry Engine ────────────────────────
function initPortalDashboard() {
  // 1. Authentication Check & User Profiles Setup
  const uName = localStorage.getItem('careportal_user_name') || 'Guest Supporter';
  const uRole = localStorage.getItem('careportal_user_role') || 'Supporter';
  
  const profileNameEl = document.getElementById('profileName');
  const bannerUserEl = document.getElementById('bannerUser');
  const userAvatarImg = document.getElementById('userAvatarImg');
  const bannerAvatarImg = document.getElementById('bannerAvatarImg');
  const profileRoleEl = document.getElementById('profileRole');
  const receiptDonorEl = document.getElementById('receiptDonorName');

  let avatarSrc = 'images/avatar_kavya.webp';
  if (uName.includes('Srikant') || uName.includes('Roy')) {
    avatarSrc = 'images/avatar_rahul.webp';
  } else if (uName.includes('Anand') || uName.includes('Sen')) {
    avatarSrc = 'images/avatar_devendra.webp';
  } else if (uName.includes('Neha') || uName.includes('Mehta')) {
    avatarSrc = 'images/avatar_anita.webp';
  }

  if (profileNameEl) profileNameEl.innerText = uName;
  if (bannerUserEl) bannerUserEl.innerText = uName;
  if (userAvatarImg) userAvatarImg.src = avatarSrc;
  if (bannerAvatarImg) bannerAvatarImg.src = avatarSrc;
  if (profileRoleEl) profileRoleEl.innerText = uRole;
  if (receiptDonorEl) receiptDonorEl.innerText = uName;

  // 2. Set Overview Contribution Metrics based on Donation
  const hasDonated = localStorage.getItem('last_donation_hash') !== null;
  const statWaterEl = document.getElementById('stat-water');
  const statSchoolEl = document.getElementById('stat-school');
  const statMealsEl = document.getElementById('stat-meals');
  const receiptHashEl = document.getElementById('receiptHashVal');
  const receiptAmountEl = document.getElementById('receiptAmount');
  const receiptAllocEl = document.getElementById('receiptAlloc');

  let amt = 5000; // Default mockup baseline
  let hash = 'st_wat_rajas';
  let freq = 'monthly';
  let alloc = 'all';

  if (hasDonated) {
    amt = parseFloat(localStorage.getItem('last_donation_amount')) || 1500;
    hash = localStorage.getItem('last_donation_hash');
    freq = localStorage.getItem('last_donation_frequency') || 'monthly';
    alloc = localStorage.getItem('last_donation_project') || 'all';
  }

  // Calculate simulated share metrics
  const waterDisp = Math.floor(amt * 5.2).toLocaleString() + ' L';
  const schoolWeeks = Math.floor(amt / 120) + ' Weeks';
  const mealsCooked = Math.floor(amt / 60) + ' Meals';

  if (statWaterEl) statWaterEl.innerText = waterDisp;
  if (statSchoolEl) statSchoolEl.innerText = schoolWeeks;
  if (statMealsEl) statMealsEl.innerText = mealsCooked;

  // Update receipt visual card
  if (receiptHashEl) receiptHashEl.innerText = hash;
  if (receiptAmountEl) receiptAmountEl.innerText = `₹${amt.toLocaleString()} / ${freq.toUpperCase()}`;
  
  let allocName = 'Stackly Core Projects';
  if (alloc === 'education') allocName = 'Child Digital Classrooms';
  if (alloc === 'medical') allocName = 'Pediatric Critical Surgeries';
  if (alloc === 'water') allocName = 'Clean Water Micro-Plants';
  if (receiptAllocEl) receiptAllocEl.innerText = allocName;

  // Set issue date
  const receiptDateEl = document.getElementById('receiptDate');
  if (receiptDateEl) {
    const today = new Date();
    receiptDateEl.innerText = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // 3. Setup Outpost Dispatch Logs Feed
  const logs = [
    { icon: 'fa-droplet', color: 'var(--accent)', title: 'Jodhpur Outpost #4 RO Cartridge Cleaned', time: '10 mins ago', desc: 'Maintenance team flushed cartridge filters. Turbidity index: 0.12 NTU (Excellent).', preset: 'st_wat_rajas' },
    { icon: 'fa-school', color: 'var(--secondary)', title: 'Odisha School #12 Attendance Verified', time: '1 hour ago', desc: 'Digital registry confirmed 48/48 kids online. Tablets battery status: 92% avg.', preset: 'st_edu_odisha' },
    { icon: 'fa-bowl-rice', color: 'var(--primary)', title: 'Mumbai Kitchen #3 Lunch Hub Dispatched', time: '2 hours ago', desc: '342 plates of nutritious Moong Dal Khichdi served to schoolchildren.', preset: 'st_hun_slums' },
    { icon: 'fa-truck-medical', color: 'var(--red)', title: 'Bihar Clinic Van #2 Sensor Synced', time: '4 hours ago', desc: 'Pediatric camp active. 85 kids scanned. Vaccine cooler temperature stable: 4°C.', preset: 'st_med_camp' }
  ];

  const logsContainer = document.getElementById('dispatchLogs');
  if (logsContainer) {
    logsContainer.innerHTML = logs.map(l => `
      <div style="display:flex; gap:16px; padding:16px; border:1px solid var(--border); background:rgba(255, 255, 255, 0.01); border-radius:var(--radius); align-items:start;">
        <div style="width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,0.02); color:${l.color}; display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0;">
          <i class="fas ${l.icon}"></i>
        </div>
        <div style="flex:1;">
          <div style="display:flex; justify-content:between; align-items:center; margin-bottom:4px; flex-wrap:wrap; gap:10px;">
            <strong style="font-size:0.88rem; color:#fff;">${l.title}</strong>
            <span style="font-size:0.75rem; color:var(--text-muted); margin-left:auto;">${l.time}</span>
          </div>
          <p style="font-size:0.8rem; color:var(--text-sec); line-height:1.5;">${l.desc}</p>
          <button onclick="window.inspectTelemetryPreset('${l.preset}')" style="margin-top:10px; background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:4px; color:var(--primary); cursor:pointer; font-size:0.7rem; padding:4px 8px; display:inline-flex; align-items:center; gap:6px; font-weight:700; transition:all 0.2s;" class="inspect-dispatch-btn">
            <i class="fas fa-satellite"></i> Inspect Outpost
          </button>
        </div>
      </div>
    `).join('');
  }

  // 4. Setup Telemetry Preset Selection & Live Tickers
  let activeTelemetryInterval = null;
  const visualCard = document.getElementById('telemetryVisualCard');
  const metaCard = document.getElementById('telemetryMetaCard');

  const presets = {
    st_wat_rajas: {
      type: 'water',
      title: 'Solar-Powered RO Filtration Plant #4',
      sub: 'Jodhpur District, Rajasthan, India • GPS: 26.2389° N, 73.0243° E',
      gauges: [
        { label: 'Water pH Index', value: '7.2', circleDash: 75.4, cls: '' },
        { label: 'Solar Battery', value: '94%', circleDash: 15, cls: 'secondary' },
        { label: 'RO Filter Life', value: '87%', circleDash: 32, cls: 'accent' }
      ],
      meta: `
        <h4 style="font-family:var(--font-display); font-size:0.85rem; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:#fff; margin-bottom:16px;">Outpost Telemetry Logs</h4>
        <div style="display:flex; flex-direction:column; gap:14px; font-size:0.82rem;">
          <div style="background:rgba(255,255,255,0.01); border:1px solid var(--border); padding:12px 16px; border-radius:var(--radius);">
            <strong style="color:#fff;">Contaminant Index Scan:</strong>
            <p style="color:var(--text-sec); margin-top:4px; line-height:1.6;">Arsenic: &lt;0.001 mg/L (99.9% reduction)<br>Lead: &lt;0.001 mg/L (99.9% reduction)<br>Fluoride: 0.14 mg/L (Safe WHO Limit)</p>
          </div>
          <div style="background:rgba(255,255,255,0.01); border:1px solid var(--border); padding:12px 16px; border-radius:var(--radius);">
            <strong style="color:#fff;">Telemetry Communication:</strong>
            <p style="color:var(--text-sec); margin-top:4px;">Channel: 4G Cellular micro-link<br>Signal strength: -74 dBm (Stable)<br>Sync Rate: 100% (5s interval)</p>
          </div>
          <div style="background:var(--primary-light); border:1px solid rgba(37, 99, 235, 0.25); padding:12px 16px; border-radius:var(--radius); color:var(--primary); line-height:1.5;">
            <i class="fas fa-circle-info"></i> <strong>Audit Compliance:</strong> Cartridge filters are backwashed automatically twice a week. Clean output complies fully with standards.
          </div>
        </div>
      `,
      initCode: () => {
        let litersCount = 24560.8;
        const countEl = document.getElementById('flowCounter');
        if (countEl) countEl.innerText = litersCount.toFixed(1) + ' L';
        
        activeTelemetryInterval = setInterval(() => {
          litersCount += Math.random() * 0.4 + 0.1;
          if (countEl) countEl.innerText = litersCount.toFixed(1) + ' L';
          
          // Randomly fluctuate battery gauge slightly
          const battVal = document.getElementById('gauge-val-Solar-Battery');
          if (battVal) {
            const currentBatt = 94 + (Math.random() > 0.5 ? 0.1 : -0.1);
            battVal.innerText = currentBatt.toFixed(0) + '%';
          }
        }, 1200);
      }
    },
    st_edu_odisha: {
      type: 'education',
      title: 'Digital Classroom Center #12',
      sub: 'Mayurbhanj District, Odisha, India • GPS: 21.9294° N, 86.7513° E',
      gauges: [
        { label: 'Kids Attending', value: '48/48', circleDash: 0, cls: '' },
        { label: 'Tablets Online', value: '16/16', circleDash: 0, cls: 'secondary' },
        { label: 'Tablet Battery', value: '92%', circleDash: 20, cls: 'accent' }
      ],
      meta: `
        <h4 style="font-family:var(--font-display); font-size:0.85rem; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:#fff; margin-bottom:16px;">Classroom Metrics</h4>
        <div style="display:flex; flex-direction:column; gap:14px; font-size:0.82rem;">
          <div style="background:rgba(255,255,255,0.01); border:1px solid var(--border); padding:12px 16px; border-radius:var(--radius);">
            <strong style="color:#fff;">Outpost Infrastructure:</strong>
            <p style="color:var(--text-sec); margin-top:4px; line-height:1.6;">Solar Grid: 2kW Photovoltaic setup<br>Battery backup: 6.4 kWh lithium ion<br>Internet: Starlink Satellite receiver</p>
          </div>
          <div style="background:rgba(255,255,255,0.01); border:1px solid var(--border); padding:12px 16px; border-radius:var(--radius);">
            <strong style="color:#fff;">Curriculum Tracker:</strong>
            <p style="color:var(--text-sec); margin-top:4px;">Active Module: Primary STEM Math & Literacy<br>Local Educator: Elena Rostova (Consultant)<br>Next assessment: Friday Quiz Module</p>
          </div>
        </div>
      `,
      initCode: () => {
        // Render attendance grids and tables
        const visualBox = document.querySelector('#telemetryVisualCard');
        if (!visualBox) return;

        // Keep header, replace body below gauges
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = `
          <div class="telemetry-grid" style="margin-top: 24px; display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
            <div class="svg-chart-container" style="padding:20px;">
              <div class="svg-chart-title">Classroom Attendance Register</div>
              <div class="attendance-calendar-grid">
                ${Array.from({length: 21}, (_, i) => `<div class="attendance-day present">${i+1}</div>`).join('')}
                <div class="attendance-day">22</div>
                <div class="attendance-day">23</div>
                <div class="attendance-day">24</div>
                <div class="attendance-day">25</div>
              </div>
            </div>
            <div class="svg-chart-container" style="padding:20px; overflow:auto; max-height:200px;">
              <div class="svg-chart-title" style="margin-bottom:10px;">Tablet Device Registries</div>
              <table style="width:100%; font-size:0.75rem; border-collapse:collapse;">
                <thead>
                  <tr style="border-bottom:1px solid var(--border); text-align:left; color:var(--text-muted);">
                    <th style="padding:6px 0;">Student</th>
                    <th>Tablet ID</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style="padding:8px 0; color:#fff;">Meera Naik</td><td>TAB-04</td><td style="color:var(--accent);">Active (94%)</td></tr>
                  <tr><td style="padding:8px 0; color:#fff;">Rajesh Das</td><td>TAB-11</td><td style="color:var(--accent);">Active (88%)</td></tr>
                  <tr><td style="padding:8px 0; color:#fff;">Sneha Soren</td><td>TAB-02</td><td style="color:var(--accent);">Active (97%)</td></tr>
                  <tr><td style="padding:8px 0; color:#fff;">Amit Majhi</td><td>TAB-08</td><td style="color:var(--accent);">Active (90%)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        `;
        visualBox.appendChild(contentDiv);
      }
    },
    st_hun_slums: {
      type: 'hunger',
      title: 'ZeroHunger Kitchen Hub #3',
      sub: 'Dharavi Sector, Mumbai, India • GPS: 19.0380° N, 72.8538° E',
      gauges: [
        { label: 'Meals Prepared Today', value: '342 Meals', circleDash: 0, cls: '' },
        { label: 'Energy Density', value: '680 kcal', circleDash: 0, cls: 'secondary' },
        { label: 'Protein Target', value: '15.4%', circleDash: 0, cls: 'accent' }
      ],
      meta: `
        <h4 style="font-family:var(--font-display); font-size:0.85rem; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:#fff; margin-bottom:16px;">Kitchen Records</h4>
        <div style="display:flex; flex-direction:column; gap:14px; font-size:0.82rem;">
          <div style="background:rgba(255,255,255,0.01); border:1px solid var(--border); padding:12px 16px; border-radius:var(--radius);">
            <strong style="color:#fff;">Supply Chain Ledger:</strong>
            <p style="color:var(--text-sec); margin-top:4px; line-height:1.6;">Vendor: Local Maharashtra farm cooperatives<br>Audit inspection: Passed (FDA Clean seal)<br>Water Purifier: UV-micro filtration active</p>
          </div>
          <div style="background:rgba(255,255,255,0.01); border:1px solid var(--border); padding:12px 16px; border-radius:var(--radius);">
            <strong style="color:#fff;">Daily Menu Registry:</strong>
            <p style="color:var(--text-sec); margin-top:4px;">Dish: Moong Dal Khichdi + Steamed Carrots & Apple slices.<br>Dietary: Nut-free, 100% vegetarian, pediatric formulation.</p>
          </div>
        </div>
      `,
      initCode: () => {
        const visualBox = document.querySelector('#telemetryVisualCard');
        if (!visualBox) return;

        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = `
          <div class="telemetry-grid" style="margin-top: 24px; display:grid; grid-template-columns: 1.1fr 0.9fr; gap:20px;">
            <div class="svg-chart-container" style="padding:20px;">
              <div class="svg-chart-title">Ingredient Inventory Levels</div>
              <div class="nutrition-stock-list">
                <div class="stock-item">
                  <div class="stock-info"><span>Grains (Rice)</span><span>820 kg (82%)</span></div>
                  <div class="progress-bar"><div class="progress-fill" style="width: 82%"></div></div>
                </div>
                <div class="stock-item">
                  <div class="stock-info"><span>Lentils (Moong Dal)</span><span>640 kg (64%)</span></div>
                  <div class="progress-bar"><div class="progress-fill stock-fill purple" style="width: 64%"></div></div>
                </div>
                <div class="stock-item">
                  <div class="stock-info"><span>Cooking Oil</span><span>150 Liters (50%)</span></div>
                  <div class="progress-bar"><div class="progress-fill" style="width: 50%; background:var(--accent);"></div></div>
                </div>
              </div>
            </div>
            
            <div class="svg-chart-container" style="padding:20px; display:flex; flex-direction:column; justify-content:center; align-items:center;">
              <div class="svg-chart-title">Caloric Composition</div>
              <svg width="120" height="120" viewBox="0 0 36 36" style="transform: rotate(-90deg);">
                <!-- Ring charts -->
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="3"/>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--primary)" stroke-width="3.2" stroke-dasharray="60 100" stroke-dashoffset="0"/>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--secondary)" stroke-width="3.2" stroke-dasharray="25 100" stroke-dashoffset="-60"/>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--accent)" stroke-width="3.2" stroke-dasharray="15 100" stroke-dashoffset="-85"/>
              </svg>
              <div style="display:flex; gap:10px; font-size:0.68rem; margin-top:10px; flex-wrap:wrap; justify-content:center;">
                <span style="display:inline-flex; align-items:center; gap:4px; color:#fff;"><span style="width:6px; height:6px; background:var(--primary); border-radius:50%;"></span>Carbs (60%)</span>
                <span style="display:inline-flex; align-items:center; gap:4px; color:#fff;"><span style="width:6px; height:6px; background:var(--secondary); border-radius:50%;"></span>Fat (25%)</span>
                <span style="display:inline-flex; align-items:center; gap:4px; color:#fff;"><span style="width:6px; height:6px; background:var(--accent); border-radius:50%;"></span>Protein (15%)</span>
              </div>
            </div>
          </div>
        `;
        visualBox.appendChild(contentDiv);
      }
    },
    st_med_camp: {
      type: 'medical',
      title: 'Pediatric Clinical Outpost #2',
      sub: 'Gaya District, Bihar, India • Coordinates: 24.7955° N, 85.0007° E',
      gauges: [
        { label: 'Patients treated', value: '42 kids', circleDash: 0, cls: '' },
        { label: 'Scans & Lab tests', value: '85 tests', circleDash: 0, cls: 'secondary' },
        { label: 'Vaccines Dispensed', value: '30 doses', circleDash: 0, cls: 'accent' }
      ],
      meta: `
        <h4 style="font-family:var(--font-display); font-size:0.85rem; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:#fff; margin-bottom:16px;">Medical Registry Log</h4>
        <div style="display:flex; flex-direction:column; gap:14px; font-size:0.82rem;">
          <div style="background:rgba(255,255,255,0.01); border:1px solid var(--border); padding:12px 16px; border-radius:var(--radius);">
            <strong style="color:#fff;">Outpost Resources:</strong>
            <p style="color:var(--text-sec); margin-top:4px; line-height:1.6;">Mobile Van: Ford F-550 custom clinical box<br>Testing: Hematology analyzer, ECG panel<br>Cooling: Solar refrigerator (2.4°C stable)</p>
          </div>
          <div style="background:rgba(255,255,255,0.01); border:1px solid var(--border); padding:12px 16px; border-radius:var(--radius);">
            <strong style="color:#fff;">Clinical Operations Squad:</strong>
            <p style="color:var(--text-sec); margin-top:4px;">Chief Pediatrician: Dr. Anita Sharma<br>Nurses assigned: 2 local clinical helpers<br>Focus: Cleft palates, vaccine records</p>
          </div>
        </div>
      `,
      initCode: () => {
        const visualBox = document.querySelector('#telemetryVisualCard');
        if (!visualBox) return;

        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = `
          <div class="telemetry-grid" style="margin-top: 24px; display:grid; grid-template-columns: 1.1fr 0.9fr; gap:20px;">
            <div class="svg-chart-container" style="padding:20px;">
              <div class="svg-chart-title">Pediatric Surgery Tracking (Demo Case)</div>
              <div class="medical-timeline">
                <div class="timeline-step completed">
                  <div class="timeline-step-dot"></div>
                  <div class="timeline-step-body">
                    <div class="timeline-step-title">Patient Admissions & Scan</div>
                    <div class="timeline-step-desc">Aarav (Age 6) diagnosed with congenital ASD heart defect. Vetted 04-Jun-26.</div>
                  </div>
                </div>
                <div class="timeline-step completed">
                  <div class="timeline-step-dot"></div>
                  <div class="timeline-step-body">
                    <div class="timeline-step-title">Clinical Operation Vetted</div>
                    <div class="timeline-step-desc">Operations panel cleared surgery files. Sponsoring hash active.</div>
                  </div>
                </div>
                <div class="timeline-step active">
                  <div class="timeline-step-dot"></div>
                  <div class="timeline-step-body">
                    <div class="timeline-step-title">Surgery Executed</div>
                    <div class="timeline-step-desc">Operation completed successfully by Dr. Anita Sharma at Kochi. Post-op checkups green.</div>
                  </div>
                </div>
                <div class="timeline-step">
                  <div class="timeline-step-dot"></div>
                  <div class="timeline-step-body">
                    <div class="timeline-step-title">Discharged & Safe</div>
                    <div class="timeline-step-desc">Timeline status: In hospital under 72h observations. Recovery forecast: Excellent.</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="svg-chart-container" style="padding:20px; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
              <div style="font-size:2rem; color:var(--primary); margin-bottom:12px;"><i class="fas fa-child-pulse"></i></div>
              <h5 style="color:#fff; font-family:var(--font-display); font-size:0.88rem; margin-bottom:8px;">SURGERY FUND COMPLIANCE</h5>
              <p style="font-size:0.8rem; color:var(--text-sec); line-height:1.6;">Your tracking hash is mapped to pediatric heart operations. Hospital receipts and surgical telemetry records are synchronized here once closed.</p>
            </div>
          </div>
        `;
        visualBox.appendChild(contentDiv);
      }
    }
  };

  function renderTelemetryPreset(presetId) {
    if (activeTelemetryInterval) {
      clearInterval(activeTelemetryInterval);
      activeTelemetryInterval = null;
    }

    const data = presets[presetId];
    if (!data) return;

    // Render Gauges and Visual Area
    visualCard.innerHTML = `
      <div class="telemetry-header">
        <div class="telemetry-header-title">
          <h3>${data.title}</h3>
          <p>${data.sub}</p>
        </div>
        <div class="status-badge live">
          <div class="status-badge-dot"></div> Live Telemetry
        </div>
      </div>

      <div class="gauges-row">
        ${data.gauges.map(g => {
          const isWater = data.type === 'water';
          const drawCircle = isWater ? `
            <svg class="gauge-svg">
              <circle class="gauge-bg-circle" cx="50" cy="50" r="40"/>
              <circle class="gauge-fill-circle" cx="50" cy="50" r="40" style="stroke-dashoffset: ${g.circleDash};"/>
            </svg>
          ` : `
            <div style="width:70px; height:70px; border-radius:50%; background:rgba(255,255,255,0.02); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; margin-bottom:10px; font-size:1.5rem; color:${g.cls === 'secondary' ? 'var(--secondary)' : (g.cls === 'accent' ? 'var(--accent)' : 'var(--primary)')};">
              <i class="fas ${data.type === 'education' ? (g.label.includes('Attending') ? 'fa-children' : (g.label.includes('Online') ? 'fa-tablet-screen-button' : 'fa-battery-three-quarters')) : (data.type === 'hunger' ? (g.label.includes('Prepared') ? 'fa-utensils' : (g.label.includes('Density') ? 'fa-bolt' : 'fa-wheat-awn')) : (g.label.includes('treated') ? 'fa-child-reaching' : (g.label.includes('Scans') ? 'fa-microscope' : 'fa-syringe')))}"></i>
            </div>
          `;

          return `
            <div class="gauge-card ${g.cls}">
              <div class="gauge-wrap" style="${isWater ? '' : 'height:auto; width:auto;'}">
                ${drawCircle}
                <div class="gauge-value" id="gauge-val-${g.label.replace(/\s/g, '-')}" style="${isWater ? '' : 'position:static; margin-top:8px;'}">${g.value}</div>
              </div>
              <div class="gauge-label" style="margin-top:10px;">${g.label}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Render baseline line chart if type is water
    if (data.type === 'water') {
      const chartDiv = document.createElement('div');
      chartDiv.innerHTML = `
        <div class="svg-chart-container">
          <div class="svg-chart-title">Water Dispensed (Last 7 Days in Liters)</div>
          <div style="position: absolute; top: 24px; right: 24px; font-family: var(--font-display); font-size: 1.25rem; font-weight: 850; color: var(--accent);" id="flowCounter">24,560.8 L</div>
          <svg class="chart-svg" viewBox="0 0 500 150">
            <defs>
              <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--primary)"/>
                <stop offset="100%" stop-color="var(--primary)" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <line class="chart-grid-line" x1="0" y1="30" x2="500" y2="30"/>
            <line class="chart-grid-line" x1="0" y1="75" x2="500" y2="75"/>
            <line class="chart-grid-line" x1="0" y1="120" x2="500" y2="120"/>
            <path class="chart-fill" d="M 0 150 L 50 110 L 120 125 L 200 80 L 280 95 L 360 55 L 430 70 L 500 40 L 500 150 Z"/>
            <path class="chart-line" d="M 0 150 L 50 110 L 120 125 L 200 80 L 280 95 L 360 55 L 430 70 L 500 40"/>
            <circle class="chart-dot" cx="50" cy="110"/><circle class="chart-dot" cx="120" cy="125"/><circle class="chart-dot" cx="200" cy="80"/><circle class="chart-dot" cx="280" cy="95"/><circle class="chart-dot" cx="360" cy="55"/><circle class="chart-dot" cx="430" cy="70"/><circle class="chart-dot" cx="500" cy="40"/>
          </svg>
        </div>
      `;
      visualCard.appendChild(chartDiv);
    }

    // Render metadata panel
    metaCard.innerHTML = data.meta;

    // Run custom code (Interval animations / table building)
    if (data.initCode) data.initCode();
  }

  // Hook preset button clicks
  const presetBtns = document.querySelectorAll('.hash-preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTelemetryPreset(btn.getAttribute('data-hash'));
    });
  });

  // Handle donation hash queries
  const hashForm = document.getElementById('hashSearchForm');
  const hashInput = document.getElementById('hashSearchInput');

  if (hashForm && hashInput) {
    hashForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const term = hashInput.value.trim().toLowerCase();
      
      // Clean highlight from buttons
      presetBtns.forEach(b => b.classList.remove('active'));

      if (term.includes('wat') || term.includes('water') || term === 'st_wat_rajas') {
        renderTelemetryPreset('st_wat_rajas');
        presetBtns[0].classList.add('active');
      } else if (term.includes('edu') || term.includes('school') || term === 'st_edu_odisha') {
        renderTelemetryPreset('st_edu_odisha');
        presetBtns[1].classList.add('active');
      } else if (term.includes('hun') || term.includes('meals') || term.includes('kitchen') || term === 'st_hun_slums') {
        renderTelemetryPreset('st_hun_slums');
        presetBtns[2].classList.add('active');
      } else if (term.includes('med') || term.includes('surgery') || term.includes('camp') || term === 'st_med_camp') {
        renderTelemetryPreset('st_med_camp');
        presetBtns[3].classList.add('active');
      } else {
        // If it's a custom hash, check allocation
        const customHash = localStorage.getItem('last_donation_hash');
        if (customHash && term === customHash.toLowerCase()) {
          const proj = localStorage.getItem('last_donation_project') || 'all';
          if (proj === 'water') {
            renderTelemetryPreset('st_wat_rajas');
          } else if (proj === 'education') {
            renderTelemetryPreset('st_edu_odisha');
          } else if (proj === 'medical') {
            renderTelemetryPreset('st_med_camp');
          } else {
            renderTelemetryPreset('st_wat_rajas'); // Baseline Core fallback
          }
        } else {
          alert('Telemetry hash not found in active registries. Attempting link to core outposts...');
          renderTelemetryPreset('st_wat_rajas');
          presetBtns[0].classList.add('active');
        }
      }
    });
  }

  // Load baseline preset on load
  if (visualCard) {
    // Check if query parameters has a hash
    const urlParams = new URLSearchParams(window.location.search);
    const hashParam = urlParams.get('hash');
    
    if (hashParam) {
      // Direct user to telemetry tab
      const tabTelemetryMenu = document.getElementById('telemetryTabMenu');
      if (tabTelemetryMenu) tabTelemetryMenu.click();
      
      if (hashInput) hashInput.value = hashParam;
      
      // Select appropriate preset
      presetBtns.forEach(b => b.classList.remove('active'));
      const proj = localStorage.getItem('last_donation_project') || 'all';
      if (proj === 'water') {
        renderTelemetryPreset('st_wat_rajas');
        if (presetBtns[0]) presetBtns[0].classList.add('active');
      } else if (proj === 'education') {
        renderTelemetryPreset('st_edu_odisha');
        if (presetBtns[1]) presetBtns[1].classList.add('active');
      } else if (proj === 'medical') {
        renderTelemetryPreset('st_med_camp');
        if (presetBtns[3]) presetBtns[3].classList.add('active');
      } else {
        renderTelemetryPreset('st_wat_rajas');
        if (presetBtns[0]) presetBtns[0].classList.add('active');
      }
    } else {
      renderTelemetryPreset('st_wat_rajas');
    }
  }

  // 5. Setup Volunteer Panel Data
  const isVol = localStorage.getItem('volunteer_registered') === 'true';
  const volPanel = document.getElementById('volunteerStatusPanel');
  const hoursCard = document.getElementById('hoursLoggerCard');
  const shiftList = document.getElementById('shiftScheduleList');

  if (isVol) {
    const vSquad = localStorage.getItem('volunteer_squad') || 'Education Squad';
    const vHours = parseInt(localStorage.getItem('volunteer_hours')) || 0;
    const vAvail = localStorage.getItem('volunteer_availability') || 'Weekends Only';
    
    // Update Overview Card value
    const statSquadEl = document.getElementById('stat-squad');
    const statSquadDescEl = document.getElementById('stat-squad-desc');
    if (statSquadEl) statSquadEl.innerText = vSquad.split(' ')[0] + ' Squad';
    if (statSquadDescEl) statSquadDescEl.innerText = `Availability: ${vAvail}`;

    // Render active squad details
    if (volPanel) {
      volPanel.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; justify-content:between; align-items:center;">
            <div>
              <h4 style="font-family:var(--font-display); font-size:1.05rem; font-weight:700; color:#fff;">${vSquad}</h4>
              <span style="font-size:0.75rem; color:var(--primary); font-weight:700; text-transform:uppercase; letter-spacing:1px;">Active Squad Member</span>
            </div>
            <div style="font-size:1.8rem; color:var(--primary);"><i class="fas fa-award"></i></div>
          </div>
          
          <div class="telemetry-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-top:10px;">
            <div style="background:rgba(255,255,255,0.01); border:1px solid var(--border); padding:12px; border-radius:var(--radius);">
              <span style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase; display:block;">Service Log Hours</span>
              <strong style="font-family:var(--font-display); font-size:1.25rem; color:#fff; display:block; margin-top:4px;" id="hoursDisplay">${vHours} Hours</strong>
            </div>
            <div style="background:rgba(255,255,255,0.01); border:1px solid var(--border); padding:12px; border-radius:var(--radius);">
              <span style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase; display:block;">Squad Duty Status</span>
              <strong style="font-family:var(--font-display); font-size:1.25rem; color:var(--accent); display:block; margin-top:4px;">STANDBY</strong>
            </div>
          </div>

          <div style="margin-top:10px;">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-sec); margin-bottom:6px;">
              <span>Squad Level Token Certificate progress</span>
              <span id="progressPct">${Math.min(vHours * 4, 100)}%</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" id="progressFill" style="width: ${Math.min(vHours * 4, 100)}%"></div></div>
          </div>
        </div>
      `;
    }

    // Render shifts
    if (shiftList) {
      let shiftSquadName = 'Outpost #12 Classroom (STEM Tab Tutor)';
      let squadVal = localStorage.getItem('volunteer_squad_val');
      if (squadVal === 'medical') shiftSquadName = 'District Outpost #2 Clinic Camp helper';
      if (squadVal === 'water') shiftSquadName = 'Jodhpur RO Station Cartridge Audit';
      if (squadVal === 'hunger') shiftSquadName = 'ZeroHunger Slums Kitchen Ingredient Stock';

      shiftList.innerHTML = `
        <div class="schedule-card">
          <div class="schedule-details">
            <h5>${shiftSquadName}</h5>
            <p>Date: Sat, 13-Jun-26 • Time: 09:30 AM - 01:30 PM</p>
          </div>
          <span class="schedule-shift-badge">Assigned</span>
        </div>
        <div class="schedule-card" style="opacity:0.6;">
          <div class="schedule-details">
            <h5>Monthly Squad Council Briefing</h5>
            <p>Date: Wed, 24-Jun-26 • Time: 07:00 PM (Google Meet)</p>
          </div>
          <span class="schedule-shift-badge" style="background:rgba(255,255,255,0.03); color:var(--text-sec); border-color:var(--border);">Online</span>
        </div>
      `;
    }

    if (hoursCard) hoursCard.style.display = 'block';

  } else {
    // If not registered as volunteer
    if (volPanel) {
      volPanel.innerHTML = `
        <div style="text-align:center; padding:20px 10px;">
          <div style="font-size:2.2rem; color:var(--text-muted); margin-bottom:14px;"><i class="fas fa-hands-holding"></i></div>
          <h4 style="font-family:var(--font-display); font-size:0.95rem; font-weight:700; color:#fff; margin-bottom:8px;">No Field Squad Registered</h4>
          <p style="color:var(--text-sec); font-size:0.82rem; line-height:1.6; margin-bottom:20px;">You are not enrolled in a volunteer field squad. Tutoring programs, health clinics, and kitchen groups require onboarding verification.</p>
          <a href="404.html" class="btn btn-primary btn-sm"><i class="fas fa-handshake-angle"></i> Enlist in a Squad</a>
        </div>
      `;
    }
    if (hoursCard) hoursCard.style.display = 'none';
    if (shiftList) {
      shiftList.innerHTML = `
        <div style="text-align:center; color:var(--text-muted); font-size:0.85rem; padding:40px 0;">
          <i class="fas fa-lock" style="font-size:1.5rem; margin-bottom:12px; display:block;"></i>
          Sign up for a squad to view assignments.
        </div>
      `;
    }
  }

  // Volunteer Log Hours Form Submission
  const hoursForm = document.getElementById('logHoursForm');
  const hoursInput = document.getElementById('logHoursInput');
  const activityInput = document.getElementById('logActivityInput');

  if (hoursForm && hoursInput && activityInput) {
    hoursForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newHrs = parseInt(hoursInput.value) || 0;
      const activity = activityInput.value.trim();
      const currentHrs = parseInt(localStorage.getItem('volunteer_hours')) || 0;
      const updatedHrs = currentHrs + newHrs;
      
      localStorage.setItem('volunteer_hours', updatedHrs);

      // Sync hours back to registered_users list
      const uEmail = localStorage.getItem('careportal_user_email');
      if (uEmail) {
        let users = [];
        try {
          users = JSON.parse(localStorage.getItem('registered_users')) || [];
        } catch (err) {
          users = [];
        }
        const userObj = users.find(u => u.email === uEmail.toLowerCase());
        if (userObj) {
          userObj.hours = updatedHrs;
          localStorage.setItem('registered_users', JSON.stringify(users));
        }
      }
      
      // Update UI elements instantly
      const hoursDispEl = document.getElementById('hoursDisplay');
      if (hoursDispEl) hoursDispEl.innerText = updatedHrs + ' Hours';
      
      const pct = Math.min(updatedHrs * 4, 100);
      const progressPctEl = document.getElementById('progressPct');
      const progressFillEl = document.getElementById('progressFill');
      if (progressPctEl) progressPctEl.innerText = pct + '%';
      if (progressFillEl) progressFillEl.style.width = pct + '%';

      alert(`Hours logged! ${newHrs} hours added for: "${activity}". Thank you for your service!`);
      hoursForm.reset();
    });
  }

  // 6. Download Receipt PDF Certificate
  const downloadBtn = document.getElementById('downloadReceiptBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const receiptContent = `
============================================================
              STACKLY GLOBAL FOUNDATION
          OFFICIAL TAX EXEMPTION CERTIFICATE
              SECTION 80G INCOME TAX ACT
============================================================

Registration Details: Registered 501(c)(3) Nonprofit
Date Issued: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
Certificate Hash Reference: ${hash}

------------------------------------------------------------
DONOR DETAILS
------------------------------------------------------------
Donor Name: ${uName}
Email Address: ${localStorage.getItem('careportal_user_email') || 'supporter@stackly.org'}
Contribution Amount: ₹${amt.toLocaleString()}
Contribution Stream: ${freq.toUpperCase()}
Allocation Outpost: ${allocName}

------------------------------------------------------------
COMPLIANCE & AUDIT STATUS
------------------------------------------------------------
Stackly Global audits guarantee that 94.2% of all donations
finance local village outposts directly. Contributions are 
exempt from taxation audits under active government approvals.

Authorized Signatory,
Stackly Global Audit Registry
Kochi Outpost Hub, India.
============================================================
`;
      
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Stackly_80G_Receipt_${hash}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('Mock PDF/Text Receipt successfully generated and downloaded!');
    });
  }

  // 7. Sign Out Hook
  const signOutBtn = document.getElementById('portalSignOut');
  const topLogoutBtn = document.getElementById('portalTopLogoutBtn');
  
  const handleLogout = () => {
    localStorage.removeItem('careportal_logged_in');
    localStorage.removeItem('last_donation_hash');
    localStorage.removeItem('last_donation_amount');
    localStorage.removeItem('last_donation_project');
    localStorage.removeItem('last_donation_frequency');
    localStorage.removeItem('volunteer_registered');
    localStorage.removeItem('volunteer_squad');
    localStorage.removeItem('volunteer_squad_val');
    localStorage.removeItem('volunteer_availability');
    localStorage.removeItem('volunteer_hours');
    
    alert('You have successfully logged out. Secure session terminated.');
    window.location.replace('login.html');
  };

  // 5. Populate Dynamic Role privileges section
  const roleIconBadge = document.getElementById('roleIconBadge');
  const roleStatusBadge = document.getElementById('roleStatusBadge');
  const roleClearanceList = document.getElementById('roleClearanceList');
  const roleMilestoneContent = document.getElementById('roleMilestoneContent');

  if (roleStatusBadge) {
    const normalizedRole = uRole.trim();
    roleStatusBadge.innerText = normalizedRole;

    let iconHtml = '<i class="fas fa-user-astronaut"></i>';
    let badgeBg = 'rgba(37,99,235,0.1)';
    let badgeColor = 'var(--primary)';
    let badgeBorder = 'rgba(37,99,235,0.2)';
    let clearances = [];
    let milestoneHtml = '';

    if (normalizedRole.includes('Volunteer')) {
      iconHtml = '<i class="fas fa-hands-holding"></i>';
      badgeBg = 'rgba(6, 182, 212, 0.12)';
      badgeColor = 'var(--secondary)';
      badgeBorder = 'rgba(6, 182, 212, 0.2)';
      
      const vHours = localStorage.getItem('volunteer_hours') || '12';
      const vSquad = localStorage.getItem('volunteer_squad') || 'Education Squad';
      const progressPercent = Math.min(Math.round((parseInt(vHours) || 0) / 20 * 100), 100);

      clearances = [
        { active: true, title: 'Shift Scheduling & Deployment Ledger', desc: 'Authorized to select open slots and view assignments.' },
        { active: true, title: 'Field Service Hours Logger', desc: 'Allowed to submit hours for community verification.' },
        { active: true, title: 'District Squad Communications', desc: 'Granted access to local coordinator team chat.' },
        { active: false, title: 'Financial Audit Signature Authority', desc: 'Restricted to system administrators and lead auditors.' }
      ];

      milestoneHtml = `
        <div style="background:rgba(255,255,255,0.01); border:1px solid var(--border); padding:16px; border-radius:var(--radius); margin-bottom:16px;">
          <div style="width:100%; height:110px; border-radius:var(--radius); overflow:hidden; margin-bottom:12px; border:1px solid var(--border);"><img src="images/volunteer_hero1.webp" alt="Volunteer Work" style="width:100%; height:100%; object-fit:cover;"/></div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <strong style="color:#fff; font-size:0.85rem;"><i class="fas fa-trophy" style="color:#F59E0B; margin-right:6px;"></i> Silver Service Star</strong>
            <span style="font-size:0.75rem; color:var(--text-sec); font-weight:700;">${vHours} / 20 Hours</span>
          </div>
          <div style="width:100%; height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden; margin-bottom:12px;">
            <div style="width:${progressPercent}%; height:100%; background:linear-gradient(to right, var(--primary), var(--secondary)); border-radius:3px;"></div>
          </div>
          <p style="font-size:0.78rem; color:var(--text-sec); line-height:1.5; margin:0;">You are currently assigned to the <strong>${vSquad}</strong>. Log 20 total service hours to receive your cryptographic silver badge and lead volunteer privileges.</p>
        </div>
        <button onclick="document.querySelector('[data-tab=volunteer]').click(); setTimeout(() => { document.getElementById('hoursLoggerCard')?.scrollIntoView({ behavior: 'smooth' }); }, 150);" class="btn btn-cyan btn-sm" style="width:100%; justify-content:center;"><i class="fas fa-stopwatch"></i> Log Service Hours</button>
      `;

    } else if (normalizedRole.includes('Donor')) {
      iconHtml = '<i class="fas fa-hand-holding-heart"></i>';
      badgeBg = 'rgba(16, 185, 129, 0.12)';
      badgeColor = '#10B981';
      badgeBorder = 'rgba(16, 185, 129, 0.2)';

      clearances = [
        { active: true, title: 'Outpost Telemetry Sync & Tracking', desc: 'Real-time sensor payload decryption keys active.' },
        { active: true, title: 'Section 80G Auto-Exemption Generator', desc: 'Download cryptographically signed tax receipts.' },
        { active: true, title: 'Direct Allocation Ledger Auditing', desc: 'Trace transactions to local purchase orders.' },
        { active: false, title: 'Field Operations Shift Sign-off', desc: 'Requires active field-squad registration and site training.' }
      ];

      milestoneHtml = `
        <div style="background:rgba(255,255,255,0.01); border:1px solid var(--border); padding:16px; border-radius:var(--radius); margin-bottom:16px;">
          <div style="width:100%; height:110px; border-radius:var(--radius); overflow:hidden; margin-bottom:12px; border:1px solid var(--border);"><img src="images/prog_solar_water.webp" alt="Clean Water Station" style="width:100%; height:100%; object-fit:cover;"/></div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <strong style="color:#fff; font-size:0.85rem;"><i class="fas fa-award" style="color:#F59E0B; margin-right:6px;"></i> Stackly Patron Level II</strong>
            <span style="font-size:0.75rem; color:var(--text-sec); font-weight:700;">1 / 3 Outposts</span>
          </div>
          <div style="width:100%; height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden; margin-bottom:12px;">
            <div style="width:33%; height:100%; background:linear-gradient(to right, #10B981, var(--primary)); border-radius:3px;"></div>
          </div>
          <p style="font-size:0.78rem; color:var(--text-sec); line-height:1.5; margin:0;">Sponsor 2 additional outposts (clean water, medical clinic, or learning) to level up your status. Level II Patrons are featured on the public donor recognition board.</p>
        </div>
        <a href="404.html" class="btn btn-primary btn-sm" style="width:100%; justify-content:center; text-decoration:none; color:#fff; display:flex;"><i class="fas fa-heart"></i> Expand Your Support</a>
      `;

    } else if (normalizedRole.includes('Auditor') || normalizedRole.includes('Audit')) {
      iconHtml = '<i class="fas fa-fingerprint"></i>';
      badgeBg = 'rgba(245, 158, 11, 0.12)';
      badgeColor = '#F59E0B';
      badgeBorder = 'rgba(245, 158, 11, 0.2)';

      clearances = [
        { active: true, title: 'Double-Entry Cryptographic Ledger Verification', desc: 'Read-access to all transaction and itemization schemas.' },
        { active: true, title: 'Live Hash Inspection & Verification Tool', desc: 'Search and inspect custom block signatures.' },
        { active: true, title: 'System Security Log Analysis', desc: 'Audit API request and synchronization patterns.' },
        { active: true, title: 'Tax Authority Report Certification', desc: 'Authorized to digitally countersign compliance forms.' }
      ];

      milestoneHtml = `
        <div style="background:rgba(255,255,255,0.01); border:1px solid var(--border); padding:16px; border-radius:var(--radius); margin-bottom:16px;">
          <div style="width:100%; height:110px; border-radius:var(--radius); overflow:hidden; margin-bottom:12px; border:1px solid var(--border);"><img src="images/telemetry_data.webp" alt="Telemetry Audits" style="width:100%; height:100%; object-fit:cover;"/></div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <strong style="color:#fff; font-size:0.85rem;"><i class="fas fa-shield-halved" style="color:#10B981; margin-right:6px;"></i> Cryptographic Audit Sync</strong>
            <span style="font-size:0.75rem; color:#10B981; font-weight:700;">100% Verified</span>
          </div>
          <div style="width:100%; height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden; margin-bottom:12px;">
            <div style="width:100%; height:100%; background:#10B981; border-radius:3px;"></div>
          </div>
          <p style="font-size:0.78rem; color:var(--text-sec); line-height:1.5; margin:0;">All 4 active outpost telemetry hashes correspond perfectly to resource distribution registries. Annual Section 80G tax auditing is marked verified.</p>
        </div>
        <button onclick="window.location.href='404.html'" class="btn btn-outline btn-sm" style="width:100%; justify-content:center; border:1px solid var(--border); color:#fff;"><i class="fas fa-search"></i> Inspect Active Hashes</button>
      `;

    } else {
      iconHtml = '<i class="fas fa-user-astronaut"></i>';
      badgeBg = 'rgba(255, 255, 255, 0.05)';
      badgeColor = 'var(--text-sec)';
      badgeBorder = 'rgba(255, 255, 255, 0.1)';

      clearances = [
        { active: true, title: 'General System Dashboard Access', desc: 'Review core impact metrics and public telemetry.' },
        { active: true, title: 'Public Audit Ledger Verification', desc: 'Analyze year-end financial disclosures.' },
        { active: false, title: 'Dedicated Outpost Telemetry Keys', desc: 'Locks active. Contribution/Sponsorship required.' },
        { active: false, title: 'Active Field Squad Access', desc: 'Locks active. Volunteer registration required.' }
      ];

      milestoneHtml = `
        <div style="background:rgba(255,255,255,0.01); border:1px solid var(--border); padding:16px; border-radius:var(--radius); margin-bottom:16px;">
          <div style="width:100%; height:110px; border-radius:var(--radius); overflow:hidden; margin-bottom:12px; border:1px solid var(--border);"><img src="images/home_pillar_water.webp" alt="Community Outpost" style="width:100%; height:100%; object-fit:cover;"/></div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <strong style="color:#fff; font-size:0.85rem;"><i class="fas fa-circle-question" style="color:var(--primary); margin-right:6px;"></i> Community Member</strong>
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">Level 1</span>
          </div>
          <div style="width:100%; height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden; margin-bottom:12px;">
            <div style="width:10%; height:100%; background:var(--primary); border-radius:3px;"></div>
          </div>
          <p style="font-size:0.78rem; color:var(--text-sec); line-height:1.5; margin:0;">Unlock deep monitoring integrations, volunteer squad sheets, and cryptographic tax receipts by getting involved in field operations or sponsoring an outpost.</p>
        </div>
        <div style="display:flex; gap:10px;">
          <a href="donate.html" class="btn btn-primary btn-sm" style="flex:1; justify-content:center; text-decoration:none; color:#fff; display:flex;"><i class="fas fa-bolt"></i> Donate</a>
          <button onclick="document.querySelector('[data-tab=volunteer]').click();" class="btn btn-cyan btn-sm" style="flex:1; justify-content:center;"><i class="fas fa-user-plus"></i> Volunteer</button>
        </div>
      `;
    }

    if (roleIconBadge) {
      roleIconBadge.innerHTML = iconHtml;
      roleIconBadge.style.backgroundColor = badgeBg;
      roleIconBadge.style.color = badgeColor;
    }

    roleStatusBadge.style.backgroundColor = badgeBg;
    roleStatusBadge.style.color = badgeColor;
    roleStatusBadge.style.borderColor = badgeBorder;

    if (roleClearanceList) {
      roleClearanceList.innerHTML = clearances.map(c => `
        <div style="display:flex; gap:12px; align-items:start; padding:10px; background:rgba(255, 255, 255, 0.01); border:1px solid var(--border); border-radius:var(--radius);">
          <div style="color:${c.active ? '#10B981' : 'var(--text-muted)'}; margin-top:3px; font-size:0.95rem; width:20px; text-align:center;">
            <i class="fas ${c.active ? 'fa-circle-check' : 'fa-circle-minus'}"></i>
          </div>
          <div style="flex:1;">
            <div style="font-size:0.82rem; font-weight:700; color:${c.active ? '#fff' : 'var(--text-muted)'}; text-transform:uppercase; letter-spacing:0.5px;">${c.title}</div>
            <p style="font-size:0.75rem; color:var(--text-sec); margin:2px 0 0 0; line-height:1.4;">${c.desc}</p>
          </div>
        </div>
      `).join('');
    }

    if (roleMilestoneContent) {
      roleMilestoneContent.innerHTML = milestoneHtml;
    }
  }

  // 6. Bind Inspect Button Actions
  window.inspectTelemetryPreset = function(preset) {
    const telemetryTabMenu = document.getElementById('telemetryTabMenu');
    if (telemetryTabMenu) {
      telemetryTabMenu.click();
    }
    
    // Attempt preset click
    const presetBtn = document.querySelector(`.hash-preset-btn[data-hash="${preset}"]`);
    if (presetBtn) {
      presetBtn.click();
    } else {
      // Custom hash fallback
      const hashInput = document.getElementById('hashSearchInput');
      const hashForm = document.getElementById('hashSearchForm');
      if (hashInput && hashForm) {
        hashInput.value = preset;
        hashForm.dispatchEvent(new Event('submit'));
      }
    }
  };

  const inspectReceiptHashBtn = document.getElementById('inspectReceiptHashBtn');
  if (inspectReceiptHashBtn) {
    inspectReceiptHashBtn.addEventListener('click', () => {
      const hashValEl = document.getElementById('receiptHashVal');
      if (hashValEl) {
        window.inspectTelemetryPreset(hashValEl.innerText.trim());
      }
    });
  }

  if (signOutBtn) signOutBtn.addEventListener('click', handleLogout);
  if (topLogoutBtn) topLogoutBtn.addEventListener('click', handleLogout);
}

// ── Floating Navigation Controller ────────────────────────────────────
function initFloatingNav() {
  const isDashboard = window.location.pathname.includes('portal.html');
  // Disable floating nav on dashboard to prevent overlap with sidebar
  if (isDashboard || document.querySelector('.floating-nav-control')) return;

  const widget = document.createElement('div');
  widget.className = 'floating-nav-control';
  
  widget.innerHTML = `
    <div class="floating-nav-btn" id="floatingGoBackBtn"><i class="fas fa-arrow-left"></i> Go Back</div>
    <a href="index.html" class="floating-nav-btn"><i class="fas fa-home"></i> Home</a>
  `;

  document.body.appendChild(widget);

  const backBtn = document.getElementById('floatingGoBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (document.referrer) {
        window.history.back();
      } else {
        window.location.href = 'index.html';
      }
    });
  }
}

// ── 3D Tilt Effect for Glass Cards ─────────────────────────────────────
function initTiltEffect() {
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const width = rect.width;
      const height = rect.height;
      
      const rotateX = ((y / height) - 0.5) * -12; // tilt angle range: -6deg to +6deg
      const rotateY = ((x / width) - 0.5) * 12;
      
      card.style.transform = `perspective(1000px) translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.boxShadow = `0 20px 45px -10px rgba(0, 0, 0, 0.85), 0 0 25px rgba(37, 99, 235, 0.15)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

// ── Magnetic CTA Buttons ──────────────────────────────────────────────
function initMagneticButtons() {
  const btns = document.querySelectorAll('.btn-primary, .btn-cyan, .btn-outline');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      // Pull button 22% of mouse distance
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px) scale(1.03)`;
      btn.style.boxShadow = `0 8px 30px rgba(37, 99, 235, 0.35)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.boxShadow = '';
    });
  });
}

// ── Scroll Progress Indicator ─────────────────────────────────────────
function initScrollProgress() {
  const progressEl = document.createElement('div');
  progressEl.id = 'scroll-progress';
  progressEl.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    width: 0%;
    background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent));
    z-index: 10001;
    transition: width 0.1s ease-out;
  `;
  document.body.appendChild(progressEl);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrolled / maxScroll) * 100;
    progressEl.style.width = progress + '%';
  });
}

// ── Text Typing Animation ─────────────────────────────────────────────
function initTextTyping() {
  const typeElements = document.querySelectorAll('[data-typewriter]');
  typeElements.forEach(el => {
    const text = el.innerText;
    el.innerText = '';
    let index = 0;
    const typingSpeed = el.getAttribute('data-type-speed') || 80;

    function typeChar() {
      if (index < text.length) {
        el.innerText += text.charAt(index);
        index++;
        setTimeout(typeChar, typingSpeed);
      }
    }
    typeChar();
  });
}

// ── Mouse Parallax Effect ────────────────────────────────────────────
function initMouseParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length > 0) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;

      parallaxElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 20;
        el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }
}

