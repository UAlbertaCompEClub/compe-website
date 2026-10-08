// Resizes Drive photos to web size and skips any photo whose source and preset haven't changed
// since the last sync (tracked in sync/image-manifest.json).
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { IMAGE_PRESETS, slugify } from './schema.mjs';

// Bump to force every image to be re-processed (e.g. after changing the WebP quality).
const PIPELINE_VERSION = 1;

export async function loadManifest(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return {};
  }
}

export async function processImages({ requests, source, outDir, publicBase, manifest, errors }) {
  const next = {};
  const byKey = new Map();
  const stats = { processed: 0, reused: 0 };

  const claimed = new Map();
  const jobs = [];
  for (const [key, req] of requests) {
    const base = slugify(req.name.replace(/\.[^.]+$/, '')) || 'image';
    const outRel = `${req.folder}/${base}.webp`;
    const other = claimed.get(outRel);
    if (other && other !== req.name) {
      errors.push(`Drive folder "${req.folder}": "${other}" and "${req.name}" would both become ${base}.webp on the website. Rename one of them.`);
      continue;
    }
    claimed.set(outRel, req.name);
    jobs.push({ key, req, outRel });
  }
  if (errors.length) return { byKey, next, stats };

  for (const { key, req, outRel } of jobs) {
    const preset = IMAGE_PRESETS[req.folder];
    const hash = `${req.file.checksum}|${JSON.stringify(preset)}|v${PIPELINE_VERSION}`;
    const outPath = path.join(outDir, outRel);
    let entry = manifest[outRel];

    if (entry?.hash === hash && existsSync(outPath)) {
      stats.reused++;
    } else {
      try {
        const input = await source.readFile(req.file);
        const { data, info } = await sharp(input, { failOn: 'error' })
          .rotate()
          .resize(preset)
          .webp({ quality: 80 })
          .toBuffer({ resolveWithObject: true });
        await mkdir(path.dirname(outPath), { recursive: true });
        await writeFile(outPath, data);
        entry = { source: req.name, hash, width: info.width, height: info.height };
        stats.processed++;
      } catch (err) {
        errors.push(`Drive folder "${req.folder}": couldn't read "${req.name}" as an image (${err.message}). Re-export it as JPG or PNG.`);
        continue;
      }
    }
    next[outRel] = entry;
    byKey.set(key, { src: `${publicBase}/${outRel}`, width: entry.width, height: entry.height });
  }
  return { byKey, next, stats };
}

// Deletes resized images no shown row uses any more.
export async function removeOrphans({ outDir, keep }) {
  let removed = 0;
  for (const folder of Object.keys(IMAGE_PRESETS)) {
    const dir = path.join(outDir, folder);
    if (!existsSync(dir)) continue;
    for (const name of await readdir(dir)) {
      if (!keep[`${folder}/${name}`]) {
        await unlink(path.join(dir, name));
        removed++;
      }
    }
  }
  return removed;
}
