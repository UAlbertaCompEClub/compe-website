import React, { useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import blockStyle from "../Block";
import navLinker from "../pageState/observer/navLinker";
import EventCard from "./EventCard";
import events from "./events.json";

const id = "eventdate-block";

var EventDateBlock = React.forwardRef((props, ref) => {
  useEffect(() => {
    navLinker(ref.current, props.setBlock, id);
  }, []);

  return (
    <div style={blockStyle()} className="block" id={id} ref={ref}>
      <Grid container spacing={8}>
        {events.map((event) => (
          <Grid>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
});

export default EventDateBlock;
