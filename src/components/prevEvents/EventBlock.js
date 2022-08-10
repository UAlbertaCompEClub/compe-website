import React, { useEffect } from 'react';
import blockStyle from '../Block';
import EventEntry from './EventEntry';
import "./EventEntry.css";
import '../Block.css'

import { HackEdDesc, HackEdGraphic } from './hackEd/HackEd';
import { HackEdBetaDesc, HackEdBetaGraphic } from './hackEdBeta/HackEdBeta';


const fade = (percentage) => ({
  transform: 'translateY(' + 50*percentage +'px)',
  opacity: percentage,
  // 'transition-property': 'transform, opacity',
  // 'transition-duration': '1s',
  // 'transition-timing-function': 'linear'
}
);

function EventBlock({ height, id }) {
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
      <div className="block-content" id={"event-block" + id}>
        <h1 className='heading faded'>Events</h1>
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