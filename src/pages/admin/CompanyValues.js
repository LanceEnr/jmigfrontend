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
} from "@mui/material";

export default function CompanyValues() {
  const [formData, setFormData] = useState({
    _valueHeading1: "",
    _valueSubheading1: "",
    _valueHeading2: "",
    _valueSubheading2: "",
    _valueHeading3: "",
    _valueSubheading3: "",
  });

  useEffect(() => {
    async function fetchValues() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-values`
        );
        const valuesData = response.data;

        // Set the formData state with the fetched values
        setFormData({
          ...formData,
          _valueHeading1: valuesData._valueHeading1 || "",
          _valueSubheading1: valuesData._valueSubheading1 || "",
          _valueHeading2: valuesData._valueHeading2 || "",
          _valueSubheading2: valuesData._valueSubheading2 || "",
          _valueHeading3: valuesData._valueHeading3 || "",
          _valueSubheading3: valuesData._valueSubheading3 || "",
        });
      } catch (error) {
        console.error("Error fetching contact:", error);
        throw error;
      }
    }

    fetchValues();
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const valueData = {
      _valueHeading1: formData._heading1,
      _valueSubheading1: formData._subheading1,
      _valueHeading2: formData._heading2,
      _valueSubheading2: formData._subheading2,
      _valueHeading3: formData._heading3,
      _valueSubheading3: formData._subheading3,
    };

    // Send data to the server using Axios (update the URL)
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-values`,
        valueData
      );
      toast.success("Values edited successfully!");
      console.log("Values submitted:", response.data);
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
                  <Typography>Values 1</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Heading"
                    name="_heading1"
                    type="text"
                    fullWidth
                    required
                    value={formData._valueHeading1}
                    onChange={handleFormChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="subheading"
                    name="_subheading1"
                    label="subheading1"
                    multiline
                    required
                    rows={2}
                    variant="outlined"
                    value={formData._valueSubheading1}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Values 2</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Heading"
                    name="_heading2"
                    type="text"
                    fullWidth
                    required
                    value={formData._valueHeading2}
                    onChange={handleFormChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="subheading2"
                    name="_subheading2"
                    label="Subheading"
                    multiline
                    rows={2}
                    required
                    variant="outlined"
                    value={formData._valueSubheading2}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Values 3</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Heading"
                    name="_heading3"
                    type="text"
                    fullWidth
                    required
                    value={formData._valueHeading3}
                    onChange={handleFormChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="subheading3"
                    name="_subheading3"
                    label="Subheading"
                    multiline
                    rows={2}
                    required
                    variant="outlined"
                    value={formData._valueSubheading3}
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
