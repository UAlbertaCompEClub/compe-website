import React, { Component } from 'react';
import path from 'path';

// We will create these two pages in a moment
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import NavBar from './components/NavBar';

import TextBlock from './components/TextBlock';
import LandingBlock from './components/landing/LandingBlock';
import SocialsBlock from './components/SocialsBlock';
import EventBlock from './components/prevEvents/EventBlock';
import ProjectBlock from './components/projects/ProjectBlock';
import AboutUsBlock from './components/aboutUs/AboutUsBlock';
import EventDateBlock from './components/eventDateBlock/EventDateBlock';
import FaqBlock from './components/faqBlock/FaqBlock';
import RegisterBlock from './components/registerBlock/RegisterBlock';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
            <LandingBlock
              height = {95}
              id = {1}
              />
            <EventDateBlock
              id = {2}
              />
            <ProjectBlock
              height={100}
              id={3}
              />
            <AboutUsBlock
              height={100}
              id={4}
              />
            <EventBlock
              height={100}
              id={5}
              />
            <FaqBlock
              height={100}
              id={6}
              />
            <RegisterBlock
              height={100}
              id={7}
              />
            <SocialsBlock
              height={10}
              id={8}
              />
      </div>
    )
  };

}

export default App;