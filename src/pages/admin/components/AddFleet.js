import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
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

export default function AddFleet() {
  const [driver, setDriver] = React.useState("");
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();
  const [driverName, setdriverName] = React.useState("");
  const [bodyNo, setbodyNo] = React.useState("");
  const [chassisNo, setchassisNo] = React.useState("");
  const [engineNo, setengineNo] = React.useState("");
  const [plateNo, setPlateNo] = React.useState("");
  const [mileage, setmileage] = React.useState(0);
  const [model, setmodel] = React.useState("");
  const [plateNo2, setPlateNo2] = React.useState("");
  const status = "available";
  const [location, setLocation] = React.useState("");

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

  const dummyDriverNames = [
    "Driver A",
    "Driver B",
    "Driver C",
    "Driver D",
    "Driver E",
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/addTruck`,
        {
          //id: actionId,
          driverName: driverName,
          bodyNo: bodyNo,
          chassisNo: chassisNo,
          engineNo: engineNo,
          plateNo: plateNo,
          plateNo2: plateNo2,
          mileage: mileage,
          model: model,
          status: status,
          location: location,
        }
      );

      console.log("Truck added successfully", response.data);
      toast.success("Truck added successfully");
      navigate("/adminfleetinformation");
    } catch (error) {
      console.error("Truck add failed", error);
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
          Add Truck
        </Typography>
        <Paper sx={{ mt: 3, p: 2, display: "flex", flexDirection: "column" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      label="Body No."
                      name="bodyNo"
                      type="text"
                      fullWidth
                      onChange={(event) => setbodyNo(event.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Tractor No."
                      name="plateNo"
                      type="text"
                      fullWidth
                      onChange={(event) => setPlateNo(event.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Trailer No."
                      name="plateNo2"
                      type="text"
                      fullWidth
                      onChange={(event) => setPlateNo2(event.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Chassis No."
                      name="chassisNo"
                      type="text"
                      fullWidth
                      onChange={(event) => setchassisNo(event.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Engine No."
                      name="engineNo"
                      type="text"
                      fullWidth
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
                      onChange={(event) => setmileage(event.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Autocomplete
                      options={drivers}
                      filterOptions={(options, state) => {
                        if (state.inputValue === "") {
                          return options.slice(0, 3);
                        }

                        return options.filter((option) =>
                          option
                            .toLowerCase()
                            .includes(state.inputValue.toLowerCase())
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Driver Name" // Change the label to "Driver Name"
                          name="drivername"
                          type="text"
                          fullWidth
                          required
                          placeholder="Search drivers..."
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      onChange={(event, value) => {
                        if (value) {
                          setdriverName(value);
                        } else {
                          // Handle the case when the user clears the selection
                          setdriverName("");
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Location</FormLabel>
                      <RadioGroup
                        aria-label="options"
                        row={true}
                        onChange={(event) => setLocation(event.target.value)}
                        required
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
