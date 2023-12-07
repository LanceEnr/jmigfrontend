import * as React from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Avatar, IconButton } from "@mui/material";
import Typography from "../components/common/Typography";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";

function ProductSmokingHero() {
  return (
    <Container
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 9,
      }}
    >
      <Button
        component={Link}
        to={"/contact"}
        sx={{
          border: "4px solid #83948a",
          borderRadius: 0,
          height: "auto",
          py: 2,
          px: 5,
          borderRadius: 2,
          "&:hover, &:active": {
            backgroundColor: "#bdcac5", // lightest color of #83948a
          },
        }}
      >
        <Typography
          variant="h4"
          component="span"
          style={{ color: "#83948a", fontWeight: "bold" }}
        >
          Got any questions? Need help?
        </Typography>
      </Button>
      <Typography variant="subtitle1" sx={{ my: 3 }}>
        We are here to help. Get in touch!
      </Typography>
      <IconButton>
        <a href="tel:09054222988">
          <Avatar
            style={{
              backgroundColor: "#EBDAB7",
              height: "70px",
              width: "70px",
            }}
          >
            <CallOutlinedIcon fontSize="large" style={{ color: "#bd8512" }} />
          </Avatar>
        </a>
      </IconButton>
    </Container>
  );
}

export default ProductSmokingHero;
