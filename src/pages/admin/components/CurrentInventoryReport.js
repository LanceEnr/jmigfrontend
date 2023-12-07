import React, { useState, useEffect } from "react";
import Typography from "../../../components/common/Typography";
import { Link, useNavigate } from "react-router-dom";
import { Paper, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import axios from "axios";
import { Box, Grid } from "@mui/material";
import InventoryBar from "./InventoryBar";

const fetchInventoryData = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/currentInventory`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const transformInventoryData = (data) => {
  const aggregatedData = {};

  data.forEach((item) => {
    const { _itemName, _quantity } = item;
    const quantity = parseInt(_quantity);

    if (aggregatedData[_itemName]) {
      aggregatedData[_itemName] += quantity;
    } else {
      aggregatedData[_itemName] = quantity;
    }
  });

  const transformedData = Object.keys(aggregatedData).map((productName) => ({
    product: productName,
    [productName]: aggregatedData[productName],
  }));

  return transformedData;
};

function CurrenInventoryReport() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchInventoryData();
        const transformedData = transformInventoryData(data);
        console.log(transformedData);
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching and transforming data:", error);
      }
    };

    fetchData();
  }, [navigate]);
  return (
    <div>
      <Box sx={{ my: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
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
                Current Inventory Report
              </Typography>
              <Box display="flex">
                <Button
                  variant="outlined"
                  sx={{ ml: 1 }}
                  color="primary"
                  component={Link}
                  to={"/admininventory"}
                >
                  Go Back
                </Button>
                <Button
                  variant="contained"
                  sx={{ ml: 1 }}
                  startIcon={<PrintIcon />}
                >
                  Print
                </Button>
              </Box>
            </Box>
            <Paper
              sx={{
                mt: 3,
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "74vh",
              }}
            >
              <InventoryBar data={data} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default CurrenInventoryReport;
