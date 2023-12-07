import React, { useState } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  gridClasses,
} from "@mui/x-data-grid";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import Typography from "../../components/common/Typography";
import { alpha, styled } from "@mui/material/styles";

import {
  Switch,
  Paper,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

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

const fetchListingData = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/get-listing2`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const transformListingData = (data) => {
  return data.map((item) => ({
    id: item._listingID,
    name: item._listingName,
    category: item._listingCategory,
    price: item._listingPrice,
    published: item._isPublished,
  }));
};

export default function ManageListings({ onAddClick, onEditClick }) {
  const [open, setOpen] = React.useState(false);
  const [action, setAction] = React.useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowsListing, setRowsListing] = useState([]);
  const [id, setId] = useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchListingData();
      const transformedData = transformListingData(data);
      setRowsListing(transformedData);
    };

    fetchData();
  }, []);

  const handleClickOpen = (action, row) => {
    setAction(action);
    setOpen(true);
    setSelectedRow(row);
    setId(row.id);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDialogConfirm = () => {
    deleteRecord();
    setOpen(false);
  };

  const deleteRecord = async () => {
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

  const handleConfirm = () => {
    if (action === "save") {
      console.log("Save changes");
    } else if (action === "delete") {
      setRowsListing((prevRows) =>
        prevRows.filter((row) => row.id !== selectedRow.id)
      );
      deleteRecord(selectedRow.id);
    }

    handleClose();
  };

  const columnsListing = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "name",
      headerName: "NAME",
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "price",
      headerName: "PRICE",
      flex: 1,
      valueFormatter: (params) => `₱${params.value.toLocaleString()}`,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "published",
      headerName: "PUBLISHED",
      flex: 1,
      renderCell: (params) => {
        if (params.value) {
          return <CheckIcon sx={{ color: "success.main" }} />;
        } else {
          return <CloseIcon sx={{ color: "error.main" }} />;
        }
      },
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },

    {
      field: "actions",
      headerName: "ACTIONS",
      sortable: false,
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => (
        <React.Fragment>
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            color="info"
            onClick={() => onEditClick(params.row)}
          />

          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            color="error"
            onClick={() => handleClickOpen("delete", params.row)}
          />
        </React.Fragment>
      ),
    },
  ];

  return (
    <Box sx={{ my: 14 }}>
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
          Manage Listings
        </Typography>

        <Button
          variant="contained"
          sx={{ ml: 1 }}
          startIcon={<AddIcon />}
          onClick={onAddClick}
        >
          Add New Listing
        </Button>
      </Box>
      <Paper sx={{ mt: 3, p: 2, display: "flex", flexDirection: "column" }}>
        <StripedDataGrid
          sx={{
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              fontWeight: "bold",
            },
          }}
          rows={rowsListing}
          columns={columnsListing}
          pageSize={5}
          disableColumnFilter
          checkboxSelection
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

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {action === "save"
                ? "Do you want to save changes?"
                : "Do you want to delete this row?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button color="primary" onClick={handleDialogConfirm} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}
