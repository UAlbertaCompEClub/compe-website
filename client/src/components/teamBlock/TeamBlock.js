import React, { useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import navLinker from "../pageState/observer/navLinker";
import TeamMemberCard from "./TeamMemberCard";
import seniorExecs from "./seniorExecs.json";
import juniorExecs from "./juniorExecs.json";
import Typography from "@mui/material/Typography";

const id = "team";

const TeamBlock = React.forwardRef((props, ref) => {
  useEffect(() => {
    navLinker(ref.current, props.setBlock, id);
  }, [ref, props.setBlock]);

  return (
    <div className="block" id={id} ref={ref}>
      <Typography gutterBottom variant="h3" component="div">
        Senior Executives
      </Typography>
      <Grid container spacing={6} justifyContent="center" paddingY="1rem">
        {seniorExecs.map((teamMember, idx) => (
          <Grid key={idx}>
            <TeamMemberCard teamMember={teamMember} />
          </Grid>
        ))}
      </Grid>
      <Typography gutterBottom variant="h3" component="div" marginTop="2.5rem">
        Junior Executives
      </Typography>
      <Grid container spacing={6} justifyContent="center" paddingY="1rem">
        {juniorExecs.map((teamMember, idx) => (
          <Grid key={idx}>
            <TeamMemberCard teamMember={teamMember} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
});

export default TeamBlock;
