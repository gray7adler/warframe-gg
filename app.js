/* =====================================================
   WARFRAME GRIND GUIDE — App v3
   Tabs: Frames | Weapons | Companions
   + Lock icons, Prime badges, Welcome popup, Mobile nav
   ===================================================== */

// ── DATA SOURCES ─────────────────────────────────────
const TAB_DATA = {
  frames:     () => FRAMES,
  weapons:    () => WEAPONS,
  companions: () => COMPANIONS,
};

// ── STATE ─────────────────────────────────────────────
const state = {
  tab:        'frames',
  search:     '',
  difficulty: 'all',
  method:     'all',
  prime:      'all',
  sort:       'difficulty',
  sortDir:    1,
};

const SORT_LABELS = {
  difficulty: ['Ease ↑', 'Ease ↓'],
  name:       ['Name A–Z', 'Name Z–A'],
  method:     ['Method A–Z', 'Method Z–A'],
  grindScore: ['Grind ↑', 'Grind ↓'],
};

// ── DOM ───────────────────────────────────────────────
const grid          = document.getElementById('frameGrid');
const resultEl      = document.getElementById('resultCount');
const emptyEl       = document.getElementById('emptyState');
const searchInput   = document.getElementById('searchInput');
const clearBtn      = document.getElementById('clearSearch');
const modalOverlay  = document.getElementById('modalOverlay');
const modalTitle    = document.getElementById('modalTitle');
const modalBody     = document.getElementById('modalBody');
const modalDiffBadge= document.getElementById('modalDiffBadge');
const modalSubtitle = document.getElementById('modalSubtitle');
const modalClose    = document.getElementById('modalClose');
const primeSection  = document.getElementById('primeFilterSection');
const resurgenceBanner = document.getElementById('resurgenceBanner');
const resurgenceText   = document.getElementById('resurgenceText');

// ── THEME ─────────────────────────────────────────────
(function () {
  const btn  = document.querySelector('[data-theme-toggle]');
  const html = document.documentElement;
  let theme  = 'dark';
  html.setAttribute('data-theme', theme);
  if (!btn) return;
  btn.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', theme);
    btn.innerHTML = theme === 'dark'
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  });
})();

// ── WELCOME POPUP ─────────────────────────────────────
(function () {
  const overlay   = document.getElementById('welcomeOverlay');
  const closeBtn  = document.getElementById('welcomeClose');
  const dontShow  = document.getElementById('dontShowAgain');
  if (!overlay) return;

  let dismissed = false;
  

  if (!dismissed) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  } else {
    overlay.style.display = 'none';
  }

  function dismiss() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    if (dontShow && dontShow.checked) {
      
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', dismiss);
  overlay.addEventListener('click', e => { if (e.target === overlay) dismiss(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.style.display !== 'none') dismiss();
  });
})();

// ── PRIME STATUS HELPERS ──────────────────────────────
function getPrimeData(frameName) {
  if (typeof PRIME_STATUS === 'undefined') return null;
  return PRIME_STATUS[frameName] || null;
}

const PRIME_LABEL = {
  active:     '★ Prime Active',
  resurgence: '↺ Resurgence',
  vaulted:    '🔒 Vaulted',
  noprime:    '— No Prime',
};

function primeBadgeHtml(frameName) {
  const p = getPrimeData(frameName);
  if (!p) return '';
  const label = {
    active:     '★ Prime',
    resurgence: '↺ Resurgence',
    vaulted:    '⊘ Vaulted',
    noprime:    '',
  }[p.status] || '';
  if (!label) return '';
  return `<span class="prime-badge ${p.status}" title="${p.note || ''}">${label}</span>`;
}

