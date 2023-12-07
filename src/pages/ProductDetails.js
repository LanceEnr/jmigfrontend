import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Typography, styled } from "@mui/material";
import { withStyles } from "@mui/styles";
import { Container } from "react-bootstrap";
import { Paper } from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Sand1 from "../assets/Sand1.webp";
import Sand2 from "../assets/Sand2.webp";
import Sand3 from "../assets/Sand3.webp";
import "../styles/UserDashboard.css";
import { MenuList } from "../helpers/MenuList";
import MoreProducts from "../components/MoreProducts";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const ColoredLinearProgress = ({ value, color, bgcolor }) => {
  const normalizedValue = Math.min(1000, Math.max(0, (value / 1000) * 100));

  return (
    <LinearProgress
      variant="determinate"
      value={normalizedValue}
      sx={{
        width: "75%",
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: bgcolor,
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,
          backgroundColor: color,
        },
      }}
    />
  );
};

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1,
  },
};

const ProductDetails = () => {
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const carouselRef = useRef(null);

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
    carouselRef.current.goToSlide(index);
  };

  const handleBeforeChange = (nextSlide) => {
    setSelectedImageIndex(nextSlide);
  };

  const [productDetails, setProductDetails] = useState(null);
  const [pandiStocks, setPandiStocks] = useState([]);
  const [mindanaoStocks, setMindanaoStocks] = useState([]);
  const [pic, setPic] = useState([]);

  useEffect(() => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);

    const productName = url.searchParams.get("productName");

    async function fetchProductDetails() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/get-listing-details`,
          {
            params: { productName }, // Use the 'params' property to pass parameters
          }
        );

        const productDetailsData = response.data;
        setPic(productDetailsData._imgPath || []);

        if (productDetailsData) {
          setProductDetails(productDetailsData);
        } else {
          console.error("Product details not found");
        }
        window.scrollTo({ top: 0 });
      } catch (error) {
        console.error("Error fetching values:", error);
      }
    }
    async function fetchStocks() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/get-listing-stocks`,
          {
            params: { productName },
          }
        );

        const stocks = response.data;

        if (stocks) {
          // Filter stocks for Pandi
          const pandiStocks = stocks.filter(
            (stock) => stock._location.toLowerCase() === "pandi"
          );
          setPandiStocks(pandiStocks);

          // Filter stocks for Mindanao
          const mindanaoStocks = stocks.filter(
            (stock) => stock._location.toLowerCase() === "mindanao ave."
          );
          setMindanaoStocks(mindanaoStocks);
        } else {
          console.error("Stocks not found");
        }
      } catch (error) {
        console.error("Error fetching values:", error);
      }
    }
    fetchStocks();
    fetchProductDetails();
  }, [navigate, window.location.href]);

  const images = pic
    .slice(0, 3)
    .map((path, index) => path || [Sand1, Sand2, Sand3][index]);

  return (
    <div>
      <Box width="80%" m="80px auto">
        <Box display="flex" flexWrap="wrap" columnGap="40px">
          <Box flex="1 1 40%" style={{ overflow: "hidden" }}>
            <Carousel
              responsive={responsive}
              ref={carouselRef}
              beforeChange={(nextSlide) => handleBeforeChange(nextSlide)}
              className="carousel"
            >
              {images.map((image, index) => (
                <div key={index} className="carousel-slide">
                  <img
                    alt={`Sand Image ${index + 1}`}
                    src={require(`../images/listings/${image.substring(
                      image.lastIndexOf("\\") + 1
                    )}`)}
                    width="100%"
                    height="100%"
                    style={{
                      objectFit: "contain",
                      transform: "scale(1.1)",
                    }}
                  />
                </div>
              ))}
            </Carousel>
            <Box display="flex" justifyContent="center" mt="20px">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${
                    selectedImageIndex === index ? "active" : ""
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    alt={`Thumbnail ${index + 1}`}
                    src={require(`../images/listings/${image.substring(
                      image.lastIndexOf("\\") + 1
                    )}`)}
                  />
                </div>
              ))}
            </Box>
          </Box>

          <Box flex="1 1 50%" mb="40px">
            <Box m="10px 0 25px 0">
              <Breadcrumbs aria-label="breadcrumb">
                <Link className="link" color="inherit" to="/">
                  Home
                </Link>
                <Link className="link" color="inherit" to="/products">
                  Products
                </Link>
                <Typography color="text.primary">
                  {productDetails && productDetails._listingName}
                </Typography>
              </Breadcrumbs>

              <Typography variant="h4" sx={{ fontWeight: "bold", my: 2 }}>
                {productDetails && productDetails._listingName}
              </Typography>
              <Typography sx={{ mb: 2 }}>Aggregate Materials</Typography>
              <Typography sx={{ color: "#bd8512", mb: 2 }}>
                ₱{productDetails && productDetails._listingPrice} per cubic mt.
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: "20px" }}>
                {productDetails && productDetails._listingDescription}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" mt={2}>
              <Typography variant="body1" color="text.secondary">
                Stocks:
              </Typography>

              <Box display="flex" flexDirection="column" mt={2}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Pandi:</strong>{" "}
                  {pandiStocks.map((stock) => stock._quantity) > 0
                    ? `${pandiStocks.map((stock) => stock._quantity)} cu. mt.`
                    : "Out of Stock"}
                </Typography>
                <ColoredLinearProgress
                  value={pandiStocks.map((stock) => stock._quantity)}
                  color={pandiStocks.map((stock) =>
                    stock._quantity > 0 ? "#bd8512" : "#f5c9c9"
                  )}
                  bgcolor="#f5f0e0"
                />
              </Box>

              <Box display="flex" flexDirection="column" mt={2}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Mindanao Ave:</strong>{" "}
                  {mindanaoStocks.map((stock) => stock._quantity) > 0
                    ? `${mindanaoStocks.map(
                        (stock) => stock._quantity
                      )} cu. mt.`
                    : "Out of Stock"}
                </Typography>
                <ColoredLinearProgress
                  value={mindanaoStocks.map((stock) => stock._quantity)}
                  color={mindanaoStocks.map((stock) =>
                    stock._quantity > 0 ? "#bd8512" : "#f5c9c9"
                  )}
                  bgcolor="#f5f0e0"
                />
              </Box>
            </Box>

            <Box display="flex" alignItems="center" minHeight="50px" mt={2}>
              <Button
                variant="contained"
                component={Link}
                to="/dashboard"
                sx={{
                  minWidth: "150px",
                  padding: "10px 40px",
                }}
              >
                REQUEST ORDER
              </Button>
            </Box>
          </Box>
        </Box>
        <Box mt="50px" width="100%">
          <Typography variant="h4" fontWeight="bold">
            More Products
          </Typography>
          <Box mt="20px">
            {/* Assuming 'MenuList' is an array of more products */}
            <MoreProducts cards={MenuList} />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default ProductDetails;
