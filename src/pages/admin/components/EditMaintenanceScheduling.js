import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import Typography from "../../../components/common/Typography";
import SearchIcon from "@mui/icons-material/Search";

export default function EditMaintenanceScheduling() {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const uid = url.searchParams.get("uid");
  const id = url.searchParams.get("id");
  const navigate = useNavigate();

  const [plateNo, setPlateNo] = React.useState("");
  const [service, setService] = React.useState("");
  const [frequency, setfrequency] = React.useState("");
  const [startmileage, setStartMileage] = React.useState("");
  const [nextDue, setNextDue] = React.useState(0);
  const [status, setStatus] = React.useState("");
  const [status2, setStatus2] = React.useState("");

  const [driver, setDriver] = React.useState("");

  const amounts = [1000, 3000, 5000, 10000, 20000, 50000, 100000];

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (event) => {
    setDriver(event.target.value);
    setfrequency(event.target.value);
  };

  const [value, setValue] = React.useState("Pandi");

  const handleLocChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-maintenanceReminders2/${uid}/${id}`
        );
        setService(response.data.service);
        setPlateNo(response.data.plateNo);
        setStatus(response.data.status);
        setStatus2(response.data.status);
        setValue(response.data.status);
        setfrequency(response.data.frequency);
        setDriver(response.data.frequency);
        setStartMileage(response.data.mileage);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [uid, id]);

  useEffect(() => {
    const calculateNextDue = () => {
      const frequencyValue = parseInt(frequency, 10) || 0;
      const startMileageValue = parseInt(startmileage, 10) || 0;
      setNextDue(startMileageValue + frequencyValue);
    };

    calculateNextDue();
  }, [frequency, startmileage]);
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/editMaintenance`,
        {
          id: id,
          uid: uid,
          plateNo: plateNo,
          service: service,
          frequency: frequency,
          startmileage: startmileage,
          nextDue: nextDue,
          status: status,
        }
      );

      console.log("Maintenance edited successfully", response.data);
      toast.success("Maintenance added successfully");
      navigate("/adminmaintenance");
    } catch (error) {
      console.error("Maintenance edit failed", error);
      toast.error("Maintenance not yet registered!");
    }
  };
  const isOverdue = status === "overdue";
  return (
    <div>
      <Box sx={{ my: 14 }}>
        <Typography
          variant="h3"
          marked="left"
          style={{ fontWeight: "bold", fontSize: "30px" }}
          gutterBottom
        >
          Edit Maintenance
        </Typography>
        <Paper sx={{ mt: 3, p: 2, display: "flex", flexDirection: "column" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      label="Tractor No."
                      name="tractorNo"
                      type="text"
                      fullWidth
                      disabled
                      value={plateNo}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Service"
                      name="serviceno"
                      value={service}
                      type="text"
                      fullWidth
                      onChange={(event) => setService(event.target.value)}
                      disabled={isOverdue}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel id="driver-label">Frequency</InputLabel>
                      <Select
                        labelId="driver-label"
                        id="driver-select"
                        value={driver}
                        disabled={isOverdue}
                        label="Driver"
                        onChange={handleChange}
                      >
                        {amounts.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {formatNumberWithCommas(option)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Start Mileage"
                      name="startmileage"
                      type="text"
                      disabled={isOverdue}
                      fullWidth
                      value={formatNumberWithCommas(startmileage)}
                      onChange={(event) => {
                        const inputValue = event.target.value;
                        const numericValue =
                          parseFloat(inputValue.replace(/,/g, "")) || 0;
                        setStartMileage(numericValue);
                      }}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Next Due Mileage"
                      name="nextduemileage"
                      type="text"
                      disabled
                      fullWidth
                      value={formatNumberWithCommas(nextDue)}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Status</FormLabel>
                      <RadioGroup
                        aria-label="options"
                        value={value}
                        onChange={(event) => {
                          setStatus(event.target.value);
                          setValue(event.target.value);
                        }}
                        row={true}
                      >
                        {!isOverdue && (
                          <>
                            <FormControlLabel
                              value="Pending"
                              control={<Radio />}
                              label="Pending"
                            />
                          </>
                        )}

                        <FormControlLabel
                          value="Completed"
                          control={<Radio />}
                          label="Completed"
                          disabled={status2 === "overdue"}
                        />
                        <FormControlLabel
                          value="overdue"
                          control={<Radio />}
                          disabled={status2 === "Pending"}
                          label="Overdue"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      component={Link}
                      to={"/adminmaintenance"}
                      sx={{
                        marginRight: 2,
                        color: "#83948a",
                        borderColor: "#83948a",
                      }}
                    >
                      Go Back
                    </Button>
                    <Button variant="contained" type="submit">
                      Save changes
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </div>
  );
}
