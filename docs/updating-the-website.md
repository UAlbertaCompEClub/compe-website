# Updating the website

Everything on compeclub.com comes from one Google Sheet and one Drive folder. You don't need GitHub or any code.

## The short version

1. Edit the Sheet, or upload photos to the Drive folder.
2. In the Sheet, click **Website → Publish now**.
3. The site updates within a few minutes.

If something in the Sheet has a problem, nothing is published and the site stays as it was.
**Website → See recent publishes** opens the list of problems to fix.

Edits also publish on their own every night at 3 a.m., in case nobody clicked Publish.

## Rules for every tab

- **Row 1 holds the column names.** Don't rename or delete them. You can add your own columns, such as `notes`; the website ignores them.
- **`show`**: TRUE puts the row on the site. FALSE or blank hides it. Hidden rows aren't checked, so a draft can be half-finished.
- **`order`**: smaller numbers come first. Blank rows go last.
- **Dates**: `YYYY-MM-DD`, for example `2027-01-17`. A cell formatted as a date also works.
- **Links**: the full address, starting with `https://`.
- **Photos**: type the file name from the Drive folder, including the extension, for example `hacked.png`.
  Capitalisation doesn't have to match: if the Sheet says `Prisha.JPG` and Drive has `prisha.jpg`, the sync uses the
  file and says so in its notes. Upload photos at any size; the site resizes them. iPhone HEIC photos don't work,
  so export them as JPG first.

## Tabs

### Events (photos go in the `events` folder)

| Column | What to put |
|---|---|
| title | Event name. Required. |
| date, end_date | Start and end date. Leave both blank for a recurring event with no fixed date. |
| venue | Building and room. |
| blurb | One or two sentences. Required. |
| link | Registration page or event website. |
| photo, photo_alt | File name in the `events` folder, and a short description of the photo for screen readers. |
| crop | Which part of the photo to keep when it's cut to fit. Blank keeps the middle. |
| registration | `none`, `soon`, `open` or `closed`. Anything but `none` shows a label next to the date. |

How events are listed:
- Events with a date come first, soonest first. The soonest one also appears at the top of the page.
- Events without a date come next, labelled "Every year", in `order`.
- Once an event's last day has passed, it disappears from the site by itself. For a yearly event like HackED,
  keep one row with no date for the description, and add a separate dated row for this year's edition.

### Team (photos go in the `team` folder)

| Column | What to put |
|---|---|
| name, role | Required. |
| group | `senior` or `junior`. Required. |
| photo | File name in the `team` folder. Leave blank to show a placeholder. |
| crop | Which part of the photo to keep. Blank crops from the top, which suits most headshots. |
| email | Role email, if the club has one. |
| contact_for | What students should contact this role about, for example "Course and instructor issues". |

**Fixing an odd crop.** Team photos are cut to a square and event photos to a wide rectangle, so something has to go.
The `crop` column decides what stays: `top` (the default for team), `center`, `bottom`, `left`, `right`, or
`attention` to let the computer pick the most interesting part. Change it, publish, and only that photo is redone.

### Sponsors (logos go in the `sponsors` folder)

`name` and `tier` (`title`, `partner`, `supporting` or `in-kind`) are required. Also: `logo`, `url`, `year`.

### Resources

`category` and `title` are required. Also: `url`, `description`.

### Gallery (photos go in the `gallery` folder)

`photo` and `alt` are required. `alt` describes what's in the photo, for example "Students talking to recruiters at the career fair". Also: `event`.

### Facts

Numbers the site shows publicly, such as attendance. `key`, `label`, `value` and **`source`** are required.
A fact without a source can't be shown. This keeps unverified numbers off the site.

### Site

One setting per row, with `key` and `value` columns. `discord_url` and `contact_email` are required.

| Key | Where it shows |
|---|---|
| `hero_title` | The big title at the top of the page |
| `mission` | The goals under the title, one per line (Ctrl+Enter starts a new line inside a cell) |
| `about` | The paragraph under the goals |
| `sponsor_pitch` | The paragraph in the Sponsors section |
| `discord_url`, `instagram_url`, `linkedin_url`, `github_url` | Buttons and footer links |
| `resources_url` | "Browse all resources on GitHub" |
| `contact_email` | Footer; also the sponsor email if `sponsor_email` is blank |
| `sponsor_email` | The email button in the Sponsors section |
| `calendar_id`, `calendar_title` | The Google Calendar in the Events section |

## Yearly checklist

**September, after the Special AGM**
- Add junior execs to Team, and upload their headshots.
- Add the year's events with dates.
- Change `calendar_title` in Site to the new year.

**For each event**
- Add or update the row two weeks before, and set `registration` when it opens.
- Afterwards, upload a few photos to `gallery/` and add Gallery rows.

**April, after the General AGM**
- Update the senior execs in Team. Set departed execs' `show` to FALSE or delete their rows.
- Delete departed execs' photos from `team/`.
- Hand over the club Google account and GitHub access to the incoming exec.

## When publishing fails

The publish history lists every problem at once, with the tab, row and column. For example:

> Events row 4, column "date": "17/01/2027" isn't a date. Write it as YYYY-MM-DD, for example 2027-01-17.
>
> Team row 9, column "photo": there's no file named "sam.jpg" in the Drive folder "team". Did you mean "Sam.jpg"?

Fix them in the Sheet or Drive folder and publish again.
