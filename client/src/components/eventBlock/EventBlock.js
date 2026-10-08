import React, { useEffect, useState } from "react";
import navLinker from "../pageState/observer/navLinker";
import events from "../../data/events.json";
import site from "../../data/site.json";
import EventCard from "./EventCard";
import PhotoGallery from "./PhotoGallery";
import { listedEvents } from "./eventDates";
import "./EventBlock.css";

const id = "events";

const calendarEmbedSrc =
  site.calendarId &&
  "https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=America%2FEdmonton" +
    `&title=${encodeURIComponent(site.calendarTitle || "CompE Club Events")}` +
    `&src=${encodeURIComponent(site.calendarId)}&color=%237CB342`;

// Google's "add this calendar" link takes the calendar ID base64-encoded, without padding.
const calendarSubscribeUrl =
  site.calendarId &&
  `https://calendar.google.com/calendar/u/0?cid=${window
    .btoa(site.calendarId)
    .replace(/=+$/, "")}`;

const EventBlock = React.forwardRef((props, ref) => {
  useEffect(
    () => navLinker(ref.current, props.setBlock, id),
    [ref, props.setBlock]
  );

  // The embed is only rendered once the disclosure is opened. A closed <details> doesn't stop
  // a loading="lazy" iframe from loading in Chrome.
  const [calendarOpen, setCalendarOpen] = useState(false);
  const listed = listedEvents(events);

  return (
    <section className="block" id={id} ref={ref} aria-labelledby="events-title">
      <div className="wrap">
        <header className="section-head">
          <p className="eyebrow">Events</p>
          <h2 id="events-title">Hackathons, career fairs and game nights</h2>
          <p className="lede">
            Have an idea for an event we don't run yet? Reach out to our Social
            VPs or any executive on Discord.
          </p>
        </header>

        {listed.length > 0 ? (
          <ol className="event-list">
            {listed.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </ol>
        ) : (
          <p className="event-list__empty">
            New events are on the way. Check Discord for the latest.
          </p>
        )}

        {calendarEmbedSrc && (
          <div className="calendar">
            <div className="calendar__head">
              <h3 className="subhead">Calendar</h3>
              <a
                className="btn btn--moss"
                href={calendarSubscribeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Add to Google Calendar
              </a>
            </div>
            <details
              className="calendar__details"
              onToggle={(e) => setCalendarOpen(e.currentTarget.open)}
            >
              <summary>Show the full calendar</summary>
              {calendarOpen && (
                <iframe
                  title={site.calendarTitle || "CompE Club events calendar"}
                  src={calendarEmbedSrc}
                />
              )}
            </details>
          </div>
        )}

        <PhotoGallery />
      </div>
    </section>
  );
});

export default EventBlock;
