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

export default function AddInspection() {
  const [driver, setDriver] = React.useState("");
  const [plates, setPlates] = useState([]);
  const [inspectionDate, setInspectionDate] = useState("");
  const [plateNo, setPlateNo] = useState("");
  const [inspectionType, setinspectionType] = useState("");
  const navigate = useNavigate();

  const getCurrentDate = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

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

  const handleChange = (event) => {
    setDriver(event.target.value);
  };

  const [value, setValue] = React.useState("Pandi");

  const handleLocChange = (event) => {
    setValue(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/addInspection`,
        {
          plateNo: plateNo,
          inspectionType: inspectionType,
          nextInspectionDate: inspectionDate,
          verdict: "Pending",
        }
      );

      toast.success(response.data.message);
      navigate("/admininspection");
    } catch (error) {
      console.error("Inspection add failed", error);
      toast.error("Inspection name already exists!");
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
          Add Inspection Schedule
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
                      label="Inspection Type"
                      name="inspectiontype"
                      type="text"
                      fullWidth
                      required
                      onChange={(event) =>
                        setinspectionType(event.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Inspection Date"
                      name="inspectiondate"
                      type="date"
                      fullWidth
                      required
                      value={inspectionDate}
                      onChange={(event) =>
                        setInspectionDate(event.target.value)
                      }
                      inputProps={{ min: getCurrentDate() }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      component={Link}
                      to={"/admininspection"}
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
