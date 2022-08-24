import React from 'react';
import GradientImg from '../../commons/gradient/GradientImg';
import githubLogo from "../../socials/github.svg";
import linkedinLogo from "../../socials/linkedin.svg";
import emailIcon from "../../socials/mail.svg";

import blockStyle from '../Block';
import '../Block.css';
import './SocialsBlock.css'

function SocialsBlock() {
  return (
    <div className="footer-block" id="footer-block">
      <div className="footer">
          <p className="footer-text">Built with React</p>
          <p className="divider">|</p>
          <p className="footer-text highlighted-text footer-link"><a href="https://github.com/itsfeas/personal-website">Website Repo</a></p>
          {/* <p className="footer-text">Property Muhammad Fiaz</p> */}
          <p className="divider">|</p>

          <div className="socials-content" id={"socials-content"}>
              <a href="https://github.com/itsfeas">
                <GradientImg img={githubLogo} className="socials-icon highlighted" />
              </a>
              <a href="https://www.linkedin.com/in/amf-fiaz/">
                <GradientImg img={linkedinLogo} className="socials-icon highlighted" />
              </a>
              <a href="mailto:mfiaz@ualberta.ca">
                <GradientImg img={emailIcon} className="socials-icon highlighted" />
              </a>
          </div>
        </div>
    </div>
  );
}

export default SocialsBlock;