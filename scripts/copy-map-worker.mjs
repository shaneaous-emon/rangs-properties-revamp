// Runs automatically before `npm run dev` and `npm run build`.
// MapLibre draws the map in a background worker file; this copies that file into /public so the
// browser can load it from this site (always the exact version that is installed).
import fs from 'node:fs';

const from = new URL('../node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs', import.meta.url);
const to = new URL('../public/maplibre-gl-worker.mjs', import.meta.url);
fs.mkdirSync(new URL('../public/', import.meta.url), { recursive: true });
fs.copyFileSync(from, to);
console.log('✔ map worker copied to public/maplibre-gl-worker.mjs');
