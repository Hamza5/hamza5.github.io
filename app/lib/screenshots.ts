import fs from "node:fs";
import path from "node:path";

const SCREENSHOT_DIR = path.join("public", "images", "projects");
const EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "avif"]);

const naturalCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function naturalCompare(a: string, b: string): number {
  return naturalCollator.compare(a, b);
}

export function getProjectScreenshots(projectId: string): string[] {
  const dir = path.join(process.cwd(), SCREENSHOT_DIR, projectId);

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = entries
      .filter(
        (entry) =>
          entry.isFile() &&
          EXTENSIONS.has(path.extname(entry.name).slice(1).toLowerCase())
      )
      .map((entry) => `/images/projects/${projectId}/${entry.name}`)
      .sort(naturalCompare);

    return files;
  } catch (err) {
    const error = err as NodeJS.ErrnoException;
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}
