import React, { useEffect, useState } from "react";

import Typography from "../../components/common/Typography";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { Paper } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EventIcon from "@mui/icons-material/Event";
import HandymanIcon from "@mui/icons-material/Handyman";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  CardActionArea,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Box,
  Grid,
  Chip,
} from "@mui/material";
import InventoryBar from "./components/InventoryBar";
import MyResponsivePie from "./components/MyResponsivePie";

function AdminHomepage() {
  const fetchInventoryData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/currentInventory`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
  const fetchOrder = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/get-order`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order data:", error);
      return [];
    }
  };
  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/get-events`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order data:", error);
      return [];
    }
  };
  const fetchTrip = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-tripDash`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order data:", error);
      return [];
    }
  };

  const fetchMaintenance = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-maintenance-overdue`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order data:", error);
      return [];
    }
  };

  const fetchInspection = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-inspection-overdue`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order data:", error);
      return [];
    }
  };

  const transformInventoryData = (data) => {
    const aggregatedData = {};

    data.forEach((item) => {
      const { _itemName, _quantity } = item;
      const quantity = parseInt(_quantity);

      if (aggregatedData[_itemName]) {
        aggregatedData[_itemName] += quantity;
      } else {
        aggregatedData[_itemName] = quantity;
      }
    });

    const transformedData = Object.keys(aggregatedData).map((productName) => ({
      product: productName,
      [productName]: aggregatedData[productName],
    }));

    return transformedData;
  };
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [totalOrders, setTotalOrders] = useState(0);
  const [events, setEvents] = useState(0);
  const [trips, setTrips] = useState(0);
  const [maintenance, setMaintenance] = useState(0);
  const [inspection, setInspection] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchInventoryData();
        const transformedData = transformInventoryData(data);
        console.log(transformedData);
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching and transforming data:", error);
      }
    };

    fetchData();
  }, [navigate]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch order data
        const orderData = await fetchOrder();

        // Calculate the total number of orders
        const totalOrders = orderData.length;

        // Update the state with the total number of orders
        setTotalOrders(totalOrders);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch order data
        const eventData = await fetchEvents();

        // Calculate the total number of orders
        const totalApp = eventData.length;

        // Update the state with the total number of orders
        setEvents(totalApp);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch order data
        const tripData = await fetchTrip();

        // Calculate the total number of orders
        const totalTrips = Object.keys(tripData).length;

        // Update the state with the total number of orders
        setTrips(totalTrips);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch order data
        const maintenanceData = await fetchMaintenance();

        // Calculate the total number of orders
        const totalMaintenance = Object.keys(maintenanceData).length;

        // Update the state with the total number of orders
        setMaintenance(totalMaintenance);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch order data
        const inspectionData = await fetchInspection();

        // Calculate the total number of orders
        const totalInspection = Object.keys(inspectionData).length;

        // Update the state with the total number of orders
        setInspection(totalInspection);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h3"
          marked="left"
          style={{ fontWeight: "bold", fontSize: "30px" }}
          gutterBottom
        >
          Welcome,{" "}
          <Typography
            variant="h3"
            component="span"
            style={{ fontWeight: "bold", fontSize: "30px" }}
            color="secondary"
          >
            Admin
          </Typography>
        </Typography>
        <Grid sx={{ mt: 3 }} container spacing={3}>
          <Grid item xs={2.4}>
            <Card>
              <CardActionArea component={Link} to={`/adminmanageorders`}>
                <CardContent>
                  <Stack
                    alignItems="flex-start"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                  >
                    <Stack spacing={1}>
                      <Typography
                        color="text.primary"
                        sx={{ fontWeight: "bold" }}
                        variant="overline"
                      >
                        {" "}
                        Total Orders
                      </Typography>
                      <Typography
                        variant="h4"
                        color="secondary"
                        sx={{ fontWeight: "bold" }}
                      >
                        {totalOrders}
                      </Typography>
                    </Stack>
                    <Avatar
                      sx={{
                        backgroundColor: "info.main",
                        height: 85,
                        width: 85,
                      }}
                    >
                      <ShoppingCartIcon sx={{ fontSize: "42px" }} />
                    </Avatar>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>{" "}
          </Grid>

          <Grid item xs={2.4}>
            <Card>
              <CardActionArea component={Link} to={`/adminmanageappointments`}>
                <CardContent>
                  <Stack
                    alignItems="flex-start"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                  >
                    <Stack spacing={1}>
                      <Typography
                        color="text.primary"
                        sx={{ fontWeight: "bold" }}
                        variant="overline"
                      >
                        {" "}
                        Appointments
                      </Typography>
                      <Typography
                        variant="h4"
                        color="secondary"
                        sx={{ fontWeight: "bold" }}
                      >
                        {events}
                      </Typography>
                    </Stack>
                    <Avatar
                      sx={{
                        backgroundColor: "secondary.main",
                        height: 85,
                        width: 85,
                      }}
                    >
                      <EventIcon sx={{ fontSize: "42px" }} />
                    </Avatar>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>{" "}
          </Grid>
          <Grid item xs={2.4}>
            <Card>
              <CardActionArea component={Link} to={`/admindeliverymonitoring`}>
                <CardContent>
                  <Stack
                    alignItems="flex-start"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                  >
                    <Stack spacing={1}>
                      <Typography
                        color="text.primary"
                        sx={{ fontWeight: "bold" }}
                        variant="overline"
                      >
                        Ongoing Trips
                      </Typography>
                      <Typography
                        variant="h4"
                        color="secondary"
                        sx={{ fontWeight: "bold" }}
                      >
                        {trips}
                      </Typography>
                    </Stack>
                    <Avatar
                      sx={{
                        backgroundColor: "success.main",
                        height: 85,
                        width: 85,
                      }}
                    >
                      <LocalShippingIcon sx={{ fontSize: "42px" }} />
                    </Avatar>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>{" "}
          </Grid>
          <Grid item xs={2.4}>
            <Card>
              <CardActionArea component={Link} to={`/adminmaintenance`}>
                <CardContent>
                  <Stack
                    alignItems="flex-start"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                  >
                    <Stack spacing={1}>
                      <Typography
                        color="text.primary"
                        sx={{ fontWeight: "bold" }}
                        variant="overline"
                      >
                        {" "}
                        Maintenance
                      </Typography>
                      <Typography
                        variant="h4"
                        color="secondary"
                        sx={{ fontWeight: "bold" }}
                      >
                        {maintenance}
                        <Chip
                          label={
                            <Typography
                              sx={{
                                fontSize: "10px",
                                color: "error.dark",
                              }}
                            >
                              OVERDUE
                            </Typography>
                          }
                          sx={{ bgcolor: "#f5c9c9" }}
                        />
                      </Typography>
                    </Stack>
                    <Avatar
                      sx={{
                        backgroundColor: "warning.main",
                        height: 85,
                        width: 85,
                      }}
                    >
                      <HandymanIcon sx={{ fontSize: "42px" }} />
                    </Avatar>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>{" "}
          </Grid>
          <Grid item xs={2.4}>
            <Card>
              <CardActionArea component={Link} to={`/admininspection`}>
                <CardContent>
                  <Stack
                    alignItems="flex-start"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                  >
                    <Stack spacing={1}>
                      <Typography
                        color="text.primary"
                        sx={{ fontWeight: "bold" }}
                        variant="overline"
                      >
                        {" "}
                        Inspection
                      </Typography>
                      <Typography
                        variant="h4"
                        color="secondary"
                        sx={{ fontWeight: "bold" }}
                      >
                        {inspection}
                        <Chip
                          label={
                            <Typography
                              sx={{
                                fontSize: "10px",
                                color: "error.dark",
                              }}
                            >
                              OVERDUE
                            </Typography>
                          }
                          sx={{ bgcolor: "#f5c9c9" }}
                        />
                      </Typography>
                    </Stack>
                    <Avatar
                      sx={{
                        backgroundColor: "warning.main",
                        height: 85,
                        width: 85,
                      }}
                    >
                      <SearchIcon sx={{ fontSize: "42px" }} />
                    </Avatar>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>{" "}
          </Grid>
          <Grid item xs={7}>
            <Paper
              sx={{ px: 2, pt: 2, pb: 6, height: "55vh", overflow: "hidden" }}
            >
              <Typography
                color="text.primary"
                sx={{ fontWeight: "bold" }}
                variant="overline"
              >
                Current Inventory
              </Typography>
              <InventoryBar data={data} />
            </Paper>
          </Grid>
          <Grid item xs={5}>
            <Paper
              sx={{ px: 2, pt: 2, pb: 6, height: "55vh", overflow: "hidden" }}
            >
              <Typography
                color="text.primary"
                sx={{ fontWeight: "bold" }}
                variant="overline"
              >
                Driver Performance
              </Typography>
              <MyResponsivePie />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default AdminHomepage;
