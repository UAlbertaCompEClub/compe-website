import React, { useEffect } from 'react';
import blockStyle from '../Block';
import { faqEntry } from './faqSegment/faqEntry';
import "./faqBlock.css";
import '../Block.css'

const fade = (percentage) => ({
  transform: 'translateY(' + 50*percentage +'px)',
  opacity: percentage,
  // 'transition-property': 'transform, opacity',
  // 'transition-duration': '1s',
  // 'transition-timing-function': 'linear'
}
);

function FaqBlock({ height, id }) {
  return (
    <div style={blockStyle(height)} className="block">
      <div className="faq-block block-content" id={"faq-block" + id}>
        <h1 className="heading faq-heading">Events</h1>
        <div className="faq-grid" id="faq-grid">
          <FaqEntry
            text={"Registration Begins"}
            month={"Nov"}
            day={"1st"}
            time={"9AM"}
          />
          <FaqEntry
            text={"Registration Ends"}
            month={"Nov"}
            day={"1st"}
            time={"9AM"}
          />
          <faqEntry
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

export default FaqBlock;