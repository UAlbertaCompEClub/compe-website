import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import useGoogleSignIn from "../components/apply/useGoogleSignIn";
import ErrorNotice from "../components/apply/ErrorNotice";
import { buildErrorReport } from "../components/apply/applyErrors";
import formConfig from "../config/application-form.json";
import site from "../data/site.json";
import { closingLabel, findRole, isOpen } from "./roles";
import "./Apply.css";

// A form filled faster than this was not filled by a person.
const MIN_FILL_MS = 4000;

function Field({ field, value, onChange, invalid }) {
  const id = `field-${field.id}`;
  const describedBy = field.help ? `${id}-help` : undefined;
  const shared = {
    id,
    name: field.id,
    value,
    maxLength: field.maxLength,
    placeholder: field.placeholder,
    "aria-describedby": describedBy,
    "aria-invalid": invalid ? "true" : undefined,
    onChange: (event) => onChange(field.id, event.target.value),
  };

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {field.label}
        {field.required ? <span className="field__required"> (required)</span> : null}
      </label>
      {field.help && (
        <p className="field__help" id={describedBy}>
          {field.help}
        </p>
      )}
      {field.type === "textarea" && <textarea className="field__input" rows={4} {...shared} />}
      {field.type === "select" && (
        <select className="field__input" {...shared}>
          <option value="">Prefer not to say</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      {(!field.type || field.type === "text") && <input className="field__input" type="text" {...shared} />}
      {invalid && <p className="field__error">Please fill this in.</p>}
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="apply-panel">
      <h2 className="apply-panel__title">{title}</h2>
      {children}
    </div>
  );
}

export default function Apply() {
  const { roleId } = useParams();
  const role = findRole(roleId);
  const discord = role?.discordUrl || site.discordUrl;

  const openedAt = useRef(Date.now());
  const [values, setValues] = useState({});
  const [trap, setTrap] = useState("");
  const [missing, setMissing] = useState([]);
  const [state, setState] = useState({ status: "idle" });

  const { buttonRef, credential, profile, status: signIn, signOut } = useGoogleSignIn(site.googleClientId);
  const configured = Boolean(site.applyEndpoint && site.googleClientId);

  // The role's own questions come after the standard ones.
  const fields = useMemo(() => {
    const extra = (role?.questions ?? []).map((label, index) => ({
      id: `question_${index + 1}`,
      label,
      type: "textarea",
      maxLength: 1500,
    }));
    return [...formConfig.fields, ...extra];
  }, [role]);

  // Start from the name on the Google account; they can still change it.
  useEffect(() => {
    if (profile?.name) setValues((current) => (current.name ? current : { ...current, name: profile.name }));
  }, [profile]);

  const failWith = (code, extra = {}) =>
    setState({
      status: "error",
      report: buildErrorReport({ code, roleId: role?.id, email: profile?.email, ...extra }),
    });

  const setValue = (id, value) => {
    setValues((current) => ({ ...current, [id]: value }));
    setMissing((current) => current.filter((item) => item !== id));
  };

  async function submit(event) {
    event.preventDefault();

    const blanks = fields.filter((field) => field.required && !String(values[field.id] ?? "").trim());
    if (blanks.length > 0) {
      setMissing(blanks.map((field) => field.id));
      document.getElementById(`field-${blanks[0].id}`)?.focus();
      return;
    }
    if (trap || Date.now() - openedAt.current < MIN_FILL_MS) {
      failWith("APP-300");
      return;
    }

    setState({ status: "sending" });
    try {
      const response = await fetch(site.applyEndpoint, {
        method: "POST",
        // text/plain keeps this a simple request, so the browser skips the CORS preflight
        // that Apps Script can't answer.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          credential,
          roleId: role.id,
          roleTitle: role.title,
          year: site.applicationYear ?? "",
          openedAt: new Date(openedAt.current).toISOString(),
          answers: fields.map((field) => ({
            id: field.id,
            label: field.label,
            value: String(values[field.id] ?? "").trim(),
          })),
        }),
      });
      let result = null;
      try {
        result = await response.json();
      } catch {
        failWith("APP-203", { status: response.status });
        return;
      }

      if (response.ok && result.ok) {
        setState({ status: "sent" });
        window.scrollTo(0, 0);
        return;
      }
      if (!response.ok) {
        failWith("APP-201", { status: response.status, serverCode: result.code, serverMessage: result.error });
        return;
      }
      failWith("APP-202", { serverCode: result.code, serverMessage: result.error });
    } catch {
      failWith("APP-200");
    }
  }

  if (!role) {
    return (
      <PageShell>
        <section className="block">
          <div className="wrap apply">
            <Panel title="We couldn't find that role">
              <p>It may have been filled or renamed.</p>
              <p className="apply-panel__actions">
                <Link className="btn btn--moss" to="/join-us">
                  See the open roles
                </Link>
              </p>
            </Panel>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="block">
        <div className="wrap apply">
          <p className="eyebrow">
            <Link className="apply__back" to="/join-us">
              ← All roles
            </Link>
          </p>
          <h1 className="apply__title">Apply: {role.title}</h1>
          <p className="apply__summary">{role.summary}</p>
          <p className="apply__closing">{closingLabel(role)}</p>

          {state.status === "sent" ? (
            <Panel title="Application received">
              <p>
                Thanks{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}. An exec will read it and get
                back to you at {profile?.email}.
              </p>
              <p>
                We usually reply within a week or two. If you'd like to get started before then, the Discord
                is where everything actually happens.
              </p>
              <p className="apply-panel__actions">
                {discord && (
                  <a className="btn btn--ember" href={discord} target="_blank" rel="noopener noreferrer">
                    Join the Discord
                  </a>
                )}
                <Link className="btn btn--ghost" to="/join-us">
                  Back to roles
                </Link>
              </p>
            </Panel>
          ) : !isOpen(role) ? (
            <Panel title="Applications are closed">
              <p>This round has finished, so the form is shut.</p>
              {discord && (
                <p>
                  If you still want to help,{" "}
                  <a href={discord} target="_blank" rel="noopener noreferrer">
                    message an exec in the Discord
                  </a>
                  . Roles open up mid-year more often than you'd think.
                </p>
              )}
              <p className="apply-panel__actions">
                <Link className="btn btn--moss" to="/join-us">
                  See other roles
                </Link>
              </p>
            </Panel>
          ) : !configured ? (
            <Panel title="Applications aren't switched on yet">
              <p>
                The form isn't connected to the club's Google account yet, so nothing would be saved.
              </p>
              {discord && (
                <p>
                  In the meantime,{" "}
                  <a href={discord} target="_blank" rel="noopener noreferrer">
                    say hi in the Discord
                  </a>{" "}
                  and tell an exec you're interested in {role.title}.
                </p>
              )}
            </Panel>
          ) : (
            <>
              <div className="apply-signin">
                <h2 className="apply-signin__title">1. Sign in</h2>
                <p className="apply-signin__note">{formConfig.signInNote}</p>
                {signIn === "signed-in" && (
                  <p className="apply-signin__who">
                    Signed in as <strong>{profile?.email}</strong>
                    <button className="apply-signin__switch" type="button" onClick={signOut}>
                      Use a different account
                    </button>
                  </p>
                )}
                {/* Google draws its button into this element once, so it stays mounted and is
                    only hidden while signed in. Swapping it out leaves an empty container. */}
                <div
                  className="apply-signin__button"
                  ref={buttonRef}
                  hidden={signIn === "signed-in"}
                />
                {signIn === "blocked" && (
                  <ErrorNotice report={buildErrorReport({ code: "APP-100", roleId: role.id })} discordUrl={discord} />
                )}
              </div>

              <form className="apply-form" onSubmit={submit} noValidate>
                <h2 className="apply-form__title">2. Tell us about you</h2>
                <p className="apply-form__intro">{formConfig.intro}</p>

                <fieldset className="apply-form__fields" disabled={signIn !== "signed-in" || state.status === "sending"}>
                  <legend className="sr-only">Application questions</legend>
                  {fields.map((field) => (
                    <Field
                      key={field.id}
                      field={field}
                      value={values[field.id] ?? ""}
                      onChange={setValue}
                      invalid={missing.includes(field.id)}
                    />
                  ))}

                  {/* Left empty by people, filled by bots. */}
                  <div className="apply-trap" aria-hidden="true">
                    <label htmlFor="field-company">Company</label>
                    <input
                      id="field-company"
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={trap}
                      onChange={(event) => setTrap(event.target.value)}
                    />
                  </div>
                </fieldset>

                <p className="apply-form__privacy">{formConfig.privacy}</p>

                <div className="apply-form__actions">
                  <button
                    className="btn btn--ember"
                    type="submit"
                    disabled={signIn !== "signed-in" || state.status === "sending"}
                  >
                    {state.status === "sending" ? "Sending..." : formConfig.submitLabel}
                  </button>
                  {signIn !== "signed-in" && <span className="apply-form__gate">Sign in first to submit.</span>}
                </div>

                <div className="apply-form__status" aria-live="polite">
                  {state.status === "error" && <ErrorNotice report={state.report} discordUrl={discord} />}
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
