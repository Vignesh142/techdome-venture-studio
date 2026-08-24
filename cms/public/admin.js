// Techdome CMS Studio Admin Logic
const API_BASE = '/api';

// State
let currentVentures = [];
let currentGlobals = {};

// DOM Elements
const tabVentures = document.getElementById('tab-ventures');
const tabGlobals = document.getElementById('tab-globals');
const tabApiDocs = document.getElementById('tab-api-docs');
const navVentures = document.getElementById('nav-ventures');
const navGlobals = document.getElementById('nav-globals');
const navApi = document.getElementById('nav-api');

const tableBody = document.getElementById('ventures-table-body');
const searchInput = document.getElementById('table-search');
const btnNewVenture = document.getElementById('btn-new-venture');
const btnResetSeed = document.getElementById('btn-reset-seed');

const modal = document.getElementById('venture-modal');
const modalTitle = document.getElementById('modal-title');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelModal = document.getElementById('btn-cancel-modal');
const formVenture = document.getElementById('form-venture');
const formGlobals = document.getElementById('form-globals');

const statTotal = document.getElementById('stat-total');
const statLaunched = document.getElementById('stat-launched');
const statBuilding = document.getElementById('stat-building');
const statExited = document.getElementById('stat-exited');

// Toast Notification
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${type === 'success' ? '#10b981' : '#ef4444'}" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}

// Navigation Tabs
function setTab(tabName) {
  [navVentures, navGlobals, navApi].forEach(el => el.classList.remove('active'));
  [tabVentures, tabGlobals, tabApiDocs].forEach(el => el.classList.remove('active'));

  if (tabName === 'ventures') {
    navVentures.classList.add('active');
    tabVentures.classList.add('active');
    document.getElementById('page-title').textContent = 'Ventures Content Model';
    document.getElementById('page-subtitle').textContent = 'Manage portfolio ventures, stage enums, copy, and metrics.';
  } else if (tabName === 'globals') {
    navGlobals.classList.add('active');
    tabGlobals.classList.add('active');
    document.getElementById('page-title').textContent = 'Global Studio Settings';
    document.getElementById('page-subtitle').textContent = 'Edit hero copy, metrics, and studio contact data (100% zero hardcoded content)';
  } else if (tabName === 'api-docs') {
    navApi.classList.add('active');
    tabApiDocs.classList.add('active');
    document.getElementById('page-title').textContent = 'REST API Documentation';
    document.getElementById('page-subtitle').textContent = 'Live schema and interactive JSON endpoints consumed by the frontend.';
  }
}

navVentures.addEventListener('click', () => setTab('ventures'));
navGlobals.addEventListener('click', () => setTab('globals'));
navApi.addEventListener('click', () => setTab('api-docs'));

// Fetch and Render Ventures
async function loadVentures() {
  try {
    const res = await fetch(`${API_BASE}/ventures?drafts=true`);
    const json = await res.json();
    if (json.success) {
      currentVentures = json.data;
      renderTable(currentVentures);
      updateStats(currentVentures);
    }
  } catch (err) {
    console.error('Failed to load ventures:', err);
    tableBody.innerHTML = `<tr><td colspan="6" style="color:#ef4444;text-align:center;">Failed to connect to CMS engine: ${err.message}</td></tr>`;
  }
}

function updateStats(ventures) {
  statTotal.textContent = ventures.length;
  statLaunched.textContent = ventures.filter(v => v.stage === 'Launched').length;
  statBuilding.textContent = ventures.filter(v => v.stage === 'Building').length;
  statExited.textContent = ventures.filter(v => v.stage === 'Exited').length;
}