// ── RESURGENCE BANNER ─────────────────────────────────
function updateResurgenceBanner() {
  if (state.tab !== 'frames' || typeof RESURGENCE_INFO === 'undefined') {
    resurgenceBanner.style.display = 'none';
    return;
  }
  if (RESURGENCE_INFO.active) {
    resurgenceText.textContent = `Prime Resurgence Active: ${RESURGENCE_INFO.frames.join(', ')} — ${RESURGENCE_INFO.note}`;
    document.getElementById('resurgenceLink').href = RESURGENCE_INFO.wikiUrl;
    resurgenceBanner.style.display = 'flex';
  } else {
    resurgenceBanner.style.display = 'none';
  }
}

// ── LOCK SVG ─────────────────────────────────────────
const LOCK_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

// ── FILTER LOGIC ──────────────────────────────────────
function getFiltered() {
  const data = TAB_DATA[state.tab]();
  return data.filter(f => {
    const q = state.search.trim().toLowerCase();
    if (q) {
      const fields = [f.name, f.boss || '', f.location, f.method, f.notes || '',
                      f.missionType, f.type || '', f.category || '', ...(f.tags || [])];
      if (!fields.some(x => x.toLowerCase().includes(q))) return false;
    }
    if (state.difficulty !== 'all' && f.difficulty !== state.difficulty) return false;
    if (state.method    !== 'all' && f.method !== state.method) return false;

    // Prime filter (frames tab only)
    if (state.tab === 'frames' && state.prime !== 'all') {
      const p = getPrimeData(f.name);
      const pStatus = p ? p.status : 'noprime';
      if (pStatus !== state.prime) return false;
    }

    return true;
  });
}

// ── SORT LOGIC ────────────────────────────────────────
function getSorted(arr) {
  return [...arr].sort((a, b) => {
    switch (state.sort) {
      case 'difficulty':
        if (a.diffScore !== b.diffScore) return (a.diffScore - b.diffScore) * state.sortDir;
        return a.grindScore - b.grindScore;
      case 'name':       return a.name.localeCompare(b.name) * state.sortDir;
      case 'method':     return a.method.localeCompare(b.method) * state.sortDir;
      case 'grindScore': return (a.grindScore - b.grindScore) * state.sortDir;
      default: return 0;
    }
  });
}

// ── GRIND BAR FILL ────────────────────────────────────
function grindBarFill(score) {
  const w = (score / 10) * 100;
  return `<div class="grind-bar-fill" data-score="${score}" style="width:${w}%"></div>`;
}

// ── RENDER CARD ───────────────────────────────────────
function renderCard(f, i) {
  const card = document.createElement('div');
  card.className = 'frame-card' + (f.locked ? ' is-locked' : '');
  card.dataset.diff = f.difficulty;
  card.setAttribute('data-testid', `card-item-${f.name.replace(/[\s\/&\.]/g, '-').toLowerCase()}`);
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `View ${f.name} details`);

  // Type badge for weapons/companions
  let sublabel = '';
  if (f.type && state.tab !== 'frames') {
    const cat = f.category ? ` · ${f.category}` : '';
    sublabel = `<div class="card-subtype"><span class="type-badge ${f.type}">${f.type}${cat}</span></div>`;
  }

  // Prime badge for frames
  let primeBadge = '';
  if (state.tab === 'frames') {
    primeBadge = primeBadgeHtml(f.name);
  }

  // Lock icon
  const lockHtml = f.locked
    ? `<span class="lock-tooltip-wrap lock-icon" title="Hard to recover if sold">${LOCK_SVG}<span class="lock-tip">Hard to recover!</span></span>`
    : '';

  card.innerHTML = `
    <div class="card-header">
      <div style="display:flex;align-items:center;gap:4px;min-width:0;flex-wrap:wrap">
        <span class="card-name">${f.name}</span>${lockHtml}
        ${primeBadge}
      </div>
      <span class="diff-badge ${f.difficulty}">${f.difficulty}</span>
    </div>
    ${sublabel}
    <div class="card-method"><span class="method-dot"></span>${f.method} — ${f.missionType}</div>
    <div class="card-location">${f.location}</div>
    <div class="card-boss">${f.boss && f.boss !== 'N/A' ? '⚔ ' + f.boss : '—'}</div>
    <div class="grind-bar-wrap">
      <div class="grind-bar-label">
        <span class="grind-bar-text">Grind</span>
        <span class="grind-bar-score">${f.grindScore}/10</span>
      </div>
      <div class="grind-bar-track">${grindBarFill(f.grindScore)}</div>
    </div>`;

  card.addEventListener('click', () => openModal(f));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(f); }});
  return card;
}

