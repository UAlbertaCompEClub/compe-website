import React, { useEffect, useState } from 'react';
import blockStyle from '../Block';
import { EventDateEntry } from './eventDateSegment/EventDateEntry';
import navLinker from "../pageState/observer/navLinker";
import "./EventDateBlock.css";
import '../Block.css'


var EventDateBlock = React.forwardRef((props, ref) => {
  var id = "eventdate-block";
  useEffect(() => {
    navLinker(ref.current, props.setBlock, id);
  }, []);
  //0 is none, 2 is company details, 1 is participant details
  var [panelVisibleId, setPanelVisibleId] = useState(1);
  var EventDatesStudents = () => {
    return (<div className="eventdate-grid gradient-border-padded" id="eventdate-grid">
      <EventDateEntry
        text={"Career++ Event"}
        month={"Jan."}
        day={"20th"}
        time={"11AM-3PM"}
      />
    </div>);
  };
  var EventDatesCompanies = () => {
    return (<div className="eventdate-grid gradient-border-padded" id="eventdate-grid">
      <EventDateEntry
        text={"Early Bird Pricing"}
        month={"Oct."}
        day={"14th"}
        time={"11:59PM"}
      />
      <EventDateEntry
        text={"Registration Ends"}
        month={"Dec."}
        day={"16th"}
        time={"11:59PM"}
      />
      <EventDateEntry
        text={"Career++ Event"}
        month={"Jan."}
        day={"20th"}
        time={"11AM-3PM"}
      />
    </div>);
  }

  return (
    <div style={blockStyle()} className="block" id={id} ref={ref}>
      <div className="eventdate-block block-content">
        <h1 className="heading eventdate-heading">Dates</h1>
        <div className="tabbed-panel">
          <h3 className={`${(panelVisibleId === 1) ? "tabbed-panel-selected" : "tabbed-panel-option"}`} onClick={e => setPanelVisibleId(1)}>Students</h3>
          <h3 className={`${(panelVisibleId === 2) ? "tabbed-panel-selected" : "tabbed-panel-option"}`} onClick={e => setPanelVisibleId(2)}>Companies</h3>
        </div>
        {panelVisibleId === 1 && <EventDatesStudents />}
        {panelVisibleId === 2 && <EventDatesCompanies />}
        {[0,1].includes(panelVisibleId) && <h2 style={{textAlign:"center"}}>Note, students do NOT need to register to attend Career++</h2> }
      </div>
    </div>
  )});

export default EventDateBlock;