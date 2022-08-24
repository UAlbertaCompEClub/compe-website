import React, { Component, useState } from 'react';
import navLinker from "./../commons/observer/navLinker";
import "./NavBar.css";

class NavBar extends Component {
  render() {
    var NavBarEntryUnlinked = ({text}) => {
      var[isVisible, setVisible] = useState(false);
      return(
        <li className={`nav-item ${(isVisible) ? "nav-item-selected" : ""}`}>{text}</li>
      );
    }
    var NavBarEntry = ({blockId, text}) => {
      var linkedEntry = <NavBarEntryUnlinked text={text} />
      var block = document.getElementById(blockId);
      // navLinker(block, linkedEntry);
      return linkedEntry
    }
    return (
      <nav className= "nav" id="navbar">
        <div className="nav-content">
          <ul className="nav-items">
            <NavBarEntry blockId="landing-block" text="Home" />
            <NavBarEntry blockId="overview-block" text="Overview" />
            <NavBarEntry blockId="about-us-block" text="About" />
            <NavBarEntry blockId="landing-block" text="FAQ" />
            <NavBarEntry blockId="landing-block" text="Register" />
            <NavBarEntry blockId="landing-block" text="Join Us" />
          </ul>
        </div>
      </nav>
    );
  }
}

export default NavBar;