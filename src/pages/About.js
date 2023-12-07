import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import "../styles/About.css";
import Box from "@mui/material/Box";

import AboutData, { fetchAboutData } from "./cmshelper/cms";
import Mission from "../components/Mission";
import Vision from "../components/Vision";
import { fetchBannerDataAbout } from "./cmshelper/cms";

const valuesData = await fetchBannerDataAbout();
const imagePath = valuesData._image;
const filename = imagePath.substring(imagePath.lastIndexOf("\\") + 1);

function About() {
  window.scrollTo({ top: 0 });

  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");

  useEffect(() => {
    fetchAboutData()
      .then((data) => {
        if (data) {
          setVision(data._vision);
          setMission(data._mission);
        } else {
          console.error("Banner image data not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching banner:", error);
      });
  }, []);
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
