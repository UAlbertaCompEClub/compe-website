# Content sync setup (for the web lead)

One-time setup to connect the Google Sheet and Drive folder to the site. Exec-facing instructions are in
[updating-the-website.md](updating-the-website.md).

## 1. Google

Do all of this signed in as a **club-owned** Google account, not a personal one, so handover doesn't break.

1. **Create the Sheet.** Make a new Google Sheet named "CompE Website Content". For each file in `sync/template/`,
   use File → Import → Upload → **Insert new sheet(s)**. Name the tabs exactly `Events`, `Team`, `Sponsors`,
   `Resources`, `Gallery`, `Facts` and `Site`. Delete the empty default tab.
   Optional but helpful: turn the `show` columns into checkboxes (Insert → Checkbox), and add dropdowns
   (Data → Data validation) for `registration`, `group` and `tier`.
2. **Create the Drive folder.** Make a folder named "CompE Website Photos" with four subfolders named exactly
   `events`, `team`, `sponsors` and `gallery` - no trailing slash in the name. Upload the photos the template refers
   to. Folder names are matched ignoring capitalisation and a trailing slash, and the sync notes when it had to do
   that; if nothing matches, it lists the folder names it did find.
3. **Create a service account.** In the Google Cloud console:
   create a project → enable the **Google Sheets API** and the **Google Drive API** → IAM & Admin → Service
   accounts → Create → open it → Keys → Add key → JSON. Keep the downloaded file private.
4. **Share with the service account.** Share both the Sheet and the Drive folder with the service account's
   `client_email` (it's in the JSON file) as **Viewer**.

## 2. GitHub

1. Settings → Secrets and variables → Actions → New repository secret:

   | Secret | Value |
   |---|---|
   | `CONTENT_SHEET_ID` | The part of the Sheet URL between `/d/` and `/edit` |
   | `CONTENT_DRIVE_FOLDER_ID` | The part of the folder URL after `/folders/` |
   | `GOOGLE_SERVICE_ACCOUNT_JSON` | The entire contents of the JSON key file |

2. The workflow commits straight to `main` as `github-actions[bot]`. If `main` is branch-protected, either allow
   that bot to bypass the rule or change the last step of `.github/workflows/sync-content.yml` to open a pull request.
3. **Check how the site deploys.** The host has to rebuild on every push to `main`. Vercel, Netlify and Cloudflare
   Pages integrations do this. Pushes made with the workflow's `GITHUB_TOKEN` **don't** trigger other GitHub Actions
   workflows. So if the site is deployed by a GitHub Actions workflow, add the build and deploy steps to
   `sync-content.yml` itself.
4. The workflow only runs after it's merged into `main`. Run it once from Actions → "Sync website content from
   Google Drive" → Run workflow.

## 3. The "Publish now" button

1. Create a **fine-grained personal access token**: resource owner `UAlbertaCompEClub`, repository access only
   `compe-website`, permission **Contents: Read and write**. An org owner may need to approve it. Set the
   expiry to one year, and put renewing it on the April handover checklist.
2. In the Sheet: Extensions → Apps Script → replace the code with `sync/apps-script/Publish.gs` → Save.
3. Project Settings → Script properties → add `GITHUB_TOKEN` with the token.
4. Reload the Sheet. A **Website** menu appears. The first click asks for permission to contact an external service.

## Testing locally

```bash
cd sync
npm ci
npm run check:local -- --drive-dir ../../my-photos   # checks only, writes nothing
npm run sync:local -- --drive-dir ../../my-photos    # writes data and images
```

`--drive-dir` is a folder laid out like the Drive folder, with `events`, `team`, `sponsors` and `gallery` inside.
The CSVs come from `sync/template/` unless you pass `--sheet-dir`.

To test against the real Sheet, set `SHEET_ID`, `DRIVE_FOLDER_ID` and `GOOGLE_SERVICE_ACCOUNT_JSON` in your
environment and run `npm run check` or `npm run sync`.

## What the sync writes

| Path | Notes |
|---|---|
| `client/src/data/*.json` | Generated. Don't edit by hand; the next sync overwrites it. |
| `client/public/images/content/<folder>/*.webp` | Resized photos. Photos no row uses are deleted. |
| `sync/image-manifest.json` | Lets the sync skip photos that haven't changed. |

To add or change a tab or column, edit `sync/src/schema.mjs`, the matching CSV in `sync/template/`,
and the table in `updating-the-website.md`.
