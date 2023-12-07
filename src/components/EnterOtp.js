import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ChangePassword from "./ChangePassword"; // Import the ChangePassword component
import { toast } from "react-toastify";

export default function EnterOTP({
  email,
  otp: initialOtp = "",
  onPasswordReset,
}) {
  const [otp, setOTP] = useState("");
  const [message, setMessage] = useState("");
  const [resetInProgress, setResetInProgress] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otpVerified, setOtpVerified] = useState(false); // New state for OTP verification

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  const handleResendOTP = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/send-otp`,
        {
          _email: email,
        }
      );
      if (response.data.success) {
        setMessage("OTP sent to your email. Check your spam folder too.");
        setOTP(response.data.otp);
        setResendDisabled(true);
        setTimer(60);
      } else {
        toast.error("Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send OTP.");
    }
  };

  const handleOTPSubmit = async (event) => {
    event.preventDefault();
    setResetInProgress(true);

    try {
      // Check if the entered OTP matches the stored OTP
      if (otp === initialOtp) {
        toast.success("OTP verified successfully.");
        setOtpVerified(true); // Set OTP verification state to true
        onPasswordReset(); // Callback to inform the parent component
      } else {
        toast.error("Incorrect OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
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
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography
        component="h1"
        variant="h5"
        sx={{ color: "#83948a", fontWeight: "bold" }}
      >
        Verify OTP
      </Typography>
      {message && (
        <Typography variant="body1" color="textSecondary">
          {message}
        </Typography>
      )}
      {!otpVerified ? ( // Render OTP verification form if OTP is not verified
        <>
          <Typography variant="body1" color="textSecondary">
            Enter the OTP sent to your email.
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleOTPSubmit}
            sx={{ mt: 3, width: "100%" }}
          >
            <TextField
              type="text"
              required
              fullWidth
              id="otp"
              label="OTP"
              name="otp"
              autoComplete="otp"
              onChange={(e) => setOTP(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#83948a" }}
              disabled={resetInProgress}
            >
              Verify OTP
            </Button>
          </Box>
          <Typography variant="body2" color="textSecondary">
            Did not receive OTP?{" "}
            {resendDisabled && `Resend OTP in ${timer} seconds.`}
            {!resendDisabled && (
              <Button
                variant="text"
                onClick={handleResendOTP}
                sx={{ color: "#83948a" }}
              >
                Resend OTP
              </Button>
            )}
          </Typography>
        </>
      ) : (
        <ChangePassword email={email} /> // Render ChangePassword component if OTP is verified
      )}
    </Box>
  );
}
