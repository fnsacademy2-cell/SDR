/**
 * MARIE ADELAIDE LEPROSY CENTRE (MALC)
 * SINGLE-DOSE RIFAMPICIN (SDR) FOR LEPROSY PREVENTION
 * Workshop Interactive Intelligence Dashboard
 * Presenter: Abdul Salam | Region: Sindh, Pakistan
 */

// ==========================================================================
// 1. Master SDR Dataset (July 2025 - June 2026, Exact Match to PPTX)
// ==========================================================================

const SDR_DATA = {
  metadata: {
    org: "MARIE ADELAIDE LEPROSY CENTRE",
    title: "Single-Dose Rifampicin (SDR) for Leprosy Prevention",
    subtitle: "Workshop on: Understand barriers • Improve counselling • Protect confidentiality",
    theme: "From Challenges to Solutions: Strengthening the Acceptability and Implementation Of SDR-PEP in Sindh, Pakistan",
    facilitator: "Abdul Salam",
    period: "July 2025 – June 2026"
  },
  interiorSindh: {
    name: "Interior Sindh",
    indexCases: { y2025: 158, y2026: 158, total: 316 },
    screened: { y2025: 6903, y2026: 5826, total: 12729 },
    household: {
      screened: { y2025: 2644, y2026: 2728, total: 5372, share: 42.20 },
      refusal: { y2025: 18, y2026: 7, total: 25, rate: 0.46 },
      sdr: { y2025: 2403, y2026: 2418, total: 4821, rate: 89.74 },
      lepSuspect: { y2025: 20, y2026: 21, total: 41, rate: 0.76 }
    },
    social: {
      screened: { y2025: 4259, y2026: 3098, total: 7357, share: 57.80 },
      refusal: { y2025: 43, y2026: 14, total: 57, rate: 0.77 },
      sdr: { y2025: 3787, y2026: 2882, total: 6669, rate: 90.65 },
      lepSuspect: { y2025: 16, y2026: 14, total: 30, rate: 0.40 }
    },
    totalRefusal: { total: 74, rate: 0.58 },
    totalLepSuspect: { total: 71, rate: 0.55 },
    totalSdr: { total: 11490, rate: 90.27 },
    prevSdr: { y2025: 17, y2026: 165, total: 182, rate: 1.43 }
  },
  karachi: {
    name: "Karachi",
    indexCases: { y2025: 751, y2026: 658, total: 1409 },
    screened: { y2025: 12936, y2026: 16106, total: 29042 },
    household: {
      screened: { y2025: 7388, y2026: 5986, total: 13374, share: 46.05 },
      refusal: { y2025: 2590, y2026: 1120, total: 3710, rate: 27.74 },
      sdr: { y2025: 2953, y2026: 2729, total: 5682, rate: 42.49 },
      lepSuspect: { y2025: 12, y2026: 14, total: 26, rate: 0.19 }
    },
    social: {
      screened: { y2025: 5548, y2026: 10120, total: 15668, share: 53.95 },
      refusal: { y2025: 1788, y2026: 2205, total: 3993, rate: 25.48 },
      sdr: { y2025: 2816, y2026: 4553, total: 7369, rate: 47.03 },
      lepSuspect: { y2025: 5, y2026: 7, total: 12, rate: 0.07 }
    },
    totalRefusal: { total: 7703, rate: 26.52 },
    totalLepSuspect: { total: 38, rate: 0.13 },
    totalSdr: { total: 13051, rate: 44.94 },
    prevSdr: { y2025: 1230, y2026: 1763, total: 2993, rate: 10.31 }
  },
  combinedSindh: {
    name: "Combined Sindh (Total)",
    indexCases: 1725,
    screened: 41771,
    householdScreened: 18746,
    socialScreened: 23025,
    totalRefusal: 7777,
    refusalRate: 18.62,
    totalSdr: 24541,
    sdrRate: 58.75,
    totalLepSuspect: 109,
    suspectRate: 0.26,
    prevSdr: 3175,
    prevSdrRate: 7.60
  }
};

// ==========================================================================
// 2. Global State & Storage
// ==========================================================================

const state = {
  activeRegion: 'combined', // 'combined', 'karachi', 'interior'
  activeTheme: localStorage.getItem('malc_sdr_theme') || 'clean-pearl',
  charts: {},
  actionFilter: 'all',
  actionItems: JSON.parse(localStorage.getItem('malc_sdr_action_plan_v1') || 'null'),
  simParams: {
    karachiRefusalReduction: 50,
    coverageExpansion: 10
  }
};

