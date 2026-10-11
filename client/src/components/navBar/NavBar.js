import { Link, useLocation } from "react-router-dom";
import site from "../../data/site.json";
import "./NavBar.css";

// Sections live on the home page; pages are their own routes.
const SECTIONS = [
  ["events", "Events"],
  ["resources", "Resources"],
  ["team", "Team"],
  ["sponsors", "Sponsors"],
];

const PAGES = [["/join-us", "Join us"]];

const NavBar = ({ visibleBlock }) => {
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <Link className="nav__brand" to="/">
          <img src="/compE.svg" width="28" height="28" alt="" />
          <span>Computer Engineering Club</span>
        </Link>
        <nav className="nav__menu" aria-label="Sections">
          <ul className="nav__links">
            {SECTIONS.map(([blockId, text]) => (
              <li key={blockId}>
                <Link
                  className="nav__link"
                  to={`/#${blockId}`}
                  aria-current={onHome && visibleBlock === blockId ? "location" : undefined}
                >
                  {text}
                </Link>
              </li>
            ))}
            {PAGES.map(([to, text]) => (
              <li key={to}>
                <Link
                  className="nav__link"
                  to={to}
                  aria-current={pathname.startsWith(to) ? "page" : undefined}
                >
                  {text}
                </Link>
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
