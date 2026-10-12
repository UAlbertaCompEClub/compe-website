# Applications setup (for the web lead)

One-time setup for the volunteer application form at `/join-us`. Roles themselves are edited in the
content Sheet's **Roles** tab like any other content; this page is only about where applications go.

## How it works

```
Applicant signs in with Google on compeclub.com
        |  (ID token + answers)
        v
Apps Script web app, attached to the applications spreadsheet
        |- verifies the token with Google (aud must match our client ID)
        |- appends a row to the "<Role> <Year>" tab, creating it if needed
        |- posts "new application to review" to Discord
        v
Execs read the sheet
```

Nothing touches the website repo, so applications never appear in GitHub.

New *roles* travel the other way: they are published from the content Sheet, and the sync can announce
each one in a public Discord channel (step 7).

## 1. The applications spreadsheet

Create a **separate** spreadsheet named "CompE Club Applications", owned by the club Google account.
Keep it apart from the content Sheet: it holds personal data and needs tighter sharing.

Share it with the execs who review applications, and nobody else. One tab is created automatically per
role and year, named like `Designer 2026-27`, with a blank **Status** column for your own notes.

## 2. OAuth client ID (so people can sign in)

In the Google Cloud console, in the same project as the content sync:

1. APIs & Services → **OAuth consent screen**. Choose External, give the app a name ("CompE Club"),
   a support email and a developer email. No extra scopes: sign-in only.
2. APIs & Services → Credentials → Create credentials → **OAuth client ID** → Web application.
3. Under **Authorised JavaScript origins**, add every address the form is used from:
   - `https://compeclub.com`
   - `https://www.compeclub.com` if that also serves the site
   - `http://localhost:3000` for local testing
4. Copy the client ID. It ends in `.apps.googleusercontent.com` and is not a secret; it ships in the page.

Netlify deploy previews get a different subdomain each time, so sign-in won't work there unless you add
that exact subdomain. Test on localhost or in production.

## 3. The intake script

In the **applications spreadsheet**: Extensions → Apps Script. Paste `sync/apps-script/ApplicationIntake.gs`,
name the project something like "Application Intake", and save.

Then Project Settings → Script properties:

| Property | Value |
|---|---|
| `GOOGLE_CLIENT_ID` | The client ID from step 2. Required. |
| `DISCORD_WEBHOOK_URL` | Webhook for the channel that should hear about new applications. Optional. |
| `ALLOWED_EMAIL_DOMAIN` | `ualberta.ca` to accept only university accounts. Leave blank to accept any Google account. |

For the Discord webhook: Server Settings → Integrations → Webhooks → New Webhook, pick the channel
(an exec-only one), then Copy Webhook URL. Treat it as a secret; anyone holding it can post to that channel.

## 4. Deploy it as a web app

Deploy → New deployment → **Web app**:

- Execute as: **Me**, so the script can write to the spreadsheet
- Who has access: **Anyone**

Copy the `/exec` URL. Deploying asks for authorization the first time: Advanced → "Go to … (unsafe)" → Allow.

Each time you change the script, Deploy → **Manage deployments** → edit → New version. Without that
step the live URL keeps running the old code.

## 5. Tell the website

In the content Sheet's **Site** tab:

| Key | Value |
|---|---|
| `apply_endpoint` | The `/exec` URL from step 4 |
| `google_client_id` | The client ID from step 2 |
| `application_year` | `2026-27`, which names the tabs |

Publish. Until both of the first two are filled in, the apply page says applications aren't switched on
yet and points people at the Discord, which is also what happens if you ever want to pause applications.

## 6. Test it

1. Open `/join-us`, pick a role, and apply with your own account.
2. Check the spreadsheet for a new tab and row.
3. Check the Discord channel for the message.
4. Submit twice more to confirm the rate limit message appears after five in an hour.

## 7. Announcing new roles in Discord (optional)

Separate from step 3: that webhook tells the execs about each application, in a private channel. This
one tells students about each new role, in a public channel.

