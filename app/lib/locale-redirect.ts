// ---------------------------------------------------------------------------
// Language redirect
//
// "/" and every un-prefixed path (/about, /services/ecommerce) are entry points
// that have to land the visitor on the language they asked for, so the site is
// never left sitting in front of a language gate. The export is static, so
// nothing server-side can read Accept-Language: the decision is made in the
// browser, from an explicit choice in localStorage first, then the browser's own
// preference list, then the default locale.
//
// The logic is emitted as a script string rather than run from a React
// component. A component redirect happens in useEffect, which is after the first
// paint, so the visitor sees the gate flash before being sent onward. A blocking
// <script> in <head> resolves the language before anything is drawn.
// ---------------------------------------------------------------------------

import { defaultLocale, locales, type Locale } from "./locales";
import { localePath } from "./site";

/** localStorage key holding a language the visitor picked explicitly. */
export const LANG_STORAGE_KEY = "lang";

/** "" for a site at the origin, "/repo" for one under a sub-path. */
function normalizeBasePath(basePath: string | undefined): string {
  if (!basePath || basePath === "/") return "";
  return basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
}

/**
 * The basePath this build actually resolved to. Next substitutes it into
 * rendered links, but the hand-written script below is raw HTML, so it has to
 * carry the prefix itself.
 */
export function currentBasePath(): string {
  return normalizeBasePath(process.env.__NEXT_ROUTER_BASEPATH);
}

/** basePath + /{locale}{path} — the URL a visitor ends up on. */
export function localeUrl(locale: Locale, path = "", basePath = currentBasePath()): string {
  return `${normalizeBasePath(basePath)}${localePath(locale, path)}`;
}

/**
 * The redirect itself, as a self-invoking script for one un-prefixed path ("" is
 * the home page). Supported locales and the default are interpolated from the
 * constants the routing uses, so publishing another language cannot leave this
 * behind. localStorage access is individually guarded because it throws in
 * private mode, and the whole search is wrapped so a hostile browser cannot
 * leave the visitor stranded here: the last resort is always the default.
 */
export function localeRedirectScript(path = "", basePath = currentBasePath()): string {
  const root = normalizeBasePath(basePath) + (path ? `/${path.replace(/^\/+/, "")}` : "");

  return `(function(){
var S=${JSON.stringify(locales)},D=${JSON.stringify(defaultLocale)},R=${JSON.stringify(root)},t=null;
try{
var s=null;try{s=localStorage.getItem(${JSON.stringify(LANG_STORAGE_KEY)})}catch(e){}
if(s){var p=s.toLowerCase().split(/[-_]/)[0];if(S.indexOf(p)>-1)t=p}
if(!t){var L=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language];
for(var i=0;i<L.length;i++){if(!L[i])continue;var q=L[i].toLowerCase().split(/[-_]/)[0];if(S.indexOf(q)>-1){t=q;break}}}
}catch(e){}
location.replace("/"+(t||D)+R);
})();`;
}

/**
 * The same inputs the script is built from, published into the root gate page
 * as JSON. scripts/generate-entry-points.mjs reads it back so the un-prefixed
 * entry points it writes cannot drift from the ones rendered here.
 */
export function localeRedirectConfig(): {
  locales: Locale[];
  default: Locale;
  basePath: string;
} {
  return { locales: [...locales], default: defaultLocale, basePath: currentBasePath() };
}
