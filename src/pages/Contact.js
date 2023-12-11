import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Container,
} from "@mui/material";

import Banner from "../components/Banner";
import { toast } from "react-toastify";

import ProductCTA from "../components/ProductCTA";
import ContactValues from "../components/ContactValues";

async function fetchContactData() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-contact`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching contact:", error);
    throw error;
  }
}
async function fetchBannerDataContact() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-category-values/Contact Page`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching banner:", error);
    throw error;
  }
}

const valuesData = await fetchBannerDataContact();
const imagePath = valuesData._image;
const filename = imagePath.substring(imagePath.lastIndexOf("\\") + 1);

function Contact() {
  window.scrollTo({ top: 0 });

  const [inquiryData, SetInquiryData] = useState({
    _name: "",
    _email: "",
    _message: "",
  });
  const currentDate = new Date();
  const options = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };
  const formattedDate = currentDate.toLocaleString("en-US", options);
  const navigate = useNavigate();
  const handleChange = (event) => {
    const { name, value } = event.target;
    SetInquiryData({
      ...inquiryData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { _name, _email, _message } = inquiryData;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/inquiry`,
        {
          ...inquiryData,
          _date: formattedDate,
        }
      );
      console.log("Inquiry submitted successfully", response.data);
      toast.success("Inquiry submitted successfully", {
        autoClose: 500,
        onClose: () => {
          navigate("/");
        },
      });
    } catch (error) {
      console.error("Registration failed", error);
      // Handle registration failure (e.g., show an error message).
    }
  };

  const [address, setAddress] = useState("");
  const [phone, setphone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchContactData()
      .then((data) => {
        if (data) {
          setAddress(data._address);
          setphone(data._contactNo);
          setEmail(data._email);
        } else {
          console.error("Contact image data not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching banner:", error);
      });
  }, []);

  return (
    <div>
      <Banner
        bannerImage={filename}
        title={valuesData._heading}
        text="Talk to us!"
      />
      <Box>
        <Container maxWidth="lg" sx={{ pt: 3 }}>
          <Box
            component="iframe"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.336009504322!2d121.0196
6503907859!3d14.693580674853429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b
13a6371ac9d%3A0x8828bdfef721a44c!2sJMIG%20Gravel%20and%20Sand%20Supply!5e0!3m2!1sen!2s
ph!4v1693048413304!5m2!1sen!2sph"
            width={1200}
            height={450}
            sx={{ border: "none", borderRadius: "5px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
          <ProductCTA />
        </Container>
      </Box>

      <ContactValues />
    </div>
  );
}

export default Contact;
