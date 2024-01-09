import "../Block.css";
import "./SocialsBlock.css";

function SocialsBlock() {
  return (
    <div className="footer-block" id="footer-block">
      <div className="footer">
        <p className="footer-text unecessary-footer-text">Built with React</p>
        <p className="divider">|</p>
        <p className="footer-text">Property of Computer Engineering Club</p>
        <p className="divider">|</p>

        <div className="socials-content">
          <a href="https://www.linkedin.com/company/computer-engineering-club-university-of-alberta">
            <img
              src="/images/socials/linkedin.svg"
              className="socials-icon highlighted"
              alt="LinkedIn Icon"
            />
          </a>
          <a href="mailto:external@compeclub.com">
            <img
              src="/images/socials/mail.svg"
              className="socials-icon highlighted"
              alt="Email Icon"
            />
          </a>
          <a href="https://www.instagram.com/compeclub">
            <img
              src="/images/socials/instagram.svg"
              className="socials-icon highlighted"
              alt="Instagram Icon"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export default SocialsBlock;
