import React, { useEffect, useState } from "react";
import Typography from "../../../components/common/Typography";
import { Link } from "react-router-dom";

import axios from "axios";
import { Paper, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

import { Box, Grid } from "@mui/material";
import MyResponsiveBar from "./ResponsiveBar";

function TripMetricsReport() {
  const [dynamicData, setDynamicData] = useState([]);
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

  const fetchDriverName = async (uid) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-DriverName/${uid}`
      );
      return response.data.driverName;
    } catch (error) {
      console.error(`Error fetching driver name for UID ${uid}:`, error);
      return null;
    }
  };

  const calculateAverages = async (data) => {
    const averages = {};

    for (const uid in data) {
      if (data.hasOwnProperty(uid)) {
        const idData = data[uid];

        for (const id in idData) {
          if (idData.hasOwnProperty(id)) {
            const record = idData[id];

            if (!averages[uid]) {
              averages[uid] = {
                totalSpeed: 0,
                totalHarshBraking: 0,
                totalSuddenAcceleration: 0,
                count: 0,
              };
            }

            averages[uid].totalSpeed += record.average_speed;
            averages[uid].totalHarshBraking += record.harsh_braking_count;
            averages[uid].totalSuddenAcceleration +=
              record.sudden_acceleration_count;
            averages[uid].count += 1;
          }
        }

        const driverName = await fetchDriverName(uid);

        if (driverName) {
          averages[uid].driverName = driverName;
        }
      }
    }

    for (const uid in averages) {
      const uidData = averages[uid];

      const averageSpeed = uidData.totalSpeed / uidData.count;
      const averageHarshBraking = uidData.totalHarshBraking / uidData.count;
      const averageSuddenAcceleration =
        uidData.totalSuddenAcceleration / uidData.count;

      averages[uid] = {
        averageSpeed,
        averageHarshBraking,
        averageSuddenAcceleration,
        driverName: uidData.driverName,
      };
    }

    return averages;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSpeedRecord();
        const averages = await calculateAverages(data);

        const newData = Object.entries(averages).map(([uid, values]) => ({
          Driver: values.driverName,
          MaxSpeedAvg: values.averageSpeed,
          OverspeedingColor: calculateColor(values.averageSpeed),
          "Harsh Braking": values.averageHarshBraking,
          "Harsh BrakingColor": calculateColor(values.averageHarshBraking),
          "Sudden Acceleration": values.averageSuddenAcceleration,
          "Sudden AccelerationColor": calculateColor(
            values.averageSuddenAcceleration
          ),
        }));

        setDynamicData(newData);
        console.log("Dynamic Data:", newData);
      } catch (error) {
        console.error("Error fetching and calculating averages:", error);
      }
    };

    fetchData();
  }, [calculateAverages]);

  // Add the calculateColor function here
  const calculateColor = (value) => {
    // Your logic for color calculation based on the value
    // For example, you can use a simple logic like:
    const hue = (value * 2) % 360;
    return `hsl(${hue}, 70%, 50%)`;
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
                Trip Metrics Report
              </Typography>
              <Box display="flex">
                <Button
                  variant="outlined"
                  sx={{ ml: 1 }}
                  color="primary"
                  component={Link}
                  to={"/admindeliverymonitoring"}
                >
                  Go Back
                </Button>
                <Button
                  variant="contained"
                  sx={{ ml: 1 }}
                  startIcon={<PrintIcon />}
                >
                  Print
                </Button>
              </Box>
            </Box>
            <Paper
              sx={{
                mt: 3,
                px: 2,
                pt: 2,
                pb: 6,
                display: "flex",
                flexDirection: "column",

                height: "74vh",
              }}
            >
              <MyResponsiveBar data={dynamicData} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default TripMetricsReport;
