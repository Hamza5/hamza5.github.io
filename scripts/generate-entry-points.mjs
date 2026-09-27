// Two jobs, both after `next build`, adding the entry points the static export
// does not produce on its own:
//
// 1. Trailing-slash twins. The export writes every route as a single file
//    (out/en/about.html). GitHub Pages answers /en/about from that file, but
//    /en/about/ looks for en/about/index.html — which does not exist — so any
//    URL that arrived with a trailing slash 404s. Each page is mirrored to
//    <path>/index.html so both spellings resolve.
//
// 2. Un-prefixed entry points. Pages are exported as /{lang}/…, so a URL with no
//    language prefix — hamza5.github.io/about, or a link pasted out of a search
//    result — falls through to the 404 page. Each un-prefixed path gets a small
//    redirect document that sends the visitor to that same page in their own
//    language, using the same detection order as the root gate.
//
// The locale list and the default come from the JSON blob the root gate page
// publishes, so this cannot drift from the app's own routing. The stub's own
// script is kept deliberately small and independent of the hashed CSS chunks;
// the document is only ever seen by a browser that runs neither the script nor
// the <noscript> refresh, so it carries its own minimal styling.
//
// Runs via npm's postbuild hook, so CI must call `npm run build`.
import { access, copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT = "out";
const GATE = join(OUT, "index.html");

/** Route handler output (social cards) is not a page and gets no twin. */
const EXCLUDED_SEGMENTS = new Set(["og", "_next", "_not-found"]);

/**
 * The un-prefixed route a file inside a locale directory stands for, or null if
 * it is not a page. `index.html` is excluded because step 1 already writes one
 * of those per page, and reading it back here would invent routes such as
 * /about/index.
 */
function pagePath(relative) {
  const segments = relative.split("/");
  if (segments[segments.length - 1] === "index.html") return null;
  if (segments.some((segment) => EXCLUDED_SEGMENTS.has(segment))) return null;
  const route = relative.replace(/\.html$/, "");
  // Never "/" or "": a stub for those would resolve to out/index.html and
  // overwrite the home page with a redirect to itself.
  return route === "" ? null : `/${route}`;
}

const problems = [];

const exists = (path) =>
  access(path).then(
    () => true,
    () => false,
  );

/** Every .html file under a directory, recursively. */
async function htmlFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) found.push(full);
  }
  return found;
}

// ── Configuration, read back from the rendered root gate ────────────────────

if (!(await exists(GATE))) {
  console.error("[paths] out/index.html is missing — did the export run?");
  process.exit(1);
}

const gateHtml = await readFile(GATE, "utf8");

const configMatch = gateHtml.match(
  /<script[^>]+id="locale-config"[^>]*>([\s\S]*?)<\/script>/,
);
if (!configMatch) {
  console.error('[paths] could not find the #locale-config blob in out/index.html');
  process.exit(1);
}

let config;
try {
  config = JSON.parse(configMatch[1]);
} catch (error) {
  console.error(`[paths] #locale-config is not valid JSON: ${error.message}`);
  process.exit(1);
}

const { locales, default: defaultLocale, basePath = "" } = config;
if (!Array.isArray(locales) || locales.length === 0 || !locales.includes(defaultLocale)) {
  console.error(`[paths] #locale-config is unusable: ${JSON.stringify(config)}`);
  process.exit(1);
}

/** basePath + /{locale}{path}, matching what the app itself links to. */
const localeUrl = (locale, path) =>
  `${basePath}/${locale}${path ? `/${path.replace(/^\/+/, "")}` : ""}`;

/**
 * The redirect, inlined into the stub. Same order as the app's own gate:
 * an explicit stored choice, then the browser's preference list, then default.
 * `s` and the list read are guarded because localStorage throws in private mode.
 */
const redirectScript = (path) => `
(function(){
var S=${JSON.stringify(locales)},D=${JSON.stringify(defaultLocale)},R=${JSON.stringify(
  basePath + (path ? `/${path.replace(/^\/+/, "")}` : ""),
)},t=null;
try{
var s=null;try{s=localStorage.getItem("lang")}catch(e){}
if(s){var p=s.toLowerCase().split(/[-_]/)[0];if(S.indexOf(p)>-1)t=p}
if(!t){var L=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language];
for(var i=0;i<L.length;i++){if(!L[i])continue;var q=L[i].toLowerCase().split(/[-_]/)[0];if(S.indexOf(q)>-1){t=q;break}}}
}catch(e){}
location.replace("/"+(t||D)+R);
})();`.trim();

