/* =============================================================
   src/projects.js
   Everything related to the "Projects I've Built" section lives
   here: the data, the card template, the render function, and
   the filter/search logic. Anything another module needs must
   be exported.
   ============================================================= */


/* =============================================================
   PROJECT DATA
   Real projects spanning the whole course — from the first
   semantic-HTML page through independent full-stack builds to
   this Vite-powered site itself.

   Each project has:
     tech  — ONE primary category used for filtering: 'html' | 'css' | 'javascript'
     tags  — the FULL list of technologies used, shown on the card
     label — a small badge ("Week 1", "Independent Project", etc.)
   ============================================================= */
export const projects = [
  {
    title: 'Hello, World Wide Web',
    tech: 'html',
    label: 'Week 1',
    tags: ['HTML5', 'Git'],
    desc: 'Built and deployed my first personal profile page using semantic HTML5 and Git version control — the foundation this whole portfolio grew from.',
    link: 'https://github.com/inthuja-nava/hello-web'
  },
  {
    title: 'Responsive Portfolio Design',
    tech: 'css',
    label: 'Weeks 2–4',
    tags: ['CSS3', 'Flexbox', 'CSS Grid', 'JavaScript'],
    desc: 'Rebuilt the layout with CSS Grid and Flexbox, added a fully responsive mobile-first design with custom media queries, and built a JavaScript-powered hamburger menu for mobile navigation.',
    link: 'https://github.com/inthuja-nava/hello-web'
  },
  {
    title: 'J.W. Foods Website',
    tech: 'javascript',
    label: 'Independent Project',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Python', 'Flask', 'SQLite'],
    desc: 'Responsive single-page website for a GTA food distributor, featuring a live Delivery Cost Calculator powered by a Python Flask backend and SQLite database.',
    link: 'https://github.com/inthuja-nava/jwfoods-website'
  },
  {
    title: 'Jiffy Listing Website',
    tech: 'css',
    label: 'Independent Project',
    tags: ['HTML5', 'CSS3', 'Bootstrap'],
    desc: 'Multi-page listing website built for the Women In Tech Web Development Program — home, about, and login pages with custom Bootstrap styling.',
    link: 'https://github.com/inthuja-nava/Jiffy-Listing-Website'
  },
  {
    title: 'Expense Tracker',
    tech: 'javascript',
    label: 'Independent Project',
    tags: ['HTML5', 'CSS3', 'JavaScript'],
    desc: 'Interactive expense tracking app built with vanilla JavaScript. Add, categorize, and remove transactions with a live running balance — no frameworks.',
    link: 'https://github.com/inthuja-nava/expense-tracker'
  },
  {
    title: 'Interactive Quiz App',
    tech: 'javascript',
    label: 'Week 5',
    tags: ['HTML5', 'CSS3', 'JavaScript'],
    desc: 'A multiple-choice quiz app about Space & Astronomy with score tracking, built with vanilla JavaScript.',
    link: 'https://github.com/inthuja-nava/quiz-app'
  },
  {
    title: 'Dynamic Portfolio + Live GitHub Data',
    tech: 'javascript',
    label: 'Weeks 6–7',
    tags: ['JavaScript', 'DOM', 'Fetch API'],
    desc: 'Rebuilt my project grid to render from a JavaScript data array with live filtering and search, then added a GitHub Repositories section that fetches real, live data straight from the GitHub REST API.',
    link: 'https://github.com/inthuja-nava/projects-js'
  },
  {
    title: 'npm + Vite Production Build',
    tech: 'javascript',
    label: 'Week 8',
    tags: ['JavaScript', 'ES Modules', 'Vite'],
    desc: 'Migrated this entire site into a real npm + Vite project — JavaScript split into clean ES Modules (projects.js, api.js, main.js) and shipped through a production build pipeline, the same workflow used on real engineering teams.',
    link: 'https://github.com/inthuja-nava/hello-web'
  }
];


/* =============================================================
   PROJECT CARD TEMPLATE
   Uses object destructuring right in the parameter list.
   Each project's full `tags` list is displayed, with the primary
   `tech` tag visually highlighted to match the filter category.
   ============================================================= */
export const projectCard = ({ title, tech, label, tags, desc, link }) => `
  <article class="project-card" data-tech="${tech}">
    <a href="${link}" target="_blank" rel="noopener" class="project-thumb tech-${tech}" aria-label="View ${title} on GitHub">
      <span class="project-thumb-label">View on GitHub</span>
    </a>
    <div class="project-body">
      <span class="project-label">${label}</span>
      <h3 class="project-title">${title}</h3>
      <p class="project-desc">${desc}</p>
      <div class="project-tags">
        <div class="project-tags-list">
          ${tags.map((t) => `<span class="project-tag ${t.toLowerCase() === tech ? `tech-${tech}` : ''}">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  </article>
`;


/* =============================================================
   RENDER FUNCTION
   Takes any array of projects, fills in #project-grid.
   ============================================================= */
export function renderProjects(list) {
  const grid = document.getElementById('project-grid');
  const resultsCount = document.getElementById('results-count');

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <p>No projects found</p>
        <p>Try a different filter or search term.</p>
      </div>
    `;
  } else {
    grid.innerHTML = list.map(projectCard).join('');
  }

  resultsCount.textContent = `Showing ${list.length} of ${projects.length} projects`;
}


/* =============================================================
   FILTER FUNCTION
   Uses the spread operator to build a fresh copy of the projects
   array before filtering, so `projects` (the exported original)
   is never mutated.
   ============================================================= */
export function getFilteredProjects() {
  const activeBtn = document.querySelector('.filter-btn.active');
  const activeTech = activeBtn ? activeBtn.dataset.filter : 'all';

  const searchTerm = document.getElementById('search-input')
    .value.toLowerCase().trim();

  const projectsCopy = [...projects]; // spread → shallow copy, original untouched

  return projectsCopy.filter((p) => {
    const matchesTech = activeTech === 'all' || p.tech === activeTech;

    const matchesSearch =
      searchTerm === '' ||
      p.title.toLowerCase().includes(searchTerm) ||
      p.desc.toLowerCase().includes(searchTerm);

    return matchesTech && matchesSearch;
  });
}
