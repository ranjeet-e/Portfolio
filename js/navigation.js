// navigation.js — scroll-to-section nav, ScrollSpy intersection observer, back to top, and footer date

function wireScrollNav(selector) {
  document.querySelectorAll(selector).forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.dataset.scroll;
      const target = document.getElementById(targetId);
      if (target) {
        const navHeight = document.querySelector('.topnav')?.offsetHeight || 60;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

wireScrollNav('.sb-nav a');
wireScrollNav('.tn-link');

// ScrollSpy — highlight nav items as sections scroll into view
const sections = document.querySelectorAll('main > section');
const tnLinks = document.querySelectorAll('.tn-link');
const sbLinks = document.querySelectorAll('.sb-nav a');

const observerOptions = {
  root: null,
  rootMargin: '-20% 0px -60% 0px',
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const currentId = entry.target.getAttribute('id');
      
      tnLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.scroll === currentId);
      });
      
      sbLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.scroll === currentId);
      });
    }
  });
}, observerOptions);

sections.forEach(sec => observer.observe(sec));

// Back to Top button
const backToTopBtn = document.getElementById('backToTopBtn');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Footer date (MM/DD/YY, updates on load)
const footDate = document.getElementById('footDate');
if (footDate) {
  footDate.textContent = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());
}

