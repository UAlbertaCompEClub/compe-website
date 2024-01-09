import AwesomeSlider from "react-awesome-slider";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import "react-awesome-slider/dist/styles.css";

const AutoplaySlider = withAutoplay(AwesomeSlider);

const carouselStyle = () => ({
  display: "flex",
  width: "70%",
  height: "60%",
  margin: "0 auto",
});

const importAll = (r) => r.keys().map(r);
const images = importAll(
  require.context(
    "../../../public/images/eventGallery",
    false,
    /\.(png|jpe?g|svg)$/
  )
);

const PhotoGallery = () => {
  return (
    <div style={{ justifyContent: "center" }}>
      <AutoplaySlider
        play={true}
        cancelOnInteraction={false} // should stop playing on user interaction
        interval={2000}
        style={carouselStyle()}
      >
        {images.map((image, idx) => (
          <div key={idx} data-src={image.default} />
        ))}
      </AutoplaySlider>
    </div>
  );
};

export default PhotoGallery;
