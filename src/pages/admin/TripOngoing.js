import React, { useState, useEffect, useRef } from "react";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import axios from "axios";
import { Button, Chip } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { toast, ToastContainer } from "react-toastify";
import Typography from "../../components/common/Typography";
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

const transformTripOngoing = (data, data2, data3) => {
  const transformedData = [];

  if (data && data2) {
    for (const uid in data) {
      if (data.hasOwnProperty(uid) && data2.hasOwnProperty(uid)) {
        const userData = data[uid];
        const userData2 = data2[uid];

        if (
          userData2 &&
          userData2.max_speed !== undefined &&
          userData2.current_speed !== undefined
        ) {
          // Both max_speed and current_speed are defined, so include this row
          const mappedData = {
            id: uid,
            maxSpeed: userData2.max_speed ?? 0,
            currentSpeed: userData2.current_speed ?? 0,
            datetime: userData.dateTime,
            averageSpeed: userData2.average_speed ?? 0,
            harshBraking: userData2.harsh_braking_count ?? 0,
            suddenAcceleration: userData2.sudden_acceleration_count ?? 0,
          };

          transformedData.push(mappedData);
        }
      }
    }
  }

  return transformedData;
};

export default function TripOngoing({ onFindClick }) {
  const [rowsTripOngoing, setRowsTripOngoing] = useState([]);
  const columnsTripOngoing = [
    {
      field: "id",
      headerName: "DRIVER NAME",
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "datetime",
      headerName: "DATE AND TIME",
      flex: 1.5,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "currentSpeed",
      headerName: "CURRENT SPEED",
      flex: 1.5,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "averageSpeed",
      headerName: "AVG SPEED",
      flex: 1.5,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "maxSpeed",
      headerName: "MAX SPEED",
      flex: 1.5,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "harshBraking",
      headerName: "HARSH BRAKING",
      flex: 1.5,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },

    {
      field: "suddenAcceleration",
      headerName: "SUDDEN ACCELERATION",
      flex: 1.5,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },

    {
      field: "track",
      headerName: "ACTIONS",
      sortable: false,
      flex: 1,
      cellClassName: "actions",

      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => (
        <Button
          variant="contained"
          endIcon={<ArrowRightAltIcon />}
          onClick={() => {
            onFindClick(params.row.id);
          }}
        >
          Find
        </Button>
      ),
    },
  ];

  const fetchTripOngoing = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-tripDash`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchTripOngoingSpeed = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-speed`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchTripOngoingLocation = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-location`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const tripData = await fetchTripOngoing();
      const speedData = await fetchTripOngoingSpeed();
      const locationData = await fetchTripOngoingLocation();

      // Now, update the state with the transformed data
      const updatedData = transformTripOngoing(
        tripData,
        speedData,
        locationData
      );
      setRowsTripOngoing(updatedData);
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [onFindClick]);

  return (
    <div style={{ width: "100%" }}>
      <StripedDataGrid
        sx={{
          border: 1,
          borderColor: "primary.light",
          "& .MuiDataGrid-cell:hover": {
            fontWeight: "bold",
          },
        }}
        rows={rowsTripOngoing}
        columns={columnsTripOngoing}
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
    </div>
  );
}
