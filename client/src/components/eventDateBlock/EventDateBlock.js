import React, { useState } from 'react';
import blockStyle from '../Block';
import { EventDateEntry } from './eventDateSegment/EventDateEntry';
import "./EventDateBlock.css";
import '../Block.css'

function EventDateBlock() {
  //0 is none, 2 is company details, 1 is participant details
  var [panelVisibleId, setPanelVisibleId] = useState(1);
  var EventDatesParticipants = () => {
    return (<div className="eventdate-grid gradient-border-padded" id="eventdate-grid">
      <EventDateEntry
        text={"Registration Begins"}
        month={"Nov"}
        day={"1st"}
        time={"9AM"}
      />
      <EventDateEntry
        text={"Registration Ends"}
        month={"Nov"}
        day={"1st"}
        time={"9AM"}
      />
      <EventDateEntry
        text={"The Event"}
        month={"Feb"}
        day={"1st"}
        time={"9AM-3PM"}
      />
    </div>);
  };
  var EventDatesCompanies = () => {
    return (<div className="eventdate-grid gradient-border-padded" id="eventdate-grid">
      <EventDateEntry
        text={"Early Bird Pricing"}
        month={"Nov"}
        day={"1st"}
        time={"9AM"}
      />
      <EventDateEntry
        text={"Registration Ends"}
        month={"Nov"}
        day={"1st"}
        time={"9AM"}
      />
      <EventDateEntry
        text={"The Event"}
        month={"Feb"}
        day={"20th"}
        time={"9AM-3PM"}
      />
    </div>);
  }

  return (
    <div style={blockStyle()} className="block" id="eventdate-block">
      <div className="eventdate-block block-content">
        <h1 className="heading eventdate-heading">Dates</h1>
        <div className="tabbed-panel">
          <h3 className={`${(panelVisibleId === 1) ? "tabbed-panel-selected" : "tabbed-panel-option"}`} onClick={e => setPanelVisibleId(1)}>Participants</h3>
          <h3 className={`${(panelVisibleId === 2) ? "tabbed-panel-selected" : "tabbed-panel-option"}`} onClick={e => setPanelVisibleId(2)}>Companies</h3>
        </div>
        {panelVisibleId === 1 && <EventDatesParticipants />}
        {panelVisibleId === 2 && <EventDatesCompanies />}
      </div>
    </div>
  );
}

export default EventDateBlock;