// Default Workshop Action Commitments (Slide 11 Baseline)
const DEFAULT_ACTION_PLAN = [
  {
    id: 1,
    challenge: "High Refusal in Karachi Urban Centers (26.5% vs 0.58% in Interior Sindh)",
    action: "Deploy trained female community mobilizers and introduce stigma-free household visits during flexible evening hours.",
    team: "Karachi Field Operations & Community Mobilization",
    timeline: "Q3-Q4 2026",
    category: "stigma",
    status: "in_progress",
    completed: false
  },
  {
    id: 2,
    challenge: "Healthy Contact Perception ('I feel healthy—why do I need medicine?')",
    action: "Develop pictorial flipbooks and Urdu/Sindhi short video clips demonstrating chemoprophylaxis and preventive immunity.",
    team: "IEC & Health Education Unit",
    timeline: "August 2026",
    category: "counselling",
    status: "in_progress",
    completed: false
  },
  {
    id: 3,
    challenge: "Stigma & Fear of Index Patient Disclosure",
    action: "Enforce strict protocol: screening offered under generalized skin-health checkup; index patient name never disclosed without explicit consent.",
    team: "Clinical Quality Assurance & Ethics Board",
    timeline: "Immediate / Ongoing",
    category: "confidentiality",
    status: "completed",
    completed: true
  },
  {
    id: 4,
    challenge: "Social Contacts Hesitation (Colleagues & Neighbours Refusal 25.5%)",
    action: "Formulate discreet invitation vouchers for screening at local MALC satellite clinics rather than public doorstep testing.",
    team: "Urban Outreach Teams",
    timeline: "September 2026",
    category: "operations",
    status: "pending",
    completed: false
  },
  {
    id: 5,
    challenge: "High Yield of Leprosy Suspects in Interior Sindh (71 suspects, 0.55%)",
    action: "Ensure fast-track confirmatory slit-skin smear examination and immediate multi-drug therapy (MDT) initiation for identified suspects.",
    team: "Interior Regional Medical Officers",
    timeline: "Monthly Audits",
    category: "clinical",
    status: "in_progress",
    completed: false
  },
  {
    id: 6,
    challenge: "Data Documentation & Tracking of Prior SDR (3,175 individuals)",
    action: "Implement digitized SDR registry cards to prevent premature re-administration and track 2-year surveillance intervals per WHO guidelines.",
    team: "Monitoring & Evaluation (M&E) / IT Team",
    timeline: "October 2026",
    category: "monitoring",
    status: "pending",
    completed: false
  }
];

if (!state.actionItems || state.actionItems.length === 0) {
  state.actionItems = DEFAULT_ACTION_PLAN;
}

// ==========================================================================
// 3. Application Lifecycle
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initLandingPage();
  initThemeSystem();
  initTabs();
  initRegionSelector();
  initCharts();
  initActionMatrix();
  initSimulator();
  initProblemTreeViewer();
  renderKPIs();
});

// ==========================================================================
// 4. Landing Screen & Tab Switching
// ==========================================================================

