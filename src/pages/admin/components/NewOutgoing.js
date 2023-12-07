import React, { useState, useEffect } from "react";

import { DataGrid, GridToolbar, gridClasses } from "@mui/x-data-grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { columnsOutgoingInventory } from "../helpers/data";
import { alpha, styled } from "@mui/material/styles";
import { toast } from "react-toastify";

import { Box } from "@mui/material";

const fetchIncomingInventoryData = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/get-inventoryhistory`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const transformIncomingInventoryData = (data) => {
  return data.map((item) => ({
    id: item._inventoryID,
    itemName: item._materialType,
    quantity: item._quantity,
    name: item._name,
    date: item._date,
    location: item._location,
  }));
};

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: "#EAECEA",
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

export default function NewOutgoingInventory() {
  const [open, setOpen] = React.useState(false);
  const [action, setAction] = React.useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowsHistoryInventory, setrowsHistoryInventory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchIncomingInventoryData();
        const transformedData = transformIncomingInventoryData(data);
        setrowsHistoryInventory(transformedData);
      } catch (error) {
        console.error("Error fetching and transforming data:", error);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <Box>
      <StripedDataGrid
        sx={{
          border: 1,
          borderColor: "primary.light",
          "& .MuiDataGrid-cell:hover": {
            fontWeight: "bold",
          },
        }}
        checkboxSelection
        columns={columnsOutgoingInventory}
        rows={rowsHistoryInventory}
        pageSize={5}
        disableColumnFilter
        disableColumnSelector
        density="comfortable"
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            printOptions: { disableToolbarButton: true },
          },
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
      />
    </Box>
  );
}
