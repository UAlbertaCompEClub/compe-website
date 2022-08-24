import React, { Component, useState } from 'react';
import navLinker from "../pageState/observer/navLinker";
import "./NavBar.css";

var NavBar = ({visibleBlock}) => {
  var NavBarEntry = ({ text, visibleBlock, blockId }) => {
    return (
      <a href={`#${blockId}`} className="anchor-base nav-item">
        <li className={`nav-item ${(visibleBlock === blockId) ? "nav-item-selected" : ""}`}>{text}</li>
      </a>
    );
  };
  return (
    <nav className="nav" id="navbar">
      <div className="nav-content">
        <ul className="nav-items">
          <NavBarEntry visibleBlock={visibleBlock} blockId="landing-block" text="Home" />
          <NavBarEntry visibleBlock={visibleBlock} blockId="eventdate-block" text="Dates" />
          <NavBarEntry visibleBlock={visibleBlock} blockId="about-us-block" text="About" />
          <NavBarEntry visibleBlock={visibleBlock} blockId="faq-block" text="FAQ" />
          <NavBarEntry visibleBlock={visibleBlock} blockId="register-block" text="Register" />
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;