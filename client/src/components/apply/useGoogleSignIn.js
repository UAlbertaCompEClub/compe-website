import { useCallback, useEffect, useRef, useState } from "react";

const GIS_SRC = "https://accounts.google.com/gsi/client";

function loadScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", resolve);
      existing.addEventListener("error", () => reject(new Error("script failed")));
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("script failed"));
    document.head.appendChild(script);
  });
}

// The payload is read only to show who is signed in. The Apps Script endpoint verifies the
// token itself before trusting any of it.
function readToken(credential) {
  try {
    const [, payload] = credential.split(".");
    const bytes = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const json = decodeURIComponent(
      Array.from(bytes, (char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`).join(""),
    );
    const { name, email, picture } = JSON.parse(json);
    return { name, email, picture };
  } catch {
    return null;
  }
}

// Renders Google's own "Sign in with Google" button into buttonRef and hands back the
// credential it returns.
export default function useGoogleSignIn(clientId) {
  const buttonRef = useRef(null);
  const [credential, setCredential] = useState(null);
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState(clientId ? "loading" : "unconfigured");

  const handle = useCallback((response) => {
    setCredential(response.credential);
    setProfile(readToken(response.credential));
    setStatus("signed-in");
  }, []);

  useEffect(() => {
    if (!clientId) {
      setStatus("unconfigured");
      return undefined;
    }
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !buttonRef.current) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handle,
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: "popup",
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "filled_black",
          size: "large",
          shape: "pill",
          text: "signin_with",
        });
        setStatus((current) => (current === "signed-in" ? current : "ready"));
      })
      .catch(() => {
        if (!cancelled) setStatus("blocked");
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, handle]);

  const signOut = useCallback(() => {
    window.google?.accounts?.id?.disableAutoSelect();
    setCredential(null);
    setProfile(null);
    setStatus(clientId ? "ready" : "unconfigured");
  }, [clientId]);

  return { buttonRef, credential, profile, status, signOut };
}
