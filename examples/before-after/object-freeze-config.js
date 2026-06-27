// #62 related — freeze exported config

const settings = { apiUrl: 'https://api.example.com', timeoutMs: 5000 };

export function getConfigBefore() {
  return settings; // mutable by importers
}

export function getConfigAfter() {
  return Object.freeze({ ...settings });
}

export { settings };
