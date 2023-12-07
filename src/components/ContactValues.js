import * as React from "react";
import { Avatar, Button } from "@mui/material";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "../components/common/Typography";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CurvyLines from "../assets/appCurvyLines.webp";
import { fetchContactData } from "../components/cms";

const item = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  px: 5,
};
const contactData = await fetchContactData();

function ContactValues() {
  return (
    <Box component="section" sx={{ display: "flex", overflow: "hidden" }}>
      <Container sx={{ mt: 10, mb: 15, display: "flex", position: "relative" }}>
        <Box
          component="img"
          src={CurvyLines} // Use the imported image here
          alt="curvy lines"
          sx={{ pointerEvents: "none", position: "absolute", top: -180 }}
        />

        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Avatar
                style={{
                  backgroundColor: "#EBDAB7",
                  height: "70px",
                  width: "70px",
                }}
              >
                <LocationOnOutlinedIcon
                  fontSize="large"
                  style={{ color: "#bd8512" }}
                />
              </Avatar>
              <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>
                Locations
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ textAlign: "center" }}
              >
                Main Branch:
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ textAlign: "center", marginBottom: 16 }}
              >
                {contactData._address2}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ textAlign: "center" }}
              >
                Satellite Branch:
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ textAlign: "center" }}
              >
                {contactData._address1}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Avatar
                style={{
                  backgroundColor: "#EBDAB7",
                  height: "70px",
                  width: "70px",
                }}
              >
                <LocalPhoneOutlinedIcon
                  fontSize="large"
                  style={{ color: "#bd8512" }}
                />
              </Avatar>
              <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>
                Contact Numbers
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ textAlign: "center" }}
              >
                Globe:
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ textAlign: "center", marginBottom: 16 }}
              >
                {contactData._phone1}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ textAlign: "center" }}
              >
                Smart:
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ textAlign: "center", marginBottom: 16 }}
              >
                {contactData._phone2}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ textAlign: "center" }}
              >
                Landline:
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ textAlign: "center", marginBottom: 16 }}
              >
                {contactData._landline}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Avatar
                style={{
                  backgroundColor: "#EBDAB7",
                  height: "70px",
                  width: "70px",
                }}
              >
                <EmailOutlinedIcon
                  fontSize="large"
                  style={{ color: "#bd8512" }}
                />
              </Avatar>
              <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>
                Email
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ textAlign: "center" }}
              >
                {contactData._email}
              </Typography>
              <a href="mailto:jmiggravelandsand@gmail.com">
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                  }}
                >
                  Email Us
                </Button>
              </a>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ContactValues;
