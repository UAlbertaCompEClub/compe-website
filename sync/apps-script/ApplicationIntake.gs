/**
 * Receives applications from the website and files them in the applications spreadsheet.
 *
 * Install: in the APPLICATIONS spreadsheet (not the content one), Extensions -> Apps Script,
 * paste this file, then Deploy -> New deployment -> Web app, execute as "Me", access
 * "Anyone". Put the /exec URL in the content Sheet's Site tab as apply_endpoint.
 *
 * Script properties (Project Settings -> Script properties):
 *   GOOGLE_CLIENT_ID      required. The OAuth client ID the website signs people in with.
 *   DISCORD_WEBHOOK_URL   optional. Posts a "new application" message when set.
 *   ALLOWED_EMAIL_DOMAIN  optional. e.g. ualberta.ca to accept only university accounts.
 *
 * Full setup: docs/applications-setup.md
 */
const MAX_FIELD_LENGTH = 2000;
const MAX_ANSWERS = 40;
const RATE_LIMIT_PER_HOUR = 5;
const FIXED_COLUMNS = ['Submitted', 'Status', 'Role', 'Name on account', 'Email'];

/** Errors carry a code so an applicant can quote it to an exec. */
function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function doGet() {
  return json({ ok: true, service: 'CompE Club applications' });
}

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const identity = verifyIdentity(payload.credential);
    const role = cleanText(payload.roleTitle, 120);
    const year = cleanText(payload.year, 40) || 'unsorted';

    if (!role) throw fail('SRV-400', 'That application was missing its role.');
    if (!Array.isArray(payload.answers) || payload.answers.length > MAX_ANSWERS) {
      throw fail('SRV-400', "That application didn't look right. Please reload the page and try again.");
    }
    if (overRateLimit(identity.email)) {
      throw fail('SRV-409', "You've sent several applications already. Give it an hour, or message an exec in the Discord.");
    }

    const answers = payload.answers
      .map((answer) => ({
        label: cleanText(answer && answer.label, 120),
        value: cleanText(answer && answer.value, MAX_FIELD_LENGTH),
      }))
      .filter((answer) => answer.label);

    const saved = appendApplication(role, year, identity, answers);
    notifyDiscord(role, year, identity, answers, saved);
    return json({ ok: true });
  } catch (error) {
    const code = error.code || 'SRV-500';
    console.error(code + ': ' + (error.stack || error.message));
    return json({ ok: false, code: code, error: error.message || 'Something went wrong saving that application.' });
  }
}

/** Google's tokeninfo endpoint does the signature and expiry checking for us. */
function verifyIdentity(credential) {
  if (!credential) throw fail('SRV-401', 'Please sign in with Google before submitting.');
  const clientId = PropertiesService.getScriptProperties().getProperty('GOOGLE_CLIENT_ID');
  if (!clientId) throw fail('SRV-503', 'Applications are not set up yet: GOOGLE_CLIENT_ID is missing.');

  const response = UrlFetchApp.fetch(
    'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(credential),
    { muteHttpExceptions: true },
  );
  if (response.getResponseCode() !== 200) throw fail('SRV-401', 'That sign-in has expired. Please sign in again.');

  const token = JSON.parse(response.getContentText());
  if (token.aud !== clientId) throw fail('SRV-402', 'That sign-in was issued for a different site.');
  if (token.email_verified !== 'true' && token.email_verified !== true) {
    throw fail('SRV-401', 'That Google account has no verified email address.');
  }

  const domain = PropertiesService.getScriptProperties().getProperty('ALLOWED_EMAIL_DOMAIN');
  if (domain) {
    // Suffix, not substring: "@ualberta.ca" appears inside "someone@ualberta.ca.example.com" too.
    const suffix = '@' + domain.toLowerCase().replace(/^@/, '');
    const email = String(token.email).toLowerCase();
    if (email.slice(-suffix.length) !== suffix) {
      throw fail('SRV-403', 'Please sign in with your @' + domain + ' account.');
    }
  }
  return { email: token.email, name: token.name || '', subject: token.sub };
}

