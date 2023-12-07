import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, gridClasses, GridToolbar } from "@mui/x-data-grid";

import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";

import Box from "@mui/material/Box";
import { Paper, Modal, Divider, TextField } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import Typography from "../../components/common/Typography";
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

export default function ManageContactForm() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [rows, setRows] = useState([]);

  const handleClickOpen = (rowData) => {
    if (rowData) {
      console.log("message " + rowData);
      setMessage(rowData);
      setOpen(true);
    } else {
      setMessage("null");
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // Fetch data from the API using Axios
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-inquiry`)
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);
  const getRowId = (row) => row._inquiryID;
  const columns = [
    {
      field: "_inquiryID",
      headerName: "ID",
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "_name",
      headerName: "NAME",
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "_email",
      headerName: "EMAIL",
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "_date",
      headerName: "DATE AND TIME",
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "_message",
      headerName: "MESSAGE",
      sortable: false,
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleClickOpen(params.row._message)}
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ my: 14 }}>
      <Typography
        variant="h3"
        marked="left"
        style={{ fontWeight: "bold", fontSize: "30px" }}
        gutterBottom
      >
        Contact Form Submissions
      </Typography>
      <Paper sx={{ mt: 3, p: 2, display: "flex", flexDirection: "column" }}>
        <Box style={{ width: "100%" }}>
          <StripedDataGrid
            sx={{
              border: 1,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {
                fontWeight: "bold",
              },
            }}
            checkboxSelection
            rows={rows}
            columns={columns}
            pageSize={5}
            disableColumnFilter
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                printOptions: { disableToolbarButton: true },
              },
            }}
            disableColumnSelector
            density="comfortable"
            getRowId={getRowId}
            slots={{ toolbar: GridToolbar }}
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
          <Modal onClose={handleClose} open={open}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 450,
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: "8px",
                p: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  pb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: "bold" }}
                >
                  User Message
                </Typography>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Divider
                style={{ borderStyle: "dashed", borderColor: "#bd8512" }}
              />
              <Box sx={{ mt: 2 }}>
                <TextField
                  id="modal-description"
                  multiline
                  fullWidth
                  label="Message"
                  value={message}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Modal>
        </Box>
      </Paper>
    </Box>
  );
}
