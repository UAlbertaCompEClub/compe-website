import graphic from './HackEdBetaLogo.svg';
import "../EventEntry.css";
import HollowButton from '../../../commons/buttons/HollowButton';

function HackEdBetaGraphic() {
    return (
        <div className="event-img-container">
            <img src={graphic} className="event-graphic" alt="HackEdBeta Logo" />
        </div>
    );
}


function HackEdBetaDesc() {
    return (
        <div className="event-desc-container">
            <p>HackED Beta is a recent addition to our roster, happening in advance of HackED to serve as an introduction for prospective participants. The format is similar with its intent being to give a window into the hackathon process, and provide a space for interested individuals to learn more about programming and design.</p>
            <HackEdBetaLink />
        </div>
    );
}

function HackEdBetaLink() {
    return (
        <a href='http://albertaloop.ca/' className="highlighted-text event-link text-main">
            <HollowButton text={"Link"}/>
        </a>
    );
}

export {
    HackEdBetaGraphic,
    HackEdBetaDesc
};