import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import { toast } from "react-toastify";

export default function EditTestimonials() {
  const [value, setValue] = React.useState(0);
  const [value2, setValue2] = React.useState(0);
  const [value3, setValue3] = React.useState(0);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/fetch-testimonials`)
      .then((response) => {
        const defaultValues = response.data;
        setFormData(response.data);
        setValue(defaultValues._rating);
        setValue2(defaultValues._rating2);
        setValue3(defaultValues._rating3);
        console.log(formData._fullName);
      });
  }, []);
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.fullName ||
      !formData.professionalTitle ||
      !formData.testimonial
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const testimonialData = {
      _rating: value,
      _fullName: formData.fullName,
      _professionalTitle: formData.professionalTitle,
      _testimonial: formData.testimonial,

      _rating2: value2,
      _fullName2: formData.fullName,
      _professionalTitle2: formData.professionalTitle2,
      _testimonial2: formData.testimonial2,

      _rating3: value3,
      _fullName3: formData.fullName3,
      _professionalTitle3: formData.professionalTitle3,
      _testimonial3: formData.testimonial3,
    };

    // Send data to the server using Axios (update the URL)
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-testimonials`,
        testimonialData
      );
      toast.success("Testimonials edited successfully!");
      console.log("Testimonial submitted:", response.data);
    } catch (error) {
      toast.error("Error submitting testimonial");
      console.error("Error submitting testimonial:", error);
    }
  };

  return (
    <div>
      <Box>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12}>
                  <Typography>Card 1</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography component="legend" color="text.secondary">
                    Rating
                  </Typography>
                  <Rating
                    name="simple-controlled"
                    value={value}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    type="text"
                    fullWidth
                    required // Mark the field as required
                    value={formData.fullName}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Professional Title"
                    name="professionalTitle"
                    type="text"
                    fullWidth
                    required // Mark the field as required
                    value={formData.professionalTitle}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="testimonial"
                    name="testimonial"
                    label="Testimonial"
                    multiline
                    rows={2}
                    variant="outlined"
                    required // Mark the field as required
                    value={formData.testimonial}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <Typography>Card 2</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography component="legend" color="text.secondary">
                    Rating
                  </Typography>
                  <Rating
                    name="simple-controlled"
                    value2={value2}
                    onChange={(event, newValue2) => {
                      setValue2(newValue2);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Full Name"
                    name="fullName2"
                    type="text"
                    fullWidth
                    required // Mark the field as required
                    value={formData.fullName2}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Professional Title"
                    name="professionalTitle2"
                    type="text"
                    fullWidth
                    required // Mark the field as required
                    value={formData.professionalTitle2}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="testimonial2"
                    name="testimonial2"
                    label="Testimonial"
                    multiline
                    rows={2}
                    variant="outlined"
                    required // Mark the field as required
                    value={formData.testimonial2}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <Typography>Card 3</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography component="legend" color="text.secondary">
                    Rating
                  </Typography>
                  <Rating
                    name="simple-controlled"
                    value3={value3}
                    onChange={(event, newValue3) => {
                      setValue3(newValue3);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Full Name"
                    name="fullName3"
                    type="text"
                    fullWidth
                    required // Mark the field as required
                    value={formData.fullName3}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Professional Title"
                    name="professionalTitle3"
                    type="text"
                    fullWidth
                    required // Mark the field as required
                    value={formData.professionalTitle3}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="testimonial3"
                    name="testimonial3"
                    label="Testimonial"
                    multiline
                    rows={2}
                    variant="outlined"
                    required // Mark the field as required
                    value={formData.testimonial3}
                    onChange={handleFormChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    sx={{ mt: 2 }}
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Save changes
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>
    </div>
  );
}
