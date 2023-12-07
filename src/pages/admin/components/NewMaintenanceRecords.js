import React, { useState, useEffect } from "react";

import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  gridClasses,
} from "@mui/x-data-grid";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
//import DeleteIcon from "@mui/icons-material/DeleteOutlined";
//import { rowsMaintenanceRecords } from "../helpers/data";
import { Link, useNavigate } from "react-router-dom";
import { alpha, styled } from "@mui/material/styles";
import Typography from "../../../components/common/Typography";
import { toast } from "react-toastify";

import { Box } from "@mui/material";

const transformMaintenanceRecordData = (data) => {
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
              provider: maintenanceData.provider,
              cost: maintenanceData.cost,
            };

            transformedData.push(mappedData);
          }
        }
      }
    }
  }

  return transformedData;
};

const fetchMaintenanceRecord = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-maintenanceHistory`
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

export default function NewMaintenanceRecords() {
  const [open, setOpen] = React.useState(false);
  const [action, setAction] = React.useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowsMaintenanceRecords, setrowsMaintenanceRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMaintenanceRecord();
        const transformedData = transformMaintenanceRecordData(data);
        setrowsMaintenanceRecords(transformedData);
      } catch (error) {
        console.error("Error fetching and transforming data:", error);
      }
    };

    fetchData();
  }, [navigate]);

  const columnsMaintenanceRecords = [
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
      field: "provider",
      headerName: "SERVICE PROVIDER",
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "cost",
      headerName: "TOTAL COST",
      flex: 2,
      valueFormatter: (params) =>
        `₱${params.value ? params.value.toLocaleString() : 0}`,
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
            className="unstyled-link"
            to={`/admineditmaintenancerecord?uid=${params.row.uid}&id=${params.row.id}`}
          >
            <GridActionsCellItem
              icon={<EditIcon />}
              className="textPrimary"
              color="info"
            />
          </Link>
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
        rows={rowsMaintenanceRecords}
        columns={columnsMaintenanceRecords}
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
    </Box>
  );
}
