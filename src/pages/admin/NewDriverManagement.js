import React, { useState, useEffect } from "react";
import Typography from "../../components/common/Typography";
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
//import { rowsDriverManagement } from "./helpers/data";
import { Link, useNavigate } from "react-router-dom";
import { alpha, styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import AssessmentIcon from "@mui/icons-material/Assessment";

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

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};
const transformDriverData = (data) => {
  const transformedData = [];
  if (data) {
    for (const uid in data) {
      if (data.hasOwnProperty(uid)) {
        const userData = data[uid];

        const mappedData = {
          id: uid,
          contact: userData.contact,
          date: userData.date,
          driverName: userData.driverName,
          email: userData.email,
          licenseNo: userData.licenseNo,
          plateNo: userData.plateNo,
          status: userData.status,
          profilePicture: userData.ProfileImageURL,
          performance: userData.performance,
        };

        transformedData.push(mappedData);
      }
    }
  }

  return transformedData;
};

const fetchDriverInformation = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-driver`
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

export default function NewDriverManagement() {
  const [open, setOpen] = React.useState(false);
  const [action, setAction] = React.useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [id, setId] = useState(null);
  const [rowsDriverManagement, setrowsDriverManagement] = useState([]);
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);

  const fetchSpeedRecord = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-SpeedRecord`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const calculatePerformanceScore = (
    averageSpeed,
    harshBraking,
    suddenAcceleration
  ) => {
    const minMaxNormalize = (value, min, max) => {
      return (value - min) / (max - min);
    };

    // You can customize the min and max values based on your specific requirements
    const minAverageSpeed = 0;
    const maxAverageSpeed = 80; // Adjust these values as needed

    const minHarshBraking = 0;
    const maxHarshBraking = 10; // Adjust these values as needed

    const minSuddenAcceleration = 0;
    const maxSuddenAcceleration = 10; // Adjust these values as needed

    const normalizedAverageSpeed = minMaxNormalize(
      averageSpeed,
      minAverageSpeed,
      maxAverageSpeed
    );
    const normalizedHarshBraking = minMaxNormalize(
      harshBraking,
      minHarshBraking,
      maxHarshBraking
    );
    const normalizedSuddenAcceleration = minMaxNormalize(
      suddenAcceleration,
      minSuddenAcceleration,
      maxSuddenAcceleration
    );

    // Adjust weights based on your criteria
    const weightedAverageSpeed = normalizedAverageSpeed * 0.3; // Adjust weight
    const weightedHarshBraking = (1 - normalizedHarshBraking) * 0.3; // Invert the value for harsh braking
    const weightedSuddenAcceleration = (1 - normalizedSuddenAcceleration) * 0.4; // Invert the value for sudden acceleration

    // Sum up the weighted scores
    const normalizedScore =
      weightedAverageSpeed + weightedHarshBraking + weightedSuddenAcceleration;

    return normalizedScore;
  };

  const getGrading = (normalizedScore) => {
    if (normalizedScore >= 0.8 && normalizedScore <= 1.0) {
      return "Excellent";
    } else if (normalizedScore > 0.6 && normalizedScore < 0.8) {
      return "Good";
    } else if (normalizedScore >= 0.4 && normalizedScore < 0.6) {
      return "Average";
    } else if (normalizedScore >= 0.2 && normalizedScore < 0.4) {
      return "Needs Improvement";
    } else {
      return "Invalid Score";
    }
  };

  const calculateGrades = (data) => {
    const grades = [];

    for (const uid in data) {
      if (data.hasOwnProperty(uid)) {
        const idData = data[uid];
        const numRecords = Object.keys(idData).length;

        if (numRecords > 0) {
          let totalNormalizedScore = 0;

          for (const id in idData) {
            if (idData.hasOwnProperty(id)) {
              const record = idData[id];

              const normalizedScore = calculatePerformanceScore(
                record.average_speed,
                record.harsh_braking_count,
                record.sudden_acceleration_count
              );

              totalNormalizedScore += normalizedScore;
            }
          }

          // Average the normalized scores for the current uid
          const averageNormalizedScore = totalNormalizedScore / numRecords;

          const grading = getGrading(averageNormalizedScore);

          grades.push({
            Driver: uid,
            Grading: grading,
          });
        }
      }
    }

    return grades;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSpeedRecord();

        const grades = calculateGrades(data);
        setGrades(grades);
        console.log("Grades:", grades);
      } catch (error) {
        console.error("Error fetching and calculating averages:", error);
      }
    };
    fetchData();
  }, []);

  const handleClickOpen = (action, row) => {
    setAction(action);
    setOpen(true);
    setSelectedRow(row);
    setId(row.id);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDriverInformation();
        const transformedData = transformDriverData(data);
        setrowsDriverManagement(transformedData);
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
        `${process.env.REACT_APP_API_URL}/deleteDriverRecord`,
        { _driverID: id }
      );

      if (response.status === 200) {
        toast.success("Driver deleted successfully");
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

  const columnsDriverManagement = [
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
      field: "profilePicture",
      headerName: "PICTURE",
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => (
        <img
          src={
            isValidUrl(params.row.profilePicture)
              ? params.row.profilePicture
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt={"Picture"}
          style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
      ),
    },
    {
      field: "driverName",
      headerName: "NAME",
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "contact",
      headerName: "CONTACT",
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "HIRE DATE",
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "email",
      headerName: "EMAIL",
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "licenseNo",
      headerName: "LICENSE NO.",
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
      flex: 2,
    },

    {
      field: "status",
      headerName: "STATUS",
      flex: 1,
      renderCell: (params) => {
        return params.value === "assigned" ? (
          <Chip
            label={
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "success.dark",
                }}
              >
                Assigned
              </Typography>
            }
            sx={{ bgcolor: "#8dd290" }}
            size="small"
          />
        ) : (
          <Chip
            label={
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "info.dark",
                }}
              >
                Unassigned
              </Typography>
            }
            sx={{ bgcolor: "#90caf9" }}
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
      field: "performance",
      headerName: "PERFORMANCE",
      flex: 1.5,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => {
        const driverId = params.row.id;
        const gradeInfo = grades.find((grade) => grade.Driver === driverId);

        if (gradeInfo) {
          if (gradeInfo.Grading == "Excellent") {
            return (
              <Chip
                label={
                  <Typography
                    sx={{
                      fontSize: "10px",
                      color: "success.dark",
                    }}
                  >
                    Excellent
                  </Typography>
                }
                sx={{ bgcolor: "#8dd290" }}
                size="small"
              />
            );
          } else if (gradeInfo.Grading == "Good") {
            return (
              <Chip
                label={
                  <Typography
                    sx={{
                      fontSize: "10px",
                      color: "info.dark",
                    }}
                  >
                    Good
                  </Typography>
                }
                sx={{ bgcolor: "#90caf9" }}
                size="small"
              />
            );
          } else if (gradeInfo.Grading == "Average") {
            return (
              <Chip
                label={
                  <Typography
                    sx={{
                      fontSize: "10px",
                      color: "warning.dark",
                    }}
                  >
                    Average
                  </Typography>
                }
                sx={{ bgcolor: "#ffc890" }}
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
                      color: "error.dark",
                    }}
                  >
                    Needs Improvement
                  </Typography>
                }
                sx={{ bgcolor: "#f5c9c9" }}
                size="small"
              />
            );
          }

          // ... (similar grading logic as before)
        } else {
          // Handle the case when no grading information is available
          return (
            <Chip
              label={
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: "error.dark",
                  }}
                >
                  No Data
                </Typography>
              }
              sx={{ bgcolor: "#f5c9c9" }}
              size="small"
            />
          );
        }
      },
    },

    ,
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
            to={`/admineditdriver?id=${params.row.id}`}
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
          Driver Management
        </Typography>
        <Box display="flex">
          <Button
            variant="contained"
            sx={{ ml: 1 }}
            color="secondary"
            startIcon={<AssessmentIcon />}
            component={Link}
            to={"/admindriversreport"}
          >
            Generate Report
          </Button>
          <Button
            component={Link}
            to={"/adminadddriver"}
            variant="contained"
            sx={{ ml: 1 }}
            startIcon={<AddIcon />}
          >
            Add a Driver
          </Button>
        </Box>
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
          rows={rowsDriverManagement}
          columns={columnsDriverManagement}
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
