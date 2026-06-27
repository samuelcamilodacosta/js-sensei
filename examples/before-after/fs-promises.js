// Before / After #103 — fs callbacks vs fs/promises (Node.js)
// Run in Node: node examples/before-after/fs-promises.js

import { readFile } from 'node:fs/promises';

// Before (callback style — avoid in new code):
// import { readFile } from 'node:fs';
// readFile('package.json', 'utf8', (err, data) => { ... });

// After
export async function readJsonFile(path) {
  const text = await readFile(path, 'utf8');
  return JSON.parse(text);
}
