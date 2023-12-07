import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Grid,
  Paper,
  Box,
  useMediaQuery,
  List,
  Button,
  TextField,
  TextareaAutosize,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import UserDrawer from "./common/UserDrawer";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { toast } from "react-toastify";
import moment from "moment";

export default function SetAppointmentForm(props) {
  const isMobile = useMediaQuery("(max-width:600px)");

  const userName = localStorage.getItem("userName");
  const [userData, setUserData] = useState({
    First: "",
    Last: "",
    Email: "",
    Phone: "",
    Agenda: "",
    Schedule: null,
    time: null,
    IsAM: true,
  });
  useEffect(() => {
    const storedUsername = localStorage.getItem("userName");
    axios
      .get(`${process.env.REACT_APP_API_URL}/user?userName=${storedUsername}`)
      .then((response) => {
        if (response.data.length > 0) {
          const user = response.data[0];

          setUserData({
            First: user._fName,
            Last: user._lName,
            Email: user._email,
            Phone: user._phone,
          });
        }
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({
      ...userData,
      [name]: value,
    });
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
  const formattedDate = currentDate.toLocaleString("en-US", options);

  const handleSaveAppointment = () => {
    const userName = localStorage.getItem("userName");
    const { Agenda, Schedule, First, Last, Email, Phone, time, IsAM } =
      userData;
    const formattedSchedule = moment(userData.Schedule).format("YYYY-MM-DD");
    const formattedTime = moment(time, "HH:mm").format(
      `h:mm ${IsAM ? "A" : "P"}`
    );
    const formattedTime2 = moment(time, "HH:mm").format("HH:mm");
    const dateTime = `${formattedSchedule}T${formattedTime2}`;
    axios
      .post(`${process.env.REACT_APP_API_URL}/save-appointment`, {
        _userName: userName,
        _note: userData.Agenda,
        _date: formattedSchedule,
        _fName: userData.First,
        _lName: userData.Last,
        _phone: userData.Phone,
        _time: formattedTime,
        _email: userData.Email,
        _dateTime: dateTime,
        _dateNow: formattedDate,
      })
      .then((response) => {
        toast.success("Appointment submitted successfully");
        setUserData({
          First: "",
          Last: "",
          Email: "",
          Phone: "",
          Agenda: "",
          Schedule: null,
          time: null,
          IsAM: true,
        });
        props.goBack();
      })
      .catch((error) => {
        toast.error(error.response.data.error);
        console.error("Error appointment schedule", error);
      });
  };

  const validateTimeSlot = (selectedTime) => {
    const startTimeAM = "08:00";
    const endTimeAM = "11:00";
    const startTimePM = "13:00";
    const endTimePM = "16:00";

    const selectedTimeStr = moment(selectedTime).format("HH:mm");

    if (userData.IsAM) {
      return selectedTimeStr >= startTimeAM && selectedTimeStr <= endTimeAM;
    } else {
      return selectedTimeStr >= startTimePM && selectedTimeStr <= endTimePM;
    }
  };

  return (
    <List
      sx={{
        px: 0,
        py: 0,
        marginBottom: 1,
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
          <EventAvailableIcon sx={{ mr: 2, verticalAlign: "middle" }} />
          Set an Appointment
        </Typography>
        {isMobile && (
          <UserDrawer onActiveComponentChange={props.onActiveComponentChange} />
        )}
      </Box>
      <Paper elevation={2} style={{ padding: "24px" }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                name="Schedule"
                required
                value={userData.Schedule}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                shouldDisableDate={(day) => {
                  const currentDate = moment();
                  return (
                    day.day() === 0 ||
                    day.day() === 6 ||
                    day.isBefore(currentDate, "day")
                  );
                }}
                minDate={moment().add(1, "day")} // Set the minimum date to tomorrow
                onChange={(date) => {
                  setUserData({
                    ...userData,
                    Schedule: date.toDate(),
                  });
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Time"
                value={userData.time}
                minutesStep={60}
                required
                ampm={false}
                minTime={
                  userData.IsAM
                    ? moment("08:00", "HH:mm")
                    : moment("13:00", "HH:mm")
                }
                maxTime={
                  userData.IsAM
                    ? moment("11:00", "HH:mm")
                    : moment("16:00", "HH:mm")
                }
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(date) => {
                  setUserData({
                    ...userData,
                    time: date.format("HH:mm"), // Format the selected time
                  });
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Select Time</FormLabel>
              <RadioGroup
                row={true}
                aria-label="Time"
                name="time"
                value={userData.IsAM ? "AM" : "PM"}
                onChange={(e) => {
                  setUserData({ ...userData, IsAM: e.target.value === "AM" });
                }}
              >
                <FormControlLabel value="AM" control={<Radio />} label="AM" />
                <FormControlLabel value="PM" control={<Radio />} label="PM" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormLabel component="legend">Appointment Type</FormLabel>
            <FormControl fullWidth>
              <Select
                value={userData.Agenda}
                required
                onChange={(e) => {
                  setUserData({ ...userData, Agenda: e.target.value });
                }}
              >
                <MenuItem value="Product Inquiry and Pricing">
                  Product Inquiry and Pricing
                </MenuItem>
                <MenuItem value="Order Placement">Order Placement</MenuItem>
                <MenuItem value="Delivery Scheduling">
                  Delivery Scheduling
                </MenuItem>
                <MenuItem value="Site Visit and Assessment">
                  Site Visit and Assessment
                </MenuItem>
                <MenuItem value="Payment">Payment</MenuItem>
                <MenuItem value="Complaints and Issue Resolution">
                  Complaints and Issue Resolution
                </MenuItem>
                <MenuItem value="Consultation">Consultation</MenuItem>
                <MenuItem value="Inventory Availability">
                  Inventory Availability
                </MenuItem>
                <MenuItem value="Follow Up">Follow Up</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              onClick={props.goBack}
              sx={{
                mt: 2,
                marginRight: 2,
                color: "#83948a",
                borderColor: "#83948a",
              }}
            >
              Go Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                mt: 2,
                width: "100px", // adjust this value as needed
              }}
              onClick={handleSaveAppointment}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </List>
  );
}
