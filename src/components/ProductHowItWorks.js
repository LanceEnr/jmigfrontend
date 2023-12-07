import * as React from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { Button } from "@mui/material";
import Typography from "../components/common/Typography";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { Avatar } from "@mui/material";
import CurvyLines from "../assets/appCurvyLines.webp";

const item = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  px: 5,
};

const number = {
  fontSize: 24,
  fontFamily: "default",
  fontWeight: "bold",
  mb: 3,
};

const image = {
  height: 55,
  my: 4,
};

function ProductHowItWorks() {
  return (
    <Box
      component="section"
      sx={{ display: "flex", bgcolor: "#EAECEA", overflow: "hidden" }}
    >
      <Container
        sx={{
          mt: 10,
          mb: 15,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={CurvyLines} // Use the imported image here
          alt="curvy lines"
          sx={{ pointerEvents: "none", position: "absolute", top: -180 }}
        />
        <Typography
          variant="h4"
          marked="center"
          component="h2"
          sx={{ mb: 14, fontWeight: "bold" }}
        >
          HOW TO ORDER
        </Typography>

        <div>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Avatar
                  style={{
                    backgroundColor: "#EBDAB7",
                    height: "70px",
                    width: "70px",
                    marginBottom: "20px", // Add margin here
                  }}
                >
                  <LocalShippingOutlinedIcon
                    fontSize="large"
                    style={{ color: "#bd8512" }}
                  />
                </Avatar>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ textAlign: "center" }}
                >
                  Supplying the highest quality gravel and sand for all your
                  construction needs. Just a few clicks away from delivery to
                  your site.
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
                    marginBottom: "20px", // Add margin here
                  }}
                >
                  <LocalShippingOutlinedIcon
                    fontSize="large"
                    style={{ color: "#bd8512" }}
                  />
                </Avatar>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ textAlign: "center" }}
                >
                  Supplying the highest quality gravel and sand for all your
                  construction needs. Just a few clicks away from delivery to
                  your site.
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
                    marginBottom: "20px", // Add margin here
                  }}
                >
                  <LocalShippingOutlinedIcon
                    fontSize="large"
                    style={{ color: "#bd8512" }}
                  />
                </Avatar>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ textAlign: "center" }}
                >
                  Supplying the highest quality gravel and sand for all your
                  construction needs. Just a few clicks away from delivery to
                  your site.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </div>
        <Button
          size="large"
          variant="contained"
          component={Link}
          to={"/products"}
          sx={{
            mt: 8,
          }}
        >
          Get started
        </Button>
      </Container>
    </Box>
  );
}

export default ProductHowItWorks;
