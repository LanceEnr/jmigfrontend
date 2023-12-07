import React, { useState, useEffect, useCallback } from "react";
import { Paper, Box, Tab, Tabs, Button } from "@mui/material";

import Typography from "../../components/common/Typography";
import { toast } from "react-toastify";
import axios from "axios";

import NewMaintenanceScheduling from "./components/NewMaintenanceScheduling";
import { Link } from "react-router-dom";
import NewMaintenanceRecords from "./components/NewMaintenanceRecords";
import AddIcon from "@mui/icons-material/Add";

function Maintenance() {
  const [value, setValue] = useState(0);
  const [plates, setPlates] = useState([]);

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
    async function fetchMaintenance() {
      try {
        const responseMaintenance = await fetch(
          `${process.env.REACT_APP_API_URL}/fetch-maintenance`
        );
        if (responseMaintenance.ok) {
          const dataMaintenance = await responseMaintenance.json();

          if (dataMaintenance) {
            for (const uidMaintenance in dataMaintenance) {
              if (dataMaintenance.hasOwnProperty(uidMaintenance)) {
                const userDataMaintenance = dataMaintenance[uidMaintenance];

                for (const idMaintenance in userDataMaintenance) {
                  if (userDataMaintenance.hasOwnProperty(idMaintenance)) {
                    const maintenanceData = userDataMaintenance[idMaintenance];

                    const { mileage, frequency, service, status } =
                      maintenanceData;

                    const mileage2 = parseInt(mileage, 10);
                    const frequency2 = parseInt(frequency, 10);
                    const nextduemileage = mileage2 + frequency2;
                    console.log("due: " + (mileage2 + frequency2));
                    fetch(`${process.env.REACT_APP_API_URL}/fetch-trucks`)
                      .then((responseTrucks) => responseTrucks.json())
                      .then((truckData) => {
                        Object.keys(truckData).forEach((truckId) => {
                          const truckItem = truckData[truckId];
                          const currentMileage = parseInt(
                            truckItem.mileage,
                            10
                          );
                          const plateNo = truckItem.plateNo;
                          const uidTruck = truckItem.UID;

                          if (
                            status === "pending" &&
                            currentMileage >= nextduemileage
                          ) {
                            toast.warning(
                              `Maintenance (${service}) due for ${plateNo}. Mileage: ${currentMileage}`
                            );
                            try {
                              const response = axios.post(
                                `${process.env.REACT_APP_API_URL}/maintenance-notif`,
                                {
                                  plateNo,
                                  uidMaintenance,
                                  idMaintenance,
                                  service,
                                  currentMileage,
                                  status,
                                  date: formattedDate,
                                }
                              );

                              console.log(
                                "Maintenance check successfully",
                                response.data
                              );
                            } catch (error) {
                              console.error("Maintenance check failed", error);
                            }
                          }
                        });
                      })
                      .catch((error) => {
                        console.error("Error fetching truck data:", error);
                      });
                  }
                }
              }
            }
          }
        } else {
          console.error("Failed to fetch maintenance");
        }
      } catch (error) {
        console.error("Error fetching maintenance:", error);
      }
    }

    fetchMaintenance();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box sx={{ my: 12 }}>
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
            Maintenance
          </Typography>
          {value === 0 && (
            <Button
              component={Link}
              to={"/adminaddmaintenancescheduling"}
              variant="contained"
              sx={{ ml: 1 }}
              startIcon={<AddIcon />}
            >
              Add Maintenance
            </Button>
          )}
        </Box>
        <Paper sx={{ mt: 3, p: 2, display: "flex", flexDirection: "column" }}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="Maintenance"
              >
                <Tab label="Scheduling" />
                <Tab label="Records" />
              </Tabs>
            </Box>
            {value === 0 && <NewMaintenanceScheduling />}
            {value === 1 && <NewMaintenanceRecords />}
          </Box>
        </Paper>
      </Box>
    </div>
  );
}

export default Maintenance;