```
Roles tab -> Website: Publish now -> the sync spots a role it has never seen
                                         |
                                         v
                      one message in the announcements channel, with the facts
                      and a link straight to that role's form
```

Set up once:

| Where | Name | Value |
|---|---|---|
| GitHub → Settings → Secrets and variables → Actions → **Secrets** | `DISCORD_ROLES_WEBHOOK_URL` | A webhook for the public channel. Server Settings → Integrations → Webhooks → New Webhook → Copy Webhook URL. |
| the same page, **Variables** tab | `DISCORD_ROLES_MENTION` | Optional ping: `@everyone`, `@here`, or a role id like `<@&123456789>` (right-click the role → Copy Role ID, with Developer Mode on). Leave it unset for no ping. |
| content Sheet → **Site** tab | `site_url` | `https://compeclub.com`, so the links point at the live site. Blank falls back to compeclub.com. |

How it decides what to post:

- One message per role, the first time the sync sees that role's id. The ids already announced are kept
  in `sync/announced-roles.json`, which the Action commits along with the content.
- **The first run after you add the webhook posts nothing.** It records the roles already on the site, so
  switching this on doesn't dump the whole Join us page into the channel at once.
- Roles past their `closes` date are never announced, and hidden rows (`show` = FALSE) never reach the
  website at all. A role that reopens later, or gets its deadline extended, isn't re-announced.
- Renaming a role changes its id, so it counts as a new role and is announced again.

**Posting one again.** GitHub → Actions → "Sync website content from Google Drive" → Run workflow, and set
**announce** to the role id, e.g. `designer`, or several separated by commas. `all` posts every open role;
`none` publishes the content without announcing anything.

If Discord refuses a message, the run summary says which role and why, and that role stays unannounced so
the next publish tries again.

## Each year

- Update `application_year` in the Site tab so new applications file under the new year.
- Old tabs stay where they are. Delete them once hiring is done, in line with what the form promises
  applicants: "deleted once this year's hiring is done".

## When something goes wrong

Every failure shows the applicant a code and a reference like `APP-202/SRV-500 - ref 1010-1352-QAWY`,
with a button that copies the full details and a link to the Discord. Ask them for that code.

Codes starting **APP-** happen in the browser; **SRV-** come back from the Apps Script.

| Code | What it means | Where to look |
|---|---|---|
| `APP-100` | Google's sign-in script didn't load | A tracker blocker on their side, or the page's origin is missing from the OAuth client's authorised origins |
| `APP-200` | The browser couldn't reach the endpoint | Deployment deleted, URL wrong in the Site tab, or their network blocks it |
| `APP-201` | Endpoint answered with an HTTP error | Deployment access isn't "Anyone", or the URL has a `/u/1/` in it |
| `APP-202` | Endpoint answered, but refused the application | Read the `SRV-` code beside it |
| `APP-203` | The reply wasn't JSON | Usually an Apps Script error page: redeploy a new version |
| `APP-300` | Submitted in under four seconds, or the honeypot was filled | A bot, or someone pasting very fast |
| `SRV-400` | The application arrived incomplete | Mismatch between the site and the deployed script; redeploy |
| `SRV-401` | Sign-in couldn't be verified | Token expired mid-form, or the clock on their device is badly off |
| `SRV-402` | Sign-in was for a different client ID | `GOOGLE_CLIENT_ID` in Script properties doesn't match `google_client_id` in the Site tab |
| `SRV-403` | Account isn't allowed | `ALLOWED_EMAIL_DOMAIN` is set and they used another account |
| `SRV-409` | More than five applications from one account in an hour | The rate limit, working as intended |
| `SRV-500` | Couldn't write to the spreadsheet | Sheet renamed, permissions changed, or the script is attached to the wrong spreadsheet |
| `SRV-503` | `GOOGLE_CLIENT_ID` script property missing | Add it in Project Settings |

The Apps Script editor's **Executions** tab logs every call with its code and stack, which pairs with
whatever code the applicant quotes.

The codes themselves live in `client/src/components/apply/applyErrors.js`, with the wording shown to
applicants. Add new ones there and in `ApplicationIntake.gs` together.
