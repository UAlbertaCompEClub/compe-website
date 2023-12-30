import React, { useEffect } from "react";
import { TypeAnimation } from 'react-type-animation';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "./LandingBlock.css";
import { Stack, Typography } from "@mui/material";
import navLinker from "../pageState/observer/navLinker";
import CompELogo from "./CompELogo.svg";


const theme = createTheme();

theme.typography.h1 = {
  fontSize: '2.2rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '3.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '4.2rem',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '5.5rem',
  },
};

theme.typography.h5 = {
  fontSize: '1.0rem',
  lineHeight: 1.4,
  [theme.breakpoints.up('md')]: {
    fontSize: '1.3rem',
  },
};

var LandingBlock = React.forwardRef((props, ref) => {
  var id = "landing-block";
  useEffect(() => {
    navLinker(ref.current, props.setBlock, id);
  }, []);
 

  return (
    <div className="block" id={id} ref={ref} style={{"width": "100%", "height": "100%"}}>
      <ThemeProvider theme={theme}>
      <Stack padding={{ xs: 4, md: 6, lg: 10}} spacing={{ xs: 3, md: 8}}> 
      <Stack direction="row" spacing={{ xs: 1, sm: 2, md: 5, lg: 10}}  > 
        <Stack direction="column" spacing={4}>
          <Typography variant={"h1"} fontWeight="bold">Computer Engineering Club</Typography>
          <TypeAnimation
            className="typing"
            style={{ whiteSpace: 'pre-line', display: 'block', fontStyle: 'italic' }}
            sequence={[
              `Promote sense of community\nProvide resources and services to facilitate career success\nPresent opportunities to network and develop technical skills`,
              1000,
              '',
              500,
            ]}
            deletionSpeed={80}
            speed={{type: 'keyStrokeDelayInMs', value: 100}}
            repeat={Infinity}
          />
        </Stack>
        <img src={CompELogo} className="logo" alt="Computer Engineering Club logo"/>
      </Stack>
        <Typography variant="h5">
          The Computer Engineering Club (CompE Club) is a student organization that represents all Computer Engineering students’ interests to broader organizations at the University of Alberta like the Engineering Student Society and Faculty of Engineering. 
          We also host various events and provide resources for students to grow professionally and/or take a necessary break from school. 
          Please contact us at any of the provided socials if you are a student with any concerns, event ideas etc... or a company / organization for any sponsorship or collaboration inquiries!
        </Typography>
      </Stack>
      </ThemeProvider>
    </div>
  );
});

export default LandingBlock;
