import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Box, Grid, Paper, TextField, Button } from "@mui/material";
import Typography from "../../../components/common/Typography";

export default function AddDriver() {
  const [driver, setDriver] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [originalContact, setOriginalContact] = useState("");
  const [license, setLicense] = useState("");
  const [status, setStatus] = React.useState("unassigned");
  const navigate = useNavigate();
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Handle dropped files here, if needed
      setSelectedFiles(acceptedFiles);
    },
  });
  const removeFile = (indexToRemove) => {
    // Create a copy of the selectedFiles array without the file at the specified index
    const updatedFiles = [
      ...selectedFiles.slice(0, indexToRemove),
      ...selectedFiles.slice(indexToRemove + 1),
    ];
    setSelectedFiles(updatedFiles);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleChange = (event) => {
    setDriver(event.target.value);
  };

  const handleContactChange = (event) => {
    setContact(event.target.value);
  };

  const handleContactBlur = () => {
    const phoneNumberRegex = /^(09|\+639)\d{9}$/;

    if (contact.match(phoneNumberRegex) || contact === "") {
      setOriginalContact(contact);
    } else {
      toast.error(
        "Invalid phone number format. Please enter a valid Philippine phone number."
      );
      setContact(originalContact);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("driverName", name);
      formData.append("contact", contact);
      formData.append("date", date);
      formData.append("status", status);
      formData.append("email", email);
      formData.append("licenseNo", license);

      // Append each selected file to the FormData object with the same key
      selectedFiles.forEach((file, index) => {
        formData.append("image", file);
      });

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/addDriver`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Driver added successfully", response.data);
      toast.success("Driver added successfully");
      navigate("/admindrivermanagement");
    } catch (error) {
      console.error("Driver add failed", error);
      toast.error("Driver must register first on app!");
      setEmail("");
    }
  };

  return (
    <div>
      <Box sx={{ my: 14 }}>
        <Typography
          variant="h3"
          marked="left"
          style={{ fontWeight: "bold", fontSize: "30px" }}
          gutterBottom
        >
          Add a Driver
        </Typography>
        <Paper
          sx={{
            mt: 3,
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      label="Name"
                      name="drivername"
                      type="text"
                      onChange={(event) => setName(event.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      label="Contact No."
                      name="contactno"
                      type="text"
                      value={contact}
                      onChange={handleContactChange}
                      onBlur={handleContactBlur}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      label="Hire Date"
                      name="hiredate"
                      type="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      inputProps={{ max: getCurrentDate() }}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      {...getRootProps()}
                      sx={{
                        height: 200,
                        border: "1px dashed gray",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input {...getInputProps()} />
                      {selectedFiles.length > 0 ? (
                        <ul>
                          {selectedFiles.map((file, index) => (
                            <li key={index}>
                              {file.name}{" "}
                              <button onClick={() => removeFile(index)}>
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>
                          Drag & drop driver's license here, or click to select
                          images
                        </p>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="License No."
                      name="licenseno"
                      type="text"
                      onChange={(event) => setLicense(event.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      component={Link}
                      to={"/admindrivermanagement"}
                      sx={{
                        marginRight: 2,
                        color: "#83948a",
                        borderColor: "#83948a",
                      }}
                    >
                      Go Back
                    </Button>
                    <Button variant="contained" type="submit">
                      Save changes
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </div>
  );
}