// ── RENDER ────────────────────────────────────────────
function render() {
  const filtered = getFiltered();
  const sorted   = getSorted(filtered);

  resultEl.textContent = `${sorted.length} result${sorted.length !== 1 ? 's' : ''}`;

  document.getElementById('statTotal').textContent     = filtered.length;
  document.getElementById('statEasy').textContent      = filtered.filter(f => f.difficulty === 'Easy').length;
  document.getElementById('statMedium').textContent    = filtered.filter(f => f.difficulty === 'Medium').length;
  document.getElementById('statHard').textContent      = filtered.filter(f => f.difficulty === 'Hard').length;
  document.getElementById('statNightmare').textContent = filtered.filter(f => f.difficulty === 'Nightmare').length;

  // Prime filter section: only show on frames tab
  if (primeSection) primeSection.style.display = state.tab === 'frames' ? '' : 'none';

  updateResurgenceBanner();

  grid.innerHTML = '';
  if (sorted.length === 0) { emptyEl.style.display = 'flex'; return; }
  emptyEl.style.display = 'none';

  const frag = document.createDocumentFragment();
  sorted.forEach((f, i) => {
    const card = renderCard(f, i);
    card.style.animationDelay = `${Math.min(i * 15, 200)}ms`;
    frag.appendChild(card);
  });
  grid.appendChild(frag);
}

// ── MODAL ─────────────────────────────────────────────
function openModal(f) {
  modalDiffBadge.innerHTML = `<span class="diff-badge ${f.difficulty}">${f.difficulty}</span>`;
  modalTitle.innerHTML = f.name + (f.locked ? ` <span class="lock-icon" style="vertical-align:middle">${LOCK_SVG}</span>` : '');

  const typeLine = (f.type && state.tab !== 'frames')
    ? `<span class="type-badge ${f.type}" style="display:inline-block;margin-right:6px">${f.type}${f.category ? ' · '+f.category : ''}</span>` : '';
  modalSubtitle.innerHTML = typeLine + `${f.method} — ${f.missionType}`;

  const grindColor = f.grindScore <= 3 ? 'var(--easy)' :
                     f.grindScore <= 5 ? 'var(--medium)' :
                     f.grindScore <= 7 ? 'var(--hard)' : 'var(--nightmare)';

  const lockWarning = f.locked ? `<div class="lock-warning">${LOCK_SVG}<div><strong>Hard to recover if sold.</strong> This item comes from a time-gated, quest-locked, or one-time source. Think twice before selling — re-acquiring may be very difficult or impossible without trading.</div></div>` : '';

  // Prime info block for frames
  let primeBlock = '';
  if (state.tab === 'frames') {
    const p = getPrimeData(f.name);
    if (p) {
      const statusLabels = { active: 'Active — farmable via Void Relics', resurgence: 'In Resurgence — Varzia (costs Aya)', vaulted: 'Vaulted — trade or wait for Resurgence', noprime: 'No prime version exists yet' };
      const statusColors = { active: 'var(--accent)', resurgence: 'var(--medium)', vaulted: 'var(--nightmare)', noprime: 'var(--text-faint)' };
      primeBlock = p.status !== 'noprime' ? `
        <div>
          <div class="modal-section-label">Prime Version</div>
          <div class="modal-grid-item" style="display:flex;align-items:center;gap:var(--sp3)">
            <span class="prime-badge ${p.status}">${p.primeName || 'No Prime'}</span>
            <span style="font-size:0.75rem;color:${statusColors[p.status]}">${statusLabels[p.status]}</span>
          </div>
        </div>` : '';
    }
  }

  modalBody.innerHTML = `
    ${lockWarning}
    ${primeBlock}
    <div>
      <div class="modal-section-label">Grind Score</div>
      <div class="modal-grind-section">
        <div class="modal-grind-score" style="color:${grindColor}">${f.grindScore}</div>
        <div class="modal-grind-bar-wrap">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px">
            <span style="font-size:0.65rem;color:var(--text-faint)">Easiest</span>
            <span style="font-size:0.65rem;color:var(--text-faint)">Nightmare</span>
          </div>
          <div class="modal-grind-bar-track">
            <div class="modal-grind-bar-fill" style="width:${(f.grindScore/10)*100}%;background:${grindColor}"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-grid">
      <div class="modal-grid-item"><div class="modal-section-label">Farm Method</div><div class="modal-value">${f.method}</div></div>
      <div class="modal-grid-item"><div class="modal-section-label">Mission Type</div><div class="modal-value">${f.missionType}</div></div>
      <div class="modal-grid-item"><div class="modal-section-label">Location</div><div class="modal-value mono">${f.location}</div></div>
      <div class="modal-grid-item"><div class="modal-section-label">Boss / Source</div><div class="modal-value">${f.boss || 'N/A'}</div></div>
    </div>
    <div><div class="modal-section-label">Blueprint Source</div><div class="modal-value">${f.blueprint}</div></div>
    <div><div class="modal-section-label">Farm Notes</div><div class="modal-notes">${f.notes}</div></div>
    ${f.tags && f.tags.length ? `<div><div class="modal-section-label">Tags</div><div class="tag-list">${f.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div></div>` : ''}
    <a href="${f.wikiUrl}" target="_blank" rel="noopener noreferrer" class="wiki-link">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      View on Warframe Wiki
    </a>`;

  modalOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  modalOverlay.style.display = 'none';
  document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); } });

