import React from "react";
import "./NavBar.css";

var NavBar = ({ visibleBlock }) => {
  var NavBarEntry = ({ text, visibleBlock, blockId }) => {
    return (
      <a href={`#${blockId}`} className="anchor-base nav-item">
        <li
          className={`nav-item ${
            visibleBlock === blockId ? "nav-item-selected" : ""
          }`}
        >
          {text}
        </li>
      </a>
    );
  };
  return (
    <nav className="nav" id="navbar">
      <div className="nav-content">
        <ul className="nav-items">
          <NavBarEntry
            visibleBlock={visibleBlock}
            blockId="landing-block"
            text="Home"
          />
          <NavBarEntry
            visibleBlock={visibleBlock}
            blockId="events"
            text="Events"
          />
          <NavBarEntry
            visibleBlock={visibleBlock}
            blockId="about-us-block"
            text="About"
          />
          <NavBarEntry
            visibleBlock={visibleBlock}
            blockId="faq-block"
            text="FAQ"
          />
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
