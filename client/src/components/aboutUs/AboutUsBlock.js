import React, { useEffect } from 'react';
import './AboutUsBlock.css';
import navLinker from "../pageState/observer/navLinker";

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
            <div className="about-us-text" id="about-us-text" style={{paddingBottom: '10px'}}>
                <h1 className='main-heading faded text-main'>About Us</h1>
                <h2 className='sub-heading faded text-main colored-text'>The Computer Engineering Club</h2>
                <p>
                    For over 35 years, the University of Alberta's Computer Engineering Club has bought Computer Engineering students together, organized specialized events and initiatives, and advocated to larger bodies — such as the Engineering Students’ Society, the Faculty of Engineering, and the Students’ Union. In recent years however, we have expanded our scope to include students in Computer Science, and Data Science fields who share similar interests in industry.
                    We have a longstanding history of running large-scale events focused around educational and hands-on learning for programming and design, such as <a href="https://hacked.compeclub.com" target="_blank" rel="noopener noreferrer">HackED</a> and <a href="https://hackedbeta.compeclub.com" target="_blank" rel="noopener noreferrer">HackED Beta</a>. 
                    Now, we are excited to continue this fairly new endeavor, with the <strong className="colored-text">goal of connecting undergraduate students to employers and businesses</strong> in a way that is unprecedented on our campus: Career++
                </p>
                <p>
                    While Career++ is still somewhat new, our club has phenomenal successful and experience running large-scale events. HackED is one of <strong className="colored-text">Alberta’s largest student-run hackathons with over 700 participants</strong>, and a history stretching back over 10 years. 
                    Additionally, at the inaugeral Career++ last year, we had an incredible participation rate of <strong className="colored-text">over 1000 students</strong> and received <strong className="colored-text">overwhelmingly positive feedback</strong> from the students and companies! 
                    Furthermore, many students successfully received internship or new grad job offers directly from this event!
                    The companies and organizations that attended last year are:
                    <ul>Servus Credit Union, DriveWyze, Inflexion Games, Technology Alberta, PCL, 
                    Drugbank, Sparrow Connected, Fig Finance and DevFacto</ul>
                    <br/><strong className="colored-text">Check out the images below to get a better sense of this event!</strong>
                </p>
            </div>
        </div>
)});

export default AboutUsBlock;