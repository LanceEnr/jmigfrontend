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

export default function AddOrder() {
  const [driver, setDriver] = React.useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [status, setStatus] = useState("");
  const [details, setDetails] = useState("");
  const [name, setName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [customers, setCustomers] = useState([]);
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    async function fetchCustomerName() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/get-customers`
        );
        if (response.ok) {
          const data = await response.json();
          const customerNames = data.map(
            (customer) => `${customer._fName}_${customer._lName}`
          );

          setCustomers(customerNames);
        } else {
          console.error("Failed to fetch customers");
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    }

    fetchCustomerName();
  }, []);

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
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/addOrder`,
        {
          _name: name,
          _materialType: selectedProduct,
          _date: formattedDate,
          _status: status,
          _price: parseInt(price, 10) * parseInt(quantity, 10),
          _quantity: quantity,
          _orderDet: details,
        }
      );

      console.log("Order added successfully", response.data);
      toast.success(response.data.message);
      navigate("/adminmanageorders");
    } catch (error) {
      console.error("Order add failed", error);
      toast.error("Stocks not enough!");
    }
  };

  return (
    <div>
      <Box sx={{ my: 14 }}>
        <Typography
          variant="h3"
          marked="left"
          style={{ fontWeight: "bold", fontSize: "30px" }}
          gutterBottom
        >
          Add an Order
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
                    <Autocomplete
                      options={customers}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Customer Name"
                          name="customername"
                          type="text"
                          fullWidth
                          required
                          placeholder="Search customers..."
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      onChange={(event, value) => {
                        if (value) {
                          setName(value);
                        } else {
                          setName("");
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Autocomplete
                      options={product}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Product Name"
                          name="productname"
                          type="text"
                          fullWidth
                          required
                          placeholder="Search products..."
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      onChange={(event, value) => {
                        if (value) {
                          setSelectedProduct(value);
                        } else {
                          setSelectedProduct("");
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Price"
                      name="price"
                      type="number"
                      required
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
                      required
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            cu. mt.
                          </InputAdornment>
                        ),
                      }}
                      value={quantity}
                      onChange={handleQuantityChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Total Price"
                      name="totalPrice"
                      type="text"
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₱</InputAdornment>
                        ),
                      }}
                      value={formatNumberWithCommas(totalPrice)}
                      readOnly
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Status</FormLabel>
                      <RadioGroup
                        aria-label="options"
                        row={true}
                        onChange={(event) => setStatus(event.target.value)}
                        required
                      >
                        <FormControlLabel
                          value="Pending"
                          control={<Radio />}
                          label="Pending"
                        />
                        <FormControlLabel
                          value="Fetch from quarry"
                          control={<Radio />}
                          label="Fetch from quarry"
                        />
                        <FormControlLabel
                          value="Available for pickup-PANDI"
                          control={<Radio />}
                          label="Available for pickup (Pandi)"
                        />
                        <FormControlLabel
                          value="Available for pickup-MindanaoAve."
                          control={<Radio />}
                          label="Available for pickup (Mindanao Ave.)"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Order Details"
                      name="orderdet"
                      type="text"
                      fullWidth
                      required
                      multiline
                      rows={4}
                      onChange={(event) => setDetails(event.target.value)}
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
                    <Button variant="contained" type="submit">
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
