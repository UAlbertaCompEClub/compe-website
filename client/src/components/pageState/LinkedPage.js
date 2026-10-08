import React, { Component } from "react";
import NavBar from "../navBar/NavBar";
import LandingBlock from "../landing/LandingBlock";
import SocialsBlock from "../socialsBlock/SocialsBlock";
import EventBlock from "../eventBlock/EventBlock";
import TeamBlock from "../teamBlock/TeamBlock";
import ResourceBlock from "../resourceBlock/ResourceBlock";
import SponsorsBlock from "../sponsorsBlock/SponsorsBlock";

class LinkedPage extends Component {
  constructor(props) {
    super(props);
    this.homeRef = React.createRef();
    this.eventsRef = React.createRef();
    this.resourcesRef = React.createRef();
    this.teamRef = React.createRef();
    this.sponsorsRef = React.createRef();
  }

  state = {
    visibleBlock: "",
  };
  setVisibleBlock = (id) => {
    this.setState({ visibleBlock: id });
  };

  render() {
    return (
      <>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <NavBar visibleBlock={this.state.visibleBlock} />
        <main id="main">
          <LandingBlock ref={this.homeRef} setBlock={this.setVisibleBlock} />
          <EventBlock ref={this.eventsRef} setBlock={this.setVisibleBlock} />
          <ResourceBlock
            ref={this.resourcesRef}
            setBlock={this.setVisibleBlock}
          />
          <TeamBlock ref={this.teamRef} setBlock={this.setVisibleBlock} />
          <SponsorsBlock
            ref={this.sponsorsRef}
            setBlock={this.setVisibleBlock}
          />
        </main>
        <SocialsBlock />
      </>
    );
  }
}

export default LinkedPage;
