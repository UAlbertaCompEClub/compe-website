import React, { useEffect } from 'react';
// import landingStyle from './Block';
import './LandingBlock.css'
import graphic from './LandingGraphic.svg'

const landingStyle = (height) => ({
    display: 'flex',
    // padding: '10vh',
    // 'border-bottom': '1px solid gray',
    'align-items': 'flex-start',
    'min-height': height + 'vh',
    'max-height': '100vh',
    'overflow': 'hidden'
}
)

function LandingBlock({ height, id }) {
    return (
        <div style={ landingStyle(height)} className={"block"}>
            <div className="landing-content" id={"project-block" + id}>
                <div className="landing-text text-main" id="landing-text-1">
                    <h1 className='main-heading faded text-main'>Career Fair</h1>
                    <h2 className='sub-heading faded text-main'>Presented by the Computer Engineering Club</h2>
                </div>
                <div className='landing-img-container faded'>
                    <img src={graphic} className="landing-img" alt="Cool Graphic" />
                </div>
            </div>
        </div>
    );
}

export default LandingBlock;