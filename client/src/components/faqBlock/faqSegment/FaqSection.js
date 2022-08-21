import React, { useEffect } from 'react';
import "../FaqBlock.css";
import '../../Block.css';
import "../../../commons/gradient/gradientStyles.css"

function FaqSection({ heading, questions }) {
  return (
    <div className="faq-section">
      <h2 className="faq-section-header text-main colored-text">{heading}</h2>
      {questions}
    </div>
  );
}

export {
  FaqSection
};