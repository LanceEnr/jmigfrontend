import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Grid,
  Paper,
  Box,
  useMediaQuery,
  Avatar,
  List,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import UserDrawer from "./common/UserDrawer";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
async function fetchProfilePic(_userName) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-profile-pic/${_userName}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching banner:", error);
    throw error;
  }
}

const storedUsername = document.cookie
  .split("; ")
  .find((cookie) => cookie.startsWith("userName="))
  ?.split("=")[1];

const valuesData = await fetchProfilePic(storedUsername);
const imagePath = valuesData._profilePicture;

export default function ProfileInfo(props) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const userAvatarUrl = "https://example.com/avatar.jpg";

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState({ totalOrders: "", pendingOrders: "" });
  const [userData, setUserData] = useState({
    "First Name": "",
    "Last Name": "",
    Email: "",
    Phone: "",
    Birthdate: "",
    Address: "",
  });

  useEffect(() => {
    const storedUsername = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("userName="))
      ?.split("=")[1];

    axios
      .get(`${process.env.REACT_APP_API_URL}/user?userName=${storedUsername}`)
      .then((response) => {
        setUsers(response.data);

        if (response.data.length > 0) {
          const user = response.data[0];

          setUserData({
            "First Name": user._fName,
            "Last Name": user._lName,
            Email: user._email,
            Phone: user._phone,
            Birthdate: user._bday,
            Address: user._address,
          });
          setOrders({
            totalOrders: user.totalOrders,
            pendingOrders: user.pendingOrders,
          });
        }
      });
  }, []);
  const userName = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("userName="))
    ?.split("=")[1];

  return (
    <List
      sx={{
        px: 0,
        py: 0,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          component="h1"
          variant="h5"
          sx={{
            color: "#83948a",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            my: 2,
          }}
        >
          <AccountCircleIcon sx={{ mr: 2, verticalAlign: "middle" }} />
          Profile Information
        </Typography>
        {isMobile && (
          <UserDrawer onActiveComponentChange={props.onActiveComponentChange} />
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={2}
            style={{
              height: "100px",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
            }}
          >
            <Avatar
              alt={userName}
              src={imagePath}
              style={{ width: "60px", height: "60px", marginLeft: "16px" }}
            />
            <Typography variant="h5" style={{ marginLeft: "16px" }}>
              {userName}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper
            elevation={2}
            style={{
              height: "100px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" style={{ color: "#bd8512" }}>
              {orders.totalOrders}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Total Orders
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper
            elevation={2}
            style={{
              height: "100px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" style={{ color: "#bd8512" }}>
              {orders.pendingOrders}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Pending Orders
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper
            elevation={2}
            style={{ padding: "16px 16px 16px 32px", marginBottom: "16px" }}
          >
            <Grid container spacing={2}>
              {Object.entries(userData).map(([key, value]) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={key}>
                  <Typography variant="subtitle1" color="textSecondary">
                    {key}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ wordBreak: "break-word" }}
                  >
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </List>
  );
}
