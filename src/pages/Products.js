// Products.js
import React from "react";
import { MenuList } from "../helpers/MenuList";
import ProductList from "../components/ProductList";
import { Box } from "@mui/material";
import ProductSmokingHero from "../components/ProductSmokingHero";
import ProductBanner from "../components/ProductBanner";

function Products() {
  window.scrollTo({ top: 0 });
  return (
    <Box>
      <div id="product-list-section">
        <ProductBanner />
        <ProductList cards={MenuList} />
      </div>
      <ProductSmokingHero />
    </Box>
  );
}

export default Products;
