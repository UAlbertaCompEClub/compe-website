import gradientImg from './gradient.svg';
import './gradientStyles.css';

function GradientImg({ img, className, ...props }) { 
    const gradientImgStyle = (img) => ({
        WebkitMaskImage: "url(" + img + ")",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",

        maskImage: "url(" + img + ")",
        maskRepeat: "no-repeat",
        maskSize: "100% 100%",

        WebkitMaskBoxImage: "url(" + img + ")",
        maskBoxImage: "url(" + img + ")"
    });

    return (
        <div className="gradient-image-container">
            <img src={gradientImg} className={`gradientImg ${className}`} style={gradientImgStyle(img)} {...props} />
        </div>
    );
}

export default GradientImg;