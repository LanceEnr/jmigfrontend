import React from "react";
import { Container, Grid } from "@mui/material";
import MyCard from "../components/ProductCard";

const ProductList = ({ cards }) => (
  <Container sx={{ py: 3 }} maxWidth="lg">
    <Grid container spacing={3}>
      {cards.map((card) => (
        <MyCard card={card} />
      ))}
    </Grid>
  </Container>
);

export default ProductList;
