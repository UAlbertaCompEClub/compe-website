import { Link } from "@mui/material";
import "./NavBar.css";

const NavBar = ({ visibleBlock }) => {
  const NavBarEntry = ({ text, visibleBlock, blockId }) => {
    return (
      <li
        className={`nav-item ${
          visibleBlock === blockId ? "nav-item-selected" : ""
        }`}
      >
        <Link className="anchor-base" href={`#${blockId}`}>
          {text}
        </Link>
      </li>
    );
  };

  return (
    <nav className="nav">
      <div className="nav-logo">
        <img src="/compE.svg" width="25" alt="" />
        Computer Engineering Club
      </div>
      <ul className="nav-items">
        <NavBarEntry
          visibleBlock={visibleBlock}
          blockId="landing"
          text="HOME"
        />
        <NavBarEntry
          visibleBlock={visibleBlock}
          blockId="events"
          text="EVENTS"
        />
        <NavBarEntry
          visibleBlock={visibleBlock}
          blockId="resources"
          text="RESOURCES"
        />
        <NavBarEntry
          visibleBlock={visibleBlock}
          blockId="team"
          text="OUR TEAM"
        />
      </ul>
    </nav>
  );
};

export default NavBar;
