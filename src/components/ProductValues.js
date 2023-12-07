import * as React from "react";
import { Avatar } from "@mui/material";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "../components/common/Typography";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import CurvyLines from "../assets/appCurvyLines.webp";
import { fetchValuesData } from "../components/cms";

const item = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  px: 5,
};
const valuesData = await fetchValuesData();

function ProductValues() {
  return (
    <Box
      component="section"
      sx={{ display: "flex", overflow: "hidden", bgcolor: "#EAECEA" }}
    >
      <Container sx={{ mt: 15, mb: 25, display: "flex", position: "relative" }}>
        <Box
          component="img"
          src={CurvyLines}
          alt="curvy lines"
          sx={{ pointerEvents: "none", position: "absolute", top: -180 }}
        />

        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Avatar
                style={{
                  backgroundColor: "#EBDAB7",
                  height: "70px",
                  width: "70px",
                }}
              >
                <LocalShippingOutlinedIcon
                  fontSize="large"
                  style={{ color: "#bd8512" }}
                />
              </Avatar>
              <Typography
                variant="h6"
                sx={{ my: 2, fontWeight: "bold", textAlign: "center" }}
              >
                {valuesData._valueHeading1}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ textAlign: "center" }}
              >
                {valuesData._valueSubheading1}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Avatar
                style={{
                  backgroundColor: "#EBDAB7",
                  height: "70px",
                  width: "70px",
                }}
              >
                <VerifiedOutlinedIcon
                  fontSize="large"
                  style={{ color: "#bd8512" }}
                />
              </Avatar>
              <Typography
                variant="h6"
                sx={{ my: 2, fontWeight: "bold", textAlign: "center" }}
              >
                {valuesData._valueHeading2}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ textAlign: "center" }}
              >
                {valuesData._valueSubheading2}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Avatar
                style={{
                  backgroundColor: "#EBDAB7",
                  height: "70px",
                  width: "70px",
                }}
              >
                <HandymanOutlinedIcon
                  fontSize="large"
                  style={{ color: "#bd8512" }}
                />
              </Avatar>
              <Typography
                variant="h6"
                sx={{ my: 2, fontWeight: "bold", textAlign: "center" }}
              >
                {valuesData._valueHeading3}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ textAlign: "center" }}
              >
                {valuesData._valueSubheading3}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ProductValues;
