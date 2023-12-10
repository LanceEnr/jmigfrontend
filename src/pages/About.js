import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure to import axios

import Banner from "../components/Banner";
import "../styles/About.css";
import Box from "@mui/material/Box";

import Mission from "../components/Mission";
import Vision from "../components/Vision";

function About() {
  window.scrollTo({ top: 0 });
  const [bannerData, setBannerData] = useState({
    imagePath: "",
    filename: "",
    title: "",
  });

  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const bannerResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-category-values/About Page`
        );
        const aboutResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-about`
        );

        const bannerData = {
          imagePath: bannerResponse.data._image,
          filename: bannerResponse.data._image.substring(
            bannerResponse.data._image.lastIndexOf("\\") + 1
          ),
          title: bannerResponse.data._heading,
        };

        setBannerData(bannerData);
        setVision(aboutResponse.data._vision);
        setMission(aboutResponse.data._mission);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <div>
      <Banner bannerImage={bannerData.filename} title={bannerData.title} />
      <Mission />
      <Box sx={{ mt: 3 }}>
        <Vision />
      </Box>
    </div>
  );
}

export default About;
