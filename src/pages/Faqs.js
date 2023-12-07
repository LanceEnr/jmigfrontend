import React from "react";
import CustomizedAccordions, {
  items,
} from "../components/CustomizedAccordions";
import "../styles/Faqs.css";
import { Container, Box } from "@mui/material";
import Banner from "../components/Banner";
import { rowsFaqs, fetchBannerDataFAQ } from "./cmshelper/cms";

import BannerImage from "../assets/faqs1.webp";
import ProductSmokingHero from "../components/ProductSmokingHero";
import { toast } from "react-toastify";

const valuesData = await fetchBannerDataFAQ();
const imagePath = valuesData._image;
const filename = imagePath.substring(imagePath.lastIndexOf("\\") + 1);

function Faqs() {
  window.scrollTo({ top: 0 });
  return (
    <div>
      <Banner bannerImage={filename} title="FREQUENTLY ASK QUESTIONS" />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <CustomizedAccordions items={rowsFaqs} />
      </Container>
      <ProductSmokingHero />
    </div>
  );
}

export default Faqs;
