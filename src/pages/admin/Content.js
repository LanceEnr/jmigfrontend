import React, { useState } from "react";
import { Paper, Box, Tab, Tabs, Button } from "@mui/material";
import Typography from "../../components/common/Typography";
import CompanyValues from "./CompanyValues";
import EditBanners from "./EditBanners";
import AboutContent from "./AboutContent";
import ContactContent from "./ContactContent";
import NewFaqTable from "./components/NewFaqTable";
import { Link } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
function Content() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <Box sx={{ my: 12 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={2}
        >
          <Typography
            variant="h3"
            marked="left"
            style={{ fontWeight: "bold", fontSize: "30px" }}
            gutterBottom
          >
            General Content
          </Typography>
          {value === 4 && (
            <Button
              component={Link}
              to={"/adminaddfaq"}
              variant="contained"
              sx={{ ml: 1 }}
              startIcon={<AddIcon />}
            >
              Add FAQ Item
            </Button>
          )}
        </Box>
        <Paper sx={{ mt: 3, p: 2, display: "flex", flexDirection: "column" }}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Banners" />
                <Tab label="Values" />
                <Tab label="About" />
                <Tab label="Contact" />
                <Tab label="FAQs" />
              </Tabs>
            </Box>
            {value === 0 && <EditBanners />}
            {value === 1 && <CompanyValues />}
            {value === 2 && <AboutContent />}
            {value === 3 && <ContactContent />}
            {value === 4 && <NewFaqTable />}
          </Box>
        </Paper>
      </Box>
    </div>
  );
}

export default Content;
