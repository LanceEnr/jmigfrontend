import React, { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  gridClasses,
} from "@mui/x-data-grid";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
//import { rowsMaintenanceScheduling } from "../helpers/data";
import { Link, useNavigate } from "react-router-dom";
import { alpha, styled } from "@mui/material/styles";
import Typography from "../../../components/common/Typography";
import { toast } from "react-toastify";

import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const transformMaintenanceData = (data) => {
  const transformedData = [];
  if (data) {
    for (const uid in data) {
      if (data.hasOwnProperty(uid)) {
        const userData = data[uid];

        for (const id in userData) {
          if (userData.hasOwnProperty(id)) {
            const maintenanceData = userData[id];

            const mappedData = {
              uid: uid,
              id: id,
              plateNo: maintenanceData.plateNo,
              service: maintenanceData.service,
              frequency: maintenanceData.frequency,
              nextDueMileage: maintenanceData.nextDueMileage,
              nextMaintenanceDate: new Date(
                maintenanceData.nextMaintenanceDate
              ),
              mileage: maintenanceData.mileage,
              status: maintenanceData.status,
            };

            transformedData.push(mappedData);
          }
        }
      }
    }
  }

  return transformedData;
};

const fetchMaintenance = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-maintenance`
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

export default function NewMaintenanceScheduling() {
  const [open, setOpen] = React.useState(false);
  const [action, setAction] = React.useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [id, setId] = useState(null);
  const [uid, setUID] = useState(null);
  const navigate = useNavigate();
  const [rowsMaintenanceScheduling, setrowsMaintenanceScheduling] = useState(
    []
  );

  const handleClickOpen = (action, row) => {
    setAction(action);
    setOpen(true);
    setSelectedRow(row);
    setId(row.id);
    setUID(row.uid);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMaintenance();
        const transformedData = transformMaintenanceData(data);
        setrowsMaintenanceScheduling(transformedData);
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
      const _maintenanceId = parseInt(id, 10);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/deleteMaintenanceRecord`,
        { _maintenanceId, uid }
      );

      if (response.status === 200) {
        setOpen(false);
        toast.success("Record deleted successfully");
        setrowsMaintenanceScheduling((prevRows) =>
          prevRows.filter((row) => row.id !== id && row.uid !== uid)
        );
        navigate("/adminmaintenance");
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

  const columnsMaintenanceScheduling = [
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
      field: "service",
      headerName: "SERVICE",
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "frequency",
      headerName: "FREQUENCY",
      flex: 2,
      valueFormatter: (params) => `${params.value.toLocaleString()} km.`,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "mileage",
      headerName: "START MILEAGE",
      flex: 2,
      valueFormatter: (params) => `${params.value.toLocaleString()} km.`,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "nextDueMileage",
      headerName: "NEXT DUE MILEAGE",
      flex: 2,
      valueFormatter: (params) => `${params.value.toLocaleString()} km.`,
      valueGetter: (params) => {
        const mileage = params.row.mileage;
        const frequency = params.row.frequency;
        return parseInt(frequency) + parseInt(mileage);
      },
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "STATUS",
      flex: 1.5,
      renderCell: (params) => {
        return params.value === "overdue" ? (
          <Chip
            label={
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "error.dark",
                }}
              >
                Overdue
              </Typography>
            }
            sx={{ bgcolor: "#f5c9c9" }}
            size="small"
          />
        ) : (
          <Chip
            label={
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "warning.dark",
                }}
              >
                Pending
              </Typography>
            }
            sx={{ bgcolor: "#ffc890" }}
            size="small"
          />
        );
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
      flex: 1.5,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => (
        <React.Fragment>
          <Link
            to={`/admineditmaintenancescheduling?uid=${params.row.uid}&id=${params.row.id}`}
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
    <Box>
      <StripedDataGrid
        sx={{
          border: 1,
          borderColor: "primary.light",
          "& .MuiDataGrid-cell:hover": {
            fontWeight: "bold",
          },
        }}
        rows={rowsMaintenanceScheduling}
        columns={columnsMaintenanceScheduling}
        pageSize={5}
        disableColumnFilter
        disableColumnSelector
        checkboxSelection
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
    </Box>
  );
}
