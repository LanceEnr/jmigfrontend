import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import Divider from "@mui/material/Divider";
import CoverPhoto from "../../assets/coverphoto.webp";

import { fetchProfilePic } from "../../components/cms";

const storedUsername = document.cookie
  .split("; ")
  .find((cookie) => cookie.startsWith("userName="))
  ?.split("=")[1];

const valuesData = await fetchProfilePic(storedUsername);
const imagePath = valuesData._profilePicture;
//const filename = imagePath.substring(imagePath.lastIndexOf("\\") + 1);

const Img = styled("img")({
  height: "140px",
  width: "100%",
  objectFit: "cover",
});

export default function ProfileCard({ profile }) {
  const userName = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("userName="))
    ?.split("=")[1];

  const [count, setCounts] = useState({
    totalOrders: "",
    totalAppointments: "",
  });

  useEffect(() => {
    const storedUsername = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("userName="))
      ?.split("=")[1];

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/get-counts?userName=${storedUsername}`
      )
      .then((response) => {
        setCounts(response.data);

        if (response.data.length > 0) {
          const user = response.data[0];

          setCounts({
            totalOrders: user.totalOrders,
            totalAppointments: user.totalCounts,
          });
        }
      });
  }, []);
  return (
    <Card sx={{ width: "100%", position: "relative" }}>
      <Img alt={profile.name} src={CoverPhoto} />
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Avatar
          alt={profile.name}
          src={imagePath}
          sx={{
            width: 100,
            height: 100,
            top: -60,
            position: "absolute", // Set position to absolute
            marginBottom: -10,
            border: "4px solid white", // Add a white border with a width of 3px
          }}
        />

        <CardContent>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              mt: 3,
              mb: 1,
            }}
          >
            <Typography
              gutterBottom
              variant="h5"
              style={{ fontWeight: "bold", textAlign: "center" }}
              component="div"
            >
              {profile.name}
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ color: "#83948a", fontWeight: "bold", textAlign: "center" }}
            >
              @{userName}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              {profile.city}
            </Typography>
          </Box>
        </CardContent>
        <Divider
          sx={{
            position: "absolute", // Set position to absolute
            bottom: 80, // Position it at the bottom
            width: "100%", // Make it full width
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pt: 1,
          }}
        >
          <div style={{ textAlign: "center", margin: "0 10px" }}>
            <Typography
              variant="h6"
              style={{ fontWeight: "bold", color: "#bd8512" }}
            >
              {count.totalOrders}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Orders
            </Typography>
          </div>

          <div style={{ textAlign: "center", margin: "0 10px" }}>
            <Typography
              variant="h6"
              style={{ fontWeight: "bold", color: "#bd8512" }}
            >
              {count.totalAppointments}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Appointments
            </Typography>
          </div>
        </Box>
      </Box>
    </Card>
  );
}
