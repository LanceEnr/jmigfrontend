import "./App.css";
import React, { useReducer, useEffect, Suspense } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Box, Toolbar, Grid } from "@mui/material";
import authReducer from "./store/reducers/authReducer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";

import AdminRegister from "./pages/admin/AdminRegister";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import AdminProfileInfo from "./pages/admin/AdminProfileInfo";
import NewFleetInformation from "./pages/admin/NewFleetInformation";
import Maintenance from "./pages/admin/Maintenance";
import Inspection from "./pages/admin/Inspection";
import Trips from "./pages/admin/Trips";
import JobOrderSystem from "./pages/admin/JobOrderSystem";
import DeliveryMonitoring from "./pages/admin/DeliveryMonitoring";
import ManageAppointments from "./pages/admin/ManageAppointments";
import Inventory from "./pages/admin/Inventory";
import Content from "./pages/admin/Content";
import ManageContactForm from "./pages/admin/ManageContactForm";
import Listings from "./pages/admin/Listings";
import AddFleet from "./pages/admin/components/AddFleet";
import EditFleet from "./pages/admin/components/EditFleet";
import AddMaintenanceScheduling from "./pages/admin/components/AddMaintenanceScheduling";
import EditMaintenanceScheduling from "./pages/admin/components/EditMaintenanceScheduling";
import EditMaintenanceRecord from "./pages/admin/components/EditMaintenanceRecord";
import AddInspection from "./pages/admin/components/AddInspection";
import EditInspection from "./pages/admin/components/EditInspection";
import NewDriverManagement from "./pages/admin/NewDriverManagement";
import AddDriver from "./pages/admin/components/AddDriver";
import EditDriver from "./pages/admin/components/EditDriver";
import NewManageOrders from "./pages/admin/components/NewManageOrders";
import AddOrder from "./pages/admin/components/AddOrder";
import EditOrder from "./pages/admin/components/EditOrder";
import AddCurrent from "./pages/admin/components/AddCurrent";
import EditCurrent from "./pages/admin/components/EditCurrent";
import AddFaq from "./pages/admin/components/AddFaq";
import EditFaq from "./pages/admin/components/EditFaq";
import NewUserManagement from "./pages/admin/components/NewUserManagement";
import RandomStringGenerator from "./pages/admin/components/RandomStringGenerator";
import { toast } from "react-toastify";
import AdminHomepage from "./pages/admin/AdminHomepage";
import TripMetricsReport from "./pages/admin/components/TripMetricsReport";
import DriversReport from "./pages/admin/components/DriversReport";
import CurrenInventoryReport from "./pages/admin/components/CurrentInventoryReport";

const initialState = {
  isAuthenticated: !!localStorage.getItem("adminToken"),
};

