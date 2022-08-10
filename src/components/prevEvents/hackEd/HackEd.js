import graphic from './HackEdLogo.svg';
import "../EventEntry.css";
import HollowButton from '../../../commons/buttons/HollowButton';

function HackEdGraphic() {
    return (
        <div className="event-img-container">
            <img src={graphic} className="event-graphic" alt="HackEd Logo" />
        </div>
    );
}


function HackEdDesc() {
    return (
        <div className="event-desc-container">
            <p className='text-main'>HackED is one of Alberta’s largest student-run hackathons with over 700 participants, and a history stretching back over 10 years. For 24 hours, participants work together in teams of 1 to 5 people to build a project. Teams can work on hardware or software projects. There is no limit on creativity. The hackathon acts as a sort of incubator to mini projects as it provides a focused time to work on ideas with mentors and workshops.</p>
            <HackEdLink/>
        </div>
    );
}

function HackEdLink() {
    return (
        <a href='http://albertaloop.ca/' className="highlighted-text event-link text-main">
            <HollowButton text={"Link"} />
        </a>
    );
}

export {
    HackEdGraphic,
    HackEdDesc
};