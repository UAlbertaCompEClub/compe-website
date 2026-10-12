import { useState } from "react";

// Shows what went wrong, the code to quote, and a one-click copy of the details.
export default function ErrorNotice({ report, discordUrl }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(report.details);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch {
      // Clipboard access can be refused; the details stay on screen to copy by hand.
      setCopied(false);
    }
  }

  return (
    <div className="apply-error" role="alert">
      <p className="apply-error__message">{report.message}</p>
      {report.hint && <p className="apply-error__hint">{report.hint}</p>}

      <p className="apply-error__code">
        Error <strong>{report.code}</strong> · ref <strong>{report.reference}</strong>
      </p>

      <div className="apply-error__actions">
        <button className="btn btn--ghost" type="button" onClick={copy}>
          {copied ? "Copied" : "Copy error details"}
        </button>
        {discordUrl && (
          <a className="btn btn--ghost" href={discordUrl} target="_blank" rel="noopener noreferrer">
            Report it in the Discord
          </a>
        )}
      </div>

      <p className="apply-error__note">
        Send that code to an exec in the Discord and we'll work out what happened. Your answers are
        still on this page, so you can try again first.
      </p>

      <details className="apply-error__details">
        <summary>Details we'd find useful</summary>
        <pre>{report.details}</pre>
      </details>
    </div>
  );
}
