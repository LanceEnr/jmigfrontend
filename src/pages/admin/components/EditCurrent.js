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
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import Typography from "../../../components/common/Typography";

export default function EditCurrent() {
  const [value, setValue] = React.useState("Pandi");
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const id = url.searchParams.get("id");
  const navigate = useNavigate();
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [location, setLocation] = useState("");

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
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-inventory/${id}`
        );
        setItem(response.data._itemName);
        setLocation(response.data._location);
        setQuantity(response.data._quantity);
        setValue(response.data._location);
        setLocation(response.data._location);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleLocChange = (event) => {
    setValue(event.target.value);
    setLocation(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-current`,
        {
          _inventoryID: id,
          itemName: item,
          quantity: quantity,
          location: location,
          lastUpdated: formattedDate,
        }
      );

      console.log("Inventory edited successfully", response.data);
      toast.success("Inventory edited successfully");
      navigate("/admininventory");
    } catch (error) {
      console.error("Inventory edit failed", error);
      toast.error("Inventory update failed!");
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
          Edit Inventory
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
                      label="Item Name"
                      name="itemname"
                      type="text"
                      value={item}
                      onChange={(event) => setItem(event.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Quantity"
                      name="qty"
                      type="number"
                      value={quantity}
                      fullWidth
                      onChange={(event) => setQuantity(event.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            cu. mt.
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Location</FormLabel>
                      <RadioGroup
                        aria-label="options"
                        value={value}
                        onChange={handleLocChange}
                        row={true}
                      >
                        <FormControlLabel
                          value="Pandi"
                          control={<Radio />}
                          label="Pandi"
                        />
                        <FormControlLabel
                          value="Mindanao Avenue"
                          control={<Radio />}
                          label="Mindanao Avenue"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      component={Link}
                      to={"/admininventory"}
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
