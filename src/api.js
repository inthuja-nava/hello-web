/* =============================================================
   src/api.js
   Everything related to talking to the GitHub API and rendering
   the "GitHub Repositories" section lives here.
   ============================================================= */


/* =============================================================
   FETCH FUNCTION
   fetch() only rejects on a true network failure, so response.ok
   is checked manually and a meaningful Error is thrown for a
   "successful" request that came back as a 404/403/500/etc.
   ============================================================= */
export async function fetchRepos(username) {
  const response = await fetch(`https://api.github.com/users/${username}/repos`);

  if (!response.ok) {
    throw new Error(`GitHub API request failed (status ${response.status})`);
  }

  return response.json();
}


/* =============================================================
   REPO CARD TEMPLATE
   Destructures the fields needed straight out of the repo object.
   Styled with the SAME classes as the project cards (.card,
   .project-label, .project-title, .project-desc) so the two
   sections feel like one consistent design system, not two.
   Handles a null description and a null language safely.
   ============================================================= */
export function repoCard({ name, description, language, stargazers_count, html_url, fork }) {
  const desc = description ?? 'No description provided.';

  const languageBadge = language
    ? `<span class="lang-tag">${language}</span>`
    : '';

  return `
    <article class="card" data-fork="${fork}">
      <div class="project-body">
        <span class="project-label">${fork ? 'Fork' : 'Repository'}</span>
        <h3 class="project-title">${name}</h3>
        <p class="project-desc">${desc}</p>
        <div class="repo-card-footer">
          <div class="repo-badges">
            ${languageBadge}
            <span class="star-count">&#9733; ${stargazers_count}</span>
          </div>
          <a href="${html_url}" class="card-link" target="_blank" rel="noopener noreferrer">View Repo &#x2192;</a>
        </div>
      </div>
    </article>
  `;
}


/* =============================================================
   RENDER FUNCTION
   Same pattern as renderProjects() in src/projects.js. Keeping it
   here means main.js never builds HTML itself — it only calls
   exported functions and manages the loading/error UI state.
   ============================================================= */
export function renderRepos(repos) {
  const grid = document.getElementById('repos-grid');
  const count = document.getElementById('repos-count');

  if (repos.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <p>No repositories found</p>
        <p>Push a project to GitHub and it'll show up here.</p>
      </div>
    `;
  } else {
    grid.innerHTML = repos.map(repoCard).join('');
  }

  count.textContent = `Showing ${repos.length} repositories`;
}
