import React, { useEffect } from 'react';
import blockStyle from '../Block';
import navLinker from "../pageState/observer/navLinker";
import { RegisterSection } from "./registerSegment/RegisterSection";
import "./RegisterBlock.css";
import '../Block.css'

var RegisterBlock = React.forwardRef((props, ref) => {
  var id = "register-block";
  useEffect(() => {
    navLinker(ref.current, props.setBlock, id);
  }, []);
  return (
    <div style={blockStyle()} className="block" id={id} ref={ref}>
      <div className="register-block">
        <h1 className="heading event-heading">Registration</h1>
        <RegisterSection />
      </div>
    </div>
)});

export default RegisterBlock;