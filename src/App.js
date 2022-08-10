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

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <NavBar /> */}
            <LandingBlock
              height = { 80 }
              id = { 1 }
            />
            <ProjectBlock
              height={100}
              id={2}
            />
            <AboutUsBlock
              height={100}
              id={3}
            />
            <EventBlock
              height={100}
              id={3}
            />
            <SocialsBlock
              height={10}
              id={4}
            />
      </div>
    )
  };

}

export default App;