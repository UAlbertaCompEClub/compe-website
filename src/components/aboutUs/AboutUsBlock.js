import React, { useEffect } from 'react';
import './AboutUsBlock.css'
import compELogo from './compeLogoWhite.svg'

const aboutUsStyle = (height) => ({
    display: 'flex',
    // padding: '10vh',
    // 'border-bottom': '1px solid gray',
    'align-items': 'flex-start',
    'min-height': height + 'vh',
    'max-height': '100vh',
    'overflow': 'hidden'
}
)

function AboutUsBlock({ height, id }) {
    return (
        <div style={ aboutUsStyle(height)} className={"block"}>
            <div className="about-us-content" id={"project-block" + id}>
                <div className="about-us-text" id="about-us-text">
                    <h1 className='main-heading faded text-main'>About Us</h1>
                    <h2 className='sub-heading faded text-main'>Presented by the Computer Engineering Club</h2>
                </div>
                <div className='about-us-img-container faded'>
                    <img src={compELogo} className="about-us-img" alt="Cool Graphic"/>
                </div>
            </div>
        </div>
    );
}

export default AboutUsBlock;