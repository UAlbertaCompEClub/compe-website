import React, { useEffect } from 'react';
// import landingStyle from './Block';
import './LandingBlock.css'
import navLinker from "../pageState/observer/navLinker";
import CompELogo from './CompELogo.svg';

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
                            <h1 className='main-heading faded text-main'>Computer Engineering Club</h1>
                        </div>
                        <h2 className='sub-heading faded text-main'>Promote sense of community<br/>Provide resources and services to facilitate career success<br/>Present opportunities to network and develop technical skills</h2>
                    </div>
                    <div className='landing-img-container faded'>
                        <img src={CompELogo} />
                    </div>
                </div>
            </div>
        </div>
)});

export default LandingBlock;