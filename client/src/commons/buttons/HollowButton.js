import "./HollowButton.css";

function HollowButton({ text, ...props }) {
    return (
        <button class="buttonHollow" {...props}>
            <span className="gradient-text-small">{text}</span>
        </button>
    );
}
export default HollowButton;