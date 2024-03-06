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
            padding: 0,
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#90A890",
            transition: "transform 0.3s ease-in-out",
            transform: isHovered ? "translateY(0%)" : "translateY(82%)",
          }}
        >
          <Typography
            variant="h5"
            component="div"
            textAlign="center"
            fontWeight="bold"
            paddingTop={isHovered ? "1rem" : "0.5rem"}
          >
            {event.title}
          </Typography>
          <Typography
            variant="p"
            component="div"
            paddingBlock="1rem"
            paddingInline="1.5rem"
            fontSize="18px"
            fontWeight="bold"
          >
            {event.description}
          </Typography>
          {event.link && (
            <Link
              sx={{
                position: "absolute",
                bottom: "1rem",
                left: "1.5rem",
                display: "block",
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
