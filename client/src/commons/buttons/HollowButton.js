import "./HollowButton.css";

function HollowButton({ text, ...props }) {
    return (
        <button class="buttonHollow" {...props}>
            <span className="gradient-text-small">{text}</span>
        </button>
    );
}

function HollowerButton({ text, ...props }) {
    return (
        <button class="buttonHollower" {...props}>
            <span className="text-main">{text}</span>
        </button>
    );
}

export default HollowButton;
export {
    HollowerButton
}