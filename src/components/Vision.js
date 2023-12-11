import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "../components/common/Typography";
import ImageDots from "../assets/productCTAImageDots.webp";
import { fetchVisionData } from "../components/cms";

import VisionImage from "../assets/vision.webp";

const valuesData = await fetchVisionData();
const imagePath = valuesData.image;

function Vision() {
  return (
    <Container component="section" sx={{ pt: 13, pb: 10, display: "flex" }}>
      <Grid container>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: { md: "block", xs: "none" }, position: "relative" }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -67,
              left: 67,
              right: 0,
              bottom: 0,
              width: "100%",
              background: `url(${ImageDots})`, // Use the imported image
            }}
          />
          <Box
            component="img"
            src={imagePath}
            alt="call to action"
            sx={{
              position: "absolute",
              top: -28,
              left: 28,
              right: 0,
              bottom: 0,
              width: "100%",
              maxWidth: 600,
              borderRadius: 4, // Adjust the value to control the roundness
              transition: "transform .5s", // Animation
              "&:hover": {
                transform: "scale(1.015)", // (110% zoom - Note: if the zoom is too large, it will go outside of the viewport)
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              bgcolor: "#EBDAB7",
              py: 8,
              px: 3,
              borderRadius: 4, // Adjust the value to control the roundness
            }}
          >
            <Box
              sx={{
                maxWidth: 400,
              }}
            >
              <Typography
                variant="h3"
                component="h2"
                marked="left"
                style={{ fontWeight: "bold" }}
                gutterBottom
              >
                VISION
              </Typography>
              <Typography variant="subtitle1">{valuesData._vision}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Vision;
