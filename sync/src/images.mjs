// Resizes Drive photos to web size and skips any photo whose source and preset haven't changed
// since the last sync (tracked in sync/image-manifest.json).
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { CROP_POSITIONS, IMAGE_PRESETS, slugify } from './schema.mjs';

// Bump to force every image to be re-processed (e.g. after changing the WebP quality).
const PIPELINE_VERSION = 1;

export async function loadManifest(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return {};
  }
}

// Works out the file each photo becomes and whether it still needs resizing, without
// downloading anything. Lets the caller print a plan before the slow part starts.
export function planImages({ requests, outDir, manifest, errors }) {
  const claimed = new Map();
  const jobs = [];

  for (const [key, req] of requests) {
    const base = slugify(req.name.replace(/\.[^.]+$/, '')) || 'image';
    const outRel = `${req.folder}/${base}${req.crop ? `-${req.crop}` : ''}.webp`;
    const other = claimed.get(outRel);
    if (other && other !== req.name) {
      errors.push(`Drive folder "${req.folder}": "${other}" and "${req.name}" would both become ${base}.webp on the website. Rename one of them.`);
      continue;
    }
    claimed.set(outRel, req.name);

    // A row's crop overrides where the photo is cropped from. It is part of the fingerprint, so
    // changing the crop in the Sheet re-processes just that photo.
    const preset = { ...IMAGE_PRESETS[req.folder] };
    if (req.crop) preset.position = CROP_POSITIONS[req.crop];
    const hash = `${req.file.checksum}|${JSON.stringify(preset)}|v${PIPELINE_VERSION}`;
    const entry = manifest[outRel];

    jobs.push({
      key,
      req,
      outRel,
      preset,
      hash,
      entry,
      reuse: entry?.hash === hash && existsSync(path.join(outDir, outRel)),
    });
  }
  return jobs;
}

export async function processImages({ jobs, source, outDir, publicBase, errors, onProgress }) {
  const next = {};
  const byKey = new Map();
  const stats = { processed: 0, reused: 0 };

  for (const [index, job] of jobs.entries()) {
    const position = index + 1;
    let entry = job.entry;

    if (job.reuse) {
      stats.reused++;
      onProgress?.({ position, total: jobs.length, action: 'unchanged', job });
    } else {
      try {
        const input = await source.readFile(job.req.file);
        const { data, info } = await sharp(input, { failOn: 'error' })
          .rotate()
          .resize(job.preset)
          .webp({ quality: 80 })
          .toBuffer({ resolveWithObject: true });
        await mkdir(path.dirname(path.join(outDir, job.outRel)), { recursive: true });
        await writeFile(path.join(outDir, job.outRel), data);
        entry = {
          source: job.req.name,
          hash: job.hash,
          width: info.width,
          height: info.height,
          ...(job.req.crop ? { crop: job.req.crop } : {}),
        };
        stats.processed++;
        onProgress?.({ position, total: jobs.length, action: 'resized', job, bytes: data.length });
      } catch (err) {
        errors.push(`Drive folder "${job.req.folder}": couldn't read "${job.req.name}" as an image (${err.message}). Re-export it as JPG or PNG.`);
        continue;
      }
    }

    next[job.outRel] = entry;
    byKey.set(job.key, { src: `${publicBase}/${job.outRel}`, width: entry.width, height: entry.height });
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
