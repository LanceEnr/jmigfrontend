import React from "react";
import { Grid } from "@mui/material";
import MyCard from "./ProductCard";

const MoreProducts = ({ cards }) => (
  <Grid container spacing={3}>
    {cards.slice(0, 4).map((card) => (
      <MyCard card={card} />
    ))}
  </Grid>
);
export default MoreProducts;
