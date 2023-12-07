import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const ProductBannerLayoutRoot = styled("section")(({ theme }) => ({
  color: theme.palette.common.white,
  position: "relative",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    height: "50vh",
    minHeight: 500,
    maxHeight: 1300,
  },
}));

const Background = styled(Box)({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  zIndex: -2,
});

function ProductBannerLayout(props) {
  const { sxBackground, children } = props;

  return (
    <ProductBannerLayoutRoot>
      <Container
        sx={{
          mt: 3,
          mb: 7,
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
        }}
      >
        {children}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "#EBDAB7",
            opacity: 0.5,
            zIndex: -1,
          }}
        />
        <Background sx={sxBackground} />
      </Container>
    </ProductBannerLayoutRoot>
  );
}

ProductBannerLayout.propTypes = {
  children: PropTypes.node,
  sxBackground: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

export default ProductBannerLayout;
