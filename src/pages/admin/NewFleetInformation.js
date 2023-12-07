import React, { useState, useEffect } from "react";
import Typography from "../../components/common/Typography";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  gridClasses,
} from "@mui/x-data-grid";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
//import { rowsFleetInformation } from "./helpers/data";
import { Link, useNavigate } from "react-router-dom";
import { alpha, styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";

import { toast } from "react-toastify";

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

const transformFleetData = (data) => {
  const transformedData = [];

  if (data) {
    for (const uid in data) {
      if (data.hasOwnProperty(uid)) {
        const userData = data[uid];

        const mappedData = {
          id: uid,
          driverName: userData.driverName,
          bodyNo: userData.bodyNo,
          plateNo: userData.plateNo,
          plateNo2: userData.plateNo2,
          chassisNo: userData.chassisNo,
          engineNo: userData.engineNo,
          model: userData.model,
          mileage: userData.mileage,
          status: userData.status,
          location: userData.location,
        };

        transformedData.push(mappedData);
      }
    }
  }

  return transformedData;
};

const fetchFleetInformation = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-trucks`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
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

export default function NewFleetInformation() {
  const [open, setOpen] = React.useState(false);
  const [action, setAction] = React.useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [id, setId] = useState(null);
  const [rowsFleetInformation, setrowsFleetInformation] = useState([]);
  const navigate = useNavigate();

  const handleClickOpen = (action, row) => {
    setAction(action);
    setOpen(true);
    setSelectedRow(row);
    setId(row.id);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFleetInformation();
        const transformedData = transformFleetData(data);
        setrowsFleetInformation(transformedData);
      } catch (error) {
        console.error("Error fetching and transforming data:", error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleClose = () => {
    setOpen(false);
  };
  const handleDialogConfirm = () => {
    deleteRecord();
    setOpen(false);
  };

  const deleteRecord = async () => {
    try {
      const _truckID = id;
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/deleteTruckRecord`,
        {
          _truckID: _truckID,
        }
      );

      if (response.status === 200) {
        setOpen(false);
        toast.success("Record deleted successfully");
        navigate("/adminfleetinformation");
      } else if (response.status === 404) {
        toast.error("Record not found");
      } else {
        toast.error("Failed to delete the record");
      }
    } catch (error) {
      console.error("Error deleting record", error);
      toast.error("An error occurred while deleting the record");
    }
  };

  const columnsFleetInformation = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      hidden: true,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "bodyNo",
      headerName: "BODY NO.",
      flex: 1.5,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "plateNo",
      headerName: "TRACTOR NO.",
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "plateNo2",
      headerName: "TRAILER NO.",
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "chassisNo",
      headerName: "CHASSIS NO.",
      flex: 2.5,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "engineNo",
      headerName: "ENGINE NO.",
      flex: 2.5,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "model",
      headerName: "MODEL",
      flex: 1.5,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "mileage",
      headerName: "MILEAGE",
      flex: 2,
      valueFormatter: (params) => `${params.value.toLocaleString()} km.`,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },

    {
      field: "driverName",
      headerName: "DRIVER",
      flex: 3,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "location",
      headerName: "LOCATION",
      flex: 2,
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
      flex: 1.5,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => (
        <React.Fragment>
          <Link
            to={`/admineditfleet?id=${params.row.id}`}
            className="unstyled-link"
          >
            <GridActionsCellItem
              icon={<EditIcon />}
              className="textPrimary"
              color="info"
            />
          </Link>

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
          Fleet Information
        </Typography>
        <Button
          component={Link}
          to={"/adminaddfleet"}
          variant="contained"
          sx={{ ml: 1 }}
          startIcon={<AddIcon />}
        >
          Add a Truck
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
          rows={rowsFleetInformation}
          columns={columnsFleetInformation}
          pageSize={5}
          disableColumnFilter
          disableColumnSelector
          checkboxSelection
          density="comfortable"
          slots={{
            toolbar: GridToolbar,
          }}
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
