// Reads tabs from CSV files (one per tab, e.g. Events.csv) and photos from a local folder laid
// out like the Drive folder (events/, team/, sponsors/, gallery/). For testing without Google.
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parseCsv } from '../csv.mjs';

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

    async listFiles(folder) {
      const dir = driveDir && path.join(driveDir, folder);
      if (!dir || !existsSync(dir)) return [];
      const entries = await readdir(dir, { withFileTypes: true });
      return Promise.all(
        entries
          .filter((e) => e.isFile())
          .map(async (e) => {
            const id = path.join(dir, e.name);
            const checksum = createHash('md5').update(await readFile(id)).digest('hex');
            return { name: e.name, id, checksum, mimeType: null };
          }),
      );
    },

    readFile: (file) => readFile(file.id),
  };
}
