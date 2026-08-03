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
  } catch (error) {
    console.error('Failed to load GitHub repos:', error);
    errorBox.hidden = false;
  } finally {
    loading.classList.add('hidden');
  }
}


document.addEventListener('DOMContentLoaded', () => {

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

  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(getFilteredProjects());
    });
  });

  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', () => {
    renderProjects(getFilteredProjects());
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      renderProjects(getFilteredProjects());
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
