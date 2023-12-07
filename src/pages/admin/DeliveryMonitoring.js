import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Link } from "react-router-dom";
import Typography from "../../components/common/Typography";
import { DataGrid, GridToolbar, gridClasses } from "@mui/x-data-grid";
import AdjustIcon from "@mui/icons-material/Adjust";

import axios from "axios";
import { Grid, Paper, Box, Button, Tab, Tabs } from "@mui/material";

import TripOngoing from "./TripOngoing";
import truckIcon from "../../assets/truck.png";
import { alpha, styled } from "@mui/material/styles";
import AssessmentIcon from "@mui/icons-material/Assessment";

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: "#EAECEA",
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

const mapStyles = {
  height: "75vh",
  width: "100%",
};

const columns = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },
  {
    field: "driver",
    headerName: "DRIVER NAME",
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },
  {
    field: "date",
    headerName: "DATE AND TIME",
    flex: 3,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },
  {
    field: "avgSpeed",
    headerName: "AVG. SPEED",
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },
  {
    field: "maxSpeed",
    headerName: "MAX SPEED",
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },
  {
    field: "harshBraking",
    headerName: "HARSH BRAKING",
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },
  {
    field: "sua",
    headerName: "SUDDEN ACCELERATION",
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },
  {
    field: "eSignature",
    headerName: "E-SIGNATURE",
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
    renderCell: (params) => (
      <img
        src={params.row.signature}
        alt="E-Signature"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          margin: "auto",
          display: "block",
        }}
      />
    ),
  },
];

function DeliveryMonitoring() {
  const [truckLocations, setTruckLocations] = useState({});
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [foundLocation, setFoundLocation] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [lockZoom, setLockZoom] = useState(false);
  const [hoveredTruck, setHoveredTruck] = useState(null);
  const [rows, setRows] = useState([]);

  const transformTripOngoing = (data, data2, data3) => {
    const transformedData = [];

    if (data && data2 && data3) {
      for (const uid in data) {
        const userData = data[uid];
        const userData2 = data2[uid];
        const userData3 = data3[uid];

        for (const id in userData) {
          if (userData.hasOwnProperty(id)) {
            const mappedData = {
              id: id,
              driver: userData[id].driverName,
              date: userData3[id].date,
              signature: userData3[id].esignature,
              avgSpeed: userData2[id].average_speed || 0,
              maxSpeed: userData2[id].max_speed,
              harshBraking: userData2[id].harsh_braking_count,
              sua: userData2[id].sudden_acceleration_count,
            };

            transformedData.push(mappedData);
          }
        }
      }
    }

    return transformedData;
  };

  const fetchTripHistory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-tripHistory`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
  const fetchSpeedRecord = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-SpeedRecord`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
  const fetchProofRecords = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-ProofRecords`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const tripData = await fetchTripHistory();
      const speedData = await fetchSpeedRecord();
      const proofData = await fetchProofRecords();

      const updatedData = transformTripOngoing(tripData, speedData, proofData);

      setRows(updatedData);
    };

    fetchData();
  }, []);

  const handleLoad = () => {
    setIsMapLoaded(true);
  };

  const fetchTruckLocations = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-location`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching truck locations:", error);
      return {};
    }
  };

  const handleCenterMap = () => {
    setFoundLocation(null);
    handleZoomChange(5);
    setLockZoom(false);
  };

  const handleZoomChange = (newZoomLevel) => {
    if (!lockZoom) {
      setZoomLevel(newZoomLevel);
    }
  };
  function handleFindClick(id) {
    const location = truckLocations[id];
    if (location) {
      setFoundLocation(location);
      handleZoomChange(15);
      setLockZoom(true);
    }
  }

  useEffect(() => {
    fetchTruckLocations().then((data) => {
      setTruckLocations(data);
    });

    const intervalId = setInterval(() => {
      fetchTruckLocations().then((data) => {
        setTruckLocations(data);
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box sx={{ my: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginBottom={2}
            >
              <Typography
                variant="h3"
                marked="left"
                style={{ fontWeight: "bold", fontSize: "30px" }}
                gutterBottom
              >
                Delivery Monitoring
              </Typography>
              <Box display="flex">
                <Button
                  variant="contained"
                  sx={{ ml: 1 }}
                  color="secondary"
                  startIcon={<AssessmentIcon />}
                  component={Link}
                  to={"/admintripmetricsreport"}
                >
                  Generate Report
                </Button>
                <Button
                  variant="contained"
                  sx={{ ml: 1 }}
                  startIcon={<AdjustIcon />}
                  onClick={handleCenterMap}
                >
                  Center Map
                </Button>
              </Box>
            </Box>

            <Paper
              sx={{
                mt: 3,
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <LoadScript
                googleMapsApiKey="AIzaSyAJf20RDl1D_m5wh6KGdhKPOALFM-pbMFI"
                onLoad={handleLoad}
              >
                {isMapLoaded && (
                  <GoogleMap
                    mapContainerStyle={mapStyles}
                    center={
                      foundLocation
                        ? {
                            lat: foundLocation.latitude,
                            lng: foundLocation.longitude,
                          }
                        : {
                            lat: 14.6936,
                            lng: 121.0197,
                          }
                    }
                    zoom={zoomLevel}
                    options={{
                      gestureHandling: "greedy",
                    }}
                  >
                    {Object.keys(truckLocations).map((uid) => (
                      <Marker
                        key={uid}
                        position={{
                          lat: truckLocations[uid].latitude,
                          lng: truckLocations[uid].longitude,
                        }}
                        icon={{
                          url: truckIcon, // Use your custom icon URL here
                          scaledSize: new window.google.maps.Size(40, 40), // Set the desired size
                        }}
                      />
                    ))}
                  </GoogleMap>
                )}
              </LoadScript>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                  >
                    <Tab label="Trip Metrics" />
                    <Tab label="Records" />
                  </Tabs>
                </Box>
                {value === 0 && <TripOngoing onFindClick={handleFindClick} />}
                {value === 1 && (
                  <StripedDataGrid
                    sx={{
                      border: 1,
                      borderColor: "primary.light",
                      "& .MuiDataGrid-cell:hover": {
                        fontWeight: "bold",
                      },
                    }}
                    rows={rows}
                    columns={columns}
                    checkboxSelection
                    disableColumnFilter
                    disableColumnSelector
                    density="comfortable"
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                      toolbar: {
                        showQuickFilter: true,
                        printOptions: { disableToolbarButton: true },
                      },
                    }}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 5,
                        },
                      },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    getRowClassName={(params) =>
                      params.indexRelativeToCurrentPage % 2 === 0
                        ? "even"
                        : "odd"
                    }
                  />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default DeliveryMonitoring;