// ── TAB SWITCHING ─────────────────────────────────────
function switchTab(tabName) {
  state.tab = tabName;
  // Update all tab buttons (both desktop sidebar and mobile bottom bar)
  document.querySelectorAll('[data-tab]').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabName);
  });
  // Reset filters
  state.search = '';
  state.difficulty = 'all';
  state.method = 'all';
  state.prime = 'all';
  searchInput.value = '';
  clearBtn.style.display = 'none';
  document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('[data-filter][data-value="all"]').forEach(b => b.classList.add('active'));
  render();
}

document.querySelectorAll('[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ── FILTERS ───────────────────────────────────────────
document.querySelectorAll('[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    const value  = btn.dataset.value;
    document.querySelectorAll(`[data-filter="${filter}"]`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state[filter] = value;
    render();
  });
});

// ── SORT BUTTONS ──────────────────────────────────────
document.querySelectorAll('[data-sort]').forEach(btn => {
  btn.addEventListener('click', () => {
    const k = btn.dataset.sort;
    state.sortDir = state.sort === k ? state.sortDir * -1 : 1;
    state.sort = k;
    document.querySelectorAll('[data-sort]').forEach(b => {
      b.classList.remove('active');
      const lbl = SORT_LABELS[b.dataset.sort];
      if (lbl) b.textContent = lbl[0];
    });
    btn.classList.add('active');
    const lbl = SORT_LABELS[k];
    if (lbl) btn.textContent = lbl[state.sortDir === 1 ? 0 : 1];
    render();
  });
});
document.querySelector('[data-sort="difficulty"]').classList.add('active');

// ── SEARCH ────────────────────────────────────────────
searchInput.addEventListener('input', () => {
  state.search = searchInput.value;
  clearBtn.style.display = state.search ? 'flex' : 'none';
  render();
});
clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  state.search = '';
  clearBtn.style.display = 'none';
  searchInput.focus();
  render();
});

