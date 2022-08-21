import React, { useEffect } from 'react';
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
  useEffect(
    () => {
      const toBeObserved = document.querySelectorAll(".faded");
      // const toBeObserved = document.getElementsByClassName('prj-content');

      // root is the browser viewport / screen
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
          if (entry['isIntersecting'] === true) {
            entry.target.classList.add("in-view");
            console.log('Target is visible in the screen');
          }
          else {
            if (entry.target.classList.contains("in-view")) {
              // entry.target.classList.remove("in-view");
              observer.unobserve(entry.target);
            };
            console.log('Target is not visible in the screen');
          }
        }, { threshold: [0, 1] });

        });

      toBeObserved.forEach(observed => {
        observer.observe(observed);
        // observed.style.opacity = 0.5;
      });
    }, []
  );
  return (
    <div style={blockStyle(height)} className="block">
      <div className="eventdate-block block-content" id={"eventdate-block" + id}>
        <h1 className="heading eventdate-heading">Events</h1>
        <div className="eventdate-grid" id="eventdate-grid">
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
        </div>
      </div>
    </div>
  );
}

export default EventDateBlock;