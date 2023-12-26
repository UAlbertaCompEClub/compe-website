import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

export default function EventCard({ event }) {
  return (
    <Card sx={{ width: 400, height: 325 }}>
      <CardActionArea>
        <CardMedia component="img" image={event.img} alt={event.title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {event.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
