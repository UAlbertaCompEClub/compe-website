// Every way the application form can fail, with a stable code an applicant can quote in Discord.
// APP-1xx: the browser or sign-in. APP-2xx: talking to the server. APP-3xx: the form itself.
// SRV-xxx codes come from the Apps Script and are passed through untouched.
export const APPLY_ERRORS = {
  "APP-100": {
    message: "Google's sign-in script didn't load.",
    hint: "A tracker blocker or a strict privacy setting is the usual cause. Try another browser, or turn the blocker off for this site.",
  },
  "APP-200": {
    message: "We couldn't reach the server.",
    hint: "Check your connection and try again. Campus Wi-Fi sometimes blocks this.",
  },
  "APP-201": {
    message: "The server turned the application away.",
    hint: "This usually means the form is misconfigured on our end rather than anything you did.",
  },
  "APP-202": {
    message: "The server couldn't save the application.",
    hint: "Worth one more try. If it happens again, send us the code below.",
  },
  "APP-203": {
    message: "The server sent something we couldn't read.",
    hint: "Usually a sign that the form needs redeploying on our end.",
  },
  "APP-300": {
    message: "That submission looked automated.",
    hint: "Give it a few more seconds and submit again.",
  },
};

// Codes the Apps Script can return. Kept here so the page can explain them too.
export const SERVER_ERRORS = {
  "SRV-400": "The application arrived incomplete.",
  "SRV-401": "The sign-in couldn't be verified with Google.",
  "SRV-402": "The sign-in was issued for a different site.",
  "SRV-403": "That Google account isn't allowed to apply.",
  "SRV-409": "Too many applications from this account in the last hour.",
  "SRV-500": "The application couldn't be written to the spreadsheet.",
  "SRV-503": "Applications aren't fully set up yet.",
};

const pad = (value) => String(value).padStart(2, "0");

// A short, pronounceable-enough tag so two reports can be told apart.
function reference() {
  const now = new Date();
  const stamp = `${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${stamp}-${random}`;
}

// Builds what the applicant sees and what they can copy for us.
export function buildErrorReport({ code, serverCode, serverMessage, roleId, email, status }) {
  const known = APPLY_ERRORS[code] ?? {};
  const ref = reference();
  const shortCode = serverCode ? `${code}/${serverCode}` : code;

  const details = [
    `Code: ${shortCode}`,
    `Reference: ${ref}`,
    `Role: ${roleId || "unknown"}`,
    `When: ${new Date().toISOString()}`,
    email ? `Signed in as: ${email}` : "Signed in as: not signed in",
    status ? `HTTP status: ${status}` : null,
    serverMessage ? `Server said: ${serverMessage}` : null,
    `Browser: ${navigator.userAgent}`,
  ].filter(Boolean);

  return {
    code: shortCode,
    reference: ref,
    message: serverMessage || known.message || "Something went wrong sending your application.",
    hint: known.hint ?? (serverCode ? SERVER_ERRORS[serverCode] : null),
    details: details.join("\n"),
  };
}
