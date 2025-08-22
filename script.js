// Performance optimization: Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Wait for DOM to be fully loaded
// Note: Client-side portfolio code - no server authorization required
document.addEventListener("DOMContentLoaded", function () {
  // Client-side UI initialization - no authorization needed
  initSmoothScrolling();
  initNavbarScroll();
  initContactForm();
  initScrollAnimations();
  initTypingEffect();
  initPreloader();
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70;

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });

        // Close mobile menu if open
        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (
          navbarCollapse &&
          navbarCollapse.classList.contains("show") &&
          typeof bootstrap !== "undefined"
        ) {
          try {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
          } catch (error) {
            console.warn("Bootstrap Collapse initialization failed:", error);
          }
        }
      }
    });
  });
}

// Navbar scroll effect
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const handleScroll = debounce(function () {
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(255, 255, 255, 0.98)";
      navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.95)";
      navbar.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
    }
    updateActiveNavLink();
  }, 100);

  window.addEventListener("scroll", handleScroll);
}

// Contact form handling
function initContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector('button[type="submit"]');
      if (!submitBtn) return;

      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual form handling)
      setTimeout(() => {
        showNotification("Message sent successfully!", "success");
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }
}

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";

        if (entry.target.classList.contains("stat-item")) {
          animateCounter(entry.target);
        }

        if (entry.target.classList.contains("skill-category")) {
          entry.target.style.animationDelay = index * 0.1 + "s";
          entry.target.classList.add("animate-in");
        }
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll(
    ".project-card, .skill-category, .stat-item, .about-content"
  );
  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.6s ease";
    observer.observe(el);
  });
}

// Counter animation for stats
function animateCounter(element) {
  const h3Element = element.querySelector("h3");
  if (!h3Element) return;

  const target = parseInt(h3Element.textContent, 10);
  const duration = 2000;
  const startTime = Date.now();

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(target * progress);

    h3Element.textContent = current + (target > 10 ? "+" : "");

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
}

// Typing effect for hero subtitle
function initTypingEffect() {
  const subtitle = document.querySelector(".hero-subtitle");
  if (!subtitle) return;

  const texts = [
    "Full-Stack Developer",
    "Problem Solver",
    "Tech Enthusiast",
    "Code Craftsman",
  ];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeoutId;

  function typeEffect() {
    if (!subtitle.parentNode) {
      clearTimeout(timeoutId);
      return;
    }

    const currentText = texts[textIndex];

    if (isDeleting) {
      subtitle.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      subtitle.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typeSpeed = 500;
    }

    timeoutId = setTimeout(typeEffect, typeSpeed);
  }

  timeoutId = setTimeout(typeEffect, 1000);
}

// Utility function to show notifications
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  const validTypes = ["success", "info", "warning", "danger"];
  const alertType = validTypes.includes(type) ? type : "info";

  notification.className = `alert alert-${alertType} position-fixed`;
  notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

  // Sanitize message to prevent XSS
  const textNode = document.createTextNode(String(message));
  notification.appendChild(textNode);

  document.body.appendChild(notification);

  const showTimeout = setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(0)";
  }, 100);

  const hideTimeout = setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
    const removeTimeout = setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

// Navbar active link highlighting
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  let current = "";

  for (const section of sections) {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
      break;
    }
  }

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

// Preloader (optional)
function initPreloader() {
  const preloader = document.createElement("div");
  preloader.id = "preloader";

  // Create elements safely to prevent XSS
  const container = document.createElement("div");
  container.className =
    "d-flex justify-content-center align-items-center h-100";

  const spinner = document.createElement("div");
  spinner.className = "spinner-border text-primary";
  spinner.setAttribute("role", "status");

  const hiddenText = document.createElement("span");
  hiddenText.className = "visually-hidden";
  hiddenText.textContent = "Loading...";

  spinner.appendChild(hiddenText);
  container.appendChild(spinner);
  preloader.appendChild(container);
  preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;

  document.body.appendChild(preloader);

  // Client-side preloader removal - no authorization needed
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.style.opacity = "0";
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 500);
    }, 500);
  });
}

// Add some interactive features
document.addEventListener(
  "mousemove",
  debounce(function (e) {
    const hero = document.querySelector(".hero-section");
    if (hero) {
      const rect = hero.getBoundingClientRect();
      if (rect.top <= 0 && rect.bottom >= 0) {
        requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth) * 100;
          const y = (e.clientY / window.innerHeight) * 100;
          hero.style.backgroundPosition = `${x}% ${y}%`;
        });
      }
    }
  }, 16)
);

// Keyboard navigation
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    const navbarCollapse = document.querySelector(".navbar-collapse.show");
    if (navbarCollapse && typeof bootstrap !== "undefined") {
      try {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      } catch (error) {
        console.warn("Bootstrap Collapse initialization failed:", error);
      }
    }
  }
});

// Note: Scroll handling is now consolidated in initNavbarScroll function
console.log("Portfolio JavaScript loaded successfully!");
// Cleanup function for page unload
window.addEventListener("beforeunload", function () {
  // Clear any running timeouts/intervals
  const highestTimeoutId = setTimeout(() => {}, 0);
  for (let i = 0; i < highestTimeoutId; i++) {
    clearTimeout(i);
  }
});
