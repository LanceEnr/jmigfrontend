import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
  InputAdornment,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
export default function ContactContent() {
  const [formData, setFormData] = useState({
    _address1: "",
    _address2: "",
    _phone1: "",
    _phone2: "",
    _landline: "",
    _email: "",
    _fb: "",
    _messenger: "",
  });

  useEffect(() => {
    async function fetchContactData() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-contact`
        );
        const contactData = response.data;

        // Set the formData state with the fetched values
        setFormData({
          ...formData,
          _address1: contactData._address1 || "",
          _address2: contactData._address2 || "",
          _phone1: contactData._phone1 || "",
          _phone2: contactData._phone2 || "",
          _landline: contactData._landline || "",
          _email: contactData._email || "",
          _fb: contactData._fb || "",
          _messenger: contactData._messenger || "",
        });
      } catch (error) {
        console.error("Error fetching contact:", error);
        throw error;
      }
    }

    fetchContactData();
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const valueData = {
      _address1: formData._address1,
      _address2: formData._address2,
      _phone1: formData._phone1,
      _phone2: formData._phone2,
      _landline: formData._landline,
      _email: formData._email,
      _fb: formData._fb,
      _messenger: formData._messenger,
    };

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-contact`
      );
      const data = response.data;
    } catch (error) {
      console.error("Error fetching contact:", error);
      throw error;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-contact`,
        valueData
      );
      toast.success("Contact edited successfully!");
      console.log("Contact submitted:", response.data);
    } catch (error) {
      toast.error("Error submitting values");
      console.error("Error submitting values:", error);
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
                  <Typography>Business Contact Information</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="address"
                    name="_address"
                    label="Address 1"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData._address1}
                    onChange={handleFormChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="address"
                    name="_address"
                    label="Address 2"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData._address2}
                    onChange={handleFormChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    id="contact-no"
                    name="_contactNo"
                    label="Phone 1"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData._phone1}
                    onChange={handleFormChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SmartphoneIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="contact-no"
                    name="_contactNo"
                    label="Phone 2"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData._phone2}
                    onChange={handleFormChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SmartphoneIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    id="contact-no"
                    name="_contactNo"
                    label="Landline"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData._landline}
                    onChange={handleFormChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    id="email"
                    name="_email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData._email}
                    onChange={handleFormChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Footer Social Links</Typography>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    id="facebook-link"
                    name="_fb"
                    label="Facebook Link"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData._fb}
                    onChange={handleFormChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FacebookIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="messenger-link"
                    name="_messenger"
                    label="Messenger Link"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData._messenger}
                    onChange={handleFormChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapsUgcIcon />
                        </InputAdornment>
                      ),
                    }}
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
