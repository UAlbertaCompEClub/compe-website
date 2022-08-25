import React from 'react';
import { GradientImgUnbordered } from '../../commons/gradient/GradientImg';
import instagramIcon from "../../socials/instagram.svg";
import webIcon from "../../socials/web.svg";
import emailIcon from "../../socials/mail.svg";

import blockStyle from '../Block';
import '../Block.css';
import './SocialsBlock.css'

function SocialsBlock() {
  return (
    <div className="footer-block" id="footer-block">
      <div className="footer">
          <p className="footer-text unecessary-footer-text">Built with React</p>
          <p className="divider">|</p>
          <p className="footer-text">Property of Computer Engineering Club</p>
          {/* <p className="footer-text">Property Muhammad Fiaz</p> */}
          <p className="divider">|</p>

          <div className="socials-content">
            <a href="https://www.compeclub.com/">
              <img src={webIcon} className="socials-icon highlighted" />
              </a>
            <a href="mailto:external@compeclub.com">
              <img src={emailIcon} className="socials-icon highlighted" />
            </a>
            <a href="https://www.instagram.com/compeclub/">
              <img src={instagramIcon} className="socials-icon highlighted" />
            </a>
          </div>
        </div>
    </div>
  );
}

export default SocialsBlock;