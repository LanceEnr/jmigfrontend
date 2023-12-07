import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
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
  InputAdornment,
} from "@mui/material";
import Typography from "../../components/common/Typography";

export default function AddListing({ onBackClick }) {
  const [product, setProduct] = React.useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const onDrop = useCallback(
    (acceptedFiles) => {
      const remainingSlots = 3 - selectedFiles.length;
      const filesToAdd = acceptedFiles.slice(0, remainingSlots);
      setSelectedFiles([...selectedFiles, ...filesToAdd]);
    },
    [selectedFiles]
  );
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_listingName", productName);
    formData.append("_listingCategory", category);
    formData.append("_listingPrice", price);
    formData.append("_isPublished", description);
    selectedFiles.forEach((file) => {
      formData.append("image", file);
    });
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/add-listing`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Listing added successfully");
      setProductName("");
      setCategory("");
      setPrice(0);
      setDescription("");
      setSelectedFiles([]);
      onBackClick();
      console.log("Form submitted successfully", response.data);
    } catch (error) {
      toast.error("Modification failed, please try again!");
      console.error("Form submission failed", error);
    }
  };
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/get-products2`
        );
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
    setProduct(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  const removeFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <Box sx={{ my: 14 }}>
        <Typography
          variant="h3"
          marked="left"
          style={{ fontWeight: "bold", fontSize: "30px" }}
          gutterBottom
        >
          Add New Listing
        </Typography>
        <Paper
          sx={{
            mt: 3,
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <form onSubmit={handleFormSubmit}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel id="product-label">Product</InputLabel>
                      <Select
                        labelId="product-label"
                        id="productName"
                        name="productName"
                        value={productName}
                        onChange={(e) => {
                          setProductName(e.target.value);
                        }}
                        label="Product"
                      >
                        {Array.from(
                          new Set(products.map((product) => product._itemName))
                        ).map((uniqueItemName) => (
                          <MenuItem key={uniqueItemName} value={uniqueItemName}>
                            {uniqueItemName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Price"
                      name="price"
                      value={price}
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₱</InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        setPrice(e.target.value);
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                      {selectedFiles.length > 0 ? (
                        <ul>
                          {selectedFiles.map((file, index) => (
                            <li key={index}>
                              {file.name}{" "}
                              <button onClick={() => removeFile(index)}>
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>
                          Drag & drop images here, or click to select images
                        </p>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="description"
                      label="Description"
                      multiline
                      rows={4}
                      variant="outlined"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      sx={{
                        marginRight: 2,
                        color: "#83948a",
                        borderColor: "#83948a",
                      }}
                      onClick={onBackClick}
                    >
                      Go Back
                    </Button>
                    <Button variant="contained" color="primary" type="submit">
                      Save changes
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </div>
  );
}
