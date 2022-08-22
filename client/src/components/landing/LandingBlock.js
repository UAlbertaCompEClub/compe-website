import React, { useEffect } from 'react';
// import landingStyle from './Block';
import './LandingBlock.css'
import graphic from './LandingGraphic.svg';
import GradientImg from '../../commons/gradient/GradientImg';

function LandingBlock({ height, id }) {
    return (
        <div className={"block"}>
            <div className="landing-content" id={"project-block" + id}>
                <div className="landing-text text-main" id="landing-text-1">
                    <div className='landing-logo-container'>
                        <h1 className='main-heading faded text-main'>Career</h1>
                        <h1 className='main-heading faded gradient-header'>++</h1>
                    </div>
                    <h2 className='sub-heading faded text-main'>Presented by the Computer Engineering Club</h2>
                </div>
                <div className='landing-img-container faded'>
                    <GradientImg img={graphic} className="landing-img" alt="Cool Graphic" />
                </div>
            </div>
        </div>
    );
}

export default LandingBlock;