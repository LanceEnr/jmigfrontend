import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridActionsCellItem, gridClasses } from "@mui/x-data-grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  TextField,
  IconButton,
  InputAdornment,
  Button,
  Paper,
  Box,
  Chip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toast } from "react-toastify";
import Typography from "../../../components/common/Typography";
import { alpha, styled } from "@mui/material/styles";

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

function getRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export default function RandomStringGenerator() {
  const [randomString, setRandomString] = useState(getRandomString(6));
  const [rows, setRows] = useState([]);
  const currentDate = new Date();
  const options = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };
  const formattedDate = currentDate.toLocaleString("en-US", options);

  useEffect(() => {
    // Fetch data from your database and update the rows state
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/accessCodes`
        );
        const rowsWithIds = response.data.map((row) => ({
          ...row,
          id: row._codeID,
        }));
        setRows(rowsWithIds);
      } catch (error) {
        console.error("Error fetching access codes", error);
      }
    };

    fetchData();
  }, []);

  const handleGenerate = () => {
    setRandomString(getRandomString(6));
  };

  const handleCopyAccessCode = (accessCode) => {
    // Copy the access code to the clipboard
    navigator.clipboard.writeText(accessCode);
    toast.success("Access code copied to clipboard");
  };

  const handleDeleteRow = async (adminCode) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/accessCodes/${adminCode}`
      );
      if (response.status === 204) {
        setRows((prevRows) =>
          prevRows.filter((row) => row._adminCode !== adminCode)
        );
        toast.success("Code deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting row", error);
      toast.error("Error deleting code");
    }
  };

  const handleGenerateAndPost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/generateCode`,
        {
          accessCode: randomString,
          formattedDate,
        }
      );

      const generatedCode = response.data;
      const newRow = {
        ...generatedCode,
        id: generatedCode._codeID,
      };
      setRows((prevRows) => [...prevRows, newRow]);

      toast.success("Generated code successfully");
      handleGenerate();
    } catch (error) {
      console.error("Generate code failed", error);
      toast.error("Generate code failed");
    }
  };

  const columns = [
    {
      field: "_codeID",
      headerName: "ID",
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "_adminCode",
      headerName: "ACCESS CODE",
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "_isRedeem",
      headerName: "REDEMPTION STATUS",
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => {
        if (params.value === true) {
          return (
            <Chip
              label={
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: "info.dark",
                  }}
                >
                  Redeemed
                </Typography>
              }
              sx={{ bgcolor: "#90caf9" }}
              size="small"
            />
          );
        } else if (params.value === false) {
          return (
            <Chip
              label={
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: "success.dark",
                  }}
                >
                  Available
                </Typography>
              }
              sx={{ bgcolor: "#8dd290" }}
              size="small"
            />
          );
        }
      },
    },

    {
      field: "_dateTime",
      headerName: "DATE AND TIME GENERATED",
      flex: 1,
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
            icon={<ContentCopyIcon />}
            label="Copy"
            color="info"
            onClick={() => handleCopyAccessCode(params.row._adminCode)}
          />
          <GridActionsCellItem
            icon={<DeleteOutlineIcon />}
            label="Remove"
            className="textPrimary"
            color="error"
            onClick={() => handleDeleteRow(params.row._adminCode)}
          />
        </React.Fragment>
      ),
    },
  ];

  return (
    <div>
      <Box sx={{ my: 12 }}>
        <Typography
          variant="h3"
          marked="left"
          style={{ fontWeight: "bold", fontSize: "30px" }}
          gutterBottom
        >
          Admin Access Code
        </Typography>

        <Paper sx={{ mt: 3, p: 2, display: "flex", flexDirection: "column" }}>
          <TextField
            label="Access Code"
            variant="outlined"
            value={randomString}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleGenerate}>
                    <RefreshIcon />
                  </IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGenerateAndPost} // Handle POST request
                  >
                    Generate Code
                  </Button>
                </InputAdornment>
              ),
            }}
            readOnly
          />
          <StripedDataGrid
            sx={{
              border: 1,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {
                fontWeight: "bold",
              },
            }}
            rows={rows}
            columns={columns}
            pageSize={5}
            disableColumnFilter
            disableColumnSelector
            density="comfortable"
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
        </Paper>
      </Box>
    </div>
  );
}