// ── VIEW TOGGLE ───────────────────────────────────────
document.getElementById('viewGrid').addEventListener('click', () => {
  grid.classList.remove('list-view');
  document.getElementById('viewGrid').classList.add('active');
  document.getElementById('viewList').classList.remove('active');
});
document.getElementById('viewList').addEventListener('click', () => {
  grid.classList.add('list-view');
  document.getElementById('viewList').classList.add('active');
  document.getElementById('viewGrid').classList.remove('active');
});

// ── RESET FILTERS ─────────────────────────────────────
document.getElementById('resetFilters').addEventListener('click', () => {
  state.search = ''; state.difficulty = 'all'; state.method = 'all'; state.prime = 'all';
  searchInput.value = '';
  clearBtn.style.display = 'none';
  document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('[data-filter][data-value="all"]').forEach(b => b.classList.add('active'));
  render();
});

// ── MOBILE FILTER SHEET ───────────────────────────────
const filterToggle   = document.getElementById('filterToggle');
const filterSheet    = document.getElementById('filterSheet');
const filterSheetClose = document.getElementById('filterSheetClose');
const filterSheetApply = document.getElementById('filterSheetApply');
const sheetBackdrop  = document.getElementById('sheetBackdrop');
const filterSheetBody = document.getElementById('filterSheetBody');

function openFilterSheet() {
  // Clone sidebar filter content into sheet
  const sidebar = document.getElementById('sidebar');
  // Get difficulty, method, prime, sort sections from sidebar
  const sections = sidebar ? [...sidebar.querySelectorAll('.sidebar-section')] : [];
  filterSheetBody.innerHTML = '';
  sections.forEach(sec => {
    // Skip stats section
    if (sec.classList.contains('sidebar-stats')) return;
    filterSheetBody.appendChild(sec.cloneNode(true));
  });
  // Wire up cloned filter buttons in sheet
  filterSheetBody.querySelectorAll('[data-filter]').forEach(btn => {
    const filter = btn.dataset.filter;
    const value  = btn.dataset.value;
    // Sync active states
    if (state[filter] === value || (value === 'all' && state[filter] === 'all')) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
    btn.addEventListener('click', () => {
      filterSheetBody.querySelectorAll(`[data-filter="${filter}"]`).forEach(b => b.classList.remove('active'));
      // Also sync main sidebar
      document.querySelectorAll(`[data-filter="${filter}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll(`[data-filter="${filter}"][data-value="${value}"]`).forEach(b => b.classList.add('active'));
      state[filter] = value;
      render();
    });
  });
  filterSheetBody.querySelectorAll('[data-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
      const k = btn.dataset.sort;
      state.sortDir = state.sort === k ? state.sortDir * -1 : 1;
      state.sort = k;
      document.querySelectorAll('[data-sort]').forEach(b => { b.classList.remove('active'); });
      btn.classList.add('active');
      render();
    });
  });
  // Search mirror
  const sheetSearch = filterSheetBody.querySelector('.search-input');
  if (sheetSearch) {
    sheetSearch.value = state.search;
    sheetSearch.addEventListener('input', () => {
      state.search = sheetSearch.value;
      searchInput.value = state.search;
      clearBtn.style.display = state.search ? 'flex' : 'none';
      render();
    });
  }

  filterSheet.classList.add('open');
  filterSheet.setAttribute('aria-hidden', 'false');
  sheetBackdrop.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeFilterSheet() {
  filterSheet.classList.remove('open');
  filterSheet.setAttribute('aria-hidden', 'true');
  sheetBackdrop.classList.remove('visible');
  document.body.style.overflow = '';
}

if (filterToggle) filterToggle.addEventListener('click', openFilterSheet);
if (filterSheetClose) filterSheetClose.addEventListener('click', closeFilterSheet);
if (filterSheetApply) filterSheetApply.addEventListener('click', closeFilterSheet);
if (sheetBackdrop) sheetBackdrop.addEventListener('click', closeFilterSheet);

// ── INIT ──────────────────────────────────────────────
render();
