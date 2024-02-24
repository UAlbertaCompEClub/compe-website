import AwesomeSlider from "react-awesome-slider";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import "react-awesome-slider/dist/styles.css";

import image1 from "./galleryPhotos/Career1.jpg";
import image2 from "./galleryPhotos/Career2.jpg";
import image3 from "./galleryPhotos/Career3.jpg";
import image4 from "./galleryPhotos/Career4.jpg";
import image5 from "./galleryPhotos/Career5.jpg";
import image6 from "./galleryPhotos/Career6.jpg";
const images = [image1, image2, image3, image4, image5, image6];

const AutoplaySlider = withAutoplay(AwesomeSlider);

const carouselStyle = {
  display: "flex",
  width: "70%",
  height: "60%",
  margin: "0 auto",
};

const PhotoGallery = () => {
  return (
    <div style={{ justifyContent: "center" }}>
      <AutoplaySlider
        play={true}
        cancelOnInteraction={true}
        interval={2000}
        style={carouselStyle}
      >
        {images.map((image, idx) => (
          <div key={idx} data-src={image} />
        ))}
      </AutoplaySlider>
    </div>
  );
};

export default PhotoGallery;
