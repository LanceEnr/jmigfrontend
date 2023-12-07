import React from "react";
import Typography from "../../../components/common/Typography";
import { Link } from "react-router-dom";
import { Paper, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { Box, Grid } from "@mui/material";
import MyResponsivePie from "./MyResponsivePie";

function DriversReport() {
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
                Driver Performance Report
              </Typography>
              <Box display="flex">
                <Button
                  variant="outlined"
                  sx={{ ml: 1 }}
                  color="primary"
                  component={Link}
                  to={"/admindrivermanagement"}
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
              <MyResponsivePie />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default DriversReport;
