import React, { useReducer, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Box, Toolbar, Grid } from "@mui/material";
import authReducer from "./store/reducers/authReducer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy loading the components
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminRegister = lazy(() => import("./pages/admin/AdminRegister"));
const AdminForgotPassword = lazy(() =>
  import("./pages/admin/AdminForgotPassword")
);
const AdminProfileInfo = lazy(() => import("./pages/admin/AdminProfileInfo"));
const NewFleetInformation = lazy(() =>
  import("./pages/admin/NewFleetInformation")
);
const Maintenance = lazy(() => import("./pages/admin/Maintenance"));
const Inspection = lazy(() => import("./pages/admin/Inspection"));
const Trips = lazy(() => import("./pages/admin/Trips"));
const JobOrderSystem = lazy(() => import("./pages/admin/JobOrderSystem"));
const DeliveryMonitoring = lazy(() =>
  import("./pages/admin/DeliveryMonitoring")
);
const ManageAppointments = lazy(() =>
  import("./pages/admin/ManageAppointments")
);
const Inventory = lazy(() => import("./pages/admin/Inventory"));
const Content = lazy(() => import("./pages/admin/Content"));
const ManageContactForm = lazy(() => import("./pages/admin/ManageContactForm"));
const Listings = lazy(() => import("./pages/admin/Listings"));
const AddFleet = lazy(() => import("./pages/admin/components/AddFleet"));
const EditFleet = lazy(() => import("./pages/admin/components/EditFleet"));
const AddMaintenanceScheduling = lazy(() =>
  import("./pages/admin/components/AddMaintenanceScheduling")
);
const EditMaintenanceScheduling = lazy(() =>
  import("./pages/admin/components/EditMaintenanceScheduling")
);
const EditMaintenanceRecord = lazy(() =>
  import("./pages/admin/components/EditMaintenanceRecord")
);
const AddInspection = lazy(() =>
  import("./pages/admin/components/AddInspection")
);
const EditInspection = lazy(() =>
  import("./pages/admin/components/EditInspection")
);
const NewDriverManagement = lazy(() =>
  import("./pages/admin/NewDriverManagement")
);
const AddDriver = lazy(() => import("./pages/admin/components/AddDriver"));
const EditDriver = lazy(() => import("./pages/admin/components/EditDriver"));
const NewManageOrders = lazy(() =>
  import("./pages/admin/components/NewManageOrders")
);
const AddOrder = lazy(() => import("./pages/admin/components/AddOrder"));
const EditOrder = lazy(() => import("./pages/admin/components/EditOrder"));
const AddCurrent = lazy(() => import("./pages/admin/components/AddCurrent"));
const EditCurrent = lazy(() => import("./pages/admin/components/EditCurrent"));
const AddFaq = lazy(() => import("./pages/admin/components/AddFaq"));
const EditFaq = lazy(() => import("./pages/admin/components/EditFaq"));
const NewUserManagement = lazy(() =>
  import("./pages/admin/components/NewUserManagement")
);
const RandomStringGenerator = lazy(() =>
  import("./pages/admin/components/RandomStringGenerator")
);
const AdminHomepage = lazy(() => import("./pages/admin/AdminHomepage"));
const TripMetricsReport = lazy(() =>
  import("./pages/admin/components/TripMetricsReport")
);
const DriversReport = lazy(() =>
  import("./pages/admin/components/DriversReport")
);
const CurrenInventoryReport = lazy(() =>
  import("./pages/admin/components/CurrentInventoryReport")
);

const isAdminTokenExists = document.cookie
  .split("; ")
  .some((cookie) => cookie.startsWith("adminToken="));

const initialState = {
  isAuthenticated: isAdminTokenExists,
};

function AdminApp() {
  const [authState, authDispatch] = useReducer(authReducer, initialState);
  const isAuthenticated = authState.isAuthenticated;

  const handleLogout = () => {
    // Remove the adminToken cookie
    document.cookie =
      "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Strict";

    // Dispatch the logout action
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