function renderTable(ventures) {
  if (ventures.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-muted);">No ventures found in database.</td></tr>`;
    return;
  }

  tableBody.innerHTML = ventures.map(v => `
    <tr>
      <td>
        <div class="venture-cell-title">${v.name}</div>
        <div class="venture-cell-tag">${v.tagline || 'Studio Venture'}</div>
      </td>
      <td><span class="mono-tag">/${v.slug}</span></td>
      <td>
        <span class="badge-stage ${v.stage}">${v.stage}</span>
      </td>
      <td>
        <div style="font-size:0.85rem;">${v.metrics || '—'}</div>
        <div style="font-size:0.75rem;color:var(--text-dim);">Est. ${v.year || '2024'}</div>
      </td>
      <td>
        <span class="badge-status ${v.published !== false ? 'published' : 'draft'}">
          ${v.published !== false ? 'Published' : 'Draft'}
        </span>
      </td>
      <td>
        <div class="action-group">
          <button class="btn btn-secondary btn-sm" onclick="editVenture(${v.id})">
            Edit
          </button>
          <a href="http://localhost:3000/ventures/${v.slug}" target="_blank" class="btn btn-secondary btn-sm" title="Preview on live site">
            View ↗
          </a>
          <button class="btn btn-danger btn-sm" onclick="deleteVenture(${v.id})" title="Delete venture">
            &times;
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Search Filter
searchInput.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = currentVentures.filter(v => 
    v.name.toLowerCase().includes(q) || 
    v.tagline.toLowerCase().includes(q) || 
    v.slug.toLowerCase().includes(q) ||
    v.stage.toLowerCase().includes(q)
  );
  renderTable(filtered);
});

// Modal Logic
function openModal(isEdit = false, venture = null) {
  modal.classList.add('active');
  if (isEdit && venture) {
    modalTitle.textContent = `Edit Venture: ${venture.name}`;
    document.getElementById('v-id').value = venture.id;
    document.getElementById('v-name').value = venture.name;
    document.getElementById('v-slug').value = venture.slug;
    document.getElementById('v-stage').value = venture.stage;
    document.getElementById('v-tagline').value = venture.tagline || '';
    document.getElementById('v-oneliner').value = venture.one_liner || '';
    document.getElementById('v-metrics').value = venture.metrics || '';
    document.getElementById('v-year').value = venture.year || '';
    document.getElementById('v-founders').value = venture.founders || '';
    document.getElementById('v-website').value = venture.website_url || '';
    document.getElementById('v-description').value = venture.description || '';
    document.getElementById('v-published').checked = venture.published !== false;
  } else {
    modalTitle.textContent = 'Create New Venture';
    formVenture.reset();
    document.getElementById('v-id').value = '';
    document.getElementById('v-published').checked = true;
  }
}

function closeModal() {
  modal.classList.remove('active');
  formVenture.reset();
}

btnCloseModal.addEventListener('click', closeModal);
btnCancelModal.addEventListener('click', closeModal);
btnNewVenture.addEventListener('click', () => openModal(false));

// Global Edit & Delete attached to window
window.editVenture = function(id) {
  const venture = currentVentures.find(v => v.id === id);
  if (venture) {
    openModal(true, venture);
  }
};

window.deleteVenture = async function(id) {
  const venture = currentVentures.find(v => v.id === id);
  if (!confirm(`Are you sure you want to delete venture "${venture ? venture.name : id}"?`)) return;

  try {
    const res = await fetch(`${API_BASE}/ventures/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('Venture deleted successfully');
      loadVentures();
    }
  } catch (err) {
    showToast('Failed to delete venture: ' + err.message, 'error');
  }
};

// Auto-generate slug on name typing when creating
document.getElementById('v-name').addEventListener('input', (e) => {
  const id = document.getElementById('v-id').value;
  if (!id) {
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    document.getElementById('v-slug').value = slug;
  }
});

