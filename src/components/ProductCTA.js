import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { TextField, Button, Checkbox } from "@mui/material";
import Typography from "../components/common/Typography";
import ImageDots from "../assets/productCTAImageDots.webp";
import Catalog from "../assets/cta.webp";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

function ProductCTA() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    SetInquiryData({
      ...inquiryData,
      [name]: value,
    });
  };
  const resetForm = () => {
    SetInquiryData({
      _name: "",
      _email: "",
      _message: "",
    });
  };
  const handleCheckboxChange = (event) => {
    setAgreementChecked(event.target.checked);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleAgreeSubmit = () => {
    // Perform any additional actions upon agreement (e.g., store the agreement status)
    handleDialogClose(); // Close the dialog
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
      toast.success("Inquiry submitted successfully");
      resetForm();
    } catch (error) {
      console.error("Registration failed", error);
      // Handle registration failure (e.g., show an error message).
    }
  };

  const [address, setAddress] = useState("");
  const [phone, setphone] = useState("");
  const [email, setEmail] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container component="section" sx={{ pt: 10, display: "flex" }}>
      <Grid container>
        <Grid item xs={12} md={6} sx={{ zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              bgcolor: "#EBDAB7",
              py: 8,
              px: 3,
              borderRadius: 4, // Adjust the value to control the roundness
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                maxWidth: 400,
              }}
            >
              <Typography
                variant="h3"
                component="h2"
                style={{ fontWeight: "bold" }}
                gutterBottom
              >
                GET IN TOUCH
              </Typography>
              <Typography variant="subtitle1">
                Send us a message and we'll get in touch with you!
              </Typography>
              <TextField
                fullWidth
                label="Name"
                name="_name"
                margin="normal"
                onChange={handleChange}
                value={inquiryData._name}
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="_email"
                margin="normal"
                onChange={handleChange}
                value={inquiryData._email}
                required
                type="email"
              />

              <TextField
                fullWidth
                label="Message"
                name="_message"
                margin="normal"
                onChange={handleChange}
                value={inquiryData._message}
                required
                multiline
                rows={4}
              />
              <Checkbox
                id="agreementCheckbox"
                checked={agreementChecked}
                onChange={handleCheckboxChange}
              />
              <Typography
                variant="caption"
                color="textSecondary"
                component="label"
                htmlFor="agreementCheckbox"
              >
                I agree that the information provided will be used for product
                promotion and will be used to contact me.
              </Typography>

              {/* Button to open the dialog */}

              <Button
                variant="contained"
                type="submit"
                sx={{
                  mt: 2,
                  width: "100px", // adjust this value as needed
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: { md: "block", xs: "none" }, position: "relative" }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -67,
              left: -67,
              right: 0,
              bottom: 0,
              width: "100%",
              background: `url(${ImageDots})`, // Use the imported image
            }}
          />
          <Box
            component="img"
            src={Catalog}
            alt="call to action"
            sx={{
              position: "absolute",
              top: -28,
              left: -28,
              right: 0,
              bottom: 0,
              width: "100%",
              maxWidth: 600,
              borderRadius: 4, // Adjust the value to control the roundness
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductCTA;
