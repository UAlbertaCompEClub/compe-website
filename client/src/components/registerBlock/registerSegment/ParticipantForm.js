import React, { useState } from 'react';
import { UrlFetchApp } from '@dgcode/url-fetch-app';
import "../RegisterBlock.css";
import "../../Block.css"
import FormField from "./formComponents/FormField";
import FormLargeField from "./formComponents/FormLargeField";
import { HollowerButton } from "../../../commons/buttons/HollowButton";
import FormDropdownField from './formComponents/FormDropdownField';

function ParticipantForm() {
  var [failed, setFailed] = useState(false);
  var [submitted, setSubmitted] = useState(false);
  var isEmpty = (value) => { if (value == "" || !value ) {return true} return false };
  var getField = (id) => { return document.getElementById("register_"+id).value };
  var checkResponse = () => {
    var firstName = getField("firstName");
    var lastName = getField("lastName");
    var title = getField("title");
    var email = getField("email");
    var company = getField("company");
    var additional = getField("additional");
    console.log("log", firstName, lastName, title, email, company);
    (isEmpty(firstName) || isEmpty(lastName) || isEmpty(title) || isEmpty(email) || isEmpty(company))? setFailed(true) : setFailed(false);
    if (!failed) {
      fetch("https://docs.google.com/forms/d/e/1FAIpQLSeddsZIZHJ84MwW62YHYjtNX6Y5pXG6gsksTxls88Agn4AglA/formResponse?usp=pp_url&entry.1398323061=FIRST_NAME&entry.1509660360=LAST_NAME&entry.802216155=TITLE&entry.1387214098=EMAIL&entry.987011643=COMPANY&entry.1377794354=ADDITIONAL");
      // fetch('https://docs.google.com/forms/d/e/1FAIpQLSeddsZIZHJ84MwW62YHYjtNX6Y5pXG6gsksTxls88Agn4AglA/formResponse', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     "entry.1398323061": firstName,
      //     "entry.1509660360": lastName,
      //     "entry.802216155": title,
      //     "entry.1387214098": email,
      //     "entry.987011643": company,
      //     "entry.1377794354": additional
      //   }),
      // });
    }
  };

  return (
    <div className="register-form bordered-container-padded">
      <h2 className="register-section-subheader">Participant RSVP</h2>
      <h4 className="register-section-subheader">We will reach out to you once you submit this form!</h4>
        <div className="register-fields-container">
          <div className="register-fields-col">
            <FormField fieldId={"firstName"} label={"First Name"} />
            <FormField fieldId={"lastName"} label={"Last Name"} />
            <FormField fieldId={"email"} label={"Email Address"} />
            <FormField fieldId={"company"} label={"University"} />
            <FormField fieldId={"company"} label={"Degree"} />
            <FormDropdownField fieldId={"year"} label={"Year"}
              options={["1", "2", "3", "4", "5+"]}/>
          </div>
          <div className="register-fields-col">
            <FormLargeField fieldId={"additional"} label={"Additional Questions/Comments"} />
          </div>
        </div>
        {failed && <h4 className="gradient-text"><i>One or more fields have not been filled out!</i></h4>}
        <a className='highlighted-text'>
          <HollowerButton text="Submit" onClick={checkResponse}/>
        </a>
    </div>
  );
}

export {
  ParticipantForm
};