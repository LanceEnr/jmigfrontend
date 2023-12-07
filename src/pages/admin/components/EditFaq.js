import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Box, Grid, Paper, TextField, Button } from "@mui/material";
import Typography from "../../../components/common/Typography";

export default function EditFaq() {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const uid = url.searchParams.get("uid");
  const id = url.searchParams.get("id");
  const [value, setValue] = React.useState("Pandi");
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const navigate = useNavigate();

  const handleLocChange = (event) => {
    setValue(event.target.value);
  };
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/fetch-faq/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setQuestion(data._question);
          setAnswer(data._answer);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-faq`,
        {
          _faqNum: id,
          _question: question,
          _answer: answer,
        }
      );

      console.log("FAQ edited successfully", response.data);
      toast.success("FAQ edited successfully");
      navigate("/admincontent");
    } catch (error) {
      console.error("FAQ edit failed", error);
      toast.error("FAQ edit failed!");
    }
  };

  // Assuming valueOptions is an array of driver names
  return (
    <div>
      <Box sx={{ my: 14 }}>
        <Typography
          variant="h3"
          marked="left"
          style={{ fontWeight: "bold", fontSize: "30px" }}
          gutterBottom
        >
          Edit Faqs
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
              <form onSubmit={handleFormSubmit}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12}>
                    <TextField
                      label="Question"
                      name="question"
                      type="text"
                      fullWidth
                      required
                      value={question}
                      onChange={(e) => {
                        setQuestion(e.target.value);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="answer"
                      label="Answer"
                      multiline
                      required
                      rows={4}
                      variant="outlined"
                      value={answer}
                      onChange={(e) => {
                        setAnswer(e.target.value);
                      }}
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
