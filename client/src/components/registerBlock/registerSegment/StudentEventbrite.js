import React from 'react';
import { UrlFetchApp } from '@dgcode/url-fetch-app';
import "../RegisterBlock.css";
import "../../Block.css"
import HollowButton from "../../../commons/buttons/HollowButton";

function StudentEventbrite() {
  return (
    <div className="register-form gradient-border-padded">
      <h2 className="register-section-subheader">Student RSVP</h2>
      <h4 className="register-section-subheader">Please check out our EventBrite here for updates (optional)!</h4>
        <a className='highlighted-text' href='https://www.eventbrite.ca/'>
          <HollowButton text="Link"/>
        </a>
    </div>
  );
}

export {
  StudentEventbrite
};