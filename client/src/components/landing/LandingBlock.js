import React, { useEffect } from "react";
import navLinker from "../pageState/observer/navLinker";
import events from "../../data/events.json";
import site from "../../data/site.json";
import { formatRange, upcomingEvents } from "../eventBlock/eventDates";
import "./LandingBlock.css";

const id = "landing";

// Each trace bends at its node. Colours and pulse timing per trace live in LandingBlock.css.
const TRACES = [
  { id: "a", d: "M180 620 L520 280 L900 280 L1180 0", node: [900, 280], drawOn: true },
  { id: "b", d: "M300 680 L620 360 L1000 360 L1260 100", node: [1000, 360], drawOn: true },
  { id: "c", d: "M420 740 L720 440 L1100 440 L1320 220", node: [1100, 440], drawOn: false },
];

const LandingBlock = React.forwardRef((props, ref) => {
  useEffect(
    () => navLinker(ref.current, props.setBlock, id),
    [ref, props.setBlock]
  );

  const next = upcomingEvents(events)[0];
  const mission = (site.mission || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section
      className="block block--dark hero"
      id={id}
      ref={ref}
      aria-labelledby="hero-title"
    >
      {/* The three traces from the club mark, each with a travelling pulse and a node that
          shares its line's colour. */}
      <svg
        className="hero__traces"
        viewBox="0 0 1200 560"
        preserveAspectRatio="xMaxYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        {TRACES.map((trace) => (
          <g key={trace.id} className={`hero__circuit hero__circuit--${trace.id}`}>
            <path
              className={`hero__trace${trace.drawOn ? " hero__trace--draw" : ""}`}
              d={trace.d}
            />
            <path className="hero__pulse" d={trace.d} pathLength="100" />
            <circle className="hero__node" cx={trace.node[0]} cy={trace.node[1]} r="9" />
          </g>
        ))}
      </svg>

      <div className="wrap hero__inner">
        <p className="eyebrow hero__eyebrow">University of Alberta</p>
        <h1 className="hero__title" id="hero-title">
          {site.heroTitle || "Computer Engineering Club"}
        </h1>
        {mission.length > 0 && (
          <ul className="hero__mission">
            {mission.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
        {site.about && <p className="hero__about">{site.about}</p>}

        {next && (
          <a className="hero__next" href="#events">
            <span className="hero__when">
              {formatRange(next.date, next.endDate)}
            </span>
            <span className="hero__what">
              <b>{next.title}</b>
              {next.venue && <span> · {next.venue}</span>}
            </span>
          </a>
        )}

        <div className="hero__actions">
          {site.discordUrl && (
            <a
              className="btn btn--ember"
              href={site.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join the Discord
            </a>
          )}
          <a className="btn btn--ghost-dark" href="#events">
            See what we run
          </a>
        </div>
      </div>
    </section>
  );
});

export default LandingBlock;
