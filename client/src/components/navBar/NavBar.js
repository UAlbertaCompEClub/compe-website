import site from "../../data/site.json";
import "./NavBar.css";

const LINKS = [
  ["events", "Events"],
  ["resources", "Resources"],
  ["team", "Team"],
  ["sponsors", "Sponsors"],
];

const NavBar = ({ visibleBlock }) => {
  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <a className="nav__brand" href="#landing">
          <img src="/compE.svg" width="28" height="28" alt="" />
          <span>Computer Engineering Club</span>
        </a>
        <nav className="nav__menu" aria-label="Sections">
          <ul className="nav__links">
            {LINKS.map(([blockId, text]) => (
              <li key={blockId}>
                <a
                  className="nav__link"
                  href={`#${blockId}`}
                  aria-current={visibleBlock === blockId ? "location" : undefined}
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {site.discordUrl && (
          <a
            className="btn btn--ember nav__cta"
            href={site.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Join the Discord
          </a>
        )}
      </div>
    </header>
  );
};

export default NavBar;
