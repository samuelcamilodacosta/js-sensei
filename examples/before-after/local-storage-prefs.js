// Before / After — localStorage preferences module (browser)

const KEY = 'app:preferences';
const DEFAULTS = { theme: 'system', density: 'comfortable' };

// Before — ad hoc access scattered in components
function loadThemeBefore() {
  return JSON.parse(localStorage.getItem('theme') || '"dark"');
}

// After — centralized with defaults and parse guard
export function loadPreferences() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function savePreferences(prefs) {
  localStorage.setItem(KEY, JSON.stringify(prefs));
}

export { loadThemeBefore };
