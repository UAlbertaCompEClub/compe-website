import React from 'react';
import instagramIcon from "../../socials/instagram.svg";
import linkedinIcon from "../../socials/linkedin.svg";
import emailIcon from "../../socials/mail.svg";
import '../Block.css';
import './SocialsBlock.css';

function SocialsBlock() {
  return (
    <div className="footer-block" id="footer-block">
      <div className="footer">
          <p className="footer-text unecessary-footer-text">Built with React</p>
          <p className="divider">|</p>
          <p className="footer-text">Property of Computer Engineering Club</p>
          <p className="divider">|</p>

          <div className="socials-content">
            <a href="https://www.linkedin.com/company/computer-engineering-club-university-of-alberta">
              <img src={linkedinIcon} className="socials-icon highlighted" />
              </a>
            <a href="mailto:external@compeclub.com">
              <img src={emailIcon} className="socials-icon highlighted" />
            </a>
            <a href="https://www.instagram.com/compeclub">
              <img src={instagramIcon} className="socials-icon highlighted" />
            </a>
          </div>
        </div>
    </div>
  );
}

export default SocialsBlock;