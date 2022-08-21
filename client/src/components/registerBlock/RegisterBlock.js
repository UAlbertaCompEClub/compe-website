import React, { useEffect } from 'react';
import blockStyle from '../Block';
import { RegisterSection } from "./registerSegment/RegisterSection";
import "./RegisterBlock.css";
import '../Block.css'

function RegisterBlock({ height, id }) {
  return (
    <div style={blockStyle(height)} className="block">
      <div className="register-block" id={"register-block" + id}>
        <RegisterSection />
      </div>
    </div>
  );
}

export default RegisterBlock;