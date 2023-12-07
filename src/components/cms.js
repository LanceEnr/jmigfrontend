import React, { useState, useEffect } from "react";
import axios from "axios";

export async function fetchBannerDataHome() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-category-values/Homepage Full Banner`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching banner:", error);
    throw error;
  }
}
export async function fetchBannerDataProduct() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-category-values/Products Page`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching banner:", error);
    throw error;
  }
}
export async function fetchProfilePic(_userName) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-profile-pic/${_userName}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching banner:", error);
    throw error;
  }
}
export async function fetchProfilePic2(_userName) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-profile-pic2/${_userName}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching banner:", error);
    throw error;
  }
}

export async function fetchTestimonialData() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-testimonials`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    throw error;
  }
}
export async function fetchVisionData() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-vision`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching vision:", error);
    throw error;
  }
}

export async function fetchMissionData() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-mission`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching mission:", error);
    throw error;
  }
}

export async function fetchValuesData() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-values`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching values:", error);
    throw error;
  }
}

export async function fetchAboutData() {
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

export async function fetchContactData() {
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
export async function fetchBannerDataFAQ() {
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
  }));
};

// Fetch and transform the data for outgoing inventory
const rowsFaqs = transformFAQData(await fetchFAQData());

// Export the transformed data
export { rowsFaqs };
