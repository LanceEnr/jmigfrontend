import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Container from "@mui/material/Container";
import Typography from "../components/common/Typography";

import axios from "axios";

const ImageBackdrop = styled("div")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  background: "#000",
  opacity: 0.5,
  transition: theme.transitions.create("opacity"),
}));

const ImageIconButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  display: "block",
  padding: 0,
  borderRadius: theme.spacing(1), // Apply borderRadius to create rounded corners
  height: "40vh",
  [theme.breakpoints.down("md")]: {
    width: "100% !important",
    height: 100,
  },
  "&:hover": {
    zIndex: 1,
  },
  "&:hover .imageBackdrop": {
    opacity: 0.15,
  },
  "&:hover .imageMarked": {
    opacity: 0,
  },
  "&:hover .imageTitle": {
    border: "4px solid currentColor",
    borderRadius: theme.spacing(1), // Apply borderRadius for the imageTitle as well
  },
  "& .imageTitle": {
    position: "relative",
    padding: `${theme.spacing(2)} ${theme.spacing(4)} 14px`,
    borderRadius: theme.spacing(1), // Apply borderRadius to create rounded corners
  },
  "& .imageMarked": {
    height: 3,
    width: 18,
    background: theme.palette.common.white,
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
    transition: theme.transitions.create("opacity"),
  },
}));

const fetchListingData = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/get-listing`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const transformListingData2 = (data) => {
  return data.slice(0, 3).map((item, index) => {
    const imageFileName =
      item._imgPath && item._imgPath.length > 0
        ? item._imgPath[0].substring()
        : "";

    return {
      url: imageFileName,
      title: item._listingName || `Default Title ${index + 1}`,
      width: index === 1 ? "20%" : "40%",
    };
  });
};

const images = transformListingData2(await fetchListingData());

export default function ProductCategories() {
  return (
    <Container
      component="section"
      sx={{
        pt: 8,
        pb: 4,
      }}
    >
      <Typography
        variant="h4"
        marked="center"
        align="center"
        component="h2"
        style={{ fontWeight: "bold" }}
      >
        SOME OF OUR OFFERINGS
      </Typography>
      <Box sx={{ mt: 8, display: "flex", flexWrap: "wrap" }}>
        {images.map((image) => (
          <ImageIconButton
            key={image.title}
            style={{
              width: image.width,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundSize: "cover",
                backgroundPosition: "center 40%",
                backgroundImage: `url(${image.url})`,
              }}
            />
            <ImageBackdrop className="imageBackdrop" />
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "common.white",
              }}
            >
              <Typography
                component="h3"
                variant="h6"
                color="inherit"
                className="imageTitle"
              >
                {image.title}
                <div className="imageMarked" />
              </Typography>
            </Box>
          </ImageIconButton>
        ))}
      </Box>
    </Container>
  );
}
