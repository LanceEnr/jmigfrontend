import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import axios from "axios";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Logout from "@mui/icons-material/Logout";

import { Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TripIcon from "@mui/icons-material/LocalShipping";
import ChecklistIcon from "@mui/icons-material/Checklist";
import DocumentIcon from "@mui/icons-material/Description";
import CompleteIcon from "@mui/icons-material/Done";
import LoadIcon from "@mui/icons-material/ImportExport";
import PeopleIcon from "@mui/icons-material/People";
import BuildIcon from "@mui/icons-material/Build";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import InspectionIcon from "@mui/icons-material/FindInPage";
import WebIcon from "@mui/icons-material/Web";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

import SideNavImage from "../../assets/asd.webp";
import LogoGravasend from "../../assets/LogoGravasend.webp";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EngineeringIcon from "@mui/icons-material/Engineering";
import EventIcon from "@mui/icons-material/Event";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SellIcon from "@mui/icons-material/Sell";
import NoteAltIcon from "@mui/icons-material/NoteAlt";

const StyledBox = styled(Box)(({ theme }) => ({
  "&::-webkit-scrollbar": {
    width: "0.4em",
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
const drawerWidth = 250;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    overflowY: "auto", // Add this line
    backgroundImage: `linear-gradient(to bottom, rgba(189, 133, 18, 0.5), rgba(189, 133, 18, 0.5)), url(${SideNavImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
  "& .MuiListItemText-root": {
    fontWeight: "bold",
    color: "white",
  },
  "& .MuiListItemIcon-root": {
    color: "white",
  },

  "& .MuiListSubheader-root": {
    backgroundColor: "transparent",
    color: "white",
  },
}));
const timeAgo = (timestamp) => {
  const currentDate = new Date();
  const notificationDate = new Date(timestamp);
  const timeDifference = currentDate - notificationDate;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) {
    // Display seconds if less than 1 minute
    return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  } else if (hours < 1) {
    // Display minutes if less than 1 hour
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (hours < 24) {
    // Display hours if less than 24 hours
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else {
    // If more than 24 hours, display the full date
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

const fetchNotifications = async () => {
  const storedUsername = localStorage.getItem("userName");

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-adminNotifications`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const transformNotification = (data) => {
  return data.map((item) => {
    let icon;

    if (item._title.toLowerCase().includes("appointment")) {
      icon = EventIcon;
    } else if (item._title.toLowerCase().includes("inspection")) {
      icon = InspectionIcon;
    } else if (item._title.toLowerCase().includes("trip")) {
      icon = TripIcon;
    } else if (item._title.toLowerCase().includes("check")) {
      icon = ChecklistIcon;
    } else if (item._title.toLowerCase().includes("document")) {
      icon = DocumentIcon;
    } else if (item._title.toLowerCase().includes("complete")) {
      icon = CompleteIcon;
    } else if (item._title.toLowerCase().includes("load")) {
      icon = LoadIcon;
    } else {
      icon = BuildIcon; // Default icon
    }
    return {
      icon,
      heading: item._title,
      text: item._description,
      date: item._date,
    };
  });
};

//const notifications = transformNotification(await fetchNotifications());

export default function AdminDashboard() {
  const [anchorElSettings, setAnchorElSettings] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [selectedSort, setSelectedSort] = React.useState("all");
  const [anchorElNotifications, setAnchorElNotifications] =
    React.useState(null);

  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
    if (open) {
      setOpenFleetManagement(false);
    }
  };
  const [openFleetManagement, setOpenFleetManagement] = useState(false);
  const handleClickFleetManagement = () => {
    setOpenFleetManagement(!openFleetManagement);
    if (!open) {
      setOpen(true);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUserName");
    dispatch({ type: "LOGOUT" });
    toast.success("Logout successfully", {
      autoClose: 50,
      onClose: () => {
        navigate("/adminLogin");
        window.location.reload();
      },
    });
  };

  const handleOpenSettingsMenu = (event) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleCloseSettingsMenu = () => {
    setAnchorElSettings(null);
  };

  useEffect(() => {
    const fetchDefaultNotifications = async () => {
      try {
        const fetchedNotifications = await fetchNotifications();
        const transformedNotifications =
          transformNotification(fetchedNotifications);
        setNotifications(transformedNotifications);
      } catch (error) {
        console.error(
          "Error fetching or transforming default notifications:",
          error
        );
        setNotifications([]);
      }
    };

    fetchDefaultNotifications();
  }, []);

  const handleSortSelect = async (sortOption) => {
    setSelectedSort(sortOption);

    if (sortOption === "all") {
      try {
        setNotifications([]);
        const fetchedNotifications = await fetchNotifications();
        console.log(fetchedNotifications);
        const transformedNotifications =
          transformNotification(fetchedNotifications);

        setNotifications(transformedNotifications);
      } catch (error) {
        console.error("Error fetching or transforming notifications:", error);
        setNotifications([]);
      }
    }
    if (sortOption === "appointment") {
      try {
        setNotifications([]);
        const fetchedNotifications = await fetchNotifications();
        const filteredNotifications = fetchedNotifications.filter(
          (notification) =>
            notification._title.toLowerCase().includes("appointment")
        );
        const transformedNotifications = transformNotification(
          filteredNotifications
        );
        setNotifications(transformedNotifications);
      } catch (error) {
        console.error("Error fetching or transforming notifications:", error);
        setNotifications([]);
      }
    }
    if (sortOption === "inspection") {
      try {
        setNotifications([]);
        const fetchedNotifications = await fetchNotifications();
        const filteredNotifications = fetchedNotifications.filter(
          (notification) =>
            notification._title.toLowerCase().includes("inspection")
        );
        const transformedNotifications = transformNotification(
          filteredNotifications
        );
        setNotifications(transformedNotifications);
      } catch (error) {
        console.error("Error fetching or transforming notifications:", error);
        setNotifications([]);
      }
    }
    if (sortOption === "trip") {
      try {
        setNotifications([]);
        const fetchedNotifications = await fetchNotifications();
        const filteredNotifications = fetchedNotifications.filter(
          (notification) => notification._title.toLowerCase().includes("trip")
        );
        const transformedNotifications = transformNotification(
          filteredNotifications
        );
        setNotifications(transformedNotifications);
      } catch (error) {
        console.error("Error fetching or transforming notifications:", error);
        setNotifications([]);
      }
    }
    if (sortOption === "check") {
      try {
        setNotifications([]);
        const fetchedNotifications = await fetchNotifications();
        const filteredNotifications = fetchedNotifications.filter(
          (notification) =>
            notification._title.toLowerCase().includes("document") ||
            notification._title.toLowerCase().includes("safety")
        );
        const transformedNotifications = transformNotification(
          filteredNotifications
        );
        setNotifications(transformedNotifications);
      } catch (error) {
        console.error("Error fetching or transforming notifications:", error);
        setNotifications([]);
      }
    }
    if (sortOption === "document") {
      try {
        setNotifications([]);
        const fetchedNotifications = await fetchNotifications();
        const filteredNotifications = fetchedNotifications.filter(
          (notification) =>
            notification._title.toLowerCase().includes("document")
        );
        const transformedNotifications = transformNotification(
          filteredNotifications
        );
        setNotifications(transformedNotifications);
      } catch (error) {
        console.error("Error fetching or transforming notifications:", error);
        setNotifications([]);
      }
    }
    if (sortOption === "load") {
      try {
        setNotifications([]);
        const fetchedNotifications = await fetchNotifications();
        const filteredNotifications = fetchedNotifications.filter(
          (notification) => notification._title.toLowerCase().includes("load")
        );
        const transformedNotifications = transformNotification(
          filteredNotifications
        );
        setNotifications(transformedNotifications);
      } catch (error) {
        console.error("Error fetching or transforming notifications:", error);
        setNotifications([]);
      }
    }
  };
  const selectedMenuItemStyle = {
    color: "blue",
  };

  return (
    <>
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/adminhome" className="unstyled-link">
            <Box
              sx={{
                display: "flex",
                ml: 2,
                mt: 1,
                position: "relative", // Add this
              }}
            >
              <Box
                component="img"
                src={LogoGravasend}
                alt="Logo"
                sx={{
                  width: "35px",
                  height: "auto",
                  position: "absolute", // Add this
                  top: -10, // Adjust this value as needed
                  left: -20, // Adjust this value as needed
                }}
              />

              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1, fontWeight: "bold" }}
              >
                Admin Dashboard
              </Typography>
            </Box>
          </Link>
          <Box sx={{ ml: "auto", display: "flex" }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleOpenNotificationsMenu}>
                <Badge
                  color="secondary"
                  badgeContent={notifications ? notifications.length : 0}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElNotifications}
              id="account-menu"
              open={Boolean(anchorElNotifications)}
              onClose={handleCloseNotificationsMenu}
              //onClick={handleCloseNotificationsMenu}
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
              >
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  NOTIFICATIONS
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                //padding={2}
              >
                <Divider />
                <MenuItem
                  onClick={() => handleSortSelect("all")}
                  selected={selectedSort === "all"}
                  sx={selectedSort === "all" ? selectedMenuItemStyle : {}}
                >
                  <Typography variant="body2" sx={{ fontSize: "small" }}>
                    All
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => handleSortSelect("appointment")}
                  selected={selectedSort === "appointment"}
                  sx={
                    selectedSort === "appointment" ? selectedMenuItemStyle : {}
                  }
                >
                  <Typography variant="body2" sx={{ fontSize: "small" }}>
                    Appointment
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => handleSortSelect("inspection")}
                  selected={selectedSort === "inspection"}
                  sx={
                    selectedSort === "inspection" ? selectedMenuItemStyle : {}
                  }
                >
                  <Typography variant="body2" sx={{ fontSize: "small" }}>
                    Inspection
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => handleSortSelect("trip")}
                  selected={selectedSort === "trip"}
                  sx={selectedSort === "trip" ? selectedMenuItemStyle : {}}
                >
                  <Typography variant="body2" sx={{ fontSize: "small" }}>
                    Trip
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => handleSortSelect("check")}
                  selected={selectedSort === "check"}
                  sx={selectedSort === "check" ? selectedMenuItemStyle : {}}
                >
                  <Typography variant="body2" sx={{ fontSize: "small" }}>
                    Safety/Document
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => handleSortSelect("load")}
                  selected={selectedSort === "load"}
                  sx={selectedSort === "load" ? selectedMenuItemStyle : {}}
                >
                  <Typography variant="body2" sx={{ fontSize: "small" }}>
                    Load
                  </Typography>
                </MenuItem>
                <Divider />
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
                      <MenuItem>
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
            <Box sx={{ ml: 2 }}>
              <Tooltip title="Settings">
                <IconButton onClick={handleOpenSettingsMenu} sx={{ p: 0 }}>
                  <Avatar />
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
                  to="/adminprofileinfo"
                >
                  <ListItemIcon>
                    <Avatar
                    // alt={userName}
                    // src={require(`../images/profile/${filename}`)}
                    />
                  </ListItemIcon>
                  Username
                </MenuItem>
                <Divider />

                <MenuItem
                  onClick={() => {
                    localStorage.removeItem("adminToken");
                    dispatch({ type: "LOGOUT" });
                    toast.success("Logout successfully", {
                      autoClose: 50,
                      onClose: () => {
                        navigate("/adminLogin");
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
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon style={{ color: "white" }} />
          </IconButton>
        </Toolbar>
        <Divider />
        <Box
          sx={{
            overflow: "auto",
            maxHeight: "calc(100vh - 64px)",
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
          }}
        >
          <List component="nav" sx={{ overflowX: "hidden" }}>
            <ListItemButton component={Link} to="/adminhome">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="caption">Dashboard</Typography>
              </ListItemText>
            </ListItemButton>
            <Divider sx={{ my: 1 }} />
            <ListSubheader component="div" inset>
              OPERATIONS
            </ListSubheader>
            <ListItemButton onClick={handleClickFleetManagement}>
              <ListItemIcon>
                <LocalShippingIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="caption">Fleet Management</Typography>
              </ListItemText>
              {openFleetManagement ? (
                <ExpandLess style={{ color: "white" }} />
              ) : (
                <ExpandMore style={{ color: "white" }} />
              )}
            </ListItemButton>
            <Collapse in={openFleetManagement} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  component={Link}
                  to="/adminfleetinformation"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <FiberManualRecordIcon sx={{ fontSize: "7px" }} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="caption">Fleet Information</Typography>
                  </ListItemText>
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/adminmaintenance"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <FiberManualRecordIcon sx={{ fontSize: "7px" }} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="caption">Maintenance</Typography>
                  </ListItemText>
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/admininspection"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <FiberManualRecordIcon sx={{ fontSize: "7px" }} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="caption">Inspection</Typography>
                  </ListItemText>
                </ListItemButton>
              </List>
            </Collapse>
            <ListItemButton component={Link} to="/adminjoborders">
              <ListItemIcon>
                <NoteAltIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="caption">Job Orders</Typography>
              </ListItemText>
            </ListItemButton>
            <ListItemButton component={Link} to="/admintrips">
              <ListItemIcon>
                <AssignmentTurnedInIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="caption">Trip Verification</Typography>
              </ListItemText>
            </ListItemButton>
            <ListItemButton component={Link} to="/admindeliverymonitoring">
              <ListItemIcon>
                <TrackChangesIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="caption">Delivery Monitoring</Typography>
              </ListItemText>
            </ListItemButton>
            <Divider sx={{ my: 1 }} />
            <ListSubheader component="div" inset>
              MANAGEMENT
            </ListSubheader>

            <ListItemButton component={Link} to="/admindrivermanagement">
              <ListItemIcon>
                <EngineeringIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="caption">Drivers</Typography>
              </ListItemText>
            </ListItemButton>
            <ListItemButton component={Link} to="/adminmanageappointments">
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="caption">Appointments</Typography>
              </ListItemText>
            </ListItemButton>
            <ListItemButton component={Link} to="/adminmanageorders">
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="caption">Orders</Typography>
              </ListItemText>
            </ListItemButton>
            <ListItemButton component={Link} to="/admininventory">
              <ListItemIcon>
                <Inventory2Icon />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="caption">Inventory</Typography>
              </ListItemText>
            </ListItemButton>
            <ListItemButton component={Link} to="/adminaccesscodes">
              <ListItemIcon>
                <LockOpenIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="caption">Access Codes</Typography>
              </ListItemText>
            </ListItemButton>
            <Divider sx={{ my: 1 }} />
            <ListSubheader component="div" inset>
              WEBSITE
            </ListSubheader>
            <ListItemButton component={Link} to="/admincontent">
              <ListItemIcon>
                <WebIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="caption">General Content</Typography>
              </ListItemText>
            </ListItemButton>
            <ListItemButton component={Link} to="/adminlistings">
              <ListItemIcon>
                <SellIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="caption">Listings</Typography>
              </ListItemText>
            </ListItemButton>
            <ListItemButton component={Link} to="/adminusermanagement">
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="caption">Users</Typography>
              </ListItemText>
            </ListItemButton>
            <ListItemButton component={Link} to="/adminmanagecontactform">
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="caption">Contact Form</Typography>
              </ListItemText>
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
