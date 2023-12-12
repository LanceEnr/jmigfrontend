import React, { useState, useEffect } from "react";
import axios from "axios";
import Typography from "../../components/common/Typography";
import {
  Grid,
  Paper,
  Box,
  useMediaQuery,
  List,
  Button,
  TextField,
  IconButton,
  Divider,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import AdminProfileCard from "./components/AdminProfileCard";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"; // Import the PhotoCameraIcon
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { fetchProfilePic2 } from "../../components/cms";

const filename = "";
try {
  const storedUsername = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("adminUsername="))
    ?.split("=")[1];

  const valuesData = await fetchProfilePic2(storedUsername);

  if (valuesData) {
    const imagePath = valuesData._profilePicture;
  }
} catch (error) {
  console.error("Error during fetchProfilePic:", error);
}

export default function AdminProfileInfo(props) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInputType, setPasswordInputType] = useState("password");
  const uname = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("adminUsername="))
    ?.split("=")[1];

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
      setDialogOpen(true);
    }
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleConfirmChange = async (event) => {
    event.preventDefault();
    console.log(userName);
    const formData = new FormData();
    formData.append("_userName", uname);
    formData.append("image", uploadedImage);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/update-user-profilepic2`,
        formData
      );

      toast.success("Profile picture changed successfully!");

      console.log("Profile picture changed successfully ", response.data);
    } catch (error) {
      toast.error("Error submitting picture");
      console.error("Error submitting picture:", error);
    }
    setDialogOpen(false);
  };

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
    setPasswordInputType(showPassword ? "password" : "text");
  };

  const [userData, setUserData] = useState({
    userName: "", // You should set the username here
    Phone: "",
    Address: "",
    CurrentPassword: "",
    NewPassword: "",
  });
  useEffect(() => {
    const storedUsername = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("adminUsername="))
      ?.split("=")[1];

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/setuser2?userName=${storedUsername}`
      )
      .then((response) => {
        if (response.data.length > 0) {
          const user = response.data[0];

          setUserData({
            userName: user.Username,
            Phone: user.Phone,
            Address: user.Address,
            fName: user.fName,
            lName: user.lName,
            address: user.address,
            CurrentPassword: "",
            NewPassword: "",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const profile = {
    name: userData.fName + " " + userData.lName,
    city: userData.address,
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handlePasswordChange = () => {
    const userName = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("adminUsername="))
      ?.split("=")[1];

    const { CurrentPassword, NewPassword } = userData;

    axios
      .post(`${process.env.REACT_APP_API_URL}/changepassword2`, {
        userName,
        currentPassword: CurrentPassword,
        newPassword: NewPassword,
      })
      .then((response) => {
        const lowercaseRegex = /[a-z]/;
        const uppercaseRegex = /[A-Z]/;
        const digitRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;

        if (NewPassword.length < 8) {
          toast.error("New Password must be at least 8 characters long");
          return;
        }
        if (!lowercaseRegex.test(NewPassword)) {
          toast.error("New Password must contain a lowercase character");
          return;
        }
        if (!uppercaseRegex.test(NewPassword)) {
          toast.error("New Password must contain an uppercase character");
          return;
        }
        if (!digitRegex.test(NewPassword)) {
          toast.error("New Password must contain a number");
          return;
        }
        if (!specialCharRegex.test(NewPassword)) {
          toast.error("New Password must contain a special character");
          return;
        }
        toast.success("New Password updated successfully");
        setUserData({ ...userData, NewPassword: "", CurrentPassword: "" });
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          toast.error("Incorrect current password");
        } else {
          toast.error("Error updating password");
        }
        setUserData({ ...userData, NewPassword: "", CurrentPassword: "" });
      });
  };

  const handlePhoneAddressChange = () => {
    const userName = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("adminUsername="))
      ?.split("=")[1];

    const { Phone, Address } = userData;
    const phoneNumberRegex = /^(09|\+639)\d{9}$/;
    if (!phoneNumberRegex.test(Phone)) {
      toast.error("Invalid Philippine phone number format");
      return;
    }

    axios
      .post(`${process.env.REACT_APP_API_URL}/updatephoneaddress2`, {
        userName,
        phone: Phone,
        address: Address,
      })
      .then((response) => {
        toast.success("Phone and address updated successfully");
        console.log("Phone and address updated successfully");
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating phone and address:", error);
      });
  };
  const userName = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("adminUsername="))
    ?.split("=")[1];

  return (
    <Box sx={{ my: 8, mx: 6 }}>
      <Typography
        variant="h3"
        marked="left"
        style={{ fontWeight: "bold", fontSize: "30px" }}
        gutterBottom
      >
        Admin Profile
      </Typography>
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Edit Profile
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  name="Username"
                  value={userData.userName}
                  fullWidth
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone"
                  name="Phone"
                  value={userData.Phone}
                  fullWidth
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={handlePhoneAddressChange} // Call the appropriate function here
                >
                  Save User Details
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Change Password
                </Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  label="Current Password"
                  name="CurrentPassword"
                  type="password"
                  value={userData.CurrentPassword}
                  fullWidth
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  label="New Password"
                  name="NewPassword"
                  type={passwordInputType}
                  value={userData.NewPassword}
                  fullWidth
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleShowPasswordToggle}
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={handlePasswordChange} // Call the appropriate function here
                >
                  Save changes
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} order={{ xs: -1, md: 0 }}>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <AdminProfileCard profile={profile} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Change Profile Picture</DialogTitle>
        <DialogContent>
          <Typography>Do you want to change your profile picture?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleConfirmChange} variant="contained">
            Yes, Change
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
