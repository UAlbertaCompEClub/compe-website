// Date helpers shared by the hero and the events section.
// Dates in events.json are plain YYYY-MM-DD strings with no time zone.
const CLUB_TIME_ZONE = "America/Edmonton";

// Today's date in Edmonton as YYYY-MM-DD, so events flip to "past" at local midnight.
export function todayIso() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: CLUB_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(new Date())
      .map((part) => [part.type, part.value])
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function format(iso, options) {
  const [year, month, day] = iso.split("-").map(Number);
  // Formatted in UTC so the calendar date never shifts with the viewer's time zone.
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    ...options,
    timeZone: "UTC",
  });
}

// "Sat 17 Jan", or "17 Jan – 18 Jan" for multi-day events.
export function formatRange(start, end) {
  if (!end || end === start) {
    return format(start, { weekday: "short", day: "numeric", month: "short" });
  }
  const short = { day: "numeric", month: "short" };
  return `${format(start, short)} – ${format(end, short)}`;
}

// Dated events that haven't finished yet, soonest first.
export function upcomingEvents(events, today = todayIso()) {
  return events
    .filter((event) => event.date && (event.endDate || event.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// What the events section lists: upcoming dated events first, then undated
// (recurring) ones in Sheet order. Dated events that have finished are left out.
export function listedEvents(events, today = todayIso()) {
  return [
    ...upcomingEvents(events, today),
    ...events.filter((event) => !event.date),
  ];
}
