import React, { useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import navLinker from "../pageState/observer/navLinker";
import EventCard from "./EventCard";
import events from "./events.json";
import Typography from "@mui/material/Typography";

const id = "event-block";

var EventBlock = React.forwardRef((props, ref) => {
  useEffect(() => {
    navLinker(ref.current, props.setBlock, id);
  }, []);

  return (
    <div className="block" id={id} ref={ref}>
      <Typography gutterBottom variant="h3" component="div">
        Events
      </Typography>
      <Typography gutterBottom variant="h5" component="div">
        We host everything from hackathons and career fairs to game nights!
      </Typography>
      <Grid container spacing={6}>
        {events.map((event) => (
          <Grid>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
});

export default EventBlock;
