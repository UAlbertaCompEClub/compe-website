// Turns raw Sheet rows into typed rows, collecting every problem as a sentence an exec
// can act on ("Events row 4, column "date": ...") instead of stopping at the first one.

const TRUE_WORDS = new Set(['true', 'yes', 'y', '1', 'x']);
const FALSE_WORDS = new Set(['false', 'no', 'n', '0']);
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|tiff?|gif)$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Google Sheets stores dates as days since 1899-12-30.
const SHEETS_EPOCH = Date.UTC(1899, 11, 30);

const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';

function toIsoDate(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Date(SHEETS_EPOCH + Math.floor(value) * 86400000).toISOString().slice(0, 10);
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim());
  if (!m) return undefined;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3] ? m[0] : undefined;
}

// Returns the typed value, null for an allowed blank, or undefined after recording an error.
export function coerce(def, value, where, errors) {
  if (isBlank(value)) {
    if (def.required) { errors.push(`${where}: is empty, but it's required.`); return undefined; }
    return def.default ?? null;
  }
  const text = String(value).trim();
  switch (def.type) {
    case 'text':
    case 'image':
      return text;
    case 'number': {
      const n = typeof value === 'number' ? value : Number(text);
      if (Number.isFinite(n)) return n;
      errors.push(`${where}: "${text}" isn't a number.`);
      return undefined;
    }
    case 'bool': {
      if (typeof value === 'boolean') return value;
      if (TRUE_WORDS.has(text.toLowerCase())) return true;
      if (FALSE_WORDS.has(text.toLowerCase())) return false;
      errors.push(`${where}: "${text}" should be TRUE or FALSE.`);
      return undefined;
    }
    case 'date': {
      const iso = toIsoDate(value);
      if (iso) return iso;
      errors.push(`${where}: "${text}" isn't a date. Write it as YYYY-MM-DD, for example 2027-01-17.`);
      return undefined;
    }
    case 'url': {
      try {
        const u = new URL(text);
        if (u.protocol === 'https:' || u.protocol === 'http:') return text;
      } catch { /* reported below */ }
      errors.push(`${where}: "${text}" isn't a full web address. It should start with https://`);
      return undefined;
    }
    case 'email':
      if (EMAIL.test(text)) return text;
      errors.push(`${where}: "${text}" isn't an email address.`);
      return undefined;
    case 'enum': {
      const lower = text.toLowerCase();
      if (def.values.includes(lower)) return lower;
      errors.push(`${where}: "${text}" isn't allowed. Use one of: ${def.values.join(', ')}.`);
      return undefined;
    }
    default:
      throw new Error(`Unknown column type ${def.type}`);
  }
}

export function parseTab(tab, values, errors) {
  const result = { rows: [], hidden: 0 };
  if (values === undefined) {
    errors.push(`The "${tab.name}" tab is missing. Add a tab named exactly "${tab.name}".`);
    return result;
  }
  if (values.length === 0) {
    errors.push(`The "${tab.name}" tab is empty. Row 1 must hold the column names.`);
    return result;
  }

  const header = values[0].map((h) => String(h ?? '').trim().toLowerCase());
  const missing = Object.keys(tab.columns).filter((c) => !header.includes(c) && !tab.columns[c].optional);
  if (missing.length) {
    errors.push(`The "${tab.name}" tab is missing ${missing.map((c) => `"${c}"`).join(', ')} in row 1.`);
    return result;
  }

  for (let i = 1; i < values.length; i++) {
    const cells = values[i] ?? [];
    const raw = {};
    header.forEach((h, j) => { if (Object.hasOwn(tab.columns, h)) raw[h] = cells[j]; });
    if (Object.values(raw).every(isBlank)) continue;

    const rowNumber = i + 1;
    const where = (col) => `${tab.name} row ${rowNumber}, column "${col}"`;
    const shown = coerce(tab.columns.show, raw.show, where('show'), errors);
    if (shown !== true) {
      if (shown === false) result.hidden++;
      continue;
    }

    const row = { _row: rowNumber };
    for (const [col, def] of Object.entries(tab.columns)) row[col] = coerce(def, raw[col], where(col), errors);
    tab.check?.(row, (col, message) => errors.push(`${where(col)}: ${message}`));
    // Kept even if the row had errors, so its photo is still checked and every problem is reported
    // in one run. Any error stops the sync before output, so an invalid row is never published.
    result.rows.push(row);
  }
  return result;
}

