import React, { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  gridClasses,
} from "@mui/x-data-grid";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { columnsIncomingInventory } from "../helpers/data";
import { alpha, styled } from "@mui/material/styles";
import { toast } from "react-toastify";

import { Box } from "@mui/material";

const fetchIncomingInventoryData = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/incomingInventory`
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

export default function NewIncomingInventory() {
  const [open, setOpen] = React.useState(false);
  const [action, setAction] = React.useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowsIncomingInventory, setrowsIncomingInventory] = useState([]);
  const navigate = useNavigate();

  const handleClickOpen = (action, row) => {
    setAction(action);
    setOpen(true);
    setSelectedRow(row);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchIncomingInventoryData();
        const transformedData = transformIncomingInventoryData(data);
        setrowsIncomingInventory(transformedData);
      } catch (error) {
        console.error("Error fetching and transforming data:", error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleClose = () => {
    setOpen(false);
  };

  const deleteRecord = async (id) => {
    try {
      const _listingId = parseInt(id, 10);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/delete-listing`,
        { _listingId }
      );

      if (response.status === 200) {
        toast.success("Listing deleted successfully");
      } else if (response.status === 404) {
        toast.error("Record not found");
      } else {
        toast.error("Failed to delete the listing");
      }
    } catch (error) {
      console.error("Error deleting record", error);
      toast.error("An error occurred while deleting the record");
    }
  };

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
        columns={columnsIncomingInventory}
        rows={rowsIncomingInventory}
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
