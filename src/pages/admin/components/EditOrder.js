import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
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
  Autocomplete,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Typography from "../../../components/common/Typography";
import SearchIcon from "@mui/icons-material/Search";

export default function EditOrder() {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const id = url.searchParams.get("id");
  const navigate = useNavigate();
  const [driver, setDriver] = React.useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [status, setStatus] = useState("");
  const [status2, setStatus2] = useState("");
  const [details, setDetails] = useState("");
  const [name, setName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [customers, setCustomers] = useState([]);
  const [product, setProduct] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-order/${id}`
        );
        setName(response.data._name);
        setDetails(response.data._orderDet);
        setPrice(response.data._price);
        setQuantity(response.data._quantity);
        setSelectedProduct(response.data._materialType);
        setStatus(response.data._status);
        setStatus2(response.data._status);
        setDriver(response.data._status);
        setTotalPrice(response.data._price * response.data._quantity);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-order`,
        {
          status: status,
          details: details,
          name: name,
          quantity: quantity,
          _orderNum: id,
          product: selectedProduct,
          _date: formattedDate,
        }
      );

      console.log("Order edited successfully", response.data);
      toast.success("Order added successfully");
      navigate("/adminmanageorders");
    } catch (error) {
      console.error("Order edit failed", error);
      toast.error("Order edit failed!");
    }
  };

  const handlePriceChange = (event) => {
    const newPrice = parseFloat(event.target.value) || 0;
    setPrice(newPrice);
    updateTotalPrice(newPrice, quantity);
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseFloat(event.target.value) || 0;
    setQuantity(newQuantity);
    updateTotalPrice(price, newQuantity);
  };

  const updateTotalPrice = (newPrice, newQuantity) => {
    const newTotalPrice = newPrice * newQuantity;
    setTotalPrice(newTotalPrice);
  };

  const handleChange = (event) => {
    setDriver(event.target.value);
  };

  const [value, setValue] = React.useState("Pandi");

  const handleLocChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/get-products`
        );
        if (response.ok) {
          const data = await response.json();
          const productNames = data.map(
            (product) => `${product._itemName}_${product._location}`
          );
          setProduct(productNames);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div>
      <Box sx={{ my: 14 }}>
        <Typography
          variant="h3"
          marked="left"
          style={{ fontWeight: "bold", fontSize: "30px" }}
          gutterBottom
        >
          Edit an Order
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
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      label="Customer Name"
                      name="customerName"
                      type="text"
                      value={name}
                      fullWidth
                      disabled
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      label="Product Name"
                      name="productName"
                      type="text"
                      value={selectedProduct}
                      fullWidth
                      disabled
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      label="Price"
                      name="price"
                      type="number"
                      disabled
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₱</InputAdornment>
                        ),
                      }}
                      value={price}
                      onChange={handlePriceChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Quantity"
                      name="qty"
                      type="number"
                      value={quantity}
                      fullWidth
                      disabled
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            cu. mt.
                          </InputAdornment>
                        ),
                      }}
                      onChange={handleQuantityChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Total Price"
                      name="totalPrice"
                      type="number"
                      fullWidth
                      disabled
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₱</InputAdornment>
                        ),
                      }}
                      value={totalPrice}
                      readOnly
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Status</FormLabel>
                      <RadioGroup
                        aria-label="options"
                        value={status}
                        row={true}
                        onChange={(event) => setStatus(event.target.value)}
                        required
                      >
                        <FormControlLabel
                          value="Pending"
                          control={<Radio />}
                          label="Pending"
                          disabled={status2 === "Cancelled"}
                        />
                        <FormControlLabel
                          value="Fetch from quarry"
                          control={<Radio />}
                          label="Fetch from quarry"
                          disabled={status2 === "Cancelled"}
                        />
                        <FormControlLabel
                          value="Available for pickup-PANDI"
                          control={<Radio />}
                          label="Available for pickup (Pandi)"
                          disabled={status2 === "Cancelled"}
                        />
                        <FormControlLabel
                          value="Available for pickup-MindanaoAve."
                          control={<Radio />}
                          label="Available for pickup (Mindanao Ave.)"
                          disabled={status2 === "Cancelled"}
                        />
                        <FormControlLabel
                          value="Cancelled"
                          control={<Radio />}
                          label="Cancelled"
                          disabled={status2 === "Cancelled"}
                        />
                        <FormControlLabel
                          value="Arrived at Pandi"
                          control={<Radio />}
                          label="Arrived at Pandi"
                          disabled={status2 === "Cancelled"}
                        />
                        <FormControlLabel
                          value="Arrived at MindanaoAve."
                          control={<Radio />}
                          label="Arrived at Mindanao Avenue"
                          disabled={status2 === "Cancelled"}
                        />
                        <FormControlLabel
                          value="Completed"
                          control={<Radio />}
                          label="Completed"
                          disabled={status2 === "Cancelled"}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Order Details"
                      name="orderdet"
                      type="text"
                      onChange={(event) => setDetails(event.target.value)}
                      fullWidth
                      multiline
                      value={details}
                      disabled={status2 === "Cancelled"}
                      rows={4}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      component={Link}
                      to={"/adminmanageorders"}
                      sx={{
                        marginRight: 2,
                        color: "#83948a",
                        borderColor: "#83948a",
                      }}
                    >
                      Go Back
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={status2 === "Cancelled"}
                    >
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
