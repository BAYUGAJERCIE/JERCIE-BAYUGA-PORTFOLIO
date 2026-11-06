'use strict';

document.documentElement.classList.add('js');

const projects = {
  acadlearn: {
    category: 'Learning Management System',
    title: 'AcadLearn',
    image: 'assets/acadlearn-logo.png',
    imageAlt: 'PHINMA Araullo University logo for AcadLearn',
    overview: 'An academic project focused on creating a learning management platform that helps organize educational content and provides students with an accessible digital learning environment.',
    role: 'UI Design',
    tools: 'HTML and CSS.',
    focus: ['Organize educational content.', 'Support an accessible digital learning environment.']
  },
  furniture: {
    category: 'Furniture Interactive Application',
    title: 'F.R. Ocampo Furniture',
    overview: 'An online furniture catalog and inquiry system where customers can browse designs, product descriptions, prices, and availability, view product details, and send inquiries. It also helps F.R. Ocampo Furniture organize product listings and customer inquiries.',
    role: 'UI/UX design.',
    tools: 'HTML and CSS.',
    focus: ['Let customers browse furniture designs, descriptions, prices, and availability.', 'Support product inquiries with required-field validation and submission confirmation.', 'Help the business organize furniture listings and customer inquiries.']
  },
  medicalSupplies: {
    category: 'Medical Supplies E-Commerce Website',
    title: 'Medical Supplies E-Commerce Website',
    image: 'assets/medical-supplies-logo.png',
    overview: 'An online medical store for students and healthcare professionals, offering essential supplies such as stethoscopes, gloves, masks, scissors, and penlights, with product images, prices, and descriptions.',
    role: 'UI/UX design.',
    tools: 'HTML and CSS.',
    focus: ['Present medical supplies for students and healthcare professionals.', 'Show product images, prices, and descriptions.', 'Help visitors browse and find relevant supplies.']
  }
};

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  navigation.classList.toggle('is-open', !open);
});
navLinks.forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
    if (projectDialog.open) projectDialog.close();
  }
});

