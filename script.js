const animatedItems = document.querySelectorAll("[data-animate]");
const parallaxItems = document.querySelectorAll('[data-animate="parallax"]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  }
);

animatedItems.forEach((item) => {
  if (item.dataset.animate !== "parallax") {
    observer.observe(item);
  }
});

const updateParallax = () => {
  parallaxItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const distance = rect.top + rect.height / 2 - viewportCenter;
    const translateY = distance * -0.06;
    const rotate = distance * -0.003;

    item.style.transform = `translate3d(0, ${translateY}px, 0) rotate(${rotate}deg)`;
  });
};

let ticking = false;

const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
};

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updateParallax);
window.addEventListener("load", updateParallax);

// Floating Header Bar Functionality
const floatingHeader = document.querySelector(".floating-header");
const ctaButton = document.querySelector(".cta-button");
const contactForm = document.getElementById("contactForm");

// Smooth scroll for nav links
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.querySelector(
        `[data-animate*="${targetId}"], section:has(${href}), #${targetId}`
      );
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

// CTA Button click handler - scroll to contact form
ctaButton.addEventListener("click", () => {
  const contactSection = document.querySelector(".panel-contact");
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: "smooth" });
    document.getElementById("name").focus();
  }
});

// Contact Form Submission
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Collect form data
    const formData = new FormData(contactForm);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };
    
    // Simulate form submission
    console.log("Form submitted:", data);
    
    // Show success message
    const submitButton = contactForm.querySelector(".form-submit");
    const originalText = submitButton.textContent;
    submitButton.textContent = "Message Sent!";
    submitButton.style.background = "linear-gradient(135deg, #4CAF50, #45a049)";
    
    // Reset form
    contactForm.reset();
    
    // Restore button after 3 seconds
    setTimeout(() => {
      submitButton.textContent = originalText;
      submitButton.style.background = "linear-gradient(135deg, var(--accent), #a65c32)";
    }, 3000);
  });
}

// Hide/show header on scroll with floating position
let lastScrollTop = 0;
const headerHeight = floatingHeader?.offsetHeight || 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  
  if (floatingHeader) {
    if (currentScroll > 100) {
      if (currentScroll > lastScrollTop) {
        // Scrolling down - hide header
        floatingHeader.style.transform = "translateX(-50%) translateY(-120px)";
        floatingHeader.style.opacity = "0";
        floatingHeader.style.pointerEvents = "none";
      } else {
        // Scrolling up - show header
        floatingHeader.style.transform = "translateX(-50%) translateY(0)";
        floatingHeader.style.opacity = "1";
        floatingHeader.style.pointerEvents = "auto";
      }
    } else {
      // At top of page
      floatingHeader.style.transform = "translateX(-50%) translateY(0)";
      floatingHeader.style.opacity = "1";
      floatingHeader.style.pointerEvents = "auto";
    }
  }
  
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, { passive: true });

