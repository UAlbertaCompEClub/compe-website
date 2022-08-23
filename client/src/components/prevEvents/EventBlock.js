import React, { useEffect } from 'react';
import blockStyle from '../Block';
import EventEntry from './EventEntry';
import "./EventEntry.css";
import '../Block.css'

import { HackEdDesc, HackEdGraphic } from './hackEd/HackEd';
import { HackEdBetaDesc, HackEdBetaGraphic } from './hackEdBeta/HackEdBeta';

function EventBlock({ height, id }) {
  return (
    <div style={blockStyle(height)} className="block">
      <div className="event-block block-content" id={"event-block" + id}>
        <h1 className="heading event-heading">Previous Events</h1>
        <div className="event-grid" id="event-grid">
          <EventEntry
            id={1}
            name={"HackEd"}
            image={<HackEdGraphic />}
            descr={<HackEdDesc />}
          />
          <EventEntry
            id={2}
            name={"HackEd Beta"}
            image={<HackEdBetaGraphic />}
            descr={<HackEdBetaDesc />}
          />
        </div>
      </div>
    </div>
  );
}

export default EventBlock;