/** Links are labelled with the code itself, so nothing here is translated. */
const gateBody = (path) => `
<main>
<p class="n">Hamza Abbad</p>
<nav>${locales
  .map(
    (locale) =>
      `<a href="${localeUrl(locale, path)}" lang="${locale}" hreflang="${locale}">${locale.toUpperCase()}</a>`,
  )
  .join("")}</nav>
</main>`;

const STYLES = `
:root{color-scheme:light dark}
body{margin:0;min-height:100vh;display:grid;place-items:center;font:1rem/1.5 system-ui,sans-serif;
background:Canvas;color:CanvasText}
main{display:flex;flex-direction:column;align-items:center;gap:1.25rem;padding:3rem 1.5rem;text-align:center}
.n{font-size:1.5rem;font-weight:800;margin:0}
nav{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center}
a{padding:.6rem 1.1rem;border:1px solid;color:inherit;border-radius:.75rem;text-decoration:none;font-weight:600}
a:hover{border-color:currentColor}
a:focus-visible{outline:2px solid currentColor;outline-offset:3px}`.trim();

const stubHtml = (path) => `<!DOCTYPE html>
<html lang="${defaultLocale}" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,follow">
<title>Redirecting…</title>
<script>${redirectScript(path)}</script>
<noscript><meta http-equiv="refresh" content="0;url=${localeUrl(defaultLocale, path)}"></noscript>
<style>${STYLES}</style>
</head>
<body>${gateBody(path)}
</body>
</html>
`;

// ── 1. Trailing-slash twins ────────────────────────────────────────────────

let twins = 0;

/** Copies `<dir>/<name>.html` to `<dir>/<name>/index.html` when it is missing. */
async function mirror(source, target) {
  await mkdir(join(target, ".."), { recursive: true });
  if (await exists(target)) return;
  await copyFile(source, target);
  twins++;
}

for (const locale of locales) {
  const root = join(OUT, locale);
  if (!(await exists(join(OUT, `${locale}.html`)))) {
    problems.push(`${locale}: out/${locale}.html is missing`);
    continue;
  }
  await mirror(join(OUT, `${locale}.html`), join(root, "index.html"));

  for (const file of await htmlFiles(root).catch(() => [])) {
    const path = pagePath(file.slice(root.length + 1));
    if (path === null) continue;
    await mirror(file, join(root, path, "index.html"));
  }
}

// ── 2. Un-prefixed entry points ────────────────────────────────────────────

const pagesByLocale = new Map(locales.map((locale) => [locale, new Set()]));

for (const locale of locales) {
  const root = join(OUT, locale);
  if (!(await exists(root))) continue;
  pagesByLocale.get(locale).add("");

  for (const file of await htmlFiles(root).catch(() => [])) {
    const path = pagePath(file.slice(root.length + 1));
    if (path === null) continue;
    pagesByLocale.get(locale).add(path);
  }
}

// Every locale has to publish the same set of pages, otherwise the stubs would
// send some languages to a page that was never exported.
const reference = [...pagesByLocale.get(locales[0])].sort();
for (const locale of locales.slice(1)) {
  const own = [...pagesByLocale.get(locale)].sort();
  for (const path of reference) {
    if (!own.includes(path)) problems.push(`${locale}: no page exported for ${path}`);
  }
  for (const path of own) {
    if (!reference.includes(path)) problems.push(`${locale}: extra page ${path}`);
  }
}

const unprefixed = reference.filter((path) => path !== "");
let stubs = 0;

for (const path of unprefixed) {
  const file = join(OUT, `${path.replace(/^\//, "")}.html`);
  const directory = join(OUT, path);
  // out/index.html is the rendered gate page, and "" / "/" both resolve to it.
  if (file === GATE || directory === OUT) {
    problems.push(`refusing to write a stub for "${path}" — it would overwrite the home page`);
    continue;
  }
  const document = stubHtml(path);
  await writeFile(file, document);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "index.html"), document);
  stubs += 2;
}

console.log(
  `[paths] ${twins} trailing-slash twin(s), ${stubs} un-prefixed redirect(s) across ${unprefixed.length} path(s)`,
);

if (problems.length > 0) {
  console.error(`[paths] ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
