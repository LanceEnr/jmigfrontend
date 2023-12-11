import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Paper, Box, Tab, Tabs, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  rowsInspectionScheduling,
  columnsInspectionRecords,
  rowsInspectionRecords,
} from "./helpers/data";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

import Typography from "../../components/common/Typography";
import NewInspectionScheduling from "./components/NewInspectionScheduling";
import NewInspectionRecords from "./components/NewInspectionRecords";

function Inspection() {
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
    async function fetchUpcomingInspection() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/fetch-upcomingInspections`
        );
        if (response.ok) {
          const data = await response.json();

          if (data) {
            for (const uid in data) {
              if (data.hasOwnProperty(uid)) {
                const inspectionData = data[uid];

                for (const id in inspectionData) {
                  if (inspectionData.hasOwnProperty(id)) {
                    const upcomingInspections = inspectionData[id];

                    const nextInspectionDate = new Date(
                      upcomingInspections.nextInspectionDate
                    );
                    const inspectionType = upcomingInspections.inspectionType;
                    const plateNo = upcomingInspections.plateNo;
                    const verdict = upcomingInspections.verdict;

                    const currentDate = new Date();

                    const oneWeekBefore = new Date(nextInspectionDate);
                    oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);

                    const threeDaysBefore = new Date(nextInspectionDate);
                    threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);

                    if (
                      nextInspectionDate <= currentDate &&
                      verdict === "Pending"
                    ) {
                      toast.warning(
                        `Inspection overdue for ${upcomingInspections.plateNo}. Inspection Date: ${nextInspectionDate}`
                      );
                      try {
                        const response = axios.post(
                          `${process.env.REACT_APP_API_URL}/inspection-notif`,
                          {
                            plateNo,
                            uid,
                            id,
                            inspectionType,
                            verdict: "overdue",
                            date: formattedDate,
                          }
                        );

                        console.log(
                          "Inspection check successfully",
                          response.data
                        );
                      } catch (error) {
                        console.error("Inspection check failed", error);
                      }
                    } else if (
                      nextInspectionDate == currentDate &&
                      verdict === "Pending"
                    ) {
                      toast.warning(
                        `Inspection for ${upcomingInspections.plateNo} is scheduled today. Inspection Date: ${nextInspectionDate}`
                      );
                      try {
                        const response = axios.post(
                          `${process.env.REACT_APP_API_URL}/inspection-notif`,
                          {
                            plateNo,
                            uid,
                            id,
                            inspectionType,
                            verdict: "overdue",
                            date: formattedDate,
                          }
                        );

                        console.log(
                          "Inspection check successfully",
                          response.data
                        );
                      } catch (error) {
                        console.error("Inspection check failed", error);
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          console.error("Failed to fetch upcoming inspections");
        }
      } catch (error) {
        console.error("Error fetching upcoming inspections:", error);
      }
    }

    fetchUpcomingInspection();
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
            Inspection
          </Typography>
          {value === 0 && (
            <Button
              component={Link}
              to={"/adminaddinspection"}
              variant="contained"
              sx={{ ml: 1 }}
              startIcon={<AddIcon />}
            >
              Add Inspection
            </Button>
          )}
        </Box>
        <Paper sx={{ mt: 3, p: 2, display: "flex", flexDirection: "column" }}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="Inspection"
              >
                <Tab label="Scheduling" />
                <Tab label="Records" />
              </Tabs>
            </Box>
            {value === 0 && <NewInspectionScheduling />}
            {value === 1 && <NewInspectionRecords />}
          </Box>
        </Paper>
      </Box>
    </div>
  );
}

export default Inspection;
