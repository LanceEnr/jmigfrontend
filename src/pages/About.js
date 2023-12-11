import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import "../styles/About.css";
import Box from "@mui/material/Box";
import axios from "axios";
import Mission from "../components/Mission";
import Vision from "../components/Vision";

async function fetchAboutData() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-about`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching about:", error);
    throw error;
  }
}
async function fetchBannerDataAbout() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-category-values/About Page`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching banner:", error);
    throw error;
  }
}

const valuesData = await fetchBannerDataAbout();
const imagePath = valuesData._image;
const filename = imagePath.substring(imagePath.lastIndexOf("\\") + 1);

function About() {
  window.scrollTo({ top: 0 });

  return (
    <div>
      <Banner bannerImage={filename} title={valuesData._heading} />
      <Mission />
      <Box sx={{ mt: 3 }}>
        <Vision />
      </Box>
    </div>
  );
}

export default About;
