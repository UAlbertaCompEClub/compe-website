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
import AboutUsBlock from './components/aboutUs/AboutUsBlock';
import OverviewBlock from './components/overviewBlock/OverviewBlock';
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
              />
            <OverviewBlock />
            <EventDateBlock />
            <AboutUsBlock />
            <EventBlock />
            <FaqBlock />
            <RegisterBlock />
            <SocialsBlock />
      </div>
    )
  };

}

export default App;