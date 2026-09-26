import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Installs the bundled card fonts for the process that rasterises them.
 *
 * librsvg resolves `font-family` through fontconfig and does not implement
 * `@font-face`, so a font inlined in the SVG is parsed and discarded. Left
 * alone, every card draws in whatever sans-serif the host happens to ship, and
 * because measurement reads back the same fallback ink, the wrapping is decided
 * by the build machine's fonts rather than by ours. That is how
 * "Ce que je peux construire pour votre entreprise" wrapped into two legal lines
 * on a workstation and into one 838px line on the GitHub runner, failing a card
 * that fits.
 *
 * Registering the family by name pins measurement and rendering to the same
 * faces everywhere. It has to happen before the first rasterisation, because
 * fontconfig reads its configuration once, lazily, on first use — which is why
 * this runs at module scope rather than on a render path.
 *
 * fontconfig also matches each requested weight to the closest face it has, so
 * the Arabic wordmark's 900 lands on the bundled bold Cairo instead of a
 * synthesised smear.
 *
 * The generated configuration includes the host's own, so font resolution
 * outside the cards is unchanged.
 */

let registered = false;

export function registerFonts(): void {
  if (registered) return;
  registered = true;

  // The faces are registered where they already are rather than copied out: a
  // build forks a worker per core, fontconfig holds what it has scanned mapped
  // for as long as the process lives, so one worker rewriting a copy in place
  // truncates it under the others and takes SIGBUS.
  const fonts = join(process.cwd(), "assets/fonts");
  // Under node_modules rather than .next/cache because CI restores the latter
  // between runs, and the configuration embeds an absolute path to the checkout
  // it was generated in. Every path here stays rooted at the project so the
  // bundler can scope what it traces; a temp path makes it trace the whole tree.
  const dir = join(process.cwd(), "node_modules", ".cache", "og-fonts");
  mkdirSync(dir, { recursive: true });

  // An explicit FONTCONFIG_FILE is the host's choice and gets included; the
  // usual location is the fallback. ignore_missing covers a host with neither,
  // since the fonts above are what the cards actually ask for.
  const host = process.env.FONTCONFIG_FILE ?? "/etc/fonts/fonts.conf";
  const config =
    '<?xml version="1.0"?>\n' +
    '<!DOCTYPE fontconfig SYSTEM "fonts.dtd">\n' +
    "<fontconfig>\n" +
    `  <include ignore_missing="yes">${host}</include>\n` +
    `  <dir>${fonts}</dir>\n` +
    `  <cachedir>${join(dir, "cache")}</cachedir>\n` +
    "</fontconfig>\n";

  // Rewritten unconditionally, which also clears a configuration left behind by
  // a build in a different checkout. Workers all reach this during module init
  // and no worker reaches a font lookup until long after, so the rewrite is
  // never observed half-written.
  const configPath = join(dir, "fonts.conf");
  writeFileSync(configPath, config);
  process.env.FONTCONFIG_FILE = configPath;
}

