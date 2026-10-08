import site from "../../data/site.json";
import "./SocialsBlock.css";

const LINKS = [
  ["discordUrl", "Discord"],
  ["instagramUrl", "Instagram"],
  ["linkedinUrl", "LinkedIn"],
  ["githubUrl", "GitHub"],
];

function SocialsBlock() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div className="footer__brand">
          <img src="/compE.svg" width="36" height="36" alt="" />
          <div>
            <p className="footer__name">Computer Engineering Club</p>
            <p className="footer__org">University of Alberta</p>
          </div>
        </div>
        <nav aria-label="Club links">
          <ul className="footer__links">
            {LINKS.filter(([key]) => site[key]).map(([key, label]) => (
              <li key={key}>
                <a href={site[key]} target="_blank" rel="noopener noreferrer">
                  {label}
                </a>
              </li>
            ))}
            {site.contactEmail && (
              <li>
                <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <div className="wrap">
        <p className="footer__legal">
          © {new Date().getFullYear()} Computer Engineering Club
        </p>
      </div>
    </footer>
  );
}

export default SocialsBlock;