export function parseSite(siteTab, values, errors) {
  const out = Object.fromEntries(Object.values(siteTab.keys).map((def) => [def.out, null]));
  if (values === undefined) {
    errors.push(`The "${siteTab.name}" tab is missing. Add a tab named exactly "${siteTab.name}".`);
    return out;
  }
  const header = (values[0] ?? []).map((h) => String(h ?? '').trim().toLowerCase());
  const k = header.indexOf('key');
  const v = header.indexOf('value');
  if (k < 0 || v < 0) {
    errors.push(`The "${siteTab.name}" tab needs "key" and "value" in row 1.`);
    return out;
  }

  const seen = new Set();
  for (let i = 1; i < values.length; i++) {
    const key = String(values[i]?.[k] ?? '').trim().toLowerCase();
    const value = values[i]?.[v];
    if (!key) {
      if (!isBlank(value)) errors.push(`${siteTab.name} row ${i + 1}: has a value but no key.`);
      continue;
    }
    const where = `${siteTab.name} row ${i + 1} (${key})`;
    const def = siteTab.keys[key];
    if (!def) {
      errors.push(`${where}: "${key}" isn't a setting the website uses. Allowed: ${Object.keys(siteTab.keys).join(', ')}.`);
      continue;
    }
    if (seen.has(key)) {
      errors.push(`${where}: "${key}" is listed more than once.`);
      continue;
    }
    seen.add(key);
    const parsed = coerce(def, value, where, errors);
    if (parsed !== undefined) out[def.out] = parsed;
  }
  for (const [key, def] of Object.entries(siteTab.keys)) {
    if (def.required && !seen.has(key)) errors.push(`The "${siteTab.name}" tab is missing the "${key}" setting.`);
  }
  return out;
}

// Photo and folder names are matched ignoring capitalisation and a stray trailing slash, so
// "Prisha.JPG" finds "prisha.jpg" and a folder called "team/" still counts as "team".
export const looseName = (value) => String(value).trim().replace(/\/+$/, '').toLowerCase();

// The key a photo is stored under. Built from the loose name so the Sheet and Drive can disagree
// about capitalisation, and from the crop so one photo can be used twice with different crops.
export const imageKey = (folder, name, crop) => `${folder}/${looseName(name)}#${crop || 'default'}`;

function describeFolder(folder, listing) {
  const available = listing.available ?? [];
  if (available.length === 0) {
    return `No subfolders were found at all, so check that DRIVE_FOLDER_ID points at the folder holding "${folder}".`;
  }
  return `Folders found there: ${available.map((name) => `"${name}"`).join(', ')}.`;
}

// Matches every photo named in a shown row to a file in its Drive folder.
export function resolveImageRequests(parsed, listings, errors, warnings = []) {
  const requests = new Map();
  const missingFolders = new Set();

  for (const { tab, result } of parsed) {
    if (!tab.imageFolder) continue;
    const folder = tab.imageFolder;
    const listing = listings[folder] ?? { matchedName: null, files: [], available: [] };
    const files = listing.files;

    const byExact = new Map(files.map((file) => [file.name, file]));
    const byLoose = new Map();
    const ambiguous = new Set();
    for (const file of files) {
      const key = looseName(file.name);
      if (byLoose.has(key)) ambiguous.add(key);
      byLoose.set(key, file);
    }

    for (const row of result.rows) {
      for (const [col, def] of Object.entries(tab.columns)) {
        const written = row[col];
        if (def.type !== 'image' || !written) continue;
        const where = `${tab.name} row ${row._row}, column "${col}"`;
        const loose = looseName(written);
        const file = byExact.get(written) ?? byLoose.get(loose);

        if (/\.hei[cf]$/i.test(written)) {
          errors.push(`${where}: "${written}" is an iPhone HEIC photo, which the website can't use. Export it as JPG and upload that instead.`);
        } else if (!listing.matchedName) {
          // Once per folder, not once per row that needed it.
          if (!missingFolders.has(folder)) {
            missingFolders.add(folder);
            errors.push(`There is no Drive folder named "${folder}", which ${tab.name} needs for its photos. ${describeFolder(folder, listing)}`);
          }
        } else if (!file) {
          const sample = files.slice(0, 6).map((f) => `"${f.name}"`).join(', ');
          const holds = files.length === 0
            ? 'That folder is empty.'
            : `It holds: ${sample}${files.length > 6 ? `, and ${files.length - 6} more` : ''}.`;
          errors.push(`${where}: there's no file named "${written}" in the Drive folder "${listing.matchedName}". ${holds}`);
        } else if (ambiguous.has(loose)) {
          errors.push(`${where}: the Drive folder "${listing.matchedName}" holds more than one file called "${written}" apart from capitalisation. Rename one of them.`);
        } else if (file.mimeType?.startsWith('application/vnd.google-apps')) {
          errors.push(`${where}: "${written}" is a Google Docs file, not an uploaded image.`);
        } else if (!IMAGE_EXT.test(file.name)) {
          errors.push(`${where}: "${file.name}" isn't a JPG, PNG or WebP image.`);
        } else {
          if (file.name !== written) {
            warnings.push(`${where}: the Sheet says "${written}" and Drive has "${file.name}". The file's own name was used.`);
          }
          const crop = tab.columns.crop ? row.crop ?? null : null;
          requests.set(imageKey(folder, file.name, crop), { folder, name: file.name, file, crop });
        }
      }
    }
  }
  return requests;
}
