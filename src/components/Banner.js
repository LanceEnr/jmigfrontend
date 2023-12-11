import React from "react";
import "../styles/Banner.css";
import Typography from "./common/Typography";
import { toast } from "react-toastify";

const Banner = ({ bannerImage, title, text }) => {
  const image = bannerImage;
  return (
    <div
      className="aboutImage"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${image})`,
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        marked="center"
        style={{ fontWeight: "bold" }}
        gutterBottom
      >
        {title}
      </Typography>
    </div>
  );
};

export default Banner;
