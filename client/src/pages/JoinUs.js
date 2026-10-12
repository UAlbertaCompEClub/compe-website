import { Link } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import site from "../data/site.json";
import roles, { closingLabel, isOpen, openingsLabel } from "./roles";
import "./JoinUs.css";

function ApplyActions({ role }) {
  const discord = role.discordUrl || site.discordUrl;

  if (!isOpen(role)) {
    return (
      <div className="role__actions">
        <p className="role__closed">
          Applications are closed for now.
          {discord && (
            <>
              {" "}
              Still want to help?{" "}
              <a href={discord} target="_blank" rel="noopener noreferrer">
                Say hi in the Discord
              </a>{" "}
              and we'll keep you in mind for the next round.
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="role__actions">
      {role.apply === "discord" && discord && (
        <a className="btn btn--ember" href={discord} target="_blank" rel="noopener noreferrer">
          Apply in the Discord
        </a>
      )}
      {role.apply === "email" && role.email && (
        <a className="btn btn--ember" href={`mailto:${role.email}?subject=${encodeURIComponent(`${role.title} application`)}`}>
          Email us about this role
        </a>
      )}
      {role.apply === "form" && (
        <Link className="btn btn--ember" to={`/join-us/${role.id}/apply`}>
          Apply for {role.title}
        </Link>
      )}
      {discord && role.apply !== "discord" && (
        <a className="btn btn--ghost" href={discord} target="_blank" rel="noopener noreferrer">
          Ask a question in the Discord
        </a>
      )}
    </div>
  );
}

function Role({ role }) {
  const openings = openingsLabel(role);

  return (
    <article className="role" id={role.id} aria-labelledby={`${role.id}-title`}>
      <div className="role__meta">
        {role.area && <span className="pill pill--area">{role.area}</span>}
        <dl className="role__facts">
          {role.commitment && (
            <div>
              <dt>Time</dt>
              <dd>{role.commitment}</dd>
            </div>
          )}
          {openings && (
            <div>
              <dt>Spots</dt>
              <dd>{openings}</dd>
            </div>
          )}
          <div>
            <dt>Closing</dt>
            <dd className={isOpen(role) ? undefined : "role__fact--closed"}>{closingLabel(role)}</dd>
          </div>
        </dl>
      </div>

      <div className="role__body">
        <h2 className="role__title" id={`${role.id}-title`}>
          {role.title}
        </h2>
        <p className="role__summary">{role.summary}</p>

        {role.responsibilities.length > 0 && (
          <div className="role__section">
            <h3>What you'd do</h3>
            <ul className="role__list">
              {role.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {role.skills.length > 0 && (
          <div className="role__section">
            <h3>Helpful to have</h3>
            <ul className="role__skills">
              {role.skills.map((skill) => (
                <li key={skill} className="pill pill--skill">
                  {skill}
                </li>
              ))}
            </ul>
            <p className="role__note">None of these are required. We'd rather have someone keen than someone qualified.</p>
          </div>
        )}

        <ApplyActions role={role} />
      </div>
    </article>
  );
}

export default function JoinUs() {
  const open = roles.filter((role) => isOpen(role));
  const closed = roles.filter((role) => !isOpen(role));

  return (
    <PageShell>
      <section className="block join-head">
        <div className="wrap">
          <p className="eyebrow">Join us</p>
          <h1 className="join-head__title">Help run the club</h1>
          <p className="join-head__lede">
            These are volunteer roles, open to any University of Alberta student. You don't have to
            be in Computer Engineering, and you don't need experience. Exec positions are elected at
            our AGMs instead, in September and April.
          </p>
          {site.discordUrl && (
            <p className="join-head__note">
              Not sure which one fits?{" "}
              <a href={site.discordUrl} target="_blank" rel="noopener noreferrer">
                Ask in the Discord
              </a>{" "}
              and an exec will talk it through with you.
            </p>
          )}
        </div>
      </section>

      <section className="block block--tint">
        <div className="wrap">
          {roles.length === 0 && (
            <p className="join-empty">
              We're not looking for anyone right now. New roles get posted here, and announced in
              the Discord first.
            </p>
          )}
          <div className="roles">
            {open.map((role) => (
              <Role key={role.id} role={role} />
            ))}
          </div>

          {closed.length > 0 && (
            <div className="roles roles--closed">
              <h2 className="subhead">Closed for this round</h2>
              {closed.map((role) => (
                <Role key={role.id} role={role} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
