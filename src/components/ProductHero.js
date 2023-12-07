import React, { useState, useEffect } from "react";
import { Button, useMediaQuery } from "@mui/material";
import Typography from "../components/common/Typography";
import ProductHeroLayout from "./ProductHeroLayout";
import { Link } from "react-router-dom";
import homeBGImage from "../assets/homeBG.webp";
import catalogImage from "../assets/catalog.webp";
import contactImage from "../assets/contact.webp";
import { fetchBannerDataHome } from "../components/cms";

const backgroundImages = [homeBGImage, catalogImage, contactImage];
const valuesData = await fetchBannerDataHome();

export default function ProductHero() {
  const isXsScreen = useMediaQuery("(max-width:600px)"); // Define the screen width for xs screens

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const changeBackgroundWithFade = () => {
    const nextImageIndex = (currentImageIndex + 1) % backgroundImages.length;
    setCurrentImageIndex(nextImageIndex);
  };

  useEffect(() => {
    const interval = setInterval(changeBackgroundWithFade, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [currentImageIndex]);

  return (
    <ProductHeroLayout
      sxBackground={{
        backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
        backgroundColor: "#7fc7d9",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Add this line
        transition: "background-image 2s ease-in-out",
      }}
    >
      <img
        style={{ display: "none" }}
        src={backgroundImages[currentImageIndex]}
        alt="Preload"
      />
      <Typography
        color="inherit"
        align="center"
        variant={isXsScreen ? "h4" : "h2"} // Change to "h3" on xs screens, otherwise use "h2"
        marked="center"
        style={{
          fontWeight: "900",
          marginTop: "100px",
          letterSpacing: "0.05em",
        }}
      >
        {valuesData._heading}
      </Typography>
      <Typography
        color="inherit"
        align="center"
        variant="h6"
        sx={{
          mb: 4,
          mt: { xs: 4, sm: 10 },
        }}
      >
        {valuesData._subheading}
      </Typography>
      <Button
        variant="contained"
        size="large"
        sx={{
          minWidth: 200,

          color: "#fff",
        }}
        component={Link}
        to={"/about"}
      >
        Learn More
      </Button>
      <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
        Discover us
      </Typography>
    </ProductHeroLayout>
  );
}
