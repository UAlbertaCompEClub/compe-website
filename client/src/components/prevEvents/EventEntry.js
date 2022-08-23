import React from 'react';
import "./EventEntry.css";
import "../Block.css"

function EventEntry({ id, name, image, descr }) {
    return (
      <div className="event-entry" id={"event-entry" + id}>
        <div className="event-content gradient-border-padded faded">
            <div className="event-text text-main">
                <h3 className="event-title text-main colored-text">{ name }</h3>
                { descr }
            </div>
            {image}
      </div>
    </div>
  );
}

export default EventEntry;