function initLandingPage() {
  const enterBtn = document.getElementById('enterDashboardBtn');
  const returnBtn = document.getElementById('returnToLandingBtn');
  const jumpSimulatorBtn = document.getElementById('jumpSimulatorBtn');
  const jumpProblemTreeBtn = document.getElementById('jumpProblemTreeBtn');

  const enterDashboard = (targetTab = null) => {
    document.body.classList.remove('landing-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (targetTab) {
      switchTab(targetTab);
    }
    setTimeout(resizeAllCharts, 180);
  };

  if (enterBtn) enterBtn.addEventListener('click', () => enterDashboard());
  if (returnBtn) {
    returnBtn.addEventListener('click', () => {
      document.body.classList.add('landing-active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  if (jumpSimulatorBtn) jumpSimulatorBtn.addEventListener('click', () => enterDashboard('tab-simulator'));
  if (jumpProblemTreeBtn) jumpProblemTreeBtn.addEventListener('click', () => enterDashboard('tab-problem-tree'));
}

// Slide navigation array matching PPT sequence
const SLIDE_TABS = [
  'landing',          // Slide 1 (Cover)
  'tab-interior',     // Slide 2 (Interior Sindh Data)
  'tab-karachi',      // Slide 3 (Karachi Data)
  'tab-comparison',   // Slides 4 & 5 (Karachi vs Interior Sindh)
  'tab-barriers',     // Slide 6 (Acceptance Barriers)
  'tab-actions',      // Slide 7 (Practical Actions - 6 Pillars)
  'tab-pathway',      // Slide 8 (Implementation Pathway)
  'tab-monitoring',   // Slide 9 (Center Monitoring)
  'tab-problem-tree', // Slide 10 (Problem Tree Analysis)
  'tab-action-plan',  // Slide 11 (Workshop Action Plan)
  'tab-simulator'     // Bonus (Acceptance Simulator)
];

function getCurrentSlideIndex() {
  if (document.body.classList.contains('landing-active')) return 0;
  const activeTabBtn = document.querySelector('.tab-btn.active');
  if (!activeTabBtn) return 1;
  const tabId = activeTabBtn.getAttribute('data-tab');
  const idx = SLIDE_TABS.indexOf(tabId);
  return idx >= 0 ? idx : 1;
}

function goToSlideIndex(idx) {
  if (idx <= 0) {
    document.body.classList.add('landing-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (idx >= SLIDE_TABS.length) idx = SLIDE_TABS.length - 1;
  document.body.classList.remove('landing-active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  switchTab(SLIDE_TABS[idx]);
}

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Fullscreen Presentation Mode Button
  const fsBtn = document.getElementById('fullscreenBtn');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // Presentation Keyboard & Clicker Remote Shortcuts:
  // - Right Arrow / Page Down / Space: Next Slide
  // - Left Arrow / Page Up: Previous Slide
  // - Home: Slide 1 (Cover Page)
  // - 'F': Toggle Fullscreen Presentation Mode
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && document.body.classList.contains('landing-active'))) {
      e.preventDefault();
      const curr = getCurrentSlideIndex();
      if (curr < SLIDE_TABS.length - 1) {
        goToSlideIndex(curr + 1);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      const curr = getCurrentSlideIndex();
      if (curr > 0) {
        goToSlideIndex(curr - 1);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToSlideIndex(0);
    } else if (e.key === 'f' || e.key === 'F') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => {
    const isTarget = b.getAttribute('data-tab') === tabId;
    b.classList.toggle('active', isTarget);
    b.setAttribute('aria-selected', isTarget ? 'true' : 'false');
  });

  document.querySelectorAll('.tab-pane').forEach(p => {
    p.classList.toggle('active', p.id === tabId);
  });

  setTimeout(resizeAllCharts, 120);
}

function resizeAllCharts() {
  Object.values(state.charts).forEach(chart => {
    if (chart && typeof chart.resize === 'function') {
      chart.resize();
    }
  });
}

// ==========================================================================
// 5. Region Selector & KPI Rendering
// ==========================================================================

function initRegionSelector() {
  const regionBtns = document.querySelectorAll('.region-toggle-btn');
  regionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      regionBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeRegion = btn.getAttribute('data-region');
      renderKPIs();
    });
  });
}

function renderKPIs() {
  const reg = state.activeRegion;
  const kpiScreened = document.getElementById('kpiScreened');
  const kpiAcceptance = document.getElementById('kpiAcceptance');
  const kpiRefusal = document.getElementById('kpiRefusal');
  const kpiSuspects = document.getElementById('kpiSuspects');

  const subScreened = document.getElementById('kpiSubScreened');
  const subAcceptance = document.getElementById('kpiSubAcceptance');
  const subRefusal = document.getElementById('kpiSubRefusal');
  const subSuspects = document.getElementById('kpiSubSuspects');

  if (reg === 'karachi') {
    const k = SDR_DATA.karachi;
    if (kpiScreened) kpiScreened.textContent = k.screened.total.toLocaleString();
    if (subScreened) subScreened.innerHTML = `From <strong>${k.indexCases.total}</strong> index cases (46% HH / 54% Social)`;

    if (kpiAcceptance) kpiAcceptance.textContent = `${k.totalSdr.rate}%`;
    if (subAcceptance) subAcceptance.innerHTML = `<strong>${k.totalSdr.total.toLocaleString()}</strong> contacts received SDR (Prev: ${k.prevSdr.total})`;

    if (kpiRefusal) kpiRefusal.textContent = `${k.totalRefusal.rate}%`;
    if (subRefusal) subRefusal.innerHTML = `<span class="text-danger">▲ 7,703 contacts declined</span> (99% of Sindh refusals)`;

    if (kpiSuspects) kpiSuspects.textContent = `${k.totalLepSuspect.total} cases`;
    if (subSuspects) subSuspects.innerHTML = `Detection rate: <strong>0.13%</strong> referred for confirmation`;

  } else if (reg === 'interior') {
    const i = SDR_DATA.interiorSindh;
    if (kpiScreened) kpiScreened.textContent = i.screened.total.toLocaleString();
    if (subScreened) subScreened.innerHTML = `From <strong>${i.indexCases.total}</strong> index cases (42% HH / 58% Social)`;

    if (kpiAcceptance) kpiAcceptance.textContent = `${i.totalSdr.rate}%`;
    if (subAcceptance) subAcceptance.innerHTML = `<strong>${i.totalSdr.total.toLocaleString()}</strong> contacts received SDR (High compliance)`;

    if (kpiRefusal) kpiRefusal.textContent = `${i.totalRefusal.rate}%`;
    if (subRefusal) subRefusal.innerHTML = `<span class="text-success">▼ Minimal refusal: only 74 cases</span>`;

    if (kpiSuspects) kpiSuspects.textContent = `${i.totalLepSuspect.total} cases`;
    if (subSuspects) subSuspects.innerHTML = `Yield: <strong>0.55%</strong> active case detection rate`;

  } else {
    // Combined Sindh
    const c = SDR_DATA.combinedSindh;
    if (kpiScreened) kpiScreened.textContent = c.screened.toLocaleString();
    if (subScreened) subScreened.innerHTML = `Across <strong>${c.indexCases.toLocaleString()}</strong> index cases (Sindh wide)`;

    if (kpiAcceptance) kpiAcceptance.textContent = `${c.sdrRate}%`;
    if (subAcceptance) subAcceptance.innerHTML = `<strong>${c.totalSdr.toLocaleString()}</strong> total SDR given (90.3% Int vs 44.9% Khi)`;

    if (kpiRefusal) kpiRefusal.textContent = `${c.refusalRate}%`;
    if (subRefusal) subRefusal.innerHTML = `<strong>${c.totalRefusal.toLocaleString()}</strong> refusals (Karachi: 99.0% share)`;

    if (kpiSuspects) kpiSuspects.textContent = `${c.totalLepSuspect} cases`;
    if (subSuspects) subSuspects.innerHTML = `Total active suspect yield: <strong>0.26%</strong> across province`;
  }
}

// ==========================================================================
// 6. Theme Switching System
// ==========================================================================

const THEMES = [
  { id: 'theme-light', title: 'Clean Pearl (Light)', color: '#2563eb' },
  { id: 'theme-dark', title: 'Midnight Executive (Dark)', color: '#3b82f6' }
];

function initThemeSystem() {
  const landingThemeBtn = document.getElementById('landingThemeBtn');
  const landingThemeMenu = document.getElementById('landingThemeMenu');
  const dashThemeBtn = document.getElementById('themeToggle');
  const dashThemeMenu = document.getElementById('dashThemeMenu');

  const saved = localStorage.getItem('malc_sdr_theme_v2') || 'theme-light';
  applyTheme(saved);

  function setupMenu(btn, menu) {
    if (!btn || !menu) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = menu.classList.contains('active');
      document.querySelectorAll('.theme-dropdown-menu').forEach(m => m.classList.remove('active'));
      if (!open) menu.classList.add('active');
    });
  }

  setupMenu(landingThemeBtn, landingThemeMenu);
  setupMenu(dashThemeBtn, dashThemeMenu);

  document.addEventListener('click', () => {
    document.querySelectorAll('.theme-dropdown-menu').forEach(m => m.classList.remove('active'));
  });

  // Populate grids
  ['landingThemeGrid', 'dashThemeGrid'].forEach(gridId => {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = THEMES.map(t => `
      <button class="theme-item-btn" onclick="applyTheme('${t.id}')">
        <span class="theme-swatch-badge" style="background-color: ${t.color};"></span>
        <span>${t.title}</span>
      </button>
    `).join('');
  });

  // 'T' key shortcut
  document.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
      const current = document.body.classList.contains('theme-dark') ? 'theme-light' : 'theme-dark';
      applyTheme(current);
    }
  });
}

