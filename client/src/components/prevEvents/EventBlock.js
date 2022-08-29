import React, { useEffect } from 'react';
import blockStyle from '../Block';
import EventEntry from './EventEntry';
import "./EventBlock.css";
import '../Block.css'

import { HackEdDesc, HackEdGraphic } from './hackEd/HackEd';
import { HackEdBetaDesc, HackEdBetaGraphic } from './hackEdBeta/HackEdBeta';

function EventBlock() {
  return (
    <div style={blockStyle()} className="block" id="event-block">
      <div className="event-block block-content">
        <h1 className="heading event-heading">Other Events</h1>
        <h3 style={{textAlign:"center"}}>While Career++ is a new initiative, our club has phenomenal successful and
        experience running the following large-scale events. </h3>
        <div className="event-grid" id="event-grid">
          <EventEntry
            id={1}
            name={"HackED"}
            image={<HackEdGraphic />}
            descr={<HackEdDesc />}
          />
          <EventEntry
            id={2}
            name={"HackED Beta"}
            image={<HackEdBetaGraphic />}
            descr={<HackEdBetaDesc />}
          />
        </div>
      </div>
    </div>
  );
}

export default EventBlock;