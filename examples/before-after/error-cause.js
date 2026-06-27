// Before / After #51-52 — throw string vs Error with cause

class ConfigError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'ConfigError';
  }
}

function loadConfigBefore(raw) {
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw `Invalid config: ${e.message}`; // Bad — no stack
  }
}

function loadConfigAfter(raw) {
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new ConfigError('Invalid configuration file', { cause: error });
  }
}

export { loadConfigBefore, loadConfigAfter };
