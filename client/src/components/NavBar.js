import React, { Component } from 'react';
import "./NavBar.css";

class NavBar extends Component {
  render() {
    return (
      <nav className= "nav" id="navbar">
        <div className="nav-content">
          <ul className="nav-items">
            <li className="nav-item">Home</li>
            <li className="nav-item">Overview</li>
            <li className="nav-item">About</li>
            <li className="nav-item">Register</li>
            <li className="nav-item">FAQ</li>
            <li className="nav-item">Join Us</li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default NavBar;