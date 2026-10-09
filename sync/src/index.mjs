#!/usr/bin/env node
// Pulls website content from the Google Sheet + Drive folder (or local CSVs for testing), checks
// it, and writes client/src/data/*.json and client/public/images/content/. If anything is wrong
// it writes nothing, so the live site keeps its last good content.
//
//   node src/index.mjs --source google [--check]
//   node src/index.mjs --source local --drive-dir <folder> [--sheet-dir <csv folder>] [--check]
import { appendFileSync, existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { loadManifest, planImages, processImages, removeOrphans } from './images.mjs';
import { SITE_TAB, TABS } from './schema.mjs';
import { createGoogleSource } from './sources/google.mjs';
import { createLocalSource } from './sources/local.mjs';
import { imageKey, parseSite, parseTab, resolveImageRequests } from './validate.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DATA_DIR = path.join(REPO, 'client', 'src', 'data');
const IMAGE_DIR = path.join(REPO, 'client', 'public', 'images', 'content');
const PUBLIC_BASE = '/images/content';
const MANIFEST = path.join(REPO, 'sync', 'image-manifest.json');

const { values: args } = parseArgs({
  options: {
    source: { type: 'string', default: 'google' },
    'sheet-dir': { type: 'string', default: path.join(REPO, 'sync', 'template') },
    'drive-dir': { type: 'string' },
    check: { type: 'boolean', default: false },
  },
});

// Streams to the console as work happens. In GitHub Actions this appears live in the job log.
const log = (line = '') => console.log(line);

// Also writes to the run's summary page, which only appears once the job has finished.
function report(lines) {
  const text = lines.join('\n');
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n`);
}

function notes(warnings) {
  return warnings.length === 0 ? [] : ['', '#### Notes', ...warnings.map((w) => `- ${w}`)];
}

function fail(errors, warnings = []) {
  report([
    `### Nothing was published: ${errors.length} problem${errors.length === 1 ? '' : 's'} to fix`,
    '',
    ...errors.map((e) => `- ${e}`),
    ...notes(warnings),
    '',
    'Fix these in the Google Sheet or Drive folder, then publish again. The live website has not changed.',
  ]);
  process.exit(1);
}

async function writeIfChanged(file, text) {
  if (existsSync(file) && (await readFile(file, 'utf8')) === text) return false;
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, text);
  return true;
}

const json = (data) => `${JSON.stringify(data, null, 2)}\n`;
const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

// By the order column (blanks last), then date, then position in the Sheet.
function sortRows(rows) {
  return [...rows].sort(
    (a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || (a.date ?? '').localeCompare(b.date ?? '') || a._row - b._row,
  );
}

async function main() {
  let source;
  if (args.source === 'local') {
    source = createLocalSource({
      sheetDir: path.resolve(args['sheet-dir']),
      driveDir: args['drive-dir'] && path.resolve(args['drive-dir']),
    });
  } else if (args.source === 'google') {
    source = await createGoogleSource({
      sheetId: process.env.SHEET_ID,
      folderId: process.env.DRIVE_FOLDER_ID,
      credentialsJson: process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
    });
  } else {
    throw new Error(`Unknown --source "${args.source}". Use google or local.`);
  }

  const errors = [];
  const warnings = [];

  log(`Reading content from ${source.label}...`);
  const values = await source.readTabs([...TABS.map((t) => t.name), SITE_TAB.name]);
  const parsed = TABS.map((tab) => ({ tab, result: parseTab(tab, values[tab.name], errors) }));
  const site = parseSite(SITE_TAB, values[SITE_TAB.name], errors);

  const listings = {};
  for (const folder of new Set(TABS.map((t) => t.imageFolder).filter(Boolean))) {
    listings[folder] = await source.listFolder(folder);
    const matched = listings[folder].matchedName;
    if (matched && matched !== folder) {
      warnings.push(
        `The folder "${folder}" was matched to "${matched}" in Drive. Names are compared ignoring capitalisation and a trailing slash.`,
      );
    }
  }
  const requests = resolveImageRequests(parsed, listings, errors, warnings);
  if (errors.length) fail(errors, warnings);

  const manifest = args.check ? {} : await loadManifest(MANIFEST);
  const jobs = args.check ? [] : planImages({ requests, outDir: IMAGE_DIR, manifest, errors });
  if (errors.length) fail(errors, warnings);

  // The plan, printed before the slow part, so a running job shows what it is about to do.
  const toResize = jobs.filter((job) => !job.reuse);
  log('');
  log('Plan');
  for (const { tab, result } of parsed) {
    log(`  ${tab.name.padEnd(10)} ${result.rows.length} shown, ${result.hidden} hidden`);
  }
  const photoPlan = args.check ? '' : ` - ${toResize.length} to resize, ${jobs.length - toResize.length} unchanged`;
  log(`  ${'Photos'.padEnd(10)} ${requests.size} referenced${photoPlan}`);
  for (const warning of warnings) log(`  note: ${warning}`);
  log('');

  const table = [
    '| Tab | Shown | Hidden |',
    '|---|---|---|',
    ...parsed.map(({ tab, result }) => `| ${tab.name} | ${result.rows.length} | ${result.hidden} |`),
  ];

  if (args.check) {
    report(['### Content check passed', '', ...table, '', `${requests.size} photos referenced.`, ...notes(warnings)]);
    return;
  }

  const { byKey, next, stats } = await processImages({
    jobs,
    source,
    outDir: IMAGE_DIR,
    publicBase: PUBLIC_BASE,
    errors,
    onProgress: ({ position, total, action, job, bytes }) => {
      const counter = `[${String(position).padStart(String(total).length)}/${total}]`;
      const crop = job.req.crop ? ` crop:${job.req.crop}` : '';
      const size = bytes ? ` (${kb(bytes)})` : '';
      log(`${counter} ${action.padEnd(9)} ${job.req.folder}/${job.req.name} -> ${job.outRel}${crop}${size}`);
    },
  });
  if (errors.length) fail(errors, warnings);

  const changed = [];
  for (const { tab, result } of parsed) {
    const rows = sortRows(result.rows).map((row) => {
      const image = (name, alt) => {
        if (!name) return null;
        const found = byKey.get(imageKey(tab.imageFolder, name, tab.columns.crop ? row.crop : null));
        return found ? { ...found, alt } : null;
      };
      return tab.toJson(row, image);
    });
    if (await writeIfChanged(path.join(DATA_DIR, tab.output), json(rows))) changed.push(tab.output);
  }
  if (await writeIfChanged(path.join(DATA_DIR, SITE_TAB.output), json(site))) changed.push(SITE_TAB.output);

  const sortedManifest = Object.fromEntries(Object.entries(next).sort(([a], [b]) => a.localeCompare(b)));
  await writeIfChanged(MANIFEST, json(sortedManifest));
  const removed = await removeOrphans({ outDir: IMAGE_DIR, keep: next });

  log('');
  report([
    `### Content synced from ${source.label}`,
    '',
    ...table,
    '',
    `Photos: ${stats.processed} resized, ${stats.reused} unchanged, ${removed} removed.`,
    changed.length ? `Updated: ${changed.join(', ')}` : 'No data files changed.',
    ...notes(warnings),
  ]);
}

main().catch((err) => {
  if (err.userMessage) fail([err.userMessage]);
  console.error(err);
  process.exit(1);
});
