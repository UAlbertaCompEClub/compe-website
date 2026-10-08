import React, { useEffect } from "react";
import navLinker from "../pageState/observer/navLinker";
import facts from "../../data/facts.json";
import site from "../../data/site.json";
import sponsors from "../../data/sponsors.json";
import "./SponsorsBlock.css";

const id = "sponsors";

const TIERS = [
  ["title", "Title sponsors"],
  ["partner", "Partners"],
  ["supporting", "Supporting sponsors"],
  ["in-kind", "In-kind support"],
];

const tiers = TIERS.map(([key, label]) => ({
  key,
  label,
  sponsors: sponsors.filter((sponsor) => sponsor.tier === key),
})).filter((tier) => tier.sponsors.length > 0);

function Sponsor({ sponsor }) {
  const inner = (
    <span className="sponsor__inner">
      {sponsor.logo ? (
        <img
          src={sponsor.logo.src}
          width={sponsor.logo.width}
          height={sponsor.logo.height}
          alt={sponsor.logo.alt}
          loading="lazy"
        />
      ) : (
        <span className="sponsor__name">{sponsor.name}</span>
      )}
    </span>
  );

  return (
    <li className="sponsor">
      {sponsor.url ? (
        <a
          className="sponsor__link"
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </li>
  );
}

const SponsorsBlock = React.forwardRef((props, ref) => {
  useEffect(
    () => navLinker(ref.current, props.setBlock, id),
    [ref, props.setBlock]
  );

  const email = site.sponsorEmail || site.contactEmail;

  return (
    <section
      className="block block--tint sponsors"
      id={id}
      ref={ref}
      aria-labelledby="sponsors-title"
    >
      <div className="wrap">
        <div className="sponsors__intro">
          <div>
            <p className="eyebrow">Sponsors</p>
            <h2 className="sponsors__title" id="sponsors-title">
              Sponsor the Computer Engineering Club
            </h2>
            {site.sponsorPitch && (
              <p className="sponsors__pitch">{site.sponsorPitch}</p>
            )}
            {email && (
              <a className="btn btn--moss sponsors__cta" href={`mailto:${email}`}>
                Email {email}
              </a>
            )}
          </div>

          {/* Only facts with a source in the Sheet reach facts.json. */}
          {facts.length > 0 && (
            <dl className="facts">
              {facts.map((fact) => (
                <div key={fact.key} className="fact">
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {tiers.map((tier) => (
          <div key={tier.key} className="sponsor-tier">
            <h3 className="subhead">{tier.label}</h3>
            <ul className="sponsor-grid">
              {tier.sponsors.map((sponsor) => (
                <Sponsor key={sponsor.name} sponsor={sponsor} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
});

export default SponsorsBlock;
