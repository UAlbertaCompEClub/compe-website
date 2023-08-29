import React, { useEffect } from 'react';
// import landingStyle from './Block';
import './LandingBlock.css'
import landingGraphic from './LandingGraphic.svg';
import blob1 from './blob/blob.svg';
import navLinker from "../pageState/observer/navLinker";
import floater1 from './floaters/line.svg';
import background from './background/background.svg';
import GradientImg from '../../commons/gradient/GradientImg';

var LandingBlock = React.forwardRef((props, ref) => {
    var id = "landing-block";
    useEffect(() => {
       navLinker(ref.current, props.setBlock, id)
    }, []);
    return (
        <div className="block" id={id} ref={ref}>
            <div className="landing-content">
                <div className="landing-overlay">
                    <div className="landing-text text-main" id="landing-text">
                        <div className='landing-logo-container'>
                            <h1 className='main-heading faded text-main'>Career</h1>
                            <h1 className='main-heading faded gradient-header'>++</h1>
                        </div>
                        <h2 className='sub-heading faded text-main'>Presented by the Computer Engineering Club</h2>
                        <h3 className='faded colored-text'>January 18th - 19th, 2024</h3>
                    </div>
                    <div className='landing-img-container faded'>
                        <GradientImg img={landingGraphic} className="landing-img" alt="Cool Graphic" />
                    </div>
                </div>
                <div className="landing-underlay">
                    <div className="landing-background">
                        <img src={background} className="landing-background-img" alt="Cool Graphic" />
                    </div>
                </div>
            </div>
        </div>
)});

export default LandingBlock;