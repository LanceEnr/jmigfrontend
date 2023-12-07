import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import rootReducer from "./store/reducers/authReducer";
import App from "./App";
import AdminApp from "./AdminApp";
import reportWebVitals from "./reportWebVitals";

const store = createStore(rootReducer);
const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
  components: {
    MuiButton: {
      defaultProps: {
        color: "primary",
      },
      styleOverrides: {
        contained: {
          backgroundColor: "#83948a",
          "&:hover": {
            backgroundColor: "#6d7f71",
          },
          "&:active": {
            backgroundColor: "#5b6a58",
          },
          "&.MuiButton-warning": {
            backgroundColor: "#ff9800", // warning color
            "&:hover": {
              backgroundColor: "#f57c00", // darker warning color
            },
          },
          "&.MuiButton-error": {
            backgroundColor: "#f44336", // error color
            "&:hover": {
              backgroundColor: "#d32f2f", // darker error color
            },
          },
          "&.MuiButton-success": {
            backgroundColor: "#4caf50", // success color
            "&:hover": {
              backgroundColor: "#388e3c", // darker success color
            },
          },
        },
        outlined: {
          borderColor: "#83948a",
          "&:hover": {
            borderColor: "#aebcbf",
          },
          "&:active": {
            borderColor: "#aebcbf",
          },
          "&.MuiButton-warning": {
            borderColor: "#ff9800", // warning color
            "&:hover": {
              borderColor: "#f57c00", // darker warning color
            },
          },
          "&.MuiButton-error": {
            borderColor: "#f44336", // error color
            "&:hover": {
              borderColor: "#d32f2f", // darker error color
            },
          },
          "&.MuiButton-success": {
            borderColor: "#4caf50", // success color
            "&:hover": {
              borderColor: "#388e3c", // darker success color
            },
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#83948a",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#6d7f71",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#5b6a58",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#83948a",
          "&.Mui-focused": {
            color: "#5b6a58",
          },
        },
      },
    },
    MuiRadio: {
      defaultProps: {
        color: "primary",
      },
      styleOverrides: {
        root: {
          color: "#83948a",
          "&.Mui-checked": {
            color: "#5b6a58",
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#83948a",
    },
    secondary: {
      main: "#bd8512",
    },
  },
});

document.title = "JMIG Gravel and Sand Supply";
const shouldRenderAdminApp = window.location.pathname.startsWith("/admin");
console.log("shouldRenderAdminApp:", shouldRenderAdminApp);
console.log("working");

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        {shouldRenderAdminApp ? <AdminApp /> : <App />}
      </ThemeProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

reportWebVitals();
