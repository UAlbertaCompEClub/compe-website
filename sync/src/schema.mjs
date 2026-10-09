// Every tab in the content Sheet: its columns, how each value is checked, and the JSON
// the website reads. If you change a tab here, update docs/updating-the-website.md too.

// How photos from each Drive folder are resized. Changing a preset re-processes that folder.
// `position` is where a photo is cropped from when it has to fill the frame. Rows in tabs with a
// `crop` column can override it per photo.
export const IMAGE_PRESETS = {
  events: { width: 800, height: 545, fit: 'cover', position: 'centre' },
  team: { width: 600, height: 600, fit: 'cover', position: 'top' },
  sponsors: { width: 480, height: 240, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } },
  gallery: { width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true },
};

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // accents split off by NFKD
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// What an exec may put in a `crop` column, and the sharp position each one means.
export const CROP_POSITIONS = {
  top: 'top',
  center: 'centre',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
  attention: 'attention', // let the library guess the most interesting part
  entropy: 'entropy', // let the library guess the busiest part
};

// `optional: true` means a Sheet without this column still works, so adding the column later
// doesn't break an existing Sheet.
const crop = { type: 'enum', values: Object.keys(CROP_POSITIONS), optional: true };

// Rows with show = FALSE (or blank) are skipped without being checked, so drafts can be incomplete.
const show = { type: 'bool', default: false };
const order = { type: 'number' };

export const TABS = [
  {
    name: 'Events',
    output: 'events.json',
    imageFolder: 'events',
    columns: {
      title: { type: 'text', required: true },
      date: { type: 'date' },
      end_date: { type: 'date' },
      venue: { type: 'text' },
      blurb: { type: 'text', required: true },
      link: { type: 'url' },
      photo: { type: 'image' },
      photo_alt: { type: 'text' },
      crop,
      registration: { type: 'enum', values: ['none', 'soon', 'open', 'closed'], default: 'none' },
      show,
      order,
    },
    check(row, fail) {
      if (row.end_date && !row.date) fail('date', 'is empty, but end_date is filled in. Add the start date.');
      if (row.date && row.end_date && row.end_date < row.date) fail('end_date', `is before the start date (${row.date}).`);
    },
    toJson: (row, image) => ({
      id: slugify(row.date ? `${row.title}-${row.date}` : row.title),
      title: row.title,
      date: row.date,
      endDate: row.end_date,
      venue: row.venue,
      blurb: row.blurb,
      link: row.link,
      registration: row.registration,
      image: image(row.photo, row.photo_alt || row.title),
    }),
  },
  {
    name: 'Team',
    output: 'team.json',
    imageFolder: 'team',
    columns: {
      name: { type: 'text', required: true },
      role: { type: 'text', required: true },
      group: { type: 'enum', values: ['senior', 'junior'], required: true },
      photo: { type: 'image' },
      crop,
      email: { type: 'email' },
      contact_for: { type: 'text' },
      show,
      order,
    },
    toJson: (row, image) => ({
      name: row.name,
      role: row.role,
      group: row.group,
      email: row.email,
      contactFor: row.contact_for,
      image: image(row.photo, `Photo of ${row.name}`),
    }),
  },
  {
    name: 'Sponsors',
    output: 'sponsors.json',
    imageFolder: 'sponsors',
    columns: {
      name: { type: 'text', required: true },
      tier: { type: 'enum', values: ['title', 'partner', 'supporting', 'in-kind'], required: true },
      logo: { type: 'image' },
      url: { type: 'url' },
      year: { type: 'text' },
      show,
      order,
    },
    toJson: (row, image) => ({
      name: row.name,
      tier: row.tier,
      url: row.url,
      year: row.year,
      logo: image(row.logo, `${row.name} logo`),
    }),
  },
  {
    name: 'Resources',
    output: 'resources.json',
    columns: {
      category: { type: 'text', required: true },
      title: { type: 'text', required: true },
      url: { type: 'url' },
      description: { type: 'text' },
      show,
      order,
    },
    toJson: (row) => ({
      category: row.category,
      title: row.title,
      url: row.url,
      description: row.description,
    }),
  },
  {
    name: 'Gallery',
    output: 'gallery.json',
    imageFolder: 'gallery',
    columns: {
      photo: { type: 'image', required: true },
      alt: { type: 'text', required: true },
      event: { type: 'text' },
      show,
      order,
    },
    toJson: (row, image) => ({ ...image(row.photo, row.alt), event: row.event }),
  },
  {
    // Any number the site shows publicly. A row can't be shown without a source.
    name: 'Facts',
    output: 'facts.json',
    columns: {
      key: { type: 'text', required: true },
      label: { type: 'text', required: true },
      value: { type: 'text', required: true },
      source: { type: 'text', required: true },
      show,
      order,
    },
    toJson: (row) => ({ key: row.key, label: row.label, value: row.value }),
  },
];

// Single settings, one per row: key | value.
export const SITE_TAB = {
  name: 'Site',
  output: 'site.json',
  keys: {
    discord_url: { type: 'url', required: true, out: 'discordUrl' },
    instagram_url: { type: 'url', out: 'instagramUrl' },
    linkedin_url: { type: 'url', out: 'linkedinUrl' },
    github_url: { type: 'url', out: 'githubUrl' },
    resources_url: { type: 'url', out: 'resourcesUrl' },
    contact_email: { type: 'email', required: true, out: 'contactEmail' },
    sponsor_email: { type: 'email', out: 'sponsorEmail' },
    calendar_id: { type: 'text', out: 'calendarId' },
    calendar_title: { type: 'text', out: 'calendarTitle' },
    hero_title: { type: 'text', out: 'heroTitle' },
    mission: { type: 'text', out: 'mission' },
    about: { type: 'text', out: 'about' },
    sponsor_pitch: { type: 'text', out: 'sponsorPitch' },
  },
};
