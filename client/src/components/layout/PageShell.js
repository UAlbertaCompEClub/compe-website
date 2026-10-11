import NavBar from "../navBar/NavBar";
import SocialsBlock from "../socialsBlock/SocialsBlock";

// The chrome every page shares: skip link, nav, main, footer.
export default function PageShell({ visibleBlock, children }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <NavBar visibleBlock={visibleBlock} />
      <main id="main">{children}</main>
      <SocialsBlock />
    </>
  );
}
