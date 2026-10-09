// Reads tabs from the content Google Sheet and photos from the content Drive folder, using a
// service account that has Viewer access to both. Setup: docs/content-sync-setup.md
import { GoogleAuth } from 'google-auth-library';
import { looseName } from '../validate.mjs';

const SHEETS = 'https://sheets.googleapis.com/v4/spreadsheets';
const DRIVE = 'https://www.googleapis.com/drive/v3/files';
const FOLDER_MIME = 'application/vnd.google-apps.folder';

// A problem an exec or the web lead can fix; printed without a stack trace.
export class UserError extends Error {
  constructor(message) {
    super(message);
    this.userMessage = message;
  }
}

export async function createGoogleSource({ sheetId, folderId, credentialsJson }) {
  const missing = Object.entries({ SHEET_ID: sheetId, DRIVE_FOLDER_ID: folderId, GOOGLE_SERVICE_ACCOUNT_JSON: credentialsJson })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    throw new UserError(`The sync is missing ${missing.join(', ')}. Add them as GitHub repository secrets (see docs/content-sync-setup.md).`);
  }

  let credentials;
  try {
    credentials = JSON.parse(credentialsJson);
  } catch {
    throw new UserError("GOOGLE_SERVICE_ACCOUNT_JSON isn't valid JSON. Paste the entire key file into the secret.");
  }

  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly', 'https://www.googleapis.com/auth/drive.readonly'],
  });
  const client = await auth.getClient();

  async function get(url, what, options = {}) {
    try {
      return (await client.request({ url, ...options })).data;
    } catch (err) {
      const status = err.response?.status;
      if (status === 403 || status === 404) {
        throw new UserError(`Google won't let the sync open ${what}. Share it with ${credentials.client_email} as a Viewer, and check the ID in the repository secrets.`);
      }
      throw err;
    }
  }

  async function listChildren(parentId, extraQuery) {
    const files = [];
    let pageToken;
    do {
      const params = new URLSearchParams({
        q: `'${parentId}' in parents and trashed = false and ${extraQuery}`,
        fields: 'nextPageToken, files(id, name, mimeType, md5Checksum)',
        pageSize: '1000',
        supportsAllDrives: 'true',
        includeItemsFromAllDrives: 'true',
      });
      if (pageToken) params.set('pageToken', pageToken);
      const data = await get(`${DRIVE}?${params}`, 'the content Drive folder');
      files.push(...(data.files ?? []));
      pageToken = data.nextPageToken;
    } while (pageToken);
    return files;
  }

  // Subfolders are listed once, then matched ignoring capitalisation and a trailing slash,
  // so a folder someone named "team/" still counts as "team".
  let folderIndex = null;
  async function loadFolderIndex() {
    if (!folderIndex) {
      const folders = await listChildren(folderId, `mimeType = '${FOLDER_MIME}'`);
      folderIndex = new Map();
      for (const folder of folders) {
        const key = looseName(folder.name);
        if (!folderIndex.has(key)) folderIndex.set(key, folder);
      }
    }
    return folderIndex;
  }

  return {
    label: 'Google Drive',

    async readTabs(names) {
      const sheet = encodeURIComponent(sheetId);
      const meta = await get(`${SHEETS}/${sheet}?fields=sheets.properties.title`, 'the content Sheet');
      const titles = new Set((meta.sheets ?? []).map((s) => s.properties.title));
      const present = names.filter((n) => titles.has(n));
      if (present.length === 0) return {};

      // Unformatted values: checkboxes arrive as booleans and date cells as serial numbers,
      // so the result doesn't depend on the Sheet's locale or display format.
      const params = new URLSearchParams({
        valueRenderOption: 'UNFORMATTED_VALUE',
        dateTimeRenderOption: 'SERIAL_NUMBER',
        majorDimension: 'ROWS',
      });
      for (const n of present) params.append('ranges', `'${n}'`);
      const data = await get(`${SHEETS}/${sheet}/values:batchGet?${params}`, 'the content Sheet');
      return Object.fromEntries(present.map((n, i) => [n, data.valueRanges?.[i]?.values ?? []]));
    },

    // { matchedName, files, available } - matchedName is the folder's real name in Drive,
    // or null when nothing matched; available lists what is there instead.
    async listFolder(folder) {
      const index = await loadFolderIndex();
      const available = [...index.values()].map((f) => f.name).sort();
      const match = index.get(looseName(folder));
      if (!match) return { matchedName: null, files: [], available };

      const files = await listChildren(match.id, `mimeType != '${FOLDER_MIME}'`);
      return {
        matchedName: match.name,
        available,
        files: files.map((f) => ({ name: f.name, id: f.id, checksum: f.md5Checksum ?? null, mimeType: f.mimeType })),
      };
    },

    async readFile(file) {
      const url = `${DRIVE}/${encodeURIComponent(file.id)}?alt=media&supportsAllDrives=true`;
      return Buffer.from(await get(url, `"${file.name}"`, { responseType: 'arraybuffer' }));
    },
  };
}
