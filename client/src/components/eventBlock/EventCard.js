import { formatRange } from "./eventDates";

const REGISTRATION_LABELS = {
  soon: "Registration soon",
  open: "Registration open",
  closed: "Registration closed",
};

export default function EventCard({ event }) {
  const registration = REGISTRATION_LABELS[event.registration];

  return (
    <li className="event">
      <div className="event__when">
        <span
          className={`event__date${event.date ? " event__date--dated" : ""}`}
        >
          {event.date ? formatRange(event.date, event.endDate) : "Every year"}
        </span>
        {registration && (
          <span className={`pill pill--${event.registration}`}>
            {registration}
          </span>
        )}
      </div>

      <div className="event__body">
        <h3 className="event__title">{event.title}</h3>
        <p className="event__blurb">{event.blurb}</p>
        {(event.venue || event.link) && (
          <p className="event__meta">
            {event.venue && <span className="event__venue">{event.venue}</span>}
            {event.link && (
              <a href={event.link} target="_blank" rel="noopener noreferrer">
                Event website<span aria-hidden="true"> ↗</span>
              </a>
            )}
          </p>
        )}
      </div>

      {event.image && (
        <img
          className="event__photo"
          src={event.image.src}
          width={event.image.width}
          height={event.image.height}
          alt={event.image.alt}
          loading="lazy"
        />
      )}
    </li>
  );
}
