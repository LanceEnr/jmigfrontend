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
      <Router basename="/">
        <Routes>
          <Route
            path="/adminlogin"
            element={
              <React.Fragment>
                <AdminLogin dispatch={authDispatch} />
              </React.Fragment>
            }
          />
          <Route
            path="/adminregister"
            element={
              <React.Fragment>
                <AdminRegister />
              </React.Fragment>
            }
          />
          <Route
            path="/adminForgotPassword"
            element={
              <React.Fragment>
                <AdminForgotPassword />
              </React.Fragment>
            }
          />
          <Route
            path="/*"
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
                                    element={<CurrenInventoryReport />}
                                  />

                                  <Route
                                    path="/admindriversreport"
                                    element={<DriversReport />}
                                  />
                                  <Route
                                    path="/admintripmetricsreport"
                                    element={<TripMetricsReport />}
                                  />
                                  <Route
                                    path="/adminhome"
                                    element={<AdminHomepage />}
                                  />
                                  <Route
                                    path="/adminaccesscodes"
                                    element={<RandomStringGenerator />}
                                  />
                                  <Route
                                    path="/adminprofileinfo"
                                    element={<AdminProfileInfo />}
                                  />
                                  <Route
                                    path="/adminforgotpassword"
                                    element={<AdminForgotPassword />}
                                  />

                                  <Route
                                    path="/adminregister"
                                    element={<AdminRegister />}
                                  />

                                  <Route
                                    path="/adminlogin"
                                    element={
                                      <AdminLogin dispatch={authDispatch} />
                                    }
                                  />

                                  <Route
                                    path="/admineditfaq"
                                    element={<EditFaq />}
                                  />

                                  <Route
                                    path="/adminaddfaq"
                                    element={<AddFaq />}
                                  />
                                  <Route
                                    path="/admineditcurrent"
                                    element={<EditCurrent />}
                                  />
                                  <Route
                                    path="/adminaddcurrent"
                                    element={<AddCurrent />}
                                  />
                                  <Route
                                    path="/admineditorder"
                                    element={<EditOrder />}
                                  />

                                  <Route
                                    path="/adminaddorder"
                                    element={<AddOrder />}
                                  />
                                  <Route
                                    path="/admineditdriver"
                                    element={<EditDriver />}
                                  />
                                  <Route
                                    path="/adminadddriver"
                                    element={<AddDriver />}
                                  />
                                  <Route
                                    path="/adminaddinspection"
                                    element={<AddInspection />}
                                  />
                                  <Route
                                    path="/admineditinspection"
                                    element={<EditInspection />}
                                  />
                                  <Route
                                    path="/adminaddmaintenancescheduling"
                                    element={<AddMaintenanceScheduling />}
                                  />
                                  <Route
                                    path="/admineditmaintenancescheduling"
                                    element={<EditMaintenanceScheduling />}
                                  />
                                  <Route
                                    path="/admineditmaintenancerecord"
                                    element={<EditMaintenanceRecord />}
                                  />
                                  <Route
                                    path="/adminaddfleet"
                                    element={<AddFleet />}
                                  />
                                  <Route
                                    path="/admineditfleet"
                                    element={<EditFleet />}
                                  />
                                  <Route
                                    path="/adminprofileinfo"
                                    element={<AdminProfileInfo />}
                                  />
                                  <Route
                                    path="/adminfleetinformation"
                                    element={<NewFleetInformation />}
                                  />
                                  <Route
                                    path="/adminmaintenance"
                                    element={<Maintenance />}
                                  />
                                  <Route
                                    path="/admininspection"
                                    element={<Inspection />}
                                  />
                                  <Route
                                    path="/admintrips"
                                    element={<Trips />}
                                  />
                                  <Route
                                    path="/adminjoborders"
                                    element={<JobOrderSystem />}
                                  />
                                  <Route
                                    path="/admindeliverymonitoring"
                                    element={<DeliveryMonitoring />}
                                  />

                                  <Route
                                    path="/admindrivermanagement"
                                    element={<NewDriverManagement />}
                                  />
                                  <Route
                                    path="/adminmanageappointments"
                                    element={<ManageAppointments />}
                                  />
                                  <Route
                                    path="/adminmanageorders"
                                    element={<NewManageOrders />}
                                  />
                                  <Route
                                    path="/admininventory"
                                    element={<Inventory />}
                                  />
                                  <Route
                                    path="/admincontent"
                                    element={<Content />}
                                  />
                                  <Route
                                    path="/adminusermanagement"
                                    element={<NewUserManagement />}
                                  />
                                  <Route
                                    path="/adminmanagecontactform"
                                    element={<ManageContactForm />}
                                  />
                                  <Route
                                    path="/adminlistings"
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
