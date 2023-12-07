import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
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
} from "@mui/material";
import Typography from "../../../components/common/Typography";

export default function EditFleet() {
  const [driver, setDriver] = React.useState("");
  const [drivers, setDrivers] = useState([]);
  const [driverName, setdriverName] = React.useState("");
  const [bodyNo, setbodyNo] = React.useState("");
  const [chassisNo, setchassisNo] = React.useState("");
  const [engineNo, setengineNo] = React.useState("");
  const [plateNo, setPlateNo] = React.useState("");
  const [mileage, setmileage] = React.useState("");
  const [model, setmodel] = React.useState("");
  const [plateNo2, setPlateNo2] = React.useState("");
  const status = "available";
  const [location, setLocation] = React.useState("");
  const [value, setValue] = React.useState("Pandi");

  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const id = url.searchParams.get("id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-trucks2/${id}`
        );

        setbodyNo(response.data.bodyNo);
        setPlateNo(response.data.plateNo);
        setPlateNo2(response.data.plateNo2);
        setchassisNo(response.data.chassisNo);
        setengineNo(response.data.engineNo);
        setmileage(response.data.mileage);
        setmodel(response.data.model);
        setValue(response.data.location);
        setdriverName(response.data.driverName);
        setLocation(response.data.location);
        setDriver(response.data.driverName);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    async function fetchDrivers() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/fetch-driver-available`
        );
        if (response.ok) {
          const data = await response.json();
          const driverNames = Object.keys(data).map(
            (key) => data[key].driverName
          );
          setDrivers(driverNames);
        } else {
          console.error("Failed to fetch drivers");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchDrivers();
  }, []);
  const handleChange = (event) => {
    setDriver(event.target.value);
    setdriverName(event.targe.value);
  };

  const handleLocChange = (event) => {
    setValue(event.target.value);
    setLocation(event.target.value);
    toast.error(location);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/editTruck`,
        {
          driverName: driverName,
          current: driver,
          bodyNo: bodyNo,
          chassisNo: chassisNo,
          engineNo: engineNo,
          plateNo: plateNo,
          plateNo2: plateNo2,
          mileage: mileage,
          model: model,
          status: status,
          location: location,
          id: id,
        }
      );

      console.log("Truck edited successfully", response.data);
      toast.success("Truck edited successfully");
      navigate("/adminfleetinformation");
    } catch (error) {
      console.error("Truck edit failed", error);
      toast.error("Truck not yet registered!");
    }
  };

  return (
    <div>
      <Box sx={{ my: 14 }}>
        <Typography
          variant="h3"
          marked="left"
          style={{ fontWeight: "bold", fontSize: "30px" }}
          gutterBottom
        >
          Edit Truck
        </Typography>
        <Paper sx={{ mt: 3, p: 2, display: "flex", flexDirection: "column" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      label="Body No."
                      name="bodyno"
                      type="text"
                      value={bodyNo}
                      fullWidth
                      onChange={(event) => setbodyNo(event.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Tractor No."
                      name="tractorno"
                      type="text"
                      fullWidth
                      value={plateNo}
                      onChange={(event) => setPlateNo(event.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Trailer No."
                      name="trailerno"
                      type="text"
                      fullWidth
                      value={plateNo2}
                      onChange={(event) => setPlateNo2(event.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Chassis No."
                      name="chassisno"
                      type="text"
                      fullWidth
                      value={chassisNo}
                      onChange={(event) => setchassisNo(event.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Engine No."
                      name="engineno"
                      type="text"
                      fullWidth
                      value={engineNo}
                      onChange={(event) => setengineNo(event.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Model"
                      name="model"
                      type="text"
                      fullWidth
                      value={model}
                      onChange={(event) => setmodel(event.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Mileage"
                      name="mileage"
                      type="number"
                      fullWidth
                      value={mileage}
                      onChange={(event) => setmileage(event.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel id="driver-label">Driver</InputLabel>
                      <Select
                        labelId="driver-label"
                        id="driver-select"
                        value={driverName}
                        label="Driver"
                        onChange={(event) => setdriverName(event.target.value)}
                        required
                      >
                        <MenuItem value={driver}>{driver}</MenuItem>
                        {drivers.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    Current Driver: {driver}
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Location</FormLabel>
                      <RadioGroup
                        aria-label="options"
                        value={value}
                        onChange={(event) => {
                          setLocation(event.target.value);
                          setValue(event.target.value);
                        }}
                        row={true}
                      >
                        <FormControlLabel
                          value="Pandi"
                          control={<Radio />}
                          label="Pandi"
                        />
                        <FormControlLabel
                          value="Mindanao Avenue"
                          control={<Radio />}
                          label="Mindanao Avenue"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      component={Link}
                      to={"/adminfleetinformation"}
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
