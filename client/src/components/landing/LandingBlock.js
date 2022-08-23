import React, { useEffect } from 'react';
// import landingStyle from './Block';
import './LandingBlock.css'
import clubLogo from './LandingGraphic.svg';
import blob1 from './blob/blob.svg';
import floater1 from './floaters/line.svg';
import background from './background/background.svg';
import "./animations/randFloat.css"
import GradientImg from '../../commons/gradient/GradientImg';

function LandingBlock({ height, id }) {
    return (
        <div className="block">
            <div className="landing-content" id={"landing-block" + id}>
                <div className="landing-overlay">
                    <div className="landing-text text-main" id="landing-text-1">
                        <div className='landing-logo-container'>
                            <h1 className='main-heading faded text-main'>Career</h1>
                            <h1 className='main-heading faded gradient-header'>++</h1>
                        </div>
                        <h2 className='sub-heading faded text-main'>Presented by the Computer Engineering Club</h2>
                    </div>
                    <div className='landing-img-container faded'>
                        <GradientImg img={clubLogo} className="landing-img" alt="Cool Graphic" />
                    </div>
                </div>
                <div className="landing-underlay">
                    <img src={blob1} className="blob-img" alt="Cool Graphic" />
                    <div className="landing-background">
                        <img src={background} className="landing-background-img" alt="Cool Graphic" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingBlock;