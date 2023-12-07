import React, { useState } from "react";
import { Paper, Box, Tab, Tabs } from "@mui/material";
import Typography from "../../components/common/Typography";
import TripVerification from "./TripVerification";
import TripRecords from "./TripRecords";
function Trips() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <Box sx={{ my: 12 }}>
        <Typography
          variant="h3"
          marked="left"
          style={{ fontWeight: "bold", fontSize: "30px" }}
          gutterBottom
        >
          Trip Verification
        </Typography>
        <Paper sx={{ mt: 3, p: 2, display: "flex", flexDirection: "column" }}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Verification" />
                <Tab label="Records" />
              </Tabs>
            </Box>
            {value === 0 && <TripVerification />}
            {value === 1 && <TripRecords />}
          </Box>
        </Paper>
      </Box>
    </div>
  );
}

export default Trips;
