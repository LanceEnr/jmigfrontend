import React from "react";
import CustomizedAccordions, {
  items,
} from "../components/CustomizedAccordions";
import "../styles/Faqs.css";
import { Container, Box } from "@mui/material";
import Banner from "../components/Banner";
import axios from "axios";
import BannerImage from "../assets/faqs1.webp";
import ProductSmokingHero from "../components/ProductSmokingHero";
import { toast } from "react-toastify";

const fetchFAQData = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/get-faq`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// Function to transform the data into the desired format
const transformFAQData = (data) => {
  return data.map((item) => ({
    id: item._faqNum,
    title: item._question,
    content: item._answer,
    image: item._image,
  }));
};

// Fetch and transform the data for outgoing inventory
const rowsFaqs = transformFAQData(await fetchFAQData());

async function fetchBannerDataFAQ() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-category-values/FAQS Page`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching banner:", error);
    throw error;
  }
}

const valuesData = await fetchBannerDataFAQ();
const imagepath = valuesData._image;

function Faqs() {
  window.scrollTo({ top: 0 });
  return (
    <div>
      <Banner bannerImage={imagepath} title="FREQUENTLY ASKED QUESTIONS" />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <CustomizedAccordions items={rowsFaqs} />
      </Container>
      <ProductSmokingHero />
    </div>
  );
}

export default Faqs;
