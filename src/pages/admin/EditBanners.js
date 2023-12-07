import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  ListSubheader,
} from "@mui/material";

export default function EditBanners() {
  const [category, setCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-category-values/${category}`
        );

        setHeading(response.data._heading);
        setSubheading(response.data._subheading);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (category) {
      fetchData();
    }
  }, [category]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);

    const previewURL = URL.createObjectURL(file);
    setFilePreview(previewURL);

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      setBase64Image(base64Data);
    };
    reader.readAsDataURL(file);
  }, []);

  const validateForm = () => {
    setIsFormValid(!!category && !!selectedFile && !!heading && !!subheading);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      // Form is not valid, don't submit
      return;
    }

    // Create a data object with the form fields
    const formData = new FormData();
    formData.append("category", category);
    formData.append("image", selectedFile);
    formData.append("heading", heading);
    formData.append("subheading", subheading);

    try {
      // Make a POST request to your server
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-banner`,
        formData
      );

      toast.success("Banner modified successfully");
      console.log("Form submitted successfully", response.data);
    } catch (error) {
      toast.error("Modification failed, please try again!");
      console.error("Form submission failed", error);
    }
  };
  const isCategoryEmpty = !category || category.trim().length === 0;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div>
      <Box sx={{ my: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <form onSubmit={handleFormSubmit}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="category-label">Banner</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category-select"
                      value={category}
                      label="Category"
                      onChange={handleCategoryChange}
                    >
                      <MenuItem value={"Homepage Full Banner"}>
                        Homepage Full Banner
                      </MenuItem>

                      <MenuItem value={"Products Page"}>Products Page</MenuItem>
                      <MenuItem value={"FAQS Page"}>FAQs Page</MenuItem>
                      <MenuItem value={"About Page"}>About Page</MenuItem>
                      <MenuItem value={"Contact Page"}>Contact Us</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Heading"
                    name="heading"
                    type="text"
                    value={heading}
                    disabled={isCategoryEmpty}
                    fullWidth
                    onChange={(e) => {
                      setHeading(e.target.value);
                      validateForm();
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="subheading"
                    label="Subheading"
                    value={subheading}
                    multiline
                    rows={4}
                    variant="outlined"
                    onChange={(e) => {
                      setSubheading(e.target.value);
                      validateForm();
                    }}
                    disabled={
                      category === "FAQS Page" ||
                      category === "About Page" ||
                      category === "Contact Page" ||
                      isCategoryEmpty
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  {!isCategoryEmpty ? (
                    <Box
                      {...getRootProps()}
                      sx={{
                        height: 200,
                        border: "1px dashed gray",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p>Drop the image here...</p>
                      ) : (
                        <div>
                          {selectedFile ? (
                            <div>
                              <img
                                src={filePreview}
                                alt={selectedFile.name}
                                style={{
                                  maxWidth: "300px",
                                  maxHeight: "100px",
                                }}
                              />
                              <p>Selected file: {selectedFile.name}</p>
                            </div>
                          ) : (
                            <p>
                              Drag & drop banner image here, or click to select
                              an image. <br></br>
                              <center>
                                (This will replace the stored photo.)
                              </center>
                            </p>
                          )}
                        </div>
                      )}
                    </Box>
                  ) : (
                    <p>Select a banner you want to modify</p>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid}
                    type="submit"
                  >
                    Save changes
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