// Save Venture (Create or Update) - THE ACID TEST
formVenture.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('v-id').value;
  const payload = {
    name: document.getElementById('v-name').value.trim(),
    slug: document.getElementById('v-slug').value.trim(),
    stage: document.getElementById('v-stage').value,
    tagline: document.getElementById('v-tagline').value.trim(),
    one_liner: document.getElementById('v-oneliner').value.trim(),
    metrics: document.getElementById('v-metrics').value.trim(),
    year: document.getElementById('v-year').value.trim(),
    founders: document.getElementById('v-founders').value.trim(),
    website_url: document.getElementById('v-website').value.trim(),
    description: document.getElementById('v-description').value.trim(),
    published: document.getElementById('v-published').checked
  };

  try {
    let res;
    if (id) {
      // Update
      res = await fetch(`${API_BASE}/ventures/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      // Create
      res = await fetch(`${API_BASE}/ventures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    const json = await res.json();
    if (json.success) {
      showToast(id ? `Venture "${payload.name}" updated!` : `Venture "${payload.name}" created!`);
      closeModal();
      loadVentures();
    } else {
      showToast(json.error || 'Operation failed', 'error');
    }
  } catch (err) {
    showToast('Network error: ' + err.message, 'error');
  }
});

// Fetch and Render Globals
async function loadGlobals() {
  try {
    const res = await fetch(`${API_BASE}/globals`);
    const json = await res.json();
    if (json.success) {
      currentGlobals = json.data;
      document.getElementById('g-studio-name').value = currentGlobals.studio_name || '';
      document.getElementById('g-hero-eyebrow').value = currentGlobals.hero_eyebrow || '';
      document.getElementById('g-hero-headline').value = currentGlobals.hero_headline || '';
      document.getElementById('g-hero-subline').value = currentGlobals.hero_subline || '';
      document.getElementById('g-stat1-val').value = currentGlobals.stats_metric_1_val || '';
      document.getElementById('g-stat1-label').value = currentGlobals.stats_metric_1_label || '';
      document.getElementById('g-stat2-val').value = currentGlobals.stats_metric_2_val || '';
      document.getElementById('g-stat2-label').value = currentGlobals.stats_metric_2_label || '';
      document.getElementById('g-stat3-val').value = currentGlobals.stats_metric_3_val || '';
      document.getElementById('g-stat3-label').value = currentGlobals.stats_metric_3_label || '';
      document.getElementById('g-contact-email').value = currentGlobals.contact_email || '';
      document.getElementById('g-location').value = currentGlobals.location || '';
    }
  } catch (err) {
    console.error('Failed to load globals:', err);
  }
}

// Save Globals
formGlobals.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    studio_name: document.getElementById('g-studio-name').value.trim(),
    hero_eyebrow: document.getElementById('g-hero-eyebrow').value.trim(),
    hero_headline: document.getElementById('g-hero-headline').value.trim(),
    hero_subline: document.getElementById('g-hero-subline').value.trim(),
    stats_metric_1_val: document.getElementById('g-stat1-val').value.trim(),
    stats_metric_1_label: document.getElementById('g-stat1-label').value.trim(),
    stats_metric_2_val: document.getElementById('g-stat2-val').value.trim(),
    stats_metric_2_label: document.getElementById('g-stat2-label').value.trim(),
    stats_metric_3_val: document.getElementById('g-stat3-val').value.trim(),
    stats_metric_3_label: document.getElementById('g-stat3-label').value.trim(),
    contact_email: document.getElementById('g-contact-email').value.trim(),
    location: document.getElementById('g-location').value.trim(),
  };

  try {
    const res = await fetch(`${API_BASE}/globals`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      showToast('Global settings updated live in database!');
      loadGlobals();
    }
  } catch (err) {
    showToast('Failed to save globals: ' + err.message, 'error');
  }
});

// Reset Seed
btnResetSeed.addEventListener('click', async () => {
  if (!confirm('Reset all CMS content back to initial default seed?')) return;
  try {
    const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
    const json = await res.json();
    if (json.success) {
      showToast('Database reset to default seed!');
      loadVentures();
      loadGlobals();
    }
  } catch (err) {
    showToast('Failed to reset: ' + err.message, 'error');
  }
});

// Init
loadVentures();
loadGlobals();
