import { CardContent, CardMedia, Typography, Card } from "@mui/material";

export default function TeamMemberCard({ teamMember }) {
  return (
    <Card
      sx={{
        width: 300,
        backgroundColor: "#90A890",
        textAlign: "center",
      }}
    >
      <CardMedia
        sx={{ height: 300 }}
        component="img"
        loading="lazy"
        image={teamMember.img}
        alt={`${teamMember.name}'s Photo`}
      />
      <CardContent>
        <Typography variant="h5" component="div" fontWeight="bold" margin={0}>
          {teamMember.name}
        </Typography>
        <Typography variant="p" component="div" fontSize="18px">
          {teamMember.role}
        </Typography>
      </CardContent>
    </Card>
  );
}