/** A light cap so one account can't fill the sheet. */
function overRateLimit(email) {
  const cache = CacheService.getScriptCache();
  const key = 'rate-' + Utilities.base64EncodeWebSafe(email);
  const count = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(count), 3600);
  return count > RATE_LIMIT_PER_HOUR;
}

/** One tab per role and year, columns grown as questions change. */
function appendApplication(role, year, identity, answers) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const tabName = sheetName(role + ' ' + year);
    let sheet = book.getSheetByName(tabName);
    if (!sheet) {
      sheet = book.insertSheet(tabName);
      sheet.appendRow(FIXED_COLUMNS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, FIXED_COLUMNS.length).setFontWeight('bold');
    }

    let header = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
    answers.forEach(function (answer) {
      if (header.indexOf(answer.label) === -1) {
        header.push(answer.label);
        sheet.getRange(1, header.length).setValue(safeCell(answer.label)).setFontWeight('bold');
      }
    });

    const row = new Array(header.length).fill('');
    row[header.indexOf('Submitted')] = new Date();
    row[header.indexOf('Role')] = safeCell(role);
    row[header.indexOf('Name on account')] = safeCell(identity.name);
    row[header.indexOf('Email')] = safeCell(identity.email);
    answers.forEach(function (answer) {
      row[header.indexOf(answer.label)] = safeCell(answer.value);
    });

    sheet.appendRow(row);
    return { tabName: tabName, rowNumber: sheet.getLastRow(), url: book.getUrl() + '#gid=' + sheet.getSheetId() };
  } finally {
    lock.releaseLock();
  }
}

function notifyDiscord(role, year, identity, answers, saved) {
  const webhook = PropertiesService.getScriptProperties().getProperty('DISCORD_WEBHOOK_URL');
  if (!webhook) return;

  const applicantName = findAnswer(answers, 'Your name') || identity.name || identity.email;
  const fields = [{ name: 'Role', value: role + ' (' + year + ')', inline: true }, { name: 'Contact', value: identity.email, inline: true }];

  const discordHandle = findAnswer(answers, 'Discord username');
  if (discordHandle) fields.push({ name: 'Discord', value: discordHandle, inline: true });
  const why = findAnswer(answers, 'Why this role?');
  if (why) fields.push({ name: 'Why this role?', value: why.slice(0, 300) + (why.length > 300 ? '...' : ''), inline: false });

  try {
    UrlFetchApp.fetch(webhook, {
      method: 'post',
      contentType: 'application/json',
      muteHttpExceptions: true,
      payload: JSON.stringify({
        username: 'CompE Applications',
        // Applicant text reaches this message, so no mention in it may resolve.
        allowed_mentions: { parse: [] },
        content: 'New application to review: **' + applicantName + '** for **' + role + '**',
        embeds: [
          {
            title: 'Row ' + saved.rowNumber + ' in "' + saved.tabName + '"',
            url: saved.url,
            color: 0x3f5f42,
            fields: fields,
            footer: { text: 'Open the sheet to read the whole application' },
          },
        ],
      }),
    });
  } catch (error) {
    // A broken webhook must never lose an application that is already saved.
    console.error('Discord notification failed: ' + error);
  }
}

function findAnswer(answers, label) {
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].label === label && answers[i].value) return answers[i].value;
  }
  return '';
}

/**
 * Sheets treats a cell starting with = + - @ as a formula, so an applicant could write one that
 * runs when an exec opens the sheet. A leading apostrophe marks the cell as text; Sheets hides it.
 */
function safeCell(value) {
  const text = value === null || value === undefined ? '' : String(value);
  // Leading spaces or tabs still let Sheets parse what follows as a formula.
  const trimmed = text.trimStart();
  return /^[=+@-]/.test(trimmed) ? "'" + text : text;
}

function cleanText(value, max) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\s+$/, '').slice(0, max);
}

/** Sheet names can't contain : \ / ? * [ ] and cap at 100 characters. */
function sheetName(raw) {
  return raw.replace(/[:\\/?*\[\]]/g, '-').slice(0, 95).trim();
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
