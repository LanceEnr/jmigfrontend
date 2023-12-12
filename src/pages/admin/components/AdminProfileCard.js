import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import Divider from "@mui/material/Divider";
import CoverPhoto from "../../../assets/coverphoto.webp";

import { fetchProfilePic2 } from "../../../components/cms";

const storedUsername = document.cookie
  .split("; ")
  .find((cookie) => cookie.startsWith("adminUsername="))
  ?.split("=")[1];
const valuesData = await fetchProfilePic2(storedUsername);
//const imagePath = valuesData._profilePicture;
//const filename = imagePath.substring(imagePath.lastIndexOf("\\") + 1);
// try {
//   const valuesData = await fetchProfilePic2(storedUsername);
//   toast.error(valuesData);

//   if (valuesData) {
//     //const imagePath = valuesData._profilePicture;
//     //filename = imagePath.substring(imagePath.lastIndexOf("\\") + 1);
//     console.log(valuesData._profilePicture);
//   } else {
//     console.error("Error: Unable to fetch profile picture data");
//   }
// } catch (error) {
//   console.error("Error during fetchProfilePic:", error);
// }

const Img = styled("img")({
  height: "140px",
  width: "100%",
  objectFit: "cover",
});

export default function AdminProfileCard({ profile }) {
  const userName = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("adminUsername="))
    ?.split("=")[1];
  const [count, setCounts] = useState({
    totalOrders: "",
    totalAppointments: "",
  });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const inputRef = React.useRef();

  const handleConfirmChange = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("_userName", userName);
    formData.append("image", uploadedImage);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-user-profilepic2`,
        formData
      );

      toast.success("Profile picture changed successfully!");

      console.log("Profile picture changed successfully ", response.data);
    } catch (error) {
      toast.error("Error submitting picture");
      console.error("Error submitting picture:", error);
    }
    setDialogOpen(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
      setDialogOpen(true);
    }
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    const storedUsername = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("adminUsername="))
      ?.split("=")[1];
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/get-counts?userName=${storedUsername}`
      )
      .then((response) => {
        setCounts(response.data);

        if (response.data.length > 0) {
          const user = response.data[0];

          setCounts({
            totalOrders: user.totalOrders,
            totalAppointments: user.totalCounts,
          });
        }
      });
  }, []);
  return (
    <Card sx={{ width: "100%", position: "relative" }}>
      <Img alt={profile.name} src={CoverPhoto} />
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Avatar
          alt={profile.name}
          //src={require(`../../images/profile/${filename}`)}
          sx={{
            width: 100,
            height: 100,
            top: -60,
            position: "absolute", // Set position to absolute
            marginBottom: -10,
            border: "4px solid white", // Add a white border with a width of 3px
          }}
        />

        <CardContent>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              mt: 3,
              mb: 1,
            }}
          >
            <Typography
              gutterBottom
              variant="h5"
              style={{ fontWeight: "bold", textAlign: "center" }}
              component="div"
            >
              {profile.name}
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ color: "#bd8512", fontWeight: "bold", textAlign: "center" }}
            >
              ADMIN
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              {profile.city}
            </Typography>
          </Box>
        </CardContent>
        <Divider
          sx={{
            position: "absolute", // Set position to absolute
            bottom: 65, // Position it at the bottom
            width: "100%", // Make it full width
          }}
        />
        <Box
          sx={{
            display: "flex",
            pt: 1,
          }}
        >
          <input
            type="file"
            id="upload-button"
            accept=".webp, .img, .png, .jpg"
            style={{ display: "none" }}
            onChange={handleFileUpload}
            ref={inputRef} // Add this line
          />
          <Button
            sx={{ fontWeight: "bold", width: "100%" }}
            onClick={() => inputRef.current.click()} // Add this line
          >
            Upload Picture
          </Button>
        </Box>
      </Box>
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Change Profile Picture</DialogTitle>
        <DialogContent>
          <Typography>Do you want to change your profile picture?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleConfirmChange} variant="contained">
            Yes, Change
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
