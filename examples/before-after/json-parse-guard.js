// #53 — guarded JSON.parse

export function parseConfigBefore(raw) {
  return JSON.parse(raw);
}

export function parseConfigAfter(raw) {
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new SyntaxError('Invalid JSON configuration', { cause: error });
  }
}
