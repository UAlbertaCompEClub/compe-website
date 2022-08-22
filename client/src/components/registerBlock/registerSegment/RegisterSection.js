import React, { useState } from 'react';
import "../RegisterBlock.css";
import '../../Block.css';
import '../../../commons/panel/tabbed/TabbedPanel.css';
import { SponsorForm } from './SponsorForm';
import { ParticipantForm } from './ParticipantForm';

function RegisterSection() {
  //0 is none, 1 is company form, 2 is participant form
  var [formVisibleId, setFormVisibleId] = useState(2);
  var handleFormSelection = id => {
    (formVisibleId === id)? setFormVisibleId(0) : setFormVisibleId(id);
  };

  return (
    <div className="register-section">
      <div className="tabbed-panel">
        <h3 className="highlighted-text" onClick={e => handleFormSelection(1)}>Companies</h3>
        <h3 className="highlighted-text" onClick={e => handleFormSelection(2)}>Participants</h3>
      </div>
      <div>
        {formVisibleId === 1 && <SponsorForm />}
        {formVisibleId === 2 && <ParticipantForm />}
      </div>
    </div>
  );
}

export {
  RegisterSection
};