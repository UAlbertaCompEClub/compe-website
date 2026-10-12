// Posts a "new role" announcement to Discord the first time a role appears in the Roles tab.
//
// Which roles have already been announced is remembered in sync/announced-roles.json, which the
// workflow commits alongside the content. That file, not the Sheet, is what stops the same role
// being posted on every nightly sync.
//
// Nothing here is allowed to fail a publish: the content is already written by the time we post,
// so a dead webhook turns into a note in the run summary and a retry on the next run.
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

const DEFAULT_BASE = 'https://compeclub.com';
const EMBED_COLOUR = 0xba0079; // --ember
const MAX_PER_RUN = 10; // a sanity cap, in case someone pastes a whole term of roles in at once
const GAP_MS = 1100; // webhooks take about five posts per two seconds
const LIMITS = { description: 2000, field: 1000 };

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const clip = (text, max) => (text && text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

/** ANNOUNCE_ROLES / --announce: new (default), all, none, or a comma-separated list of role ids. */
export function parseAnnounceMode(raw) {
  const text = String(raw ?? '').trim().toLowerCase();
  if (!text || text === 'new') return { kind: 'new', label: 'new roles only' };
  if (text === 'all') return { kind: 'all', label: 'every open role' };
  if (text === 'none' || text === 'off') return { kind: 'none', label: 'switched off' };
  const ids = new Set(text.split(',').map((id) => id.trim()).filter(Boolean));
  return { kind: 'only', ids, label: `only ${[...ids].join(', ')}` };
}

/**
 * A missing or unreadable file counts as "fresh": the first run records what is already on the
 * site and posts nothing, so switching this on doesn't dump every existing role into the channel.
 */
export async function loadAnnounced(file, warnings = []) {
  if (!existsSync(file)) return { roles: {}, fresh: true };
  try {
    const data = JSON.parse(await readFile(file, 'utf8'));
    if (!data || typeof data.roles !== 'object' || !data.roles) throw new Error('no roles list in it');
    return { roles: data.roles, fresh: false };
  } catch (error) {
    warnings.push(
      `sync/announced-roles.json couldn't be read (${error.message}), so nothing was announced this run. The roles on the site now have been recorded as already announced.`,
    );
    return { roles: {}, fresh: true };
  }
}

export async function saveAnnounced(file, announced, ids) {
  const roles = { ...announced.roles };
  const now = new Date().toISOString();
  for (const id of ids) roles[id] = roles[id] ?? now;
  const sorted = Object.fromEntries(Object.entries(roles).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(file, `${JSON.stringify({ updated: now, roles: sorted }, null, 2)}\n`);
}

/** Open roles only: a role that is already past its closing date is never announced. */
export function planAnnouncements({ roles, announced, mode, today }) {
  const open = roles.filter((role) => !role.closes || role.closes >= today);

  if (mode.kind === 'none') return { post: [], held: [], seed: [], skipped: [] };
  if (mode.kind === 'new' && announced.fresh) {
    return { post: [], held: [], seed: open.map((role) => role.id), skipped: [] };
  }

  const wanted =
    mode.kind === 'all'
      ? open
      : mode.kind === 'only'
        ? open.filter((role) => mode.ids.has(role.id))
        : open.filter((role) => !announced.roles[role.id]);

  const skipped =
    mode.kind === 'only' ? [...mode.ids].filter((id) => !open.some((role) => role.id === id)) : [];

  return { post: wanted.slice(0, MAX_PER_RUN), held: wanted.slice(MAX_PER_RUN), seed: [], skipped };
}

function closingText(role) {
  if (!role.closes) return 'Open until filled';
  const when = new Intl.DateTimeFormat('en-CA', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${role.closes}T12:00:00Z`));
  return `Applications close ${when}`;
}

function howToApply(role, baseUrl, discordUrl) {
  if (role.apply === 'email' && role.email) return `Email **${role.email}** with the role in the subject line.`;
  if (role.apply === 'discord') {
    const link = role.discordUrl || discordUrl;
    return link ? `[Message an exec in the Discord](${link}) and say which role you want.` : 'Message an exec here.';
  }
  return `[Open the application form](${baseUrl}/join-us/${role.id}/apply) - name and a contact method are the only required bits.`;
}

/**
 * Discord resolves mentions in the text, so the webhook is told exactly which one may ping. Set
 * DISCORD_ROLES_MENTION to @everyone, @here, a role id, or <@&roleid>.
 */
export function parseMention(raw) {
  const text = String(raw ?? '').trim();
  if (!text) return { prefix: '', allowed: { parse: [] } };
  if (text === '@everyone' || text === '@here') return { prefix: `${text} `, allowed: { parse: ['everyone'] } };
  const id = /^<@&(\d+)>$/.exec(text)?.[1] ?? (/^\d+$/.test(text) ? text : null);
  if (id) return { prefix: `<@&${id}> `, allowed: { parse: [], roles: [id] } };
  return { prefix: '', allowed: { parse: [] } };
}

export function buildPayload({ role, baseUrl, discordUrl, mention }) {
  const url = role.apply === 'form' ? `${baseUrl}/join-us/${role.id}/apply` : `${baseUrl}/join-us#${role.id}`;
  const fields = [];

  if (role.commitment) fields.push({ name: 'Time', value: clip(role.commitment, LIMITS.field), inline: true });
  if (role.openings) {
    fields.push({ name: 'Spots', value: role.openings === 1 ? '1' : String(role.openings), inline: true });
  }
  fields.push({ name: 'Closing', value: closingText(role), inline: true });

  if (role.responsibilities?.length) {
    fields.push({
      name: "What you'd do",
      value: clip(role.responsibilities.map((item) => `• ${item}`).join('\n'), LIMITS.field),
      inline: false,
    });
  }
  if (role.skills?.length) {
    fields.push({
      name: 'Helpful to have',
      value: clip(`${role.skills.join(' · ')}\nNone of these are required.`, LIMITS.field),
      inline: false,
    });
  }
  fields.push({ name: 'How to apply', value: clip(howToApply(role, baseUrl, discordUrl), LIMITS.field), inline: false });

  return {
    username: 'CompE Club',
    allowed_mentions: mention.allowed,
    content: `${mention.prefix}**We're looking for a ${role.title}**`,
    embeds: [
      {
        title: role.area ? `${role.title} (${role.area})` : role.title,
        url,
        description: clip(role.summary, LIMITS.description),
        color: EMBED_COLOUR,
        fields,
        footer: { text: 'Open to any University of Alberta student - no experience needed' },
      },
    ],
  };
}

/** One retry on a rate limit, because the whole point is not to lose an announcement. */
async function postOnce(webhook, payload) {
  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get('retry-after')) || 2;
    await sleep(Math.min(retryAfter * 1000 + 250, 10000));
    return fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }
  return response;
}

/** Returns the ids that actually reached Discord; the rest are retried on the next run. */
export async function postAnnouncements({ webhook, roles, baseUrl, discordUrl, mention, warnings, onProgress }) {
  const posted = [];
  for (const [index, role] of roles.entries()) {
    if (index > 0) await sleep(GAP_MS);
    try {
      const response = await postOnce(webhook, buildPayload({ role, baseUrl, discordUrl, mention }));
      if (!response.ok) {
        const body = (await response.text().catch(() => '')).slice(0, 200);
        warnings.push(`Discord refused the announcement for "${role.title}" (HTTP ${response.status}${body ? `: ${body}` : ''}). It will be posted again on the next publish.`);
        onProgress?.({ role, ok: false, detail: `HTTP ${response.status}` });
        continue;
      }
      posted.push(role.id);
      onProgress?.({ role, ok: true });
    } catch (error) {
      warnings.push(`Couldn't reach Discord to announce "${role.title}" (${error.message}). It will be posted again on the next publish.`);
      onProgress?.({ role, ok: false, detail: error.message });
    }
  }
  return posted;
}

export const announceBase = (siteUrl) => String(siteUrl || DEFAULT_BASE).replace(/\/+$/, '');
