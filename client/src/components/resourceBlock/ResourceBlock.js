import React, { useEffect } from "react";
import navLinker from "../pageState/observer/navLinker";
import { Link, Grid, Typography } from "@mui/material";

const id = "resources";

const flexStyle = {
  fontSize: "22px",
  marginBottom: "1rem",
};

const linkStyle = {
  color: "#C36D59",
};

const textBgStyle = {
  backgroundColor: "#253E1E",
  borderRadius: "8px",
  fontSize: "22px",
  paddingInline: "1rem",
};

const ResourceBlock = React.forwardRef((props, ref) => {
  useEffect(() => {
    navLinker(ref.current, props.setBlock, id);
  }, [ref, props.setBlock]);

  return (
    <div className="block" id={id} ref={ref}>
      <Typography gutterBottom variant="h3" component="div">
        Resources
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8} style={textBgStyle}>
          <Typography style={flexStyle}>
            Over the years, our club has compiled resources for CompE Students
            to foster a positive community and uncover the black box of the tech
            industry as a whole. Check them out{" "}
            <Link
              sx={linkStyle}
              underline="hover"
              href="https://github.com/UAlbertaCompEClub/CompE_Resources"
              target="_blank"
              rel="noopener"
            >
              here
            </Link>
            !
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <img src="/images/resources/community.svg" alt="" />
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8} style={textBgStyle}>
          <Typography style={{ ...flexStyle, marginBottom: 6 }}>
            Some key content includes:
          </Typography>
          <ul style={{ ...flexStyle, marginTop: 0 }}>
            <li>Internship/job board links</li>
            <li>Interview prep resources</li>
            <li>Resume making resources</li>
            <li>Cool reads</li>
            <li>Interesting hackathons to consider participating in</li>
            <li>And more!</li>
          </ul>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <img src="/images/resources/interview.svg" alt="" />
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8} style={textBgStyle}>
          <Typography variant="body1" style={flexStyle}>
            Also, our club offers resume reviews throughout the year from
            experienced upper year students. Join our{" "}
            <Link
              sx={linkStyle}
              underline="hover"
              href="https://discord.gg/Unr9cEVc4h"
              target="_blank"
              rel="noopener"
            >
              Discord
            </Link>{" "}
            and request a review in the{" "}
            <code
              style={{
                color: "#7289DA",
                backgroundColor: "#424549",
                fontWeight: "bold",
                paddingInline: "8px",
                borderRadius: "8px",
              }}
            >
              #resume-review
            </code>{" "}
            channel!
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <img src="/images/resources/resume-review.svg" alt="" />
        </Grid>
      </Grid>
    </div>
  );
});

export default ResourceBlock;
