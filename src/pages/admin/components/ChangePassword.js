import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

export default function ChangePassword({ email }) {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInputType, setPasswordInputType] = useState("password");
  const [resetInProgress, setResetInProgress] = useState(false);
  const [message, setMessage] = useState("");
  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
    setPasswordInputType(showPassword ? "password" : "text");
  };

  const handleResetPasswordSubmit = async (event) => {
    event.preventDefault();
    setResetInProgress(true);
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const digitRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (!lowercaseRegex.test(newPassword)) {
      toast.error("Password must contain an lowercase character");
      return;
    }
    if (!uppercaseRegex.test(newPassword)) {
      toast.error("Password must contain an uppercase character");
      return;
    }
    if (!digitRegex.test(newPassword)) {
      toast.error("Password must contain a number");
      return;
    }
    if (!specialCharRegex.test(newPassword)) {
      toast.error("Password must contain a special character");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin-reset-password`,
        {
          email,
          newPassword,
        }
      );
      if (response.data.success) {
        toast.success("Password reset successfully", {
          autoClose: 50,
          onClose: () => {
            navigate("/adminLogin");
          },
        });
      } else {
        toast.error("Failed to reset password.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to reset password.");
    } finally {
      setResetInProgress(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: 3,
        borderRadius: 2,
        px: 4,
        py: 6,
        backgroundColor: "#f9f9f9", // Customize background color
      }}
    >
      <Typography
        component="h1"
        variant="h5"
        sx={{ color: "#83948a", fontWeight: "bold" }}
      >
        Change Password
      </Typography>
      {message && (
        <Typography variant="body1" color="textSecondary">
          {message}
        </Typography>
      )}
      <Typography variant="body1" color="textSecondary">
        Enter your new password.
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleResetPasswordSubmit}
        sx={{ mt: 3, width: "100%" }}
      >
        <TextField
          type={passwordInputType}
          required
          fullWidth
          id="newPassword"
          label="New Password"
          name="newPassword"
          autoComplete="new-password"
          onChange={(e) => setNewPassword(e.target.value)}
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, backgroundColor: "#83948a" }}
        >
          Reset Password
        </Button>
      </Box>
    </Box>
  );
}
