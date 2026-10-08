# compeclub.com revamp plan

Branch: `revamp/drive-content`

The revamp keeps the existing Create React App site and its section components. It changes two things:
where the content comes from (a Google Sheet and Drive folder that any exec can edit), and then how the
site looks (the design-direction deck, applied inside the current architecture).

## Goals

- Future execs update events, team, sponsors, resources and photos without touching code or GitHub.
- A bad edit can't break the live site. If the content has a problem, nothing is published.
- Photos are resized automatically, so the page stops referencing ~108 MB of images.
- The visual revamp reuses the existing blocks instead of rebuilding the site.

## How content reaches the site

```
Google Sheet (one tab per section) ─┐
                                    ├─► GitHub Action runs sync/ ─► checks every row
Drive folder (events/ team/         │        │
  sponsors/ gallery/)              ─┘        ├─ problems ► run fails, lists them, site unchanged
                                             └─ all good ► writes client/src/data/*.json
                                                           + client/public/images/content/*.webp
                                                           ► commits to main ► host rebuilds the site
```

The sync runs when someone clicks **Website → Publish now** in the Sheet, every night at 03:00 Edmonton
time, or when started by hand from the Actions tab.

Why this and not loading from Drive in the browser: Drive isn't built to serve website images, it would
serve full-size originals, and a broken Sheet would break the live site immediately.

## Phase 1: content pipeline (this branch)

- [x] `sync/`: reads the Sheet and Drive (or local CSVs and a local folder, for testing)
- [x] Row-level error messages written for execs; nothing is written if any check fails
- [x] Photos resized to WebP per folder; unchanged photos skipped; photos no row uses are deleted
- [x] Sheet template in `sync/template/`, pre-filled with the current site's content
- [x] Components read `client/src/data/` instead of JSON files inside component folders
- [x] Empty "Junior Executives" section hides itself; calendar title comes from the Sheet
- [x] `.github/workflows/sync-content.yml` and the Apps Script "Publish now" menu
- [x] `npm run build` fixed for Node 17+ (`--openssl-legacy-provider`, same as `start`)
- [x] Old heavy assets removed (event-card SVG wrappers, gallery originals, unused headshots)

## Phase 2: Google and GitHub setup

Needs a club-owned Google account and admin access to the repo. Steps: [content-sync-setup.md](content-sync-setup.md).

- [ ] Decide which club-owned Google account (or shared drive) owns the Sheet and Drive folder
- [ ] Create the Sheet from the template and the Drive folder with `events/ team/ sponsors/ gallery/`
- [ ] Create the service account and share the Sheet and folder with it as Viewer
- [ ] Add the three repository secrets
- [ ] Create the fine-grained GitHub token and install the Apps Script
- [ ] Confirm the host rebuilds on every push to `main`, and that the bot is allowed to push to `main`
- [ ] Merge this branch, then run the workflow once by hand

## Phase 3: visual revamp (existing architecture)

Styling moved from MUI components to plain CSS files per block, built on the deck's tokens in
`client/src/index.css` (ink, bark, moss, sage, mist, paper, ember, gold; Space Grotesk, IBM Plex Sans,
Mono and Serif). The MUI cards and grids fought the layouts (hover overlays, inline `sx` styles), and
nothing on the page needs MUI's interactive components. Components, refs, `navLinker` and the data
flow are unchanged.

Page order: hero (ink) → Events (paper) → Resources (tint) → Team (paper) → Sponsors (tint, gold rule) → footer (ink).

- [x] Design tokens, base styles, buttons, visible focus ring, skip link, reduced-motion rules
- [x] `LandingBlock`: Trace hero with the club mark's traces drawn once; mission lines and about text
      from the Site tab; next-event chip for the soonest dated event; "Join the Discord" button
- [x] `EventBlock` / `EventCard`: full-width bands with details always visible. Upcoming dated events come
      first, then undated ("Every year") events; finished events drop off on their own.
      Registration pill from the `registration` column
- [x] Calendar: "Add to Google Calendar" link, with the full calendar embed behind a disclosure so it
      only loads when opened
- [x] `PhotoGallery`: still photo grid instead of the 2-second autoplay slider
- [x] `ResourceBlock`: grouped list by category, resume-review callout, link to the full GitHub repo
- [x] `TeamBlock`: grid with initials for people without a photo; shows `contact_for` and `email` when filled in
- [x] New `SponsorsBlock` (Charter): pitch from the Site tab, sourced facts, sponsors by tier, email button
- [x] `NavBar`: Events · Resources · Team · Sponsors · Join the Discord; current section underlined
- [x] Footer: Discord, Instagram, LinkedIn, GitHub and email as text links
- [x] `public/index.html`: fonts, description, Open Graph and Twitter tags, `og-image.jpg` (1200 × 630)
- [x] Removed 17 dependencies nothing imports (MUI, Emotion, react-awesome-slider, react-type-animation,
      webfontloader, the unused router/helmet/carousel/icon/fetch packages, and the testing libraries,
      since there are no tests). Kept `@babel/plugin-proposal-private-property-in-object`:
      it isn't imported, but CRA 4's Babel preset `require`s it during the build.
- [ ] Check on a real iPhone and Android phone

## Phase 4: content and launch

- [ ] Give every public figure a source in the Facts tab before setting `show` to TRUE
- [ ] Headshots for the four execs without one; junior execs after the Special AGM
- [ ] 2026/27 dates and venues in the Events tab; update `calendar_title`
- [ ] Mobile check at 375 px and a keyboard-only walkthrough
- [ ] Merge to `main`

## Open questions

1. Where is compeclub.com hosted, and does it rebuild on every push to `main`? Nothing in the repo says.
2. Which club-owned Google account should own the Sheet and the Drive folder?
3. Is `main` branch-protected? The sync commits to it directly. If it is, the workflow should open a pull request instead.
4. Should dated events come from the existing Google Calendar, so dates aren't entered twice?
5. Is the site's address `https://compeclub.com/` or `https://www.compeclub.com/`? The link-preview tags in
   `public/index.html` assume the first.
