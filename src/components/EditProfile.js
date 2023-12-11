import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
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
import UserDrawer from "./common/UserDrawer";
import { toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import ProfileCard from "./common/ProfileCard";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"; // Import the PhotoCameraIcon
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { fetchProfilePic } from "../components/cms";

const storedUsername = localStorage.getItem("userName");
const valuesData = await fetchProfilePic(storedUsername);
const imagePath = valuesData._profilePicture;
//const filename = imagePath.substring(imagePath.lastIndexOf("\\") + 1);

export default function ProfileInfo(props) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInputType, setPasswordInputType] = useState("password");

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

  const storedUsername = localStorage.getItem("userName");

  const handleConfirmChange = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("_userName", storedUsername);
    formData.append("image", uploadedImage);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/update-user-profilepic`,
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
    const storedUsername = localStorage.getItem("userName");
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/setuser?userName=${storedUsername}`
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
    const userName = localStorage.getItem("userName");
    const { CurrentPassword, NewPassword } = userData;

    axios
      .post(`${process.env.REACT_APP_API_URL}/changepassword`, {
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
        toast.success("New Password updated successfully", {
          autoClose: 50,
          onClose: () => {
            window.location.reload();
          },
        });
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
    const userName = localStorage.getItem("userName");
    const { Phone, Address } = userData;
    const phoneNumberRegex = /^(09|\+639)\d{9}$/;
    if (!phoneNumberRegex.test(Phone)) {
      toast.error("Invalid Philippine phone number format");
      return;
    }

    axios
      .post(`${process.env.REACT_APP_API_URL}/updatephoneaddress`, {
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
  const userName = localStorage.getItem("userName");
  return (
    <List
      sx={{
        px: 0,
        py: 0,
        marginBottom: 1,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          component="h1"
          variant="h5"
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            my: 2,
          }}
        >
          <AccountCircleIcon
            sx={{ color: "#83948a", mr: 2, verticalAlign: "middle" }}
          />
          User Profile
        </Typography>
        {isMobile && (
          <UserDrawer onActiveComponentChange={props.onActiveComponentChange} />
        )}
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} style={{ padding: "24px" }}>
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
                <TextField
                  label="Address"
                  name="Address"
                  value={userData.Address}
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
              <ProfileCard profile={profile} />
            </Grid>
            <Grid item>
              <Paper elevation={2} style={{ padding: "24px" }}>
                <Grid container alignItems="center">
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Select Profile Photo
                    </Typography>
                  </Grid>
                  <Grid container item xs={12} sx={{ mt: 2 }}>
                    <Grid item xs={3}>
                      <Avatar
                        alt={profile.name}
                        src={imagePath}
                        //src={ProfilePic}
                        sx={{
                          width: 40,
                          height: 40,
                        }}
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <input
                        type="file"
                        id="upload-button"
                        accept=".webp, .img, .png, .jpg"
                        style={{ display: "none" }}
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="upload-button">
                        <Button
                          variant="contained"
                          startIcon={<PhotoCameraIcon />}
                          component="span"
                        >
                          Upload
                        </Button>
                      </label>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
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
    </List>
  );
}