const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach((button) => button.addEventListener('click', () => {
  filterButtons.forEach((filter) => {
    const active = filter === button;
    filter.classList.toggle('is-active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  projectCards.forEach((card) => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
  });
}));

const projectDialog = document.querySelector('#projectDialog');
document.querySelectorAll('.project-open').forEach((button) => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  if (!project) return;
  document.querySelector('#dialogType').textContent = project.category;
  document.querySelector('#dialogTitle').textContent = project.title;
  document.querySelector('#dialogOverview').textContent = project.overview;
  const dialogImage = document.querySelector('#dialogImage');
  dialogImage.hidden = !project.image;
  if (project.image) { dialogImage.src = project.image; dialogImage.alt = project.imageAlt || project.title; }
  document.querySelector('#dialogRole').textContent = project.role;
  document.querySelector('#dialogTools').textContent = project.tools;
  const list = document.querySelector('#dialogObjectives');
  list.replaceChildren(...project.focus.map((detail) => {
    const item = document.createElement('li');
    item.textContent = detail;
    return item;
  }));
  projectDialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => projectDialog.close());
projectDialog.addEventListener('click', (event) => {
  if (event.target === projectDialog) projectDialog.close();
});

const revealItems = document.querySelectorAll('.section, .contact-section');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealItems.forEach((item) => {
    item.classList.add('reveal');
    revealObserver.observe(item);
  });

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const activeId = entry.target.id === 'journey' ? 'education' : entry.target.id; if (link.hash === `#${activeId}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-22% 0px -68% 0px' });
  document.querySelectorAll('#home, #about, #skills, #projects, #certificates, #education, #journey, #contact').forEach((section) => navObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const backToTop = document.querySelector('#backToTop');
function updateBackToTop() {
  backToTop.classList.toggle('is-visible', window.scrollY > 560);
}
window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.querySelector('#year').textContent = new Date().getFullYear();



const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');
const submitButton = contactForm.querySelector('button[type="submit"]');
const originalButtonMarkup = submitButton.innerHTML;

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';
  formStatus.dataset.state = 'pending';
  formStatus.textContent = 'Sending your message…';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(contactForm)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const details = result.errors?.map((item) => item.message).filter(Boolean).join(' ');
      throw new Error(details || 'Your message could not be sent. Please try again.');
    }

    formStatus.dataset.state = 'success';
    formStatus.textContent = 'Thanks! Your message has been sent.';
    contactForm.reset();
  } catch (error) {
    formStatus.dataset.state = 'error';
    formStatus.textContent = error instanceof TypeError
      ? 'Could not connect to the form service. Please try again or email jese.bayuga.au@phinmaed.com.'
      : error.message;
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonMarkup;
  }
});
'use strict';

document.documentElement.classList.add('js');

const projects = {
  acadlearn: {
    category: 'Learning Management System',
    title: 'AcadLearn',
    image: 'assets/acadlearn-logo.png',
    imageAlt: 'PHINMA Araullo University logo for AcadLearn',
    overview: 'An academic project focused on creating a learning management platform that helps organize educational content and provides students with an accessible digital learning environment.',
    role: 'UI Design',
    tools: 'HTML and CSS.',
    focus: ['Organize educational content.', 'Support an accessible digital learning environment.']
  },
  furniture: {
    category: 'Furniture Interactive Application',
    title: 'F.R. Ocampo Furniture',
    overview: 'An online furniture catalog and inquiry system where customers can browse designs, product descriptions, prices, and availability, view product details, and send inquiries. It also helps F.R. Ocampo Furniture organize product listings and customer inquiries.',
    role: 'UI/UX design.',
    tools: 'HTML and CSS.',
    focus: ['Let customers browse furniture designs, descriptions, prices, and availability.', 'Support product inquiries with required-field validation and submission confirmation.', 'Help the business organize furniture listings and customer inquiries.']
  },
  medicalSupplies: {
    category: 'Medical Supplies E-Commerce Website',
    title: 'Medical Supplies E-Commerce Website',
    image: 'assets/medical-supplies-logo.png',
    overview: 'An online medical store for students and healthcare professionals, offering essential supplies such as stethoscopes, gloves, masks, scissors, and penlights, with product images, prices, and descriptions.',
    role: 'UI/UX design.',
    tools: 'HTML and CSS.',
    focus: ['Present medical supplies for students and healthcare professionals.', 'Show product images, prices, and descriptions.', 'Help visitors browse and find relevant supplies.']
  }
};

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  navigation.classList.toggle('is-open', !open);
});
navLinks.forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
    if (projectDialog.open) projectDialog.close();
  }
});

const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach((button) => button.addEventListener('click', () => {
  filterButtons.forEach((filter) => {
    const active = filter === button;
    filter.classList.toggle('is-active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  projectCards.forEach((card) => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
  });
}));

const projectDialog = document.querySelector('#projectDialog');
document.querySelectorAll('.project-open').forEach((button) => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  if (!project) return;
  document.querySelector('#dialogType').textContent = project.category;
  document.querySelector('#dialogTitle').textContent = project.title;
  document.querySelector('#dialogOverview').textContent = project.overview;
  const dialogImage = document.querySelector('#dialogImage');
  dialogImage.hidden = !project.image;
  if (project.image) { dialogImage.src = project.image; dialogImage.alt = project.imageAlt || project.title; }
  document.querySelector('#dialogRole').textContent = project.role;
  document.querySelector('#dialogTools').textContent = project.tools;
  const list = document.querySelector('#dialogObjectives');
  list.replaceChildren(...project.focus.map((detail) => {
    const item = document.createElement('li');
    item.textContent = detail;
    return item;
  }));
  projectDialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => projectDialog.close());
projectDialog.addEventListener('click', (event) => {
  if (event.target === projectDialog) projectDialog.close();
});

const revealItems = document.querySelectorAll('.section, .contact-section');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealItems.forEach((item) => {
    item.classList.add('reveal');
    revealObserver.observe(item);
  });

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const activeId = entry.target.id === 'journey' ? 'education' : entry.target.id; if (link.hash === `#${activeId}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-22% 0px -68% 0px' });
  document.querySelectorAll('#home, #about, #skills, #projects, #certificates, #education, #journey, #contact').forEach((section) => navObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const backToTop = document.querySelector('#backToTop');
function updateBackToTop() {
  backToTop.classList.toggle('is-visible', window.scrollY > 560);
}
window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.querySelector('#year').textContent = new Date().getFullYear();



const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');
const submitButton = contactForm.querySelector('button[type="submit"]');
const originalButtonMarkup = submitButton.innerHTML;

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';
  formStatus.dataset.state = 'pending';
  formStatus.textContent = 'Sending your message…';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(contactForm)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const details = result.errors?.map((item) => item.message).filter(Boolean).join(' ');
      throw new Error(details || 'Your message could not be sent. Please try again.');
    }

    formStatus.dataset.state = 'success';
    formStatus.textContent = 'Thanks! Your message has been sent.';
    contactForm.reset();
  } catch (error) {
    formStatus.dataset.state = 'error';
    formStatus.textContent = error instanceof TypeError
      ? 'Could not connect to the form service. Please try again or email jese.bayuga.au@phinmaed.com.'
      : error.message;
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonMarkup;
  }
});
