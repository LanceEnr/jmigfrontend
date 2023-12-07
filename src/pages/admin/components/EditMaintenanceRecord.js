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
  InputAdornment,
} from "@mui/material";
import Typography from "../../../components/common/Typography";

export default function EditMaintenanceRecord() {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const uid = url.searchParams.get("uid");
  const id = url.searchParams.get("id");
  const navigate = useNavigate();

  const [driver, setDriver] = React.useState("");
  const [plateNo, setPlateNo] = React.useState("");
  const [mileage, setMileage] = React.useState("");
  const [service, setService] = React.useState("");
  const [provider, setProvider] = React.useState("");
  const [cost, setCost] = React.useState(0);

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (event) => {
    setDriver(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-maintenanceHistory2/${uid}/${id}`
        );
        setService(response.data.service);
        setPlateNo(response.data.plateNo);
        setMileage(response.data.nextDue.toString());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [uid, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/update-maintenanceRecords`,
        {
          id: id,
          uid: uid,
          provider: provider,
          cost: cost,
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

  return (
    <div>
      <Box sx={{ my: 14 }}>
        <Typography
          variant="h3"
          marked="left"
          style={{ fontWeight: "bold", fontSize: "30px" }}
          gutterBottom
        >
          Edit Maintenance Record
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
                      name="service"
                      type="text"
                      fullWidth
                      disabled
                      value={service}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      label="Mileage"
                      name="mileage"
                      type="text"
                      disabled
                      value={formatNumberWithCommas(mileage)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Service Provider"
                      name="serviceprovider"
                      type="text"
                      fullWidth
                      onChange={(event) => setProvider(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Total Cost"
                      name="totalcost"
                      type="text"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₱</InputAdornment>
                        ),
                      }}
                      value={formatNumberWithCommas(cost)}
                      onChange={(event) => {
                        let inputValue = event.target.value;

                        inputValue = inputValue
                          .replace(/,/g, "")
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                        setCost(inputValue);
                      }}
                    />
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