window.applyTheme = function(themeClass) {
  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add(themeClass);
  localStorage.setItem('malc_sdr_theme_v2', themeClass);

  const title = themeClass === 'theme-dark' ? 'Midnight (Dark)' : 'Clean Pearl (Light)';
  const color = themeClass === 'theme-dark' ? '#3b82f6' : '#2563eb';

  ['landingActiveThemeTitle', 'dashActiveThemeTitle'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = title;
  });
  ['landingThemeSwatch', 'dashThemeSwatch'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.backgroundColor = color;
  });

  document.querySelectorAll('.theme-dropdown-menu').forEach(m => m.classList.remove('active'));

  // Update chart datalabel contrast on theme switch
  Object.values(state.charts).forEach(c => {
    if (c && typeof c.update === 'function') c.update();
  });
};

// ==========================================================================
// 7. Interactive Charts (Chart.js & DataLabels Integration)
// ==========================================================================

function initCharts() {
  if (typeof Chart === 'undefined') return;

  // Register DataLabels Plugin for clear visibility across all slides
  if (typeof ChartDataLabels !== 'undefined') {
    Chart.register(ChartDataLabels);
  }

  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
  Chart.defaults.color = '#64748b';

  initOutcomeComparisonChart();
  initKarachiMixChart();
  initIntSindhMixChart();
  initSindhDistributionChart();
  initTrendCharts();
  initSimulatorChart();
}

// Global DataLabels Styling Helper
function getDataLabelsConfig(formatType = 'percent') {
  return {
    display: true,
    anchor: 'end',
    align: 'top',
    offset: 4,
    clip: false,
    font: {
      family: "'JetBrains Mono', monospace",
      weight: '700',
      size: 11
    },
    color: function() {
      return document.body.classList.contains('theme-dark') ? '#f8fafc' : '#0f172a';
    },
    backgroundColor: function() {
      return document.body.classList.contains('theme-dark') ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)';
    },
    borderRadius: 4,
    padding: { top: 2, bottom: 2, left: 5, right: 5 },
    formatter: function(value) {
      if (value === null || value === undefined) return '';
      if (formatType === 'percent') {
        if (value < 1 && value > 0) return value.toFixed(2) + '%';
        return value + '%';
      }
      return typeof value === 'number' ? value.toLocaleString() : value;
    }
  };
}

// Slide 4: Karachi vs Interior Sindh Macro Chart
function initOutcomeComparisonChart() {
  const ctx = document.getElementById('outcomeComparisonChart');
  if (!ctx) return;

  state.charts.outcomeCompare = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Refusal Rate (%)', 'SDR Acceptance (%)', 'Leprosy Suspect Yield (%)'],
      datasets: [
        {
          label: 'Karachi (Urban)',
          data: [26.5, 44.9, 0.13],
          backgroundColor: '#ef4444',
          borderRadius: 6,
          minBarLength: 18 // Ensures low values like 0.13% stay clearly visible to audience
        },
        {
          label: 'Interior Sindh (Rural)',
          data: [0.58, 90.3, 0.55],
          backgroundColor: '#10b981',
          borderRadius: 6,
          minBarLength: 18 // Ensures low values like 0.58% & 0.55% stay clearly visible
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 28, left: 10, right: 10 }
      },
      plugins: {
        legend: { position: 'top' },
        datalabels: getDataLabelsConfig('percent'),
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 110,
          ticks: {
            callback: v => v <= 100 ? v + '%' : ''
          }
        }
      }
    }
  });

  // Interactive Low-Value Zoom Toggle (0-30% focus)
  let isOutcomeZoomed = false;
  const zoomBtn = document.getElementById('toggleOutcomeZoomBtn');
  if (zoomBtn) {
    zoomBtn.addEventListener('click', () => {
      isOutcomeZoomed = !isOutcomeZoomed;
      if (isOutcomeZoomed) {
        state.charts.outcomeCompare.options.scales.y.max = 30;
        zoomBtn.innerHTML = '<span>↺ Reset Full Scale (100%)</span>';
        zoomBtn.classList.add('active');
      } else {
        state.charts.outcomeCompare.options.scales.y.max = 110;
        zoomBtn.innerHTML = '<span>🔍 Low-Value Zoom (0-30%)</span>';
        zoomBtn.classList.remove('active');
      }
      state.charts.outcomeCompare.update();
    });
  }
}

// Slide 5: Karachi Household vs Social (Chart 2 from PPT)
function initKarachiMixChart() {
  const ctx = document.getElementById('karachiMixChart');
  if (!ctx) return;

  state.charts.karachiMix = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['SDR Administered (%)', 'Refusal (%)'],
      datasets: [
        {
          label: 'Household Contacts',
          data: [42.5, 27.7],
          backgroundColor: '#3b82f6',
          borderRadius: 6,
          minBarLength: 18
        },
        {
          label: 'Social / Neighbour Contacts',
          data: [47.0, 25.5],
          backgroundColor: '#06b6d4',
          borderRadius: 6,
          minBarLength: 18
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 28, left: 10, right: 10 }
      },
      plugins: {
        legend: { position: 'top' },
        datalabels: getDataLabelsConfig('percent')
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 60,
          ticks: { callback: v => v + '%' }
        }
      }
    }
  });
}

// Slide 5: Interior Sindh Household vs Social (Chart 3 from PPT)
function initIntSindhMixChart() {
  const ctx = document.getElementById('intSindhMixChart');
  if (!ctx) return;

  state.charts.intSindhMix = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['SDR Administered (%)', 'Refusal (%)'],
      datasets: [
        {
          label: 'Household Contacts',
          data: [89.7, 0.46],
          backgroundColor: '#10b981',
          borderRadius: 6,
          minBarLength: 20 // Makes 0.46% distinctly visible as a clear bar stub
        },
        {
          label: 'Social / Neighbour Contacts',
          data: [90.6, 0.77],
          backgroundColor: '#14b8a6',
          borderRadius: 6,
          minBarLength: 20 // Makes 0.77% distinctly visible
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 28, left: 10, right: 10 }
      },
      plugins: {
        legend: { position: 'top' },
        datalabels: getDataLabelsConfig('percent')
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 110,
          ticks: { callback: v => v <= 100 ? v + '%' : '' }
        }
      }
    }
  });
}

// Total Sindh Outcome Distribution Donut
function initSindhDistributionChart() {
  const ctx = document.getElementById('sindhDistributionChart');
  if (!ctx) return;

  state.charts.sindhDistribution = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['SDR Administered (24,541)', 'Refusals (7,777)', 'Prior SDR Received (3,175)', 'Leprosy Suspects (109)', 'Other / Excluded (6,169)'],
      datasets: [{
        data: [24541, 7777, 3175, 109, 6169],
        backgroundColor: ['#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#94a3b8'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right' },
        datalabels: {
          color: '#ffffff',
          font: { weight: 'bold', size: 11, family: "'JetBrains Mono', monospace" },
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderRadius: 4,
          padding: 3,
          formatter: (val, ctx) => {
            const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const pct = ((val / total) * 100).toFixed(1);
            return pct > 2 ? pct + '%' : '';
          }
        }
      },
      cutout: '60%'
    }
  });
}

// Trend Charts for Slides 2 & 3
function initTrendCharts() {
  // Karachi 2025 vs 2026 Trend
  const ctxK = document.getElementById('karachiTrendChart');
  if (ctxK) {
    state.charts.karachiTrend = new Chart(ctxK, {
      type: 'bar',
      data: {
        labels: ['2025 (12,936 screened)', '2026 (16,106 screened)'],
        datasets: [
          {
            label: 'SDR Given',
            data: [5769, 7282],
            backgroundColor: '#10b981',
            borderRadius: 6,
            minBarLength: 18
          },
          {
            label: 'Refusals',
            data: [4378, 3325],
            backgroundColor: '#ef4444',
            borderRadius: 6,
            minBarLength: 18
          },
          {
            label: 'Previous SDR',
            data: [1230, 1763],
            backgroundColor: '#f59e0b',
            borderRadius: 6,
            minBarLength: 18
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { top: 28, left: 10, right: 10 }
        },
        plugins: {
          legend: { position: 'top' },
          datalabels: getDataLabelsConfig('count')
        },
        scales: {
          y: {
            beginAtZero: true,
            grace: '15%'
          }
        }
      }
    });
  }

  // Interior Sindh 2025 vs 2026 Trend (With Low-Value Zoom on Refusals & Suspects)
  const ctxI = document.getElementById('interiorTrendChart');
  if (ctxI) {
    state.charts.interiorTrend = new Chart(ctxI, {
      type: 'bar',
      data: {
        labels: ['2025 (6,903 screened)', '2026 (5,826 screened)'],
        datasets: [
          {
            label: 'SDR Given',
            data: [6190, 5300],
            backgroundColor: '#10b981',
            borderRadius: 6,
            minBarLength: 18
          },
          {
            label: 'Refusals',
            data: [61, 21],
            backgroundColor: '#ef4444',
            borderRadius: 6,
            minBarLength: 20 // Makes 61 & 21 visible even when compared against 6000
          },
          {
            label: 'Leprosy Suspects',
            data: [36, 35],
            backgroundColor: '#8b5cf6',
            borderRadius: 6,
            minBarLength: 20 // Makes 36 & 35 visible
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { top: 28, left: 10, right: 10 }
        },
        plugins: {
          legend: { position: 'top' },
          datalabels: getDataLabelsConfig('count')
        },
        scales: {
          y: {
            beginAtZero: true,
            grace: '15%'
          }
        }
      }
    });

    // Interactive Zoom on Refusals and Suspects
    let isInteriorZoomed = false;
    const intZoomBtn = document.getElementById('toggleInteriorZoomBtn');
    if (intZoomBtn) {
      intZoomBtn.addEventListener('click', () => {
        isInteriorZoomed = !isInteriorZoomed;
        if (isInteriorZoomed) {
          // Temporarily hide the large SDR dataset to magnify Refusals & Suspects
          state.charts.interiorTrend.data.datasets[0].hidden = true;
          state.charts.interiorTrend.options.scales.y.max = 80;
          intZoomBtn.innerHTML = '<span>↺ Show All (Include SDR)</span>';
          intZoomBtn.classList.add('active');
        } else {
          state.charts.interiorTrend.data.datasets[0].hidden = false;
          delete state.charts.interiorTrend.options.scales.y.max;
          intZoomBtn.innerHTML = '<span>🔍 Refusals &amp; Suspects Zoom</span>';
          intZoomBtn.classList.remove('active');
        }
        state.charts.interiorTrend.update();
      });
    }
  }
}

// What-If Simulator Chart
function initSimulatorChart() {
  const ctx = document.getElementById('simImpactChart');
  if (!ctx) return;

  state.charts.simImpact = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Current Baseline', 'Simulated Scenario'],
      datasets: [
        {
          label: 'Total Protected with SDR',
          data: [24541, 24541],
          backgroundColor: '#10b981',
          borderRadius: 6,
          minBarLength: 18
        },
        {
          label: 'Remaining Refusals',
          data: [7777, 7777],
          backgroundColor: '#ef4444',
          borderRadius: 6,
          minBarLength: 18
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 28, left: 10, right: 10 }
      },
      plugins: {
        legend: { position: 'top' },
        datalabels: getDataLabelsConfig('count')
      },
      scales: {
        y: {
          beginAtZero: true,
          grace: '15%'
        }
      }
    }
  });
}

// ==========================================================================
// 8. What-If Simulator Logic
// ==========================================================================

function initSimulator() {
  const refusalSlider = document.getElementById('simRefusalReduction');
  const coverageSlider = document.getElementById('simCoverageBoost');
  const refusalVal = document.getElementById('simRefusalVal');
  const coverageVal = document.getElementById('simCoverageVal');
  const resetBtn = document.getElementById('resetSimBtn');

  function updateSimulation() {
    const redPct = parseInt(refusalSlider ? refusalSlider.value : 0, 10);
    const covPct = parseInt(coverageSlider ? coverageSlider.value : 0, 10);

    if (refusalVal) refusalVal.textContent = `${redPct}% reduction`;
    if (coverageVal) coverageVal.textContent = `+${covPct}% screened`;

    const kScreened = 29042;
    const kRefusals = 7703;
    const kSdr = 13051;
    const intSdr = 11490;
    const intRefusals = 74;

    const convertedAcceptors = Math.round(kRefusals * (redPct / 100));
    const newKRefusals = kRefusals - convertedAcceptors;

    const additionalScreened = Math.round(kScreened * (covPct / 100));
    const sdrFromNewScreened = Math.round(additionalScreened * 0.70);

    const projectedSdrTotal = kSdr + convertedAcceptors + sdrFromNewScreened + intSdr;
    const projectedRefusalTotal = newKRefusals + intRefusals;
    const totalAdditionalProtected = convertedAcceptors + sdrFromNewScreened;

    // Averted potential transmissions estimate
    const transmissionsAverted = Math.round(totalAdditionalProtected * 0.015);

    const elAddProtected = document.getElementById('simAdditionalProtected');
    const elTransAverted = document.getElementById('simTransmissionsAverted');
    const elNewAcceptance = document.getElementById('simNewAcceptanceRate');

    if (elAddProtected) elAddProtected.textContent = `+${totalAdditionalProtected.toLocaleString()}`;
    if (elTransAverted) elTransAverted.textContent = `~${transmissionsAverted}`;
    if (elNewAcceptance) {
      const totalEvaluated = 41771 + additionalScreened;
      const rate = ((projectedSdrTotal / totalEvaluated) * 100).toFixed(1);
      elNewAcceptance.textContent = `${rate}% (up from 58.8%)`;
    }

    if (state.charts.simImpact) {
      state.charts.simImpact.data.datasets[0].data[1] = projectedSdrTotal;
      state.charts.simImpact.data.datasets[1].data[1] = projectedRefusalTotal;
      state.charts.simImpact.update();
    }
  }

  if (refusalSlider) refusalSlider.addEventListener('input', updateSimulation);
  if (coverageSlider) coverageSlider.addEventListener('input', updateSimulation);
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (refusalSlider) refusalSlider.value = 50;
      if (coverageSlider) coverageSlider.value = 10;
      updateSimulation();
    });
  }

  updateSimulation();
}

// ==========================================================================
// 9. Interactive Action Matrix (Slide 11)
// ==========================================================================

function initActionMatrix() {
  renderActionItems();

  const filterBtns = document.querySelectorAll('.filter-pill');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.actionFilter = btn.getAttribute('data-filter');
      renderActionItems();
    });
  });

  const addActionBtn = document.getElementById('openAddActionModalBtn');
  const modal = document.getElementById('addActionModal');
  const closeBtn = document.getElementById('closeActionModalBtn');
  const form = document.getElementById('newActionForm');

  if (addActionBtn && modal) {
    addActionBtn.addEventListener('click', () => modal.classList.add('active'));
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const challenge = document.getElementById('inputChallenge').value;
      const action = document.getElementById('inputAction').value;
      const team = document.getElementById('inputTeam').value;
      const timeline = document.getElementById('inputTimeline').value;
      const category = document.getElementById('inputCategory').value;

      const newItem = {
        id: Date.now(),
        challenge,
        action,
        team,
        timeline,
        category,
        status: 'pending',
        completed: false
      };

      state.actionItems.unshift(newItem);
      saveActionItems();
      renderActionItems();
      form.reset();
      modal.classList.remove('active');
    });
  }
}

function renderActionItems() {
  const container = document.getElementById('actionItemsContainer');
  if (!container) return;

  const filtered = state.actionFilter === 'all'
    ? state.actionItems
    : state.actionItems.filter(item => item.category === state.actionFilter);

  if (filtered.length === 0) {
    container.innerHTML = '<div class="p-6 text-center text-muted">No action items match the selected category filter.</div>';
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="action-item-card ${item.completed ? 'completed' : ''}" id="actionCard-${item.id}">
      <div>
        <label class="custom-checkbox">
          <input type="checkbox" ${item.completed ? 'checked' : ''} onchange="toggleActionItem(${item.id})">
          <span></span>
        </label>
      </div>
      <div>
        <div class="flex items-center gap-2 mb-1" style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          <span class="badge badge-neutral text-xs uppercase">${item.category}</span>
          <span class="badge ${item.completed ? 'badge-success' : 'badge-warning'} text-xs">
            ${item.completed ? 'Completed' : (item.status === 'in_progress' ? 'In Progress' : 'Agreed')}
          </span>
          <span class="text-xs text-muted font-mono">Timeline: ${item.timeline}</span>
        </div>
        <div class="font-bold text-sm mb-1 action-title-text">${item.challenge}</div>
        <p class="text-xs text-muted mb-2"><strong>Agreed Action:</strong> ${item.action}</p>
        <div class="text-xs text-muted"><strong>Lead Responsibility:</strong> ${item.team}</div>
      </div>
      <div>
        <button class="btn btn-sm btn-outline text-danger" onclick="deleteActionItem(${item.id})" title="Remove action item">✕</button>
      </div>
    </div>
  `).join('');

  updateActionSummaryCounts();
}

window.toggleActionItem = function(id) {
  const item = state.actionItems.find(i => i.id === id);
  if (item) {
    item.completed = !item.completed;
    item.status = item.completed ? 'completed' : 'in_progress';
    saveActionItems();
    renderActionItems();
  }
};

window.deleteActionItem = function(id) {
  if (confirm('Are you sure you want to remove this workshop action item?')) {
    state.actionItems = state.actionItems.filter(i => i.id !== id);
    saveActionItems();
    renderActionItems();
  }
};

function saveActionItems() {
  localStorage.setItem('malc_sdr_action_plan_v1', JSON.stringify(state.actionItems));
}

function updateActionSummaryCounts() {
  const total = state.actionItems.length;
  const done = state.actionItems.filter(i => i.completed).length;
  const el = document.getElementById('actionPlanProgressText');
  if (el) el.textContent = `${done} of ${total} commitments implemented (${total > 0 ? Math.round((done/total)*100) : 0}%)`;
}

// ==========================================================================
// 10. Problem Tree Image Lightbox
// ==========================================================================

function initProblemTreeViewer() {
  const img = document.getElementById('problemTreeImg');
  if (!img) return;
  img.addEventListener('click', () => {
    window.open(img.src, '_blank');
  });
}
