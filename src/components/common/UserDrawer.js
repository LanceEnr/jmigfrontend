import * as React from "react";
import Box from "@mui/material/Box";
import { withStyles } from "@mui/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import { ListSubheader, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";

export default function UserDrawer(props) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [selectedItem, setSelectedItem] = React.useState("");

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const handleCloseNavMenu = () => {
    setState({ ...state, right: false });
  };

  const list = (anchor) => (
    <Box
      sx={{
        p: 2,
        height: 1,
        backgroundColor: "#EAECEA",
        width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <IconButton sx={{ mb: 2 }} onClick={handleCloseNavMenu}>
        <CloseIcon />
      </IconButton>
      <Divider sx={{ mb: 2 }} />
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            sx={{
              backgroundColor: "#EAECEA", // Set the background color here
            }}
          >
            DASHBOARD
          </ListSubheader>
        }
      >
        {["Orders", "Appointments"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => {
                props.onActiveComponentChange(text);
                setSelectedItem(text);
              }}
              sx={{
                borderLeft:
                  selectedItem === text ? "4px solid #83948a" : "none",
                color: selectedItem === text ? "#83948a" : "inherit",
                "& .MuiListItemIcon-root": {
                  color: selectedItem === text ? "#83948a" : "#808080",
                },
              }}
            >
              <ListItemIcon>
                {index % 2 === 0 ? <ShoppingCartIcon /> : <EventNoteIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
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
            sx={{
              backgroundColor: "#EAECEA", // Set the background color here
            }}
          >
            ACCOUNT SETTINGS
          </ListSubheader>
        }
      >
        {["User Profile"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => {
                props.onActiveComponentChange(text);
                setSelectedItem(text);
              }}
              sx={{
                borderLeft:
                  selectedItem === text ? "4px solid #83948a" : "none",
                color: selectedItem === text ? "#83948a" : "inherit",
                "& .MuiListItemIcon-root": {
                  color: selectedItem === text ? "#83948a" : "#808080",
                },
              }}
            >
              <ListItemIcon>
                {index % 2 === 0 ? <AccountCircleIcon /> : <EditIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton onClick={toggleDrawer(anchor, true)}>
            <MenuIcon />
          </IconButton>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
