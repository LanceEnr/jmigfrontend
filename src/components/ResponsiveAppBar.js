import * as React from "react";
import axios from "axios";
import { withStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/system";

import NotificationsIcon from "@mui/icons-material/Notifications";
import ListItemIcon from "@mui/material/ListItemIcon";
import EventIcon from "@mui/icons-material/Event";
import OrderIcon from "@mui/icons-material/LocalShipping";
import Divider from "@mui/material/Divider";
import { Link, NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { logout } from "../store/reducers/authReducer";
import { useDispatch } from "react-redux";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import CloseIcon from "@mui/icons-material/Close";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import InfoIcon from "@mui/icons-material/Info";
import MailIcon from "@mui/icons-material/Mail";
//import { fetchProfilePic } from "../components/cms";
import LogoGravasend from "../assets/LogoGravasend.webp";
import Logout from "@mui/icons-material/Logout";

//const storedUsername = localStorage.getItem("userName");
//const valuesData = await fetchProfilePic(storedUsername);
//const imagePath = valuesData._profilePicture;
//const filename = imagePath.substring(imagePath.lastIndexOf("\\") + 1);

const StyledBox = styled(Box)(({ theme }) => ({
  "&::-webkit-scrollbar": {
    width: "0.2em",
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(169,169,169,1)", // Default grey color
    borderRadius: "10px", // Slightly rounded corners
  },
}));

const ColoredBadge = withStyles({
  badge: {
    backgroundColor: "#bd8512",
    color: "#fafbf5",
  },
})(Badge);

//const token = localStorage.getItem("token");

const pages = ["Home", "Products", "FAQs", "About", "Contact"];
const mobilePages = [
  { name: "Home", icon: <HomeIcon /> },
  { name: "Products", icon: <StorefrontIcon /> },
  { name: "FAQs", icon: <LiveHelpIcon /> },
  { name: "About", icon: <InfoIcon /> },
  { name: "Contact", icon: <MailIcon /> },
];

const timeAgo = (timestamp) => {
  const currentDate = new Date();
  const notificationDate = new Date(timestamp);
  const timeDifference = currentDate - notificationDate;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) {
    return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  } else if (hours < 1) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else {
    const options = {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    return notificationDate.toLocaleString("en-US", options);
  }
};

const userName = document.cookie
  .split("; ")
  .find((cookie) => cookie.startsWith("userName="))
  ?.split("=")[1];

const name = "";
const fetchNotifications = async () => {
  const storedUsername = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("userName="))
    ?.split("=")[1];

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-notifications?userName=${storedUsername}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const transformNotification = (data) => {
  return data.map((item) => ({
    icon: item._title.toLowerCase().includes("order") ? OrderIcon : EventIcon,
    heading: item._title,
    text: item._description,
    date: item._date,
  }));
};

const notifications = transformNotification(await fetchNotifications());

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasToken = document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith("token="));

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElNotifications, setAnchorElNotifications] =
    React.useState(null);
  const [anchorElSettings, setAnchorElSettings] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };

  const handleOpenSettingsMenu = (event) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleCloseSettingsMenu = () => {
    setAnchorElSettings(null);
  };
  //const userName = localStorage.getItem("userName");
  return (
    <AppBar position="sticky" style={{ backgroundColor: "#EAECEA" }}>
      <Container>
        <Toolbar disableGutters>
          <Link to="/">
            <Box
              component="img"
              src={LogoGravasend}
              alt="Logo"
              sx={{
                width: "125px",
                height: "auto",
                pt: "10px", // Adjust this value as needed
                pb: "10px", // Adjust this value as needed
                display: { xs: "none", md: "flex" },
              }}
            />
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon
                sx={{ color: "#343231", "&:hover": { color: "#83948a" } }}
              />
            </IconButton>

            <SwipeableDrawer
              anchor="left"
              open={Boolean(anchorElNav)}
              onOpen={() => {}}
              onClose={handleCloseNavMenu}
            >
              <Box
                sx={{
                  p: 2,
                  height: 1,
                  backgroundColor: "#EAECEA",
                }}
                role="presentation"
                onClick={handleCloseNavMenu}
                onKeyDown={handleCloseNavMenu}
              >
                <IconButton onClick={handleCloseNavMenu} sx={{ mb: 2 }}>
                  <CloseIcon />
                </IconButton>

                <Divider sx={{ mb: 2 }} />
                <List sx={{ width: 250 }}>
                  {mobilePages.map((page) => (
                    <ListItem
                      button
                      key={page.name}
                      component={Link}
                      to={page.name === "Home" ? "/" : `/${page.name}`}
                    >
                      <ListItemIcon>{page.icon}</ListItemIcon>
                      <ListItemText primary={page.name} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </SwipeableDrawer>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              justifyContent: "center", // Add this line to center horizontally
              alignItems: "center", // Add this line to center vertically
            }}
          >
            <Link to="/">
              <Box
                component="img"
                src={LogoGravasend}
                alt="Logo"
                sx={{
                  width: "90px",
                  height: "auto",
                  pt: "5px", // Adjust this value as needed
                  pb: "5px", // Adjust this value as needed
                }}
              />
            </Link>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-end",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                component={Link}
                to={page === "Home" ? "/" : `/${page}`}
                sx={{
                  fontWeight: "bold",
                  color: "#343231",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {!hasToken && (
            <Button
              component={Link}
              to={"/login"}
              variant="contained"
              sx={{
                ml: 2,
              }}
            >
              Login
            </Button>
          )}
          {hasToken && (
            <Box sx={{ flexGrow: 0, mr: 2 }}>
              <Tooltip title="Notifications">
                <IconButton onClick={handleOpenNotificationsMenu}>
                  <ColoredBadge
                    badgeContent={notifications ? notifications.length : 0}
                  >
                    <NotificationsIcon color="action" />
                  </ColoredBadge>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElNotifications}
                id="account-menu"
                open={Boolean(anchorElNotifications)}
                onClose={handleCloseNotificationsMenu}
                onClick={handleCloseNotificationsMenu}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  padding={2}
                  sx={{ minWidth: "300px" }}
                >
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    NOTIFICATIONS
                  </Typography>
                </Box>

                <Divider />
                <StyledBox sx={{ overflow: "auto", maxHeight: "600px" }}>
                  {notifications.length === 0 ? (
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      align="center"
                      sx={{ p: 2 }}
                    >
                      No notifications
                    </Typography>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.heading}>
                        <MenuItem onClick={handleCloseNotificationsMenu}>
                          <ListItemIcon style={{ color: "#bd8512" }}>
                            <notification.icon fontSize="small" />
                          </ListItemIcon>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {notification.heading}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {notification.text}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: 10,
                                color: "#83948a",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {timeAgo(notification.date)}
                            </Typography>
                          </Box>
                        </MenuItem>
                        <Divider />
                      </div>
                    ))
                  )}
                </StyledBox>
              </Menu>
            </Box>
          )}
          {hasToken && (
            <Box sx={{ flexGrow: 0, mr: 2 }}>
              <Tooltip title="Settings">
                <IconButton onClick={handleOpenSettingsMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="username"
                    //src={require(`../images/profile/${filename}`)}
                  />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorElSettings}
                id="account-menu"
                open={Boolean(anchorElSettings)}
                onClose={handleCloseSettingsMenu}
                onClick={handleCloseSettingsMenu}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    width: "175px",
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorElSettings(null);
                  }}
                  component={Link}
                  to="/dashboard"
                >
                  <ListItemIcon>
                    <Avatar
                      alt="username"
                      // src={require(`../images/profile/${filename}`)}
                    />
                  </ListItemIcon>
                  Username
                </MenuItem>
                <Divider />

                <MenuItem
                  onClick={() => {
                    document.cookie =
                      "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Strict";

                    dispatch({ type: "LOGOUT" });
                    toast.success("Logout successfully", {
                      autoClose: 50,
                      onClose: () => {
                        navigate("/login");
                        window.location.reload();
                      },
                    });
                  }}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
