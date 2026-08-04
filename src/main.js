/* =============================================================
   src/main.js
   The ONLY file imported directly by index.html. Its job is to
   import the pieces built in the other two modules and wire them
   up to real page events. It intentionally contains NO template
   strings, NO innerHTML assignment, and NO fetch calls of its
   own — all of that lives in projects.js and api.js.
   ============================================================= */

import './style.css';

import { projects, renderProjects, getFilteredProjects } from './projects.js';
import { fetchRepos, renderRepos } from './api.js';

// Real GitHub username — taken from this repo's git remote.
const GITHUB_USERNAME = 'inthuja-nava';


/* =============================================================
   FEATURE: Active nav highlight while scrolling
   Watches each <main> section; whenever one is near the vertical
   center of the viewport, its matching nav link gets .active.
   ============================================================= */
function initActiveNav() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' }); // fires when a section is near the middle of the screen

  sections.forEach((section) => observer.observe(section));
}


/* =============================================================
   FEATURE: Typing effect on the hero subtitle
   Cycles through a list of phrases, typing and deleting one
   character at a time.
   ============================================================= */
function initTypingEffect() {
  const phrases = ['Developer', 'Data Thinker', 'Product-Minded'];
  const el = document.getElementById('hero-typed');
  if (!el) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIndex];
    el.textContent = deleting ? current.slice(0, charIndex--) : current.slice(0, charIndex++);

    let delay = deleting ? 40 : 90;

    if (!deleting && charIndex === current.length + 1) {
      delay = 1400; // pause on the full word before deleting
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 300;
    }

    setTimeout(tick, delay);
  }

  tick();
}


/* =============================================================
   FEATURE: Scroll-in card animations
   A single shared observer watches every project/repo card and
   adds .is-visible the moment it enters the viewport, then stops
   watching it (animate once, not on every scroll).

   Cards get replaced by renderProjects()/renderRepos() every time
   a filter, search, or fetch runs — so observeCards() has to be
   called again after each of those, not just once on page load.
   ============================================================= */
let cardObserver;

function initScrollAnimations() {
  cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
}

function observeCards() {
  document.querySelectorAll('.project-card:not(.is-observed), .card:not(.is-observed)').forEach((card) => {
    card.classList.add('is-observed');
    cardObserver.observe(card);
  });
}


/* =============================================================
   FEATURE: Dark mode toggle
   Adds/removes .dark-mode on <body>, which redefines the CSS
   custom properties in style.css — re-theming the whole site
   without touching individual elements. Choice is remembered in
   localStorage so it persists across visits.
   ============================================================= */
function initDarkMode() {
  const toggle = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('theme');

  if (stored === 'dark') {
    document.body.classList.add('dark-mode');
    toggle.textContent = '☀️';
  }

  toggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    toggle.textContent = isDark ? '☀️' : '🌙';
  });
}


/* =============================================================
   initRepos()
   The conductor for the GitHub Repositories section:
     try     → show the spinner, fetch, filter out forks, render
     catch   → hide the grid content, show a friendly error message
     finally → ALWAYS hide the loading indicator, success or failure
   ============================================================= */
async function initRepos() {
  const loading = document.getElementById('repos-loading');
  const errorBox = document.getElementById('repos-error');
  const grid = document.getElementById('repos-grid');

  loading.classList.remove('hidden');
  errorBox.hidden = true;
  grid.innerHTML = '';

  try {
    const repos = await fetchRepos(GITHUB_USERNAME);
    const ownRepos = repos.filter((repo) => !repo.fork); // hide forks, only my own work
    renderRepos(ownRepos);
    observeCards();
  } catch (error) {
    console.error('Failed to load GitHub repos:', error);
    errorBox.hidden = false;
  } finally {
    loading.classList.add('hidden');
  }
}


document.addEventListener('DOMContentLoaded', () => {

  // ----- Personalization features -----
  initActiveNav();
  initTypingEffect();
  initScrollAnimations();
  initDarkMode();

  // ----- Mobile hamburger nav -----
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close the mobile menu after tapping a link
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ----- Projects section -----
  renderProjects(projects);
  observeCards();

  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(getFilteredProjects());
      observeCards();
    });
  });

  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', () => {
    renderProjects(getFilteredProjects());
    observeCards();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      renderProjects(getFilteredProjects());
      observeCards();
    }
  });

  // Event delegation on the project grid for card clicks
  const projectGrid = document.getElementById('project-grid');
  projectGrid.addEventListener('click', (e) => {
    const thumb = e.target.closest('.project-thumb');
    if (!thumb) return;
    const card = thumb.closest('.project-card');
    const title = card.querySelector('.project-title').textContent;
    console.log(`Opening project: ${title}`);
  });

  // ----- GitHub repos section -----
  initRepos();
  document.getElementById('repos-retry').addEventListener('click', initRepos);

});
