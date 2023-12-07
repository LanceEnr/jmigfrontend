import React, { useEffect, useState } from "react";
import { Paper, Box, Tab, Tabs, Button } from "@mui/material";

import Typography from "../../components/common/Typography";
import AssessmentIcon from "@mui/icons-material/Assessment";

import { Link } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import NewCurrent from "./components/NewCurrent";
import NewIncomingInventory from "./components/NewIncoming";
import NewOutgoingInventory from "./components/NewOutgoing";

function Inventory() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/fetch-add`
        );
        if (response.ok) {
          const data = await response.json();

          // Make a request to /addStocks with the entire data array
          const addStocksResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/addStocks`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (addStocksResponse.ok) {
            const addStocksData = await addStocksResponse.json();
          } else {
            console.error("Failed to add stocks");
          }
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    async function UpdateStatus() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/fetch-add`
        );
        if (response.ok) {
          const data = await response.json();

          // Make a request to /addStocks with the entire data array
          const addStocksResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/update-TripHistory`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (addStocksResponse.ok) {
            const addStocksData = await addStocksResponse.json();
          } else {
            console.error("Failed to add stocks");
          }
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    UpdateStatus();
  }, []);

  useEffect(() => {
    async function fetchTripHistory() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/fetch-tripHistory`
        );
        if (response.ok) {
          const data = await response.json();
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchTripHistory();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <Box sx={{ my: 12 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={2}
        >
          <Typography
            variant="h3"
            marked="left"
            style={{ fontWeight: "bold", fontSize: "30px" }}
            gutterBottom
          >
            Inventory
          </Typography>
          <Box display="flex">
            {value === 0 && (
              <Button
                variant="contained"
                sx={{ ml: 1 }}
                color="secondary"
                startIcon={<AssessmentIcon />}
                component={Link}
                to={"/admincurrentinventoryreport"}
              >
                Generate Report
              </Button>
            )}
            {value === 0 && (
              <Button
                component={Link}
                to={"/adminaddcurrent"}
                variant="contained"
                sx={{ ml: 1 }}
                startIcon={<AddIcon />}
              >
                Add Inventory
              </Button>
            )}
          </Box>
        </Box>
        <Paper sx={{ mt: 3, p: 2, display: "flex", flexDirection: "column" }}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="Maintenance"
              >
                <Tab label="Current" />
                <Tab label="Incoming" />
                <Tab label="History" />
              </Tabs>
            </Box>
            {value === 0 && <NewCurrent />}
            {value === 1 && <NewIncomingInventory />}
            {value === 2 && <NewOutgoingInventory />}
          </Box>
        </Paper>
      </Box>
    </div>
  );
}

export default Inventory;
