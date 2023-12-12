import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Badge,
  ListItemButton,
  ListItemIcon,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import { withStyles } from "@mui/styles";

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
//const filename = imagePath.substring(imagePath.lastIndexOf("\\") + 1);

const ColoredBadge = withStyles({
  badge: {
    backgroundColor: "#bd8512",
    color: "#fafbf5",
    marginRight: 12,
  },
})(Badge);

function SidePanel({ setActiveComponent }) {
  const [selected, setSelected] = useState("");

  const userName = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("userName="))
    ?.split("=")[1];

  const [counts, setCounts] = useState({
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

  const [userData, setUserData] = useState({
    fName: "",
    lName: "",
  });
  useEffect(() => {
    const storedUsername = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("userName="))
      ?.split("=")[1];

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/setuser?userName=${storedUsername}`
      )
      .then((response) => {
        if (response.data.length > 0) {
          const user = response.data[0];

          setUserData({
            fName: user.fName,
            lName: user.lName,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const badgeContentMap = {
    Orders: counts.totalOrders,
    Appointments: counts.totalAppointments,
  };

  const handleClick = (text) => {
    setActiveComponent(text);
    setSelected(text);
  };

  return (
    <Paper elevation={2} sx={{ pt: 2, pb: 2, width: "100%" }}>
      <List sx={{ padding: "16px" }}>
        <ListItem sx={{ marginBottom: "16px" }}>
          <Avatar
            alt={userName}
            src={imagePath}
            sx={{ width: 64, height: 64, marginRight: "16px" }}
          />
          <div>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", marginBottom: "8px" }}
            >
              {userData.fName}
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginBottom: "8px", color: "#83948a", fontWeight: "bold" }}
            >
              {userName}
            </Typography>
          </div>
        </ListItem>
        <Divider />
      </List>

      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            sx={{ fontWeight: "bold" }}
          >
            DASHBOARD
          </ListSubheader>
        }
      >
        {["Orders", "Appointments"].map((text, index) => (
          <ListItem
            key={text}
            disablePadding
            onClick={() => handleClick(text)}
            sx={{
              borderLeft: text === selected ? "4px solid #83948a" : "none",
            }}
          >
            <ListItemButton sx={{ justifyContent: "space-between" }}>
              <ListItemIcon
                sx={{
                  pointerEvents: "none",
                  color: text === selected ? "#83948a" : "#808080",
                }}
              >
                {index % 2 === 0 ? <ShoppingCartIcon /> : <EventNoteIcon />}
              </ListItemIcon>
              <ListItemText
                primary={text}
                sx={{ color: text === selected ? "#83948a" : "inherit" }}
              />
              <ColoredBadge badgeContent={badgeContentMap[text]} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            sx={{ fontWeight: "bold" }}
          >
            ACCOUNT
          </ListSubheader>
        }
      >
        {["User Profile"].map((text, index) => (
          <ListItem
            key={text}
            disablePadding
            onClick={() => handleClick(text)}
            sx={{
              borderLeft: text === selected ? "4px solid #83948a" : "none",
            }}
          >
            <ListItemButton>
              <ListItemIcon
                sx={{
                  pointerEvents: "none",
                  color: text === selected ? "#83948a" : "#808080",
                }}
              >
                {index % 2 === 0 ? <AccountCircleIcon /> : <EditIcon />}
              </ListItemIcon>
              <ListItemText
                primary={text}
                sx={{ color: text === selected ? "#83948a" : "inherit" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default SidePanel;
