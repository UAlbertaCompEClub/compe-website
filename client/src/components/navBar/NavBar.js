import React from "react";
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
        <img src="/compE.svg" width="36" alt="" />
        Computer Engineering Club
      </div>
      <ul className="nav-items">
        <NavBarEntry
          visibleBlock={visibleBlock}
          blockId="landing-block"
          text="HOME"
        />
        <NavBarEntry
          visibleBlock={visibleBlock}
          blockId="events"
          text="EVENTS"
        />
        <NavBarEntry
          visibleBlock={visibleBlock}
          blockId="about-us-block"
          text="RESOURCES"
        />
        <NavBarEntry
          visibleBlock={visibleBlock}
          blockId="faq-block"
          text="OUR TEAM"
        />
      </ul>
    </nav>
  );
};

export default NavBar;
