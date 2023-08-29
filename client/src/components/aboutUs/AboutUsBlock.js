import React, { useEffect } from 'react';
import './AboutUsBlock.css';
import navLinker from "../pageState/observer/navLinker";
import compELogo from './compeLogoWhite.svg';
import GradientImg from '../../commons/gradient/GradientImg';

const aboutUsStyle = () => ({
    display: 'flex',
    // 'padding-left': '5vw',
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
                        For over 35 years, the University of Alberta's Computer Engineering Club has bought Computer Engineering students together, organized specialized events and initiatives, and advocated to larger bodies — such as the Engineering Students’ Society, the Faculty of Engineering, and the Students’ Union. In recent years however, we have expanded our scope to include students in Computer Science, and Data Science fields who share similar interests in industry.
                        We have a longstanding history of running large-scale events focused around educational and hands-on learning for programming and design, such as <a href="https://hacked.compeclub.com" target="_blank" rel="noopener noreferrer">HackED</a> and <a href="https://hackedbeta.compeclub.com" target="_blank" rel="noopener noreferrer">HackED Beta</a>. 
                        Now, we are excited to continue this fairly new endeavor, with the goal of connecting undergraduate students to employers and businesses in a way that is unprecedented on our campus: Career++. 
                    </p>
                    <p>
                        While Career++ is still somewhat new, our club has phenomenal successful and experience running large-scale events. HackED is one of Alberta’s largest student-run hackathons with over 700 participants, and a history stretching back over 10 years. 
                        Additionally, at the inaugeral Career++ last year, we had an incredible participation rate of over 1000 students and received overwhelmingly positive feedback from the students and companies! We expect similar if not more students this year.
                    </p>
                </div>
                <div className='about-us-img-container'>
                    <GradientImg img={compELogo} className="about-us-img" alt="Cool Graphic" />
                    {/* <img src={compELogo} className="about-us-img about-us-img-animated"/> */}
                    {/* <img src={teamPic} className="team-img"/> */}
                </div>
            </div>
        </div>
)});

export default AboutUsBlock;