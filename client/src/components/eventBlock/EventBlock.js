import React, { useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import navLinker from "../pageState/observer/navLinker";
import EventCard from "./EventCard";
import events from "./events.json";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";
import PhotoGallery from "./PhotoGallery";

const id = "events";

const EventBlock = React.forwardRef((props, ref) => {
  useEffect(() => {
    navLinker(ref.current, props.setBlock, id);
  }, [ref, props.setBlock]);

  return (
    <div className="block" id={id} ref={ref}>
      <Typography gutterBottom variant="h3" component="div">
        Events
      </Typography>
      <Typography gutterBottom variant="h5" component="div">
        We host everything from hackathons and career fairs to game nights!
      </Typography>
      <Grid
        container
        spacing={6}
        justifyContent="center"
        paddingY="1rem"
        columns={3}
      >
        {events.map((event, idx) => (
          <Grid key={idx} xl={1}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <EventCard event={event} />
            </div>
          </Grid>
        ))}
      </Grid>
      <Paper
        elevation={16}
        style={{
          padding: "2rem",
          backgroundColor: "#253E1E",
          marginTop: "2rem",
          marginBottom: "4rem",
        }}
      >
        <Typography gutterBottom variant="h5" component="div" color={"white"}>
          Check out all our planned events in the calendar below!
        </Typography>
        <iframe
          title="CompE Club Event Calendar"
          loading="lazy"
          src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=America%2FEdmonton&title=CompE%20Club%202023%2F24%20Events&src=Y185OTBkNDAwODcwZGI1ZWMxYmY3MTI2N2VjYzcyYzMyYzI3NTA3NjZiOTk1ZmFjY2M2ZjczZWI3ZmE4Y2RjZTQ2QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&color=%237CB342"
          style={{ width: "100%", height: "600px", background: "white" }}
        ></iframe>
      </Paper>
      <Typography gutterBottom variant="h5" component="div" color={"white"}>
        See our photo gallery below for a better view of all the different types
        of events we host. If you have a cool event idea that we don't offer,
        we'd love to hear it - please reach out to our Social VPs or any
        executive in Discord!
      </Typography>
      <PhotoGallery />
    </div>
  );
});

export default EventBlock;
