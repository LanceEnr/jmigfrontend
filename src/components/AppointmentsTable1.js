import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  List,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Box,
  ListItem,
  Tooltip,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Paper,
  Pagination,
  useMediaQuery,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  ListItemIcon,
  Divider,
  Chip,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EventNoteIcon from "@mui/icons-material/EventNote";
import UserDrawer from "./common/UserDrawer";
import SetAppointmentForm from "./SetAppointmentForm";
import EditAppointmentForm from "./EditAppointmentForm";
import { toast } from "react-toastify";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Modal from "@mui/material/Modal";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EventIcon from "@mui/icons-material/Event";

const getColor = (_status) => {
  switch (_status) {
    case "Completed":
      return { main: "success.main", lighter: "#8dd290" };
    case "Cancelled":
      return { main: "error.main", lighter: "#f5c9c9" };
    case "Upcoming":
      return { main: "warning.main", lighter: "#ffc890" };
    default:
      return { main: "", lighter: "" };
  }
};

export default function AppointmentsTable1(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [appointmentNum, setAppointmentNumber] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false); // Add this line
  const [showEditForm, setShowEditForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [status, setstatus] = useState(null);
  const [phone, setphone] = useState(null);
  const [fName, setfName] = useState(null);
  const [lName, setlName] = useState(null);
  const [date, setdate] = useState(null);
  const [note, setnote] = useState(null);

  const handleOpenModal = (
    appointmentNum,
    status,
    phone,
    fName,
    lName,
    date,
    note
  ) => {
    setAppointmentNumber(appointmentNum);
    setstatus(status);
    setphone(phone);
    setfName(fName);
    setlName(lName);
    setdate(date);
    setnote(note);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEditClick = () => {
    setAnchorEl(null);
    setShowEditForm(true);
    setAppointmentNumber(appointmentNum);
  };

  const handleSetAppointmentClick = () => {
    setShowForm(true);
  };
  const handleClick = (event, appointmentNum) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
    setAppointmentNumber(appointmentNum);
  };
  const currentDate = new Date();
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
  const storedUsername = localStorage.getItem("userName");
  const formattedDate = currentDate.toLocaleString("en-US", options);
  const handleCancel = async (appointmentNum) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/cancel-appointment`, {
        _appointmentNum: appointmentNum,
        _status: "Cancelled",
        _date: formattedDate,
        _userName: storedUsername,
      })
      .then((response) => {
        toast.success("Appointment cancelled successfully");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error canceling appointment:", error);
      });
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowForm(false);
    setShowEditForm(false);
    setMenuOpen(false); // Close the menu
  };
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const handleChange = (event, value) => {
    setPage(value);
  };
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    const storedUsername = localStorage.getItem("userName");

    if (storedUsername) {
      axios
        .get(`http://localhost:3001/appointment?userName=${storedUsername}`)
        .then((response) => {
          console.log(response.data);
          setAppointments(response.data);
        })
        .catch((error) => {
          console.error("Error fetching appointments:", error);
        });
    }
  }, []);

  const isMobile = useMediaQuery("(max-width:600px)");

  if (showForm) {
    return <SetAppointmentForm goBack={handleClose} />; // Pass the handleClose function
  }

  if (showEditForm) {
    return (
      <EditAppointmentForm
        goBack={handleClose}
        appointmentNum={appointmentNum}
      />
    );
  }

  const modalBody = (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Grid
        item
        xs={11}
        sm={8}
        md={6}
        lg={4}
        component={Box}
        sx={{
          bgcolor: "background.paper",
          borderRadius: "16px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" component="div">
              Appointment
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold", ml: 1 }}
            >
              #{appointmentNum}
            </Typography>
            {!fullScreen && (
              <Chip
                label={status}
                sx={{
                  fontWeight: "bold",
                  backgroundColor:
                    status === "Completed"
                      ? "#8dd290" // Green for Completed
                      : status === "Cancelled"
                      ? "#f5c9c9" // Red for Cancelled
                      : status === "Upcoming"
                      ? "#ffc890" // Yellow for Upcoming
                      : "#EBDAB7", // Default color
                  color:
                    status === "Completed"
                      ? "success.main" // Green for Completed
                      : status === "Cancelled"
                      ? "error.main" // Red for Cancelled
                      : status === "Upcoming"
                      ? "warning.main" // Yellow for Upcoming
                      : "textSecondary", // Default color
                  ml: 1,
                }}
              />
            )}
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseModal}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider style={{ borderStyle: "dashed", borderColor: "#bd8512" }} />

        <ListItem>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary={fName + " " + lName} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <PhoneIcon />
          </ListItemIcon>
          <ListItemText primary={phone} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary={date} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary={note} />
        </ListItem>
      </Grid>
    </Grid>
  );

  return (
    <List
      component="nav"
      sx={{
        px: 0,
        py: 0,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center" // Align items along the cross axis
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            my: 2,
          }}
        >
          <EventNoteIcon
            sx={{ color: "#83948a", mr: 2, verticalAlign: "middle" }}
          />
          Appointments
        </Typography>
        {!isMobile ? (
          <Button
            variant="contained"
            onClick={handleSetAppointmentClick}
            sx={{
              backgroundColor: "#83948a",
            }}
          >
            Set Appointment
          </Button>
        ) : (
          <IconButton
            color="primary"
            onClick={handleSetAppointmentClick}
            sx={{
              color: "#83948a",
            }}
          >
            <AddCircleIcon />
          </IconButton>
        )}
        {isMobile && (
          <UserDrawer onActiveComponentChange={props.onActiveComponentChange} />
        )}
      </Box>

      {appointments.length === 0 ? (
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ textAlign: "center", mt: 2 }}
        >
          You have no appointments
        </Typography>
      ) : (
        appointments
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map((item, index) => (
            <Paper elevation={2} sx={{ my: 1 }}>
              <ListItem
                key={item.appointmentNumber}
                divider={index !== appointments.length - 1}
                onClick={() =>
                  handleOpenModal(
                    item._appointmentNum,
                    item._status,
                    item._phone,
                    item._fName,
                    item._lName,
                    item._date,
                    item._note
                  )
                }
                sx={{ cursor: "pointer" }} // This line adds the pointer
              >
                <ListItemAvatar>
                  <Tooltip title={item._status}>
                    <Avatar
                      sx={{
                        bgcolor: getColor(item._status).lighter,
                        color: getColor(item._status).main,
                      }}
                    >
                      {item._status === "Completed" && <CheckIcon />}
                      {item._status === "Cancelled" && <CloseIcon />}
                      {item._status === "Upcoming" && <AccessTimeIcon />}
                    </Avatar>
                  </Tooltip>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Typography
                      sx={{ fontWeight: "bold" }}
                      variant="subtitle1"
                    >{`Appointment #${item._appointmentNum}`}</Typography>
                  }
                  secondary={
                    <Typography
                      sx={{ color: "#83948a" }}
                      variant="body2"
                    >{`${item._date}`}</Typography>
                  }
                />
                {isMobile && (
                  <ListItemText
                    sx={{ ml: 4 }}
                    primary={
                      <Typography variant="subtitle1">
                        {`${item._time}`}
                      </Typography>
                    }
                  />
                )}
                <ListItemSecondaryAction>
                  <Box display="flex" alignItems="center">
                    {!isMobile && (
                      <Typography
                        variant="subtitle1"
                        noWrap
                        sx={{ marginRight: 2 }}
                      >
                        {`${item._time} `}
                      </Typography>
                    )}
                    <Tooltip
                      title={item._status === "Upcoming" ? "Actions" : ""}
                    >
                      <MoreVertIcon
                        onClick={(event) =>
                          item._status === "Upcoming"
                            ? handleClick(event, item._appointmentNum)
                            : null
                        }
                        sx={{
                          cursor:
                            item._status === "Upcoming" ? "pointer" : "default",
                          color:
                            item._status === "Upcoming"
                              ? "text.secondary"
                              : "text.disabled",
                          pointerEvents:
                            item._status === "Upcoming" ? "auto" : "none",
                        }}
                      />
                    </Tooltip>

                    <Menu
                      sx={{ mt: "45px" }}
                      anchorEl={anchorEl}
                      anchorOrigin={{ vertical: "top", horizontal: "right" }}
                      keepMounted
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
                      open={menuOpen}
                      onClose={handleClose}
                      elevation={2}
                    >
                      <MenuItem onClick={() => handleEditClick(appointmentNum)}>
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={handleOpenDialog}
                        sx={{ color: "error.main" }}
                      >
                        Cancel
                      </MenuItem>
                    </Menu>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ))
      )}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={Math.ceil(appointments.length / itemsPerPage)}
          page={page}
          onChange={handleChange}
          shape="rounded"
        />
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {"Are you sure you want to cancel the appointment?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please confirm if you wish to cancel this appointment.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleCancel(appointmentNum)}
            sx={{ color: "error.main" }}
          >
            Yes
          </Button>
          <Button onClick={handleCloseDialog}>No</Button>
        </DialogActions>
      </Dialog>
      <Modal
        open={showModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {modalBody}
      </Modal>
    </List>
  );
}
