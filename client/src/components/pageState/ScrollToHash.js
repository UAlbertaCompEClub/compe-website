import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Routing to "/#events" from another page lands at the top, because the browser only
// scrolls to a hash on a real page load. This scrolls once the target has rendered.
export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const target = document.querySelector(hash);
    // behavior: "auto" overrides the page's smooth scrolling: animating the whole way down
    // from the top of another page is slow, and it never finishes in a background tab.
    if (target) target.scrollIntoView({ block: "start", behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
