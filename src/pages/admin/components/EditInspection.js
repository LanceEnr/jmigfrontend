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

export default function EditInspection() {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const uid = url.searchParams.get("uid");
  const id = url.searchParams.get("id");
  const navigate = useNavigate();
  const [driver, setDriver] = React.useState("");
  const [plates, setPlates] = useState([]);
  const [inspectionDate, setInspectionDate] = useState("");
  const [plateNo, setPlateNo] = useState("");
  const [inspectionType, setinspectionType] = useState("");
  const [verdict, setverdict] = useState("");
  const [verdict2, setverdict2] = useState("");

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-inspections2/${uid}/${id}`
        );
        const originalDate = response.data.nextInspectionDate;
        const convertedDate = new Date(originalDate)
          .toISOString()
          .split("T")[0];

        setPlateNo(response.data.plateNo);
        setinspectionType(response.data.inspectionType);
        setInspectionDate(convertedDate);
        setverdict(response.data.verdict);
        setverdict2(response.data.verdict);
        setValue(response.data.verdict);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [uid, id]);

  const handleChange = (event) => {
    setDriver(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/editInspection`,
        {
          plateNo: plateNo,
          inspectionType: inspectionType,
          nextInspectionDate: inspectionDate,
          verdict: verdict,
          uid: uid,
          id: id,
        }
      );

      toast.success(response.data.message);

      navigate("/admininspection");
    } catch (error) {
      console.error("Inspection add failed", error);

      toast.error("Inspection name already exists!");
    }
  };

  const [value, setValue] = React.useState("Pandi");

  const handleLocChange = (event) => {
    setValue(event.target.value);
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
          Edit Inspection Schedule
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
                    <TextField
                      label="Tractor No."
                      name="tractorNo"
                      value={plateNo}
                      disabled
                      type="text"
                      fullWidth
                      onChange={(event) => setPlateNo(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Inspection Type"
                      name="inspectionType"
                      value={inspectionType}
                      type="text"
                      fullWidth
                      onChange={(event) =>
                        setinspectionType(event.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      label="Inspection Date"
                      name="inspectiondate"
                      type="date"
                      fullWidth
                      value={inspectionDate}
                      onChange={(event) =>
                        setInspectionDate(event.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Verdict</FormLabel>
                      <RadioGroup
                        aria-label="options"
                        value={verdict}
                        onChange={(event) => {
                          setverdict(event.target.value);
                          setValue(event.target.value);
                        }}
                        row={true}
                      >
                        <FormControlLabel
                          value="Failed"
                          control={<Radio />}
                          label="Failed"
                        />
                        <FormControlLabel
                          value="Passed"
                          control={<Radio />}
                          label="Passed"
                        />
                        {verdict2 === "overdue" && (
                          <FormControlLabel
                            value="overdue"
                            control={<Radio />}
                            label="Overdue"
                          />
                        )}
                      </RadioGroup>
                    </FormControl>
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
