import React, { useEffect } from 'react';
import './AboutUsBlock.css';
import navLinker from "../pageState/observer/navLinker";
import compELogo from './compeLogoWhite.svg';

const aboutUsStyle = () => ({
    display: 'flex',
    // padding: '10vh',
    // 'border-bottom': '1px solid gray',
    'align-items': 'flex-start',
    'overflow': 'hidden'
}
)

var AboutUsBlock = React.forwardRef((props, ref) => {
    var id = "about-us-block";
    useEffect(() => {
        navLinker(ref.current, props.setBlock, id);
    }, []);
    return (
        <div style={aboutUsStyle()} className="block" id={id} ref={ref}>
            <div className="about-us-content">
                <div className="about-us-text" id="about-us-text">
                    <h1 className='main-heading faded text-main'>About Us</h1>
                    <h2 className='sub-heading faded text-main colored-text'>The Computer Engineering Club</h2>
                    <p>
                        For over fifteen years, the University of Alberta's Computer Engineering Club has bought Computer Engineering students together, organized specialized events and initiatives, and advocated to larger bodies — such as the Engineering Students’ Society, the Faculty of Engineering, and the Students’ Union. In recent years however, we have expanded our scope to include students in Computer Science, and Data Science fields who share similar interests in industry.
                        We have a longstanding history of running large-scale events focused around educational and hands-on learning for programming and design, such as HackED and HackED Beta. Now, we are excited to announce a completely new endeavor, with the goal of connecting undergraduate students to employers and businesses in a way that is unprecedented on our campus: Career++.
                    </p>
                </div>
                <div className='about-us-img-container'>
                    <img src={compELogo} className="about-us-img about-us-img-animated"/>
                    {/* <img src={teamPic} className="team-img"/> */}
                </div>
            </div>
        </div>
)});

export default AboutUsBlock;