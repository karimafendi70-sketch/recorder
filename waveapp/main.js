const appTitle = document.getElementById('appTitle');
const yearEl = document.getElementById('year');

if (appTitle) {
  appTitle.textContent = 'waveapp';
}

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}
