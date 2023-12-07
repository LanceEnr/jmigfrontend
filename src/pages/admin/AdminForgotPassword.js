import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "../../components/common/Typography";
import Container from "@mui/material/Container";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles"; // Import makeStyles for custom styles
import BannerImage from "../../assets/choose.webp";
import EnterOTP from "../../components/EnterOtp";

const useStyles = makeStyles((theme) => ({
  signin: {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${BannerImage})`,
    backgroundSize: "cover",
    minHeight: "100vh",
  },
}));

export default function ForgotPassword() {
  const classes = useStyles(); // Add Material-UI styles
  const [_email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin-check-email`,
        {
          _email: _email,
        }
      );

      if (response.data.exists === true) {
        const otpResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/admin-send-otp`,
          {
            _email: _email,
          }
        );

        if (otpResponse.data.success) {
          toast.success("OTP sent to your email.");
          setOtpSent(true);
          setOtp(otpResponse.data.otp);
        } else {
          toast.error("Failed to send OTP.");
        }
      } else {
        toast.error("Email not found.");
        setEmail("");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const theme = useTheme();

  return (
    <div className={classes.signin}>
      <Container maxWidth="sm" sx={{ pt: 8, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontSize: "30px", fontWeight: "bold" }}
            gutterBottom
            marked="center"
            align="center"
          >
            RESET PASSWORD
          </Typography>
          {message && (
            <Typography variant="body1" color="textSecondary">
              {message}
            </Typography>
          )}
          {!otpSent ? (
            <>
              <Typography align="center">
                {"Changed your mind? "}
                <Link to="/adminlogin" align="center" className="link">
                  Login here
                </Link>
              </Typography>

              <Box
                component="form"
                noValidate
                onSubmit={handleEmailSubmit}
                sx={{ mt: 3, width: "100%" }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      type="email"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="_email"
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, backgroundColor: "#83948a" }}
                >
                  Send OTP
                </Button>
              </Box>
            </>
          ) : (
            <EnterOTP email={_email} otp={otp} />
          )}
          <Grid container justifyContent="flex-end"></Grid>
        </Box>
      </Container>
    </div>
  );
}
