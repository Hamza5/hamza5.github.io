// The location map used to stream tiles straight from CARTO's CDN. As of
// 23 September 2026 those endpoints require an API key, and a key that the
// browser has to send has to live in the public bundle — where anyone can lift
// it and spend the quota. So the tiles are pre-rendered here instead and served
// from our own origin; the key is only ever read by this script.
//
// The map never needed a planet's worth of tiles: it is one fixed viewport over
// one city, with no pan or zoom chrome. What it needs instead is a *bounded*
// pyramid — a small window of tiles per zoom level, centred on the marker, which
// shrinks geographically as you zoom in. That is what keeps this at a few hundred
// files rather than the tens of thousands a real slippy map wants.
//
// Region, zoom range and window size live in app/data/map-region.json, which the
// map component also reads. The window is validated against the card's size
// there, because Leaflet loads a half-screen buffer of tiles around the viewport
// and a window that does not cover it 404s at the edges of the card.
//
// Runs via npm's prebuild/predev hooks, so CI must call `npm run build`.
// Set SKIP_MAP_TILES=1 to skip (e.g. when working on unrelated parts of the
// site without a key); --force re-downloads even when nothing has changed.
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();
const CONFIG_PATH = join(ROOT, "app", "data", "map-region.json");
const PROFILE_PATH = join(ROOT, "app", "data", "profile.ts");
const OUT_DIR = join(ROOT, "public", "maptiles");
const MANIFEST_PATH = join(OUT_DIR, "manifest.json");

const TILE_SIZE = 256;
const CONCURRENCY = 8;
const ATTEMPTS = 3;
const MIN_TILE_BYTES = 64; // a truncated response, as opposed to a very flat all-sea tile
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47]);

// Next.js loads .env files for its own process, but npm runs this script as a
// separate one, before that happens — so the key has to be picked up from
// .env.local here. A key already in the environment wins, which is how CI
// passes it in.
if (!process.env.BASEMAPS_API_KEY && typeof process.loadEnvFile === "function") {
  const envFile = join(ROOT, ".env.local");
  if (existsSync(envFile)) process.loadEnvFile(envFile);
}

const key = process.env.BASEMAPS_API_KEY;

if (process.env.SKIP_MAP_TILES) {
  console.log("[map] SKIP_MAP_TILES set — leaving existing tiles alone");
  process.exit(0);
}

if (!key) {
  console.error("[map] BASEMAPS_API_KEY is not set.");
  console.error("[map] Put it in .env.local, or set SKIP_MAP_TILES=1 to build without the map.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const config = JSON.parse(await readFile(CONFIG_PATH, "utf8"));
const { minZoom, maxZoom, window, viewport, retina, styles } = config;
const styleNames = Object.values(styles);

// The window has to be odd on both axes, otherwise it cannot be centred on the
// marker's own tile and the region would be lopsided.
if (window.x % 2 === 0 || window.y % 2 === 0) {
  console.error(`[map] window must be odd on both axes, got ${window.x}x${window.y}`);
  process.exit(1);
}
if (minZoom > maxZoom) {
  console.error(`[map] minZoom ${minZoom} is above maxZoom ${maxZoom}`);
  process.exit(1);
}

// Leaflet loads every tile covering the card *plus* a half-screen buffer on each
// side, and the map's view is pinned to the location, so that buffer is the only
// slack there is. Too small a window and the edges of the card reach for tiles
// that were never generated — a 404 per edge, per zoom.
for (const [axis, size] of [["x", viewport.width], ["y", viewport.height]]) {
  const needed = 2 * (Math.ceil(size / 2 / TILE_SIZE) + 1) + 1;
  if (window[axis] < needed) {
    console.error(`[map] window.${axis} is ${window[axis]} but a ${size}px card needs at least ${needed}.`);
    console.error(`[map] Either widen the window, or narrow .basic-info-container and update \`viewport\`.`);
    process.exit(1);
  }
}

// The location is read from the profile rather than duplicated here, so the
// window can never drift away from the marker it is meant to contain.
const center = readLocationFromProfile(await readFile(PROFILE_PATH, "utf8"));

/** Pulls the one location block out of the profile source. */
function readLocationFromProfile(source) {
  const block = /location:\s*\{([^}]*)\}/.exec(source);
  if (!block) {
    console.error(`[map] no \`location: {…}\` block found in ${PROFILE_PATH}`);
    process.exit(1);
  }
  const read = (field) => {
    const match = new RegExp(`${field}:\\s*(-?[\\d.]+)`).exec(block[1]);
    if (!match) {
      console.error(`[map] no \`${field}\` in the location block of ${PROFILE_PATH}`);
      process.exit(1);
    }
    return Number(match[1]);
  };
  return { lat: read("latitude"), lng: read("longitude") };
}

// ---------------------------------------------------------------------------
// Web Mercator tile maths
// ---------------------------------------------------------------------------

function lngToTileX(lng, z) {
  return ((lng + 180) / 360) * 2 ** z;
}

function latToTileY(lat, z) {
  const rad = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** z;
}

const zooms = Array.from({ length: maxZoom - minZoom + 1 }, (_, i) => minZoom + i);

/** Inclusive tile range covering the marker at zoom `z`. */
function windowAt(z) {
  const halfX = Math.floor(window.x / 2);
  const halfY = Math.floor(window.y / 2);
  const cx = Math.floor(lngToTileX(center.lng, z));
  const cy = Math.floor(latToTileY(center.lat, z));
  return { cx, cy, x0: cx - halfX, x1: cx + halfX, y0: cy - halfY, y1: cy + halfY };
}

// ---------------------------------------------------------------------------
// Download
// ---------------------------------------------------------------------------

const suffixes = retina ? ["", "@2x"] : [""];
const jobs = [];
for (const style of styleNames) {
  for (const z of zooms) {
    const { x0, x1, y0, y1 } = windowAt(z);
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        for (const suffix of suffixes) {
          jobs.push({ style, z, x, y, suffix });
        }
      }
    }
  }
}

