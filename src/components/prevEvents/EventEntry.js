import React from 'react';
import "./EventEntry.css";
import "../Block.css"

function EventEntry({ id, name, image, descr }) {
    return (
      <div className="event-entry" id={"event-entry" + id}>
        <div className="event-content faded">
            <div className="event-text text-main">
                <h4 className="event-title text-main">{ name }</h4>
                { descr }
            </div>
            {image}
      </div>
    </div>
  );
}

export default EventEntry;