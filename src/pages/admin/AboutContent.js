import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";

export default function AboutContent() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [filePreview2, setFilePreview2] = useState(null);
  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const onDrop1 = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);

    const previewURL = URL.createObjectURL(file);
    setFilePreview(previewURL);

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      setBase64Image(base64Data);
    };
    reader.readAsDataURL(file);
  }, []);
  const onDrop2 = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile2(file);

    const previewURL = URL.createObjectURL(file);
    setFilePreview2(previewURL);

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      setBase64Image(base64Data);
    };
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-vision`
        );
        const response2 = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-mission`
        );

        setVision(response.data._vision);
        setMission(response2.data._mission);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("_vision", vision);
    formData.append("v", "vision");
    formData.append("image", selectedFile);

    const formData2 = new FormData();
    formData2.append("_mission", mission);
    formData2.append("m", "mission");
    formData2.append("image", selectedFile2);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-about`,
        formData
      );
      const response2 = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-about2`,
        formData2
      );

      toast.success("About edited successfully!");
      console.log("About submitted:", response.data);
    } catch (error) {
      toast.error("Error submitting about");
      console.error("Error submitting about:", error);
    }
  };
  const {
    getRootProps: getRootProps1,
    getInputProps: getInputProps1,
    isDragActive: isDragActive1,
  } = useDropzone({ onDrop: onDrop1 });
  const {
    getRootProps: getRootProps2,
    getInputProps: getInputProps2,
    isDragActive: isDragActive2,
  } = useDropzone({ onDrop: onDrop2 });
  return (
    <div>
      <Box>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12}>
                  <Typography>Vision</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    {...getRootProps1()}
                    sx={{
                      height: 200,
                      border: "1px dashed gray",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <input {...getInputProps1()} />
                    {isDragActive1 ? (
                      <p>Drop the image here...</p>
                    ) : (
                      <div>
                        {selectedFile ? (
                          <div>
                            <img
                              src={filePreview}
                              alt={selectedFile.name}
                              style={{ maxWidth: "300px", maxHeight: "100px" }}
                            />
                            <p>Selected file: {selectedFile.name}</p>
                          </div>
                        ) : (
                          <p>
                            Drag & drop banner image here, or click to select an
                            image. <br></br>
                            <center>
                              (This will replace the stored photo.)
                            </center>
                          </p>
                        )}
                      </div>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="_vision"
                    name="_vision"
                    label="Vision"
                    multiline
                    rows={4}
                    variant="outlined"
                    required
                    value={vision}
                    onChange={(event) => setVision(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <Typography>Mission</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    {...getRootProps2()}
                    sx={{
                      height: 200,
                      border: "1px dashed gray",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <input {...getInputProps2()} />
                    {isDragActive2 ? (
                      <p>Drop the image here...</p>
                    ) : (
                      <div>
                        {selectedFile2 ? (
                          <div>
                            <img
                              src={filePreview2}
                              alt={selectedFile2.name}
                              style={{ maxWidth: "300px", maxHeight: "100px" }}
                            />
                            <p>Selected file: {selectedFile2.name}</p>
                          </div>
                        ) : (
                          <p>
                            Drag & drop banner image here, or click to select an
                            image. <br></br>
                            <center>
                              (This will replace the stored photo.)
                            </center>
                          </p>
                        )}
                      </div>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="_mission"
                    label="Mission"
                    multiline
                    rows={4}
                    variant="outlined"
                    required
                    value={mission}
                    onChange={(event) => setMission(event.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    sx={{ mt: 2 }}
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Save changes
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>
    </div>
  );
}
