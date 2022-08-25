import React, { useState } from 'react';
import { UrlFetchApp } from '@dgcode/url-fetch-app';
import "../RegisterBlock.css";
import "../../Block.css"
import FormField from "./formComponents/FormField";
import FormLargeField from "./formComponents/FormLargeField";
import HollowButton from "../../../commons/buttons/HollowButton";
import FormDropdownField from './formComponents/FormDropdownField';

function ParticipantEventbrite() {
  return (
    <div className="register-form gradient-border-padded">
      <h2 className="register-section-subheader">Participant RSVP</h2>
      <h4 className="register-section-subheader">Please check out our EventBrite here!</h4>
        <a className='highlighted-text' href='https://www.eventbrite.ca/'>
          <HollowButton text="Link"/>
        </a>
    </div>
  );
}

export {
  ParticipantEventbrite
};