import React, { useState, useEffect } from "react";
import axios from "axios";

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

const fetchStocks = async (productName) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/get-listing-stocks`,
      {
        params: { productName },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return [];
  }
};

const transformListingData = async (data) => {
  const transformedData = await Promise.all(
    data.map(async (item) => {
      const imageFileName =
        item._imgPath && item._imgPath.length > 0
          ? item._imgPath[0].substring(item._imgPath[0] + 1)
          : "defaultImage.jpg";

      try {
        const stocks = await fetchStocks(item._listingName);
        const pandiStocks = stocks.filter(
          (stock) => stock._location.toLowerCase() === "pandi"
        );

        // Filter stocks for Mindanao
        const mindanaoStocks = stocks.filter(
          (stock) => stock._location.toLowerCase() === "mindanao avenue"
        );

        let status;
        let color;
        let bgcolor;

        const isAvailableInPandi =
          pandiStocks.length > 0 &&
          pandiStocks.some((stock) => parseInt(stock._quantity, 10) > 0);
        const isAvailableInMindanao =
          mindanaoStocks.length > 0 &&
          mindanaoStocks.some((stock) => parseInt(stock._quantity, 10) > 0);

        if (isAvailableInPandi && isAvailableInMindanao) {
          status = "Available";
          color = "success.dark";
          bgcolor = "#8dd290";
        } else if (isAvailableInPandi) {
          status = "Pandi";
          color = "success.dark";
          bgcolor = "#8dd290";
        } else if (isAvailableInMindanao) {
          status = "Mindanao Ave.";
          color = "success.dark";
          bgcolor = "#8dd290";
        } else {
          status = "Out of Stock";
          color = "error.dark";
          bgcolor = "#f5c9c9";
        }

        return {
          name: item._listingName,
          image: imageFileName,
          price: item._listingPrice,
          status: status,
          color: color,
          bgcolor: bgcolor,
        };
      } catch (error) {
        console.error("Error fetching stocks:", error);
        return {
          name: item._listingName,
          image: imageFileName,
          price: item._listingPrice,
          status: "Error fetching stocks",
        };
      }
    })
  );

  return transformedData;
};

const MenuList = await transformListingData(await fetchListingData());

export { MenuList };
