import React, { useEffect, useState } from 'react';
import blockStyle from '../Block';
import { EventDateEntry } from './eventDateSegment/EventDateEntry';
import navLinker from "../pageState/observer/navLinker";
import "./EventDateBlock.css";
import '../Block.css'


var EventDateBlock = React.forwardRef((props, ref) => {
  var id = "eventdate-block";
  useEffect(() => {
    navLinker(ref.current, props.setBlock, id);
  }, []);
 
  return (
    <div style={blockStyle()} className="block" id={id} ref={ref}>
      <div className="eventdate-block block-content">
        <h1 className="heading eventdate-heading">Dates</h1>
        <h2 style={{paddingBottom: '10px'}}>Career++ will take place on the 18th (virtual) and 19th (in-person) of January, 2024.</h2>
        <h2 style={{paddingBottom: '20px'}}>
          For companies, these are the following registration deadlines:
          <ul>
            <li>
            Early-Bird Discounted Pricing Deadline: October 20th, 5 pm MST
            </li>
            <li>
            Final Deadline: December 15th, 5 pm MST
            </li>
          </ul>
        </h2>
        <h3 className='colored-text'>Note, students do NOT need to register to attend Career++. However, we will create an optional eventbrite in a bit so that we can collect resumes to share with any companies interested in them.
        This info will be shared on our <a href="https://discord.gg/Dgd4hXA4eP" target="_blank" rel="noopener noreferrer">discord</a> - join if you haven't already! </h3>
      </div>
    </div>
  )});

export default EventDateBlock;
