import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Box, Grid, Paper, TextField, Button } from "@mui/material";
import Typography from "../../../components/common/Typography";

export default function AddFaq() {
  const [value, setValue] = React.useState("Pandi");
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const navigate = useNavigate();

  const handleLocChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/addFAQ`,
        {
          question: question,
          answer: answer,
        }
      );

      console.log("FAQ added successfully", response.data);
      toast.success("FAQ added successfully");
      navigate("/admincontent");
    } catch (error) {
      console.error("FAQ add failed", error);
      toast.error("FAQ Question already exists!");
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
          Add Faqs
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
                  <Grid item xs={12}>
                    <TextField
                      label="Question"
                      name="question"
                      type="text"
                      fullWidth
                      onChange={(event) => setQuestion(event.target.value)}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="answer"
                      label="Answer"
                      multiline
                      onChange={(event) => setAnswer(event.target.value)}
                      required
                      rows={4}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      component={Link}
                      to={"/admincontent"}
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
