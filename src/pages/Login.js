import React, { useState, useEffect } from "react";

import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "../components/common/Typography";
import Container from "@mui/material/Container";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import GoogleReCAPTCHA from "react-google-recaptcha";
import BannerImage from "../assets/about.webp";
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

export default function Login({ dispatch }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordInputType, setPasswordInputType] = useState("password");
  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
    setPasswordInputType(showPassword ? "password" : "text");
  };
  const [loginData, setLoginData] = useState({
    _userName: "",
    _pwd: "",
    rememberMe: false,
  });
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  useEffect(() => {
    const cookies = document.cookie;
    const rememberMeCookie = cookies
      .split("; ")
      .find((cookie) => cookie.startsWith("rememberMe="));

    if (rememberMeCookie) {
      const rememberMeValue = rememberMeCookie.split("=")[1];
      setRememberMe(rememberMeValue === "true");
    }
  }, []);
  useEffect(() => {
    if (rememberMe && loginData._userName) {
      const storedPassword = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith(`${loginData._userName}=`))
        ?.split("=")[1];

      if (storedPassword) {
        setLoginData({ ...loginData, _pwd: storedPassword });
      }
    }
  }, [loginData._userName, rememberMe]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };
  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };
  const handleRememberChange = () => {
    setRememberMe(!rememberMe);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!recaptchaValue) {
      toast.error("Please complete the reCAPTCHA challenge.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        loginData
      );

      if (response.status === 200) {
        console.log("Login successful", response.data);
        const { token, userName } = response.data;
        console.log(userName);
        document.cookie = `token=${token}; Secure; SameSite=Strict`;
        document.cookie = `userName=${userName}; Secure; SameSite=Strict`;

        if (rememberMe && loginData._userName) {
          document.cookie = `${loginData._userName}=${loginData._pwd}; Secure; SameSite=Strict`;
        }

        document.cookie = `rememberMe=${loginData.rememberMe}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;

        toast.success("Login successful", {
          autoClose: 50,
          onClose: () => {
            navigate("/Dashboard");
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
            SIGN IN
          </Typography>
          <Typography align="center">
            {"Not a member yet? "}
            <Link to="/register" align="center" className="link">
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
              id="_userName"
              label="Username"
              name="_userName"
              onChange={handleChange}
              value={loginData._userName}
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
                <Link to="/forgotpassword" variant="caption" className="link">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/" variant="caption" className="link">
                  Go back to home
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
