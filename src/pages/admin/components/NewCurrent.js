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
//import { rowsCurrentInventory } from "../helpers/data";
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
import clsx from "clsx";
import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        border: `1px solid ${theme.palette.divider}`,
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: 26,
        borderRadius: 2,
      },
      value: {
        position: "absolute",
        lineHeight: "24px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      },
      bar: {
        height: "100%",
        "&.low": {
          backgroundColor: "#f44336",
        },
        "&.medium": {
          backgroundColor: "#efbb5aa3",
        },
        "&.high": {
          backgroundColor: "#088208a3",
        },
      },
    }),
  { defaultTheme }
);

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
  return data.map((item) => ({
    id: item._inventoryID,
    itemName: item._itemName,
    quantity: item._quantity,
    location: item._location,
    lastUpdated: new Date(item._lastUpdated),
  }));
};

const ProgressBar = React.memo(function ProgressBar(props) {
  const { value } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.value}>{`${value.toLocaleString()} cu. mt.`}</div>
      <div
        className={clsx(classes.bar, {
          low: value < 300,
          medium: value >= 300 && value <= 700,
          high: value > 700,
        })}
        style={{ maxWidth: `${(value / 1000) * 100}%` }}
      />
    </div>
  );
});

export function renderProgress(params) {
  return <ProgressBar value={Number(params.value)} />;
}

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

export default function NewCurrent() {
  const [open, setOpen] = React.useState(false);
  const [action, setAction] = React.useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [id, setId] = useState(null);
  const navigate = useNavigate();
  const [rowsCurrentInventory, setrowsCurrentInventory] = useState([]);

  const handleClickOpen = (action, row) => {
    setAction(action);
    setOpen(true);
    setSelectedRow(row);
    setId(row.id);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchInventoryData();
        const transformedData = transformInventoryData(data);
        setrowsCurrentInventory(transformedData);
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
      const _inventoryID = id;
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/deleteInventory/${_inventoryID}`
      );

      if (response.status === 200) {
        setOpen(false);
        toast.success("Record deleted successfully");
        navigate("/admininventory");
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

  const columnsCurrentInventory = [
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
      field: "itemName",
      headerName: "ITEM NAME",
      flex: 1.5,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "quantity",
      headerName: "QUANTITY",
      renderCell: renderProgress,
      headerAlign: "left",
      type: "number",
      flex: 1,
      renderHeader: (params) => (
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", fontSize: "12px", textAlign: "left" }} // Add textAlign: "right" here
        >
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "location",
      headerName: "LOCATION",
      flex: 1.5,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "lastUpdated",
      headerName: "LAST UPDATED",
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
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => (
        <React.Fragment>
          <Link
            to={`/admineditcurrent?id=${params.row.id}`}
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
        rows={rowsCurrentInventory}
        columns={columnsCurrentInventory}
        pageSize={5}
        checkboxSelection
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
