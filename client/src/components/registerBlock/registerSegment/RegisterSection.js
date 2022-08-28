import React, { useState } from 'react';
import "../RegisterBlock.css";
import '../../Block.css';
import '../../../commons/panel/tabbed/TabbedPanel.css';
import { SponsorForm } from './SponsorForm';
import { StudentEventbrite } from './StudentEventbrite';

function RegisterSection() {
  //0 is none, 1 is company form, 2 is student form
  var [formVisibleId, setFormVisibleId] = useState(2);
  return (
    <div className="register-section">
      <div className="tabbed-panel">
        <h3 className={`${(formVisibleId === 2) ? "tabbed-panel-selected" : "tabbed-panel-option"}`} onClick={e => setFormVisibleId(2)}>Students</h3>
        <h3 className={`${(formVisibleId === 1) ? "tabbed-panel-selected" : "tabbed-panel-option"}`} onClick={e => setFormVisibleId(1)}>Companies</h3>
      </div>
      <div>
        {formVisibleId === 1 && <SponsorForm />}
        {formVisibleId === 2 && <StudentEventbrite />}
      </div>
    </div>
  );
}

export {
  RegisterSection
};