const tileUrl = ({ style, z, x, y, suffix }, withKey = true) =>
  `https://basemaps.cartocdn.com/rastertiles/${style}/${z}/${x}/${y}${suffix}.png${withKey ? `?key=${key}` : ""}`;

/**
 * A rejected or missing key does not error — the CDN answers 200 with a
 * placeholder tile. Comparing one keyed response against the same tile fetched
 * anonymously catches that before it reaches the disk.
 */
async function assertKeyWorks() {
  const probe = { style: styleNames[0], z: zooms[Math.floor(zooms.length / 2)], ...originTile() };
  const [keyed, anonymous] = await Promise.all([fetch(tileUrl(probe)), fetch(tileUrl(probe, false))]);
  const [a, b] = await Promise.all([keyed.arrayBuffer(), anonymous.arrayBuffer()]);
  if (Buffer.compare(Buffer.from(a), Buffer.from(b)) === 0) {
    console.error("[map] CARTO returned the same tile with and without the key.");
    console.error("[map] The key is missing, expired, out of quota, or restricted to domains/IPs that exclude this machine.");
    process.exit(1);
  }
}

function originTile() {
  const z = zooms[Math.floor(zooms.length / 2)];
  const { cx, cy } = windowAt(z);
  return { x: cx, y: cy, suffix: "" };
}

/** Fetches one tile, retrying transient failures with a backoff. */
async function fetchTile(job) {
  let lastError;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const response = await fetch(tileUrl(job));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const type = response.headers.get("content-type") ?? "";
      if (!type.includes("image/png")) throw new Error(`unexpected content-type ${type}`);

      const body = Buffer.from(await response.arrayBuffer());
      if (body.length < MIN_TILE_BYTES) throw new Error(`truncated response (${body.length} bytes)`);
      if (!body.subarray(0, 4).equals(PNG_MAGIC)) throw new Error("not a PNG");
      if (body.readUInt32BE(16) !== TILE_SIZE || body.readUInt32BE(20) !== TILE_SIZE) {
        throw new Error(`wrong tile dimensions ${body.readUInt32BE(16)}x${body.readUInt32BE(20)}`);
      }
      return body;
    } catch (error) {
      lastError = error;
      if (attempt < ATTEMPTS) await new Promise((r) => setTimeout(r, 250 * 2 ** (attempt - 1)));
    }
  }
  throw new Error(`${tileUrl(job).replace(`?key=${key}`, "")}: ${lastError.message}`);
}

/** Runs `worker` over `items` with a fixed number of requests in flight. */
async function pool(items, limit, worker) {
  const failures = [];
  const created = new Set();
  let index = 0;
  let bytes = 0;
  const hashes = new Set();

  const run = async () => {
    while (index < items.length) {
      const job = items[index++];
      try {
        const body = await worker(job);
        const path = join(OUT_DIR, job.style, String(job.z), String(job.x), `${job.y}${job.suffix}.png`);
        const dir = path.slice(0, path.lastIndexOf("/"));
        if (!created.has(dir)) {
          await mkdir(dir, { recursive: true });
          created.add(dir);
        }
        await writeFile(path, body);
        bytes += body.length;
        hashes.add(createHash("sha1").update(body).digest("base64"));
      } catch (error) {
        failures.push(error.message);
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return { failures, bytes, distinct: hashes.size };
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

const stamp = createHash("sha1").update(JSON.stringify({ config, count: jobs.length, key: key.length })).digest("hex");
if (!process.argv.includes("--force")) {
  const previous = await readFile(MANIFEST_PATH, "utf8").then(JSON.parse).catch(() => null);
  if (previous?.stamp === stamp) {
    console.log(`[map] ${jobs.length} tiles unchanged — skipping`);
    process.exit(0);
  }
}

// Only now that we know tiles are actually needed: an unchanged config should
// not depend on the network, or on the key still being valid.
await assertKeyWorks();

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

console.log(`[map] ${jobs.length} tiles · ${styleNames.join(", ")} · z${zooms[0]}–z${zooms[zooms.length - 1]} · ${window.x}x${window.y}${retina ? " @2x" : ""}`);

const { failures, bytes, distinct } = await pool(jobs, CONCURRENCY, fetchTile);

if (failures.length > 0) {
  console.error(`[map] ${failures.length}/${jobs.length} tiles failed:`);
  for (const failure of failures.slice(0, 5)) console.error(`[map]   ${failure}`);
  if (failures.length > 5) console.error(`[map]   …and ${failures.length - 5} more`);
  process.exit(1);
}

// Every tile coming back identical means the CDN is serving one placeholder for
// the whole pyramid — the exact failure this script exists to prevent.
if (distinct < jobs.length / 2) {
  console.error(`[map] only ${distinct} distinct images across ${jobs.length} tiles — CARTO is serving a placeholder, not the basemap.`);
  process.exit(1);
}

await writeFile(MANIFEST_PATH, `${JSON.stringify({ stamp, tiles: jobs.length, bytes, center, minZoom, maxZoom, window, styles }, null, 2)}\n`);

console.log(`[map] ${jobs.length} tiles · ${(bytes / 1024 / 1024).toFixed(2)} MB · ${distinct} distinct images · written to public/maptiles`);
