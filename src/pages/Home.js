import * as React from "react";
import ProductCategories from "../components/ProductCategories";
import ProductSmokingHero from "../components/ProductSmokingHero";
import ProductHero from "../components/ProductHero";
import ProductValues from "../components/ProductValues";
import ProductHowItWorks from "../components/ProductHowItWorks";
import ProductCTA from "../components/ProductCTA";

function Home() {
  window.scrollTo({ top: 0 });
  return (
    <div>
      <ProductHero />
      <ProductValues />
      <ProductCategories />
      <ProductHowItWorks />
      <ProductCTA />
      <ProductSmokingHero />
    </div>
  );
}

export default Home;
