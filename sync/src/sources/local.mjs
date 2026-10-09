// Reads tabs from CSV files (one per tab, e.g. Events.csv) and photos from a local folder laid
// out like the Drive folder (events/, team/, sponsors/, gallery/). For testing without Google.
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parseCsv } from '../csv.mjs';
import { looseName } from '../validate.mjs';

export function createLocalSource({ sheetDir, driveDir }) {
  return {
    label: `local files (${path.basename(sheetDir)})`,

    async readTabs(names) {
      const out = {};
      for (const name of names) {
        const file = path.join(sheetDir, `${name}.csv`);
        if (existsSync(file)) out[name] = parseCsv(await readFile(file, 'utf8'));
      }
      return out;
    },

    // Same shape as the Google source: folder names match loosely, and the real name is reported.
    async listFolder(folder) {
      if (!driveDir || !existsSync(driveDir)) return { matchedName: null, files: [], available: [] };
      const children = await readdir(driveDir, { withFileTypes: true });
      const available = children.filter((e) => e.isDirectory()).map((e) => e.name).sort();
      const match = available.find((name) => looseName(name) === looseName(folder));
      if (!match) return { matchedName: null, files: [], available };

      const dir = path.join(driveDir, match);
      const entries = await readdir(dir, { withFileTypes: true });
      const files = await Promise.all(
        entries
          .filter((e) => e.isFile())
          .map(async (e) => {
            const id = path.join(dir, e.name);
            const checksum = createHash('md5').update(await readFile(id)).digest('hex');
            return { name: e.name, id, checksum, mimeType: null };
          }),
      );
      return { matchedName: match, files, available };
    },

    readFile: (file) => readFile(file.id),
  };
}
