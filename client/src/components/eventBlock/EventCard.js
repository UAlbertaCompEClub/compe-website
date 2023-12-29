import React, { useState } from "react";
import {
  CardActionArea,
  Link,
  CardContent,
  CardMedia,
  Typography,
  Card,
} from "@mui/material";

export default function EventCard({ event }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleLeave = () => {
    setIsHovered(false);
  };

  return (
    <Card
      sx={{
        width: 400,
        height: 325,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#90A890",
      }}
    >
      <CardActionArea
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        sx={{
          "&:hover": {
            backgroundColor: "inherit",
            transition: "none",
          },
          "&:hover .MuiCardActionArea-focusHighlight": {
            backgroundColor: "inherit",
          },
          "& .MuiTouchRipple-root": {
            display: "none",
          },
        }}
      >
        <CardMedia component="img" image={event.img} alt={event.title} />
        <CardContent
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "auto",
            height: "100%",
            backgroundColor: "#90A890",
            transition: "transform 0.3s ease-in-out",
            transform: isHovered ? "translateY(10%)" : "translateY(97%)",
          }}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            textAlign="center"
            fontWeight="bold"
          >
            {event.title}
          </Typography>
          <Typography
            gutterBottom
            variant="p"
            component="div"
            padding="1rem"
            fontSize="18px"
            fontWeight="bold"
          >
            {event.description}
          </Typography>
          {event.link && (
            <Link
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                display: "block",
                paddingLeft: "2rem",
                fontSize: "18px",
              }}
              underline="none"
              href={event.link}
              target="_blank"
              rel="noopener"
            >
              Event Website
            </Link>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
