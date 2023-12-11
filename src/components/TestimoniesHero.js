import React, { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Container,
  Grid,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

async function fetchTestimonialData() {
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
export default function TestimoniesHero() {
  const [rating1, setRating1] = useState("");
  const [fullName1, setFullname1] = useState("");
  const [professionalTitle1, setProfessionalTitle1] = useState("");
  const [testimonial1, setTestimonial1] = useState("");
  const [rating2, setRating2] = useState("");
  const [fullName2, setFullname2] = useState("");
  const [professionalTitle2, setProfessionalTitle2] = useState("");
  const [testimonial2, setTestimonial2] = useState("");
  const [rating3, setRating3] = useState("");
  const [fullName3, setFullname3] = useState("");
  const [professionalTitle3, setProfessionalTitle3] = useState("");
  const [testimonial3, setTestimonial3] = useState("");

  useEffect(() => {
    fetchTestimonialData()
      .then((data) => {
        if (data) {
          setRating1(data._rating);
          setFullname1(data._fullName);
          setProfessionalTitle1(data._professionalTitle);
          setTestimonial1(data._testimonial);

          setRating2(data._rating2);
          setFullname2(data._fullName2);
          setProfessionalTitle2(data._professionalTitle2);
          setTestimonial2(data._testimonial2);

          setRating3(data._rating3);
          setFullname3(data._fullName3);
          setProfessionalTitle3(data._professionalTitle3);
          setTestimonial3(data._testimonial3);
        } else {
          console.error("Banner image data not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching banner:", error);
      });
  }, []);

  const testimonies = [
    {
      name: fullName1,
      title: professionalTitle1,
      text: testimonial1,
      rating: rating1,
    },
    {
      name: fullName2,
      title: professionalTitle2,
      text: testimonial2,
      rating: rating2,
    },
    {
      name: fullName3,
      title: professionalTitle3,
      text: testimonial3,
      rating: rating3,
    },
  ];
  return (
    <Container sx={{ py: 12 }}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        What Our Clients Say
      </Typography>
      <Grid container spacing={2} justifyContent="space-around">
        {testimonies.map((testimony, index) => (
          <Grid item key={index}>
            <Card
              elevation={2}
              sx={{
                minHeight: 325,
                width: 350,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "0.3s",
                borderRadius: 2,
                "&:hover": {
                  boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FormatQuoteIcon
                  sx={{
                    transform: "scaleY(-1)",
                    color: "#bd8512",
                    pointerEvents: "none",
                    fontSize: "80px",
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ pb: 2, textAlign: "center" }}
                >
                  {testimony.text}
                </Typography>
                <Rating name="read-only" value={testimony.rating} readOnly />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ pt: 2, color: "#83948a" }}
                >
                  {testimony.name}
                </Typography>
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                >
                  {testimony.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
