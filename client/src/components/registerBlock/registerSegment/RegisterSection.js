import React, { useEffect } from 'react';
import "../RegisterBlock.css";
import '../../Block.css'
import { SponsorForm } from './SponsorForm';

function RegisterSection() {
  return (
    <div className="register-section">
      <h2 className="register-section-header">Registration</h2>
      <div>
        <SponsorForm />
      </div>
    </div>
  );
}

export {
  RegisterSection
};