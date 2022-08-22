import React, { useState } from 'react';
import blockStyle from '../Block';
import { EventDateEntry } from './eventDateSegment/EventDateEntry';
import "./EventDateBlock.css";
import '../Block.css'

const fade = (percentage) => ({
  transform: 'translateY(' + 50*percentage +'px)',
  opacity: percentage,
  // 'transition-property': 'transform, opacity',
  // 'transition-duration': '1s',
  // 'transition-timing-function': 'linear'
}
);

function EventDateBlock({ height, id }) {
  //0 is none, 1 is company details, 2 is participant details
  var [panelVisibleId, setPanelVisibleId] = useState(2);
  var handlePanelSelection = id => {
    (panelVisibleId === id) ? setPanelVisibleId(0) : setPanelVisibleId(id);
  };
  var EventDatesParticipants = () => {
    return (<div className="eventdate-grid bordered-container-padded" id="eventdate-grid">
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
    return (<div className="eventdate-grid bordered-container-padded" id="eventdate-grid">
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
  }

  return (
    <div style={blockStyle(height)} className="block">
      <div className="eventdate-block block-content" id={"eventdate-block" + id}>
        <h1 className="heading eventdate-heading">Dates</h1>
        <div className="tabbed-panel">
          <h3 className="highlighted-text" onClick={e => handlePanelSelection(1)}>Companies</h3>
          <h3 className="highlighted-text" onClick={e => handlePanelSelection(2)}>Participants</h3>
        </div>
        {panelVisibleId === 1 && <EventDatesParticipants />}
        {panelVisibleId === 2 && <EventDatesCompanies />}
      </div>
    </div>
  );
}

export default EventDateBlock;