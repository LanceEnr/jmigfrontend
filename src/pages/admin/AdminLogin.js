import React, { useState, useEffect } from "react";

import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "../../components/common/Typography";
import Container from "@mui/material/Container";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import GoogleReCAPTCHA from "react-google-recaptcha";
import BannerImage from "../../assets/choose.webp";
import { makeStyles } from "@mui/styles"; // Import makeStyles for custom styles
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  signin: {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${BannerImage})`,
    backgroundSize: "cover",
    minHeight: "100vh", // Set the minimum height to fill the screen
  },
}));

export default function AdminLogin({ dispatch }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordInputType, setPasswordInputType] = useState("password");
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };
  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
    setPasswordInputType(showPassword ? "password" : "text");
  };
  const [loginData, setLoginData] = useState({
    _userName: "",
    _pwd: "",
    rememberMe: false,
  });
  useEffect(() => {
    const rememberMeData = localStorage.getItem("rememberMeData");
    console.log("Remember Me Data from localStorage:", rememberMeData);
    if (rememberMeData) {
      setLoginData(JSON.parse(rememberMeData));
    }
  }, []);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };
  const handleRememberChange = () => {
    setRememberMe(!rememberMe);
    console.log("Remember Me State:", rememberMe);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!recaptchaValue) {
      toast.error("Please complete the reCAPTCHA challenge.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/adminLogin`,
        loginData
      );

      if (response.status === 200) {
        console.log("Login successful", response.data);
        const { adminToken, adminUsername } = response.data;
        localStorage.setItem("adminToken", adminToken);
        localStorage.setItem("adminUsername", adminUsername);

        if (loginData.rememberMe) {
          localStorage.setItem("rememberMeData", JSON.stringify(loginData));
        } else {
          localStorage.removeItem("rememberMeData");
        }

        toast.success("Login successful", {
          autoClose: 50,
          onClose: () => {
            navigate("/adminhome");
          },
        });
        dispatch({ type: "LOGIN" });
      } else {
        console.error("Login failed", response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Incorrect Login Credentials");
      }
      console.error("Login failed", error);
    }
  };

  const theme = useTheme();
  const classes = useStyles(); // Add Material-UI styles

  return (
    <div className={classes.signin}>
      <Container maxWidth="sm" sx={{ pt: 8, mb: 4 }}>
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
            <span style={{ color: "#bd8512" }}>ADMIN</span> SIGN IN
          </Typography>
          <Typography align="center">
            {"Not an admin yet? "}
            <Link to="/adminregister" align="center" className="link">
              Sign Up here
            </Link>
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="_userName"
              onChange={handleChange}
              value={loginData._userName}
              autoComplete="off"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="_pwd"
              onChange={handleChange}
              value={loginData._pwd}
              label="Password"
              type={passwordInputType}
              id="_pwd"
              autoComplete="current-password"
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
            <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
              <GoogleReCAPTCHA
                sitekey="6LdkquooAAAAAGeJmM27oPgcUtRcQZIGTof4VyY-"
                onChange={handleRecaptchaChange}
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  color="primary"
                  onChange={handleRememberChange}
                  checked={rememberMe}
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#83948a" }}
            >
              Login
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  to="/adminforgotpassword"
                  variant="caption"
                  className="link"
                >
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
