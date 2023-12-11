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
import { Link, useNavigate } from "react-router-dom";
import { alpha, styled } from "@mui/material/styles";
import Typography from "../../../components/common/Typography";
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

const transformUpcomingInspectionData = (data) => {
  const transformedData = [];
  if (data) {
    for (const uid in data) {
      if (data.hasOwnProperty(uid)) {
        const userData = data[uid];

        for (const id in userData) {
          if (userData.hasOwnProperty(id)) {
            const inspectionData = userData[id];

            const mappedData = {
              uid: uid,
              id: id,
              plateNo: inspectionData.plateNo,
              inspectionType: inspectionData.inspectionType,
              nextInspectionDate: new Date(inspectionData.nextInspectionDate),
              verdict: inspectionData.verdict,
            };

            transformedData.push(mappedData);
          }
        }
      }
    }
  }

  return transformedData;
};

const fetchUpcomingInspection = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-upcominginspection`
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

export default function NewInspectionScheduling() {
  const [open, setOpen] = React.useState(false);
  const [action, setAction] = React.useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [id, setId] = useState(null);
  const [uid, setUID] = useState(null);
  const [rowsInspectionScheduling, setrowsInspectionScheduling] = useState([]);
  const navigate = useNavigate();

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
        const data = await fetchUpcomingInspection();
        const transformedData = transformUpcomingInspectionData(data);
        setrowsInspectionScheduling(transformedData);
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
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/deleteInspection`,
        { id, uid }
      );

      if (response.status === 200) {
        setOpen(false);
        toast.success("Record deleted successfully");
        navigate("/admininspection");
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

  const columnsInspectionScheduling = [
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
      headerName: "PLATE NO.",
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "inspectionType",
      headerName: "INSPECTION TYPE",
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "nextInspectionDate",
      headerName: "INSPECTION DATE",
      type: "date",
      flex: 3,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },

    {
      field: "verdict",
      headerName: "VERDICT",
      flex: 1.5,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => {
        if (params.value === "Passed") {
          return (
            <Chip
              label={
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: "success.dark",
                  }}
                >
                  Passed
                </Typography>
              }
              sx={{ bgcolor: "#8dd290" }}
              size="small"
            />
          );
        } else if (params.value === "ongoing") {
          return (
            <Chip
              label={
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: "info.dark",
                  }}
                >
                  On-going
                </Typography>
              }
              sx={{ bgcolor: "#90caf9" }}
              size="small"
            />
          );
        } else if (params.value === "Failed") {
          return (
            <Chip
              label={
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: "error.dark",
                  }}
                >
                  Failed
                </Typography>
              }
              sx={{ bgcolor: "#f5c9c9" }}
              size="small"
            />
          );
        } else if (params.value === "overdue") {
          return (
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
          );
        } else {
          return (
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
        }
      },
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
            to={`/admineditinspection?uid=${params.row.uid}&id=${params.row.id}`}
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
        rows={rowsInspectionScheduling}
        columns={columnsInspectionScheduling}
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
    </Box>
  );
}
