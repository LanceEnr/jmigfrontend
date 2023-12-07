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

export default function AddMaintenanceScheduling() {
  const [driver, setDriver] = React.useState("");
  const [plates, setPlates] = useState([]);
  const amounts = [1000, 3000, 5000, 10000, 20000, 50000, 100000];

  const [plateNo, setPlateNo] = React.useState("");
  const [service, setService] = React.useState("");
  const [frequency, setfrequency] = React.useState("");
  const [startmileage, setStartMileage] = React.useState("");
  const [nextDue, setNextDue] = React.useState(0);
  const [status, setStatus] = React.useState("Pending");
  const [isTractorNoUndefined, setIsTractorNoUndefined] = React.useState(true);

  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const id = url.searchParams.get("id");
  const navigate = useNavigate();

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
    const calculateNextDue = () => {
      const frequencyValue = parseInt(frequency, 10) || 0;
      const startMileageValue = parseInt(startmileage, 10) || 0;
      setNextDue(startMileageValue + frequencyValue);
    };

    calculateNextDue();
  }, [frequency, startmileage]);

  useEffect(() => {
    async function fetchPlates() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/fetch-trucks`
        );
        if (response.ok) {
          const data = await response.json();
          const plates = Object.keys(data).map((key) => data[key].plateNo);
          setPlates(plates);
        } else {
          console.error("Failed to fetch plates");
        }
      } catch (error) {
        console.error("Error fetching plates:", error);
      }
    }

    fetchPlates();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/addMaintenance`,
        {
          plateNo: plateNo,
          service: service,
          frequency: frequency,
          nextDueMileage: nextDue,
          status: status,
          mileage: startmileage,
        }
      );

      toast.success(response.data.message);
      navigate("/adminmaintenance");
    } catch (error) {
      console.error("Maintenance add failed", error);

      toast.error("Failed to save the record");
    }
  };
  const handleTractorNoChange = (event, value) => {
    const plate = value;
    if (value) {
      setIsTractorNoUndefined(false);

      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/fetch-mileage-plate/${plate}`
          );

          setStartMileage(response.data.mileage);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    } else {
      setIsTractorNoUndefined(true);
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
          Add Maintenance
        </Typography>
        <Paper
          sx={{
            mt: 3,
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={6}>
                    <Autocomplete
                      options={plates}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tractor No."
                          name="tractorno"
                          type="text"
                          fullWidth
                          required
                          placeholder="Search tractor numbers..."
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
                        handleTractorNoChange(event, value);
                        if (value) {
                          setPlateNo(value);
                        } else {
                          // Handle the case when the user clears the selection
                          setPlateNo("");
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      label="Service"
                      name="serviceno"
                      type="text"
                      fullWidth
                      onChange={(event) => setService(event.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel id="driver-label">Frequency</InputLabel>
                      <Select
                        labelId="driver-label"
                        id="driver-select"
                        value={driver}
                        label="Driver"
                        required
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
                      disabled={isTractorNoUndefined}
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
                        row={true}
                        onChange={(event) => setStatus(event.target.value)}
                        required
                      >
                        <FormControlLabel
                          value="Pending"
                          control={<Radio />}
                          label="Pending"
                        />
                        <FormControlLabel
                          value="Completed"
                          control={<Radio />}
                          label="Completed"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
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
