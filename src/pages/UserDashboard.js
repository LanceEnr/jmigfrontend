import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useMediaQuery, Box } from "@mui/material";
import OrdersTable1 from "../components/OrdersTable1";
import UserSidePanel from "../components/UserSidePanel";
import AppointmentsTable1 from "../components/AppointmentsTable1";
import ProfileInfo from "../components/ProfileInfo";
import EditProfile from "../components/EditProfile";
import "../styles/UserDashboard.css";
import axios from "axios";
import ProductSmokingHero from "../components/ProductSmokingHero";
import ProfileCard from "../components/common/ProfileCard";

function UserDashboard() {
  const [orders, setOrders] = useState([]);
  const [activeComponent, setActiveComponent] = useState("User Profile");
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleActiveComponentChange = (newComponent) => {
    setActiveComponent(newComponent);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "Orders":
        return (
          <OrdersTable1 onActiveComponentChange={handleActiveComponentChange} />
        );
      case "Appointments":
        return (
          <AppointmentsTable1
            onActiveComponentChange={handleActiveComponentChange}
          />
        );

      case "User Profile":
        return (
          <EditProfile onActiveComponentChange={handleActiveComponentChange} />
        );
      default:
        return (
          <AppointmentsTable1
            onActiveComponentChange={handleActiveComponentChange}
          />
        );
    }
  };

  return (
    <div className="userDashboard">
      <Container sx={{ my: 4, maxWidth: "xl" }}>
        <Grid container spacing={3}>
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <UserSidePanel setActiveComponent={setActiveComponent} />
            </Grid>
          )}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            {renderComponent()}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default UserDashboard;
