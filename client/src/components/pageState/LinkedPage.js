import React, { Component } from "react";
import PageShell from "../layout/PageShell";
import LandingBlock from "../landing/LandingBlock";
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
      <PageShell visibleBlock={this.state.visibleBlock}>
        <LandingBlock ref={this.homeRef} setBlock={this.setVisibleBlock} />
        <EventBlock ref={this.eventsRef} setBlock={this.setVisibleBlock} />
        <ResourceBlock ref={this.resourcesRef} setBlock={this.setVisibleBlock} />
        <TeamBlock ref={this.teamRef} setBlock={this.setVisibleBlock} />
        <SponsorsBlock ref={this.sponsorsRef} setBlock={this.setVisibleBlock} />
      </PageShell>
    );
  }
}

export default LinkedPage;