function AdminApp() {
  const [authState, authDispatch] = useReducer(authReducer, initialState);
  const isAuthenticated = authState.isAuthenticated;

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    authDispatch({ type: "LOGOUT" });
  };

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/adminlogin"
            exact
            element={
              <React.Fragment>
                <AdminLogin dispatch={authDispatch} />
              </React.Fragment>
            }
          />
          <Route
            path="/adminregister"
            exact
            element={
              <React.Fragment>
                <AdminRegister />
              </React.Fragment>
            }
          />
          <Route
            path="/adminForgotPassword"
            exact
            element={
              <React.Fragment>
                <AdminForgotPassword />
              </React.Fragment>
            }
          />
          <Route
            path="/*"
            exact
            element={
              isAuthenticated ? (
                <React.Fragment>
                  {window.location.pathname !== "/adminlogin" &&
                    window.location.pathname !== "/adminregister" &&
                    window.location.pathname !== "/adminForgotPassword" && (
                      <Box
                        style={{
                          display: "flex",
                        }}
                      >
                        <AdminDashboard />
                        <Box
                          component="main"
                          sx={{
                            backgroundColor: (theme) =>
                              theme.palette.mode === "light"
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                            flexGrow: 1,
                            height: "100vh",
                            overflow: "auto",
                          }}
                        >
                          <Toolbar />
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Box sx={{ mx: 3 }}>
                                <Routes>
                                  <Route
                                    path="/admincurrentinventoryreport"
                                    exact
                                    element={<CurrenInventoryReport />}
                                  />

                                  <Route
                                    path="/admindriversreport"
                                    exact
                                    element={<DriversReport />}
                                  />
                                  <Route
                                    path="/admintripmetricsreport"
                                    exact
                                    element={<TripMetricsReport />}
                                  />
                                  <Route
                                    path="/adminhome"
                                    exact
                                    element={<AdminHomepage />}
                                  />
                                  <Route
                                    path="/adminaccesscodes"
                                    exact
                                    element={<RandomStringGenerator />}
                                  />
                                  <Route
                                    path="/adminprofileinfo"
                                    exact
                                    element={<AdminProfileInfo />}
                                  />
                                  <Route
                                    path="/adminforgotpassword"
                                    exact
                                    element={<AdminForgotPassword />}
                                  />

                                  <Route
                                    path="/adminregister"
                                    exact
                                    element={<AdminRegister />}
                                  />

                                  <Route
                                    path="/adminlogin"
                                    exact
                                    element={
                                      <AdminLogin dispatch={authDispatch} />
                                    }
                                  />

                                  <Route
                                    path="/admineditfaq"
                                    exact
                                    element={<EditFaq />}
                                  />

                                  <Route
                                    path="/adminaddfaq"
                                    exact
                                    element={<AddFaq />}
                                  />
                                  <Route
                                    path="/admineditcurrent"
                                    exact
                                    element={<EditCurrent />}
                                  />
                                  <Route
                                    path="/adminaddcurrent"
                                    exact
                                    element={<AddCurrent />}
                                  />
                                  <Route
                                    path="/admineditorder"
                                    exact
                                    element={<EditOrder />}
                                  />

                                  <Route
                                    path="/adminaddorder"
                                    exact
                                    element={<AddOrder />}
                                  />
                                  <Route
                                    path="/admineditdriver"
                                    exact
                                    element={<EditDriver />}
                                  />
                                  <Route
                                    path="/adminadddriver"
                                    exact
                                    element={<AddDriver />}
                                  />
                                  <Route
                                    path="/adminaddinspection"
                                    exact
                                    element={<AddInspection />}
                                  />
                                  <Route
                                    path="/admineditinspection"
                                    exact
                                    element={<EditInspection />}
                                  />
                                  <Route
                                    path="/adminaddmaintenancescheduling"
                                    exact
                                    element={<AddMaintenanceScheduling />}
                                  />
                                  <Route
                                    path="/admineditmaintenancescheduling"
                                    exact
                                    element={<EditMaintenanceScheduling />}
                                  />
                                  <Route
                                    path="/admineditmaintenancerecord"
                                    exact
                                    element={<EditMaintenanceRecord />}
                                  />
                                  <Route
                                    path="/adminaddfleet"
                                    exact
                                    element={<AddFleet />}
                                  />
                                  <Route
                                    path="/admineditfleet"
                                    exact
                                    element={<EditFleet />}
                                  />
                                  <Route
                                    path="/adminprofileinfo"
                                    exact
                                    element={<AdminProfileInfo />}
                                  />
                                  <Route
                                    path="/adminfleetinformation"
                                    exact
                                    element={<NewFleetInformation />}
                                  />
                                  <Route
                                    path="/adminmaintenance"
                                    exact
                                    element={<Maintenance />}
                                  />
                                  <Route
                                    path="/admininspection"
                                    exact
                                    element={<Inspection />}
                                  />
                                  <Route
                                    path="/admintrips"
                                    exact
                                    element={<Trips />}
                                  />
                                  <Route
                                    path="/adminjoborders"
                                    exact
                                    element={<JobOrderSystem />}
                                  />
                                  <Route
                                    path="/admindeliverymonitoring"
                                    exact
                                    element={<DeliveryMonitoring />}
                                  />

                                  <Route
                                    path="/admindrivermanagement"
                                    exact
                                    element={<NewDriverManagement />}
                                  />
                                  <Route
                                    path="/adminmanageappointments"
                                    exact
                                    element={<ManageAppointments />}
                                  />
                                  <Route
                                    path="/adminmanageorders"
                                    exact
                                    element={<NewManageOrders />}
                                  />
                                  <Route
                                    path="/admininventory"
                                    exact
                                    element={<Inventory />}
                                  />
                                  <Route
                                    path="/admincontent"
                                    exact
                                    element={<Content />}
                                  />
                                  <Route
                                    path="/adminusermanagement"
                                    exact
                                    element={<NewUserManagement />}
                                  />
                                  <Route
                                    path="/adminmanagecontactform"
                                    exact
                                    element={<ManageContactForm />}
                                  />
                                  <Route
                                    path="/adminlistings"
                                    exact
                                    element={<Listings />}
                                  />
                                </Routes>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    )}
                </React.Fragment>
              ) : (
                <Navigate to="/adminlogin" replace />
              )
            }
          />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </Router>
    </div>
  );
}

export default AdminApp;
