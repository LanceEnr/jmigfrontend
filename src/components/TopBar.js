import React from "react";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import PhoneIcon from "@mui/icons-material/Phone";
import { Box } from "@mui/material";
import { fetchContactData } from "../components/cms";

const valuesData = await fetchContactData();

export default function TopBar() {
  return (
    <Box
      sx={{
        backgroundColor: "#829088",
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 1,
        }}
      >
        <div style={{ display: "flex" }}>
          <Chip
            label="HOT"
            sx={{
              fontWeight: "bold",
              backgroundColor: "#EBDAB7",
              color: "#bd8512",
              height: {
                xs: "16px", // Height for extra small screens (mobile)
                sm: "22px", // Height for small screens and above
              },
              marginRight: 1,
            }}
          />

          <Typography
            variant="caption"
            component="div"
            sx={{
              color: "#f6f9fc",
              fontSize: {
                xs: "10px", // Font size for extra small screens (mobile)
                sm: "14px", // Font size for small screens
                md: "inherit", // Font size for medium screens
              },
            }}
          >
            Book an appointment now!
          </Typography>
        </div>
        <div style={{ display: "flex" }}>
          <Avatar
            sx={{
              backgroundColor: "#EBDAB7",
              marginRight: 1,
              width: {
                xs: "16px", // Width for extra small screens (mobile)
                sm: "22px", // Width for small screens and above
              },
              height: {
                xs: "16px", // Height for extra small screens (mobile)
                sm: "22px", // Height for small screens and above
              },
            }}
          >
            <PhoneIcon style={{ color: "#bd8512", fontSize: "16px" }} />
          </Avatar>

          <Typography
            variant="caption"
            component="div"
            sx={{
              color: "#f6f9fc",
              fontSize: {
                xs: "10px", // Font size for extra small screens (mobile)
                sm: "14px", // Font size for small screens
                md: "inherit", // Font size for medium screens
              },
            }}
          >
            {valuesData._landline}
          </Typography>
        </div>
      </Container>
    </Box>
  );
}
