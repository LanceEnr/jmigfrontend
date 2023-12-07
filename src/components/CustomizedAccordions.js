import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { TextField, Typography, Box, InputAdornment } from "@mui/material";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { rowsFaqs } from "../pages/cmshelper/cms";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:first-of-type": {
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  "&:last-of-type": {
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    borderLeft: "5px solid #83948a", // Add a line to the right side of the border
    backgroundColor: "#F4F4F4", // Add a darker color
  },
  "&:hover": {
    backgroundColor: "#E0E0E0", // Darken color on hover
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      <Box mb={2}>
        <Typography
          component="h1"
          variant="h5"
          color="textPrimary"
          sx={{ fontWeight: "bold" }}
        >
          How can we help you?
        </Typography>
      </Box>
      <TextField
        label="Search for a question"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "1rem", width: "100%" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      {rowsFaqs
        .filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((item) => (
          <Accordion
            key={item.id}
            expanded={expanded === item.id}
            onChange={handleChange(item.id)}
          >
            <AccordionSummary
              aria-controls={`${item.id}-content`}
              id={`${item.id}-header`}
            >
              <Typography>{item.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{item.content}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}
