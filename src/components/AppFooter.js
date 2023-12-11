import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import Typography from "../components/common/Typography";
import Avatar from "@mui/material/Avatar";
import LogoGravasend from "../assets/LogoGravasend.webp";
import axios from "axios";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import MapsUgcOutlinedIcon from "@mui/icons-material/MapsUgcOutlined";

async function fetchContactData() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-contact`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching contact:", error);
    throw error;
  }
}

function Copyright() {
  return (
    <React.Fragment>
      {"© "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

const iconStyle = {
  width: 48,
  height: 48,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "warning.main",
  mr: 1,
  "&:hover": {
    bgcolor: "warning.dark",
  },
};
const contactData = await fetchContactData();

const LANGUAGES = [
  {
    code: "en-US",
    name: "English",
  },
  {
    code: "fr-FR",
    name: "Français",
  },
];

export default function AppFooter() {
  return (
    <Typography
      component="footer"
      sx={{
        display: "flex",
        bgcolor: "#EAECEA",
      }}
    >
      <Container sx={{ my: 8, display: "flex" }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6} md={3} sx={{ mr: 4, pb: { xs: 3, md: 0 } }}>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
              sx={{ height: 120 }}
            >
              <Grid item sx={{ display: "flex" }}>
                <a href="/">
                  <img
                    src={LogoGravasend}
                    alt="Logo"
                    style={{
                      width: "125px",
                      height: "auto",
                      display: { xs: "flex", md: "flex" },
                    }}
                  />
                </a>
              </Grid>

              <Grid item>
                <Typography variant="caption">
                  Supplying the highest quality gravel and sand for all your
                  construction needs. Just a few clicks away from delivery to
                  your site.
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={3} md={2}>
            <Typography
              variant="h6"
              marked="left"
              style={{
                fontSize: "16px",
                fontWeight: "bold",
              }}
              gutterBottom
            >
              ABOUT US
            </Typography>
            <Box component="ul" sx={{ m: 0, listStyle: "none", p: 0 }}>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link href="/about" underline="none">
                  <Typography color="textPrimary" variant="caption">
                    About
                  </Typography>
                </Link>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link href="/faqs" underline="none">
                  <Typography color="textPrimary" variant="caption">
                    FAQs
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <Typography
              variant="h6"
              marked="left"
              style={{ fontSize: "16px", fontWeight: "bold" }}
              gutterBottom
            >
              NAVIGATION
            </Typography>
            <Box component="ul" sx={{ m: 0, listStyle: "none", p: 0 }}>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link href="/" underline="none">
                  <Typography color="textPrimary" variant="caption">
                    Home
                  </Typography>
                </Link>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link href="/products" underline="none">
                  <Typography color="textPrimary" variant="caption">
                    Products
                  </Typography>
                </Link>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link href="/services" underline="none">
                  <Typography color="textPrimary" variant="caption">
                    Services
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              marked="left"
              style={{ fontSize: "16px", fontWeight: "bold" }}
              gutterBottom
            >
              CONTACT US
            </Typography>
            <Box component="ul" sx={{ m: 0, listStyle: "none", p: 0 }}>
              <Box component="li" sx={{ py: 0.5 }}>
                <Typography variant="caption">
                  {contactData._address1}
                </Typography>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <Typography variant="caption">{contactData._email}</Typography>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <Typography variant="caption">
                  {contactData._landline}
                </Typography>
              </Box>
              <Box
                component="li"
                sx={{
                  py: 0.5,
                  display: "flex", // Add this line
                }}
              >
                <a href="https://your-external-link.com">
                  {" "}
                  <Avatar
                    sx={{
                      backgroundColor: "#EBDAB7",
                      marginRight: 1,
                      width: {
                        xs: "16px", // Width for extra small screens (mobile)
                        sm: "30px", // Width for small screens and above
                      },
                      height: {
                        xs: "16px", // Height for extra small screens (mobile)
                        sm: "30px", // Height for small screens and above
                      },
                    }}
                  >
                    <FacebookOutlinedIcon
                      style={{ color: "#bd8512", fontSize: "16px" }}
                    />
                  </Avatar>
                </a>
                <a href="https://your-external-link.com">
                  {" "}
                  <Avatar
                    sx={{
                      backgroundColor: "#EBDAB7",
                      marginRight: 1,
                      width: {
                        xs: "16px", // Width for extra small screens (mobile)
                        sm: "30px", // Width for small screens and above
                      },
                      height: {
                        xs: "16px", // Height for extra small screens (mobile)
                        sm: "30px", // Height for small screens and above
                      },
                    }}
                  >
                    <MapsUgcOutlinedIcon
                      style={{ color: "#bd8512", fontSize: "16px" }}
                    />
                  </Avatar>
                </a>
              </Box>
            </Box>
          </Grid>

          <Grid item>
            <Typography variant="caption">
              {"© "}
              <Link color="inherit" href="/">
                JMIG Gravel and Sand Supply
              </Link>{" "}
              {new Date().getFullYear()}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}
