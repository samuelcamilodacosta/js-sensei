// #59 — __dirname equivalent in ESM
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filenameBefore = 'use import.meta.url instead of __dirname';
const __dirnameAfter = path.dirname(fileURLToPath(import.meta.url));

export { __filenameBefore, __dirnameAfter };
