import "./HollowButton.css";

function HollowButton({ text, ...props }) {
    return (
        <button class="buttonHollow" {...props}>{text}</button>
    );
}
export default HollowButton;