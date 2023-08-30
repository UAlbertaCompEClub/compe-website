import React from 'react';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import image1 from "./careerphotos/CompEClubFair1.jpg";
import image2 from "./careerphotos/CompEClubFair2.jpg";
import image3 from "./careerphotos/CompEClubFair3.jpg";
import image4 from "./careerphotos/CompEClubFair4.JPG";
import image5 from "./careerphotos/CompEClubFair5.JPG";
import image6 from "./careerphotos/CompEClubFair6.JPG";
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';

const AutoplaySlider = withAutoplay(AwesomeSlider);

const carouselStyle = () => ({
  display: 'flex',
  width: '70%', 
  height: '60%',
  margin: '0 auto'
})

const PrevCareerFairBlock = () => {
  return (
    <div className="block" style={{justifyContent: "center"}}>
    <AutoplaySlider
      play={true}
      cancelOnInteraction={false} // should stop playing on user interaction
      interval={6000}
      style={carouselStyle()}
    >
      <div data-src={image1} />
      <div data-src={image2} />
      <div data-src={image3} />
      <div data-src={image4} />
      <div data-src={image5} />
      <div data-src={image6} />
    </AutoplaySlider>
  </div>
  );
}

export default PrevCareerFairBlock;