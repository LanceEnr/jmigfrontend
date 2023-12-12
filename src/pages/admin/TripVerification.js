import React, { useState, useEffect, useRef } from "react";
import {
  DataGrid,
  gridClasses,
  GridToolbar,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { green, red } from "@mui/material/colors";
import Signature from "../../assets/white.jpg";
import { alpha, styled } from "@mui/material/styles";
import axios from "axios";

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

const transformTripOngoing = (data, data2, data3, data4) => {
  const transformedData = [];

  if (data && data2 && data3 && data4) {
    for (const uid in data) {
      const userData = data[uid];
      const userData2 = data2[uid];
      const userData3 = data3[uid];
      const userData4 = data4[uid];
      const mappedData = {
        id: uid,
        driver: userData.driverName,
        datetime: userData.dateTime,
      };

      if (userData2) {
        mappedData.cargoType = userData2.cargoType;
        mappedData.cargoWeight = userData2.cargoWeight;
      } else {
        mappedData.cargoType = "No Cargo Type";
        mappedData.cargoWeight = "No Cargo Weight";
      }

      if (
        userData2 &&
        userData2.cargoType &&
        userData2.cargoWeight &&
        userData3.driversLicenseChecked &&
        userData3.localTransportPermitChecked &&
        userData3.orcrChecked &&
        userData4.brake &&
        userData4.lights &&
        userData4.safetyequipment &&
        userData4.steering &&
        userData4.suspension &&
        userData4.tireswheels
      ) {
        mappedData.status = "complete";
      } else {
        mappedData.status = "incomplete";
      }

      transformedData.push(mappedData);
    }
  }

  return transformedData;
};

export default function TripVerification() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [documentChecklist, setDocumentChecklist] = useState([]);
  const [selectedID, setSelectedID] = useState(null);
  const [id, setId] = useState(null);
  const [sign, setSignature] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [documentChecklistData, setDocumentChecklistData] = useState({
    driversLicenseChecked: false,
    localTransportPermitChecked: false,
    orcrChecked: false,
  });
  const [SafetyChecklistData, setSafetyChecklistData] = useState({
    suspension: false,
    brake: false,
    steering: false,
    tireswheels: false,
    safetyequipment: false,
    lights: false,
  });

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
  const fetchCargo = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-cargo`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-documentCheck`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
  const fetchSafetyCheck = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-schecklist`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
  const fetchDocumentChecklist = async (id) => {
    try {
      setDocumentChecklistData({
        driversLicenseChecked: false,
        localTransportPermitChecked: false,
        orcrChecked: false,
      });

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-documentCheck/${id}`
      );
      const checklistData = response.data;

      setDocumentChecklistData((prevState) => ({
        ...prevState,
        driversLicenseChecked: checklistData.driversLicenseChecked,
        localTransportPermitChecked: checklistData.localTransportPermitChecked,
        orcrChecked: checklistData.orcrChecked,
      }));

      return checklistData;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
  const fetchsetSafetyChecklistData = async (id) => {
    try {
      setSafetyChecklistData({
        suspension: false,
        brake: false,
        steering: false,
        tireswheels: false,
        safetyequipment: false,
        lights: false,
      });

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-safetychecklist/${id}`
      );
      const checklistData = response.data;
      setSafetyChecklistData((prevState) => ({
        ...prevState,
        suspension: checklistData.suspension,
        brake: checklistData.brake,
        steering: checklistData.steering,
        tireswheels: checklistData.tireswheels,
        safetyequipment: checklistData.safetyequipment,
        lights: checklistData.lights,
      }));
      console.log(SafetyChecklistData);
      return checklistData;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
  const fetchSignatureImage = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-signature/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching signature image:", error);
      return Signature;
    }
  };
  useEffect(() => {
    fetchSignatureImage(selectedID)
      .then((imageLocation) => {
        if (imageLocation) {
          setSignature(imageLocation);
        }
        setIsLoadingImage(false);
      })
      .catch((error) => {
        console.error("Error fetching signature image:", error);
        setIsLoadingImage(false);
      });
  }, [selectedID]);

  useEffect(() => {
    const fetchData = async () => {
      const tripData = await fetchTripOngoing();
      const cargoData = await fetchCargo();
      const documentData = await fetchDocuments();
      const safetyData = await fetchSafetyCheck();

      const updatedData = transformTripOngoing(
        tripData,
        cargoData,
        documentData,
        safetyData
      );

      setRows(updatedData);
    };

    fetchData();
  }, []);

  const handleClickOpen = (id) => {
    setSelectedID(id);
    setId(id);
    fetchDocumentChecklist(id)
      .then((data) => {
        setDocumentChecklist(data);
      })
      .catch((error) => {
        console.error("Error fetching document checklist:", error);
        setDocumentChecklist([]);
      });

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleDialogOpen = (id) => {
    setSelectedID(id);
    setId(id);
    fetchsetSafetyChecklistData(id)
      .then((data) => {
        setSafetyChecklistData(data);
      })
      .catch((error) => {
        console.error("Error fetching document checklist:", error);
        setSafetyChecklistData([]);
      });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const columns = [
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
      field: "driver",
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
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "cargoType",
      headerName: "CARGO TYPE",
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "cargoWeight",
      headerName: "CARGO WEIGHT",
      flex: 2,
      valueFormatter: (params) => `${params.value.toLocaleString()} cu. mt.`,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "documents",
      headerName: "DOCUMENTS",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleClickOpen(params.row.id)}
        >
          <Visibility />
        </IconButton>
      ),
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "safetyChecks",
      headerName: "SAFETY CHECKS",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleDialogOpen(params.row.id)}
        >
          <Visibility />
        </IconButton>
      ),
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "STATUS",
      flex: 2,
      valueFormatter: (params) => `${params.value} `,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
  ];

  return (
    <Box style={{ width: "100%" }}>
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
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Document Check</DialogTitle>
        <List>
          {[
            {
              documentName: "Driver's License",
              approved: documentChecklistData.driversLicenseChecked,
            },
            {
              documentName: "OR/CR",
              approved: documentChecklistData.orcrChecked,
            },
            {
              documentName: "Local Transport Permit",
              approved: documentChecklistData.localTransportPermitChecked,
            },
          ].map(({ documentName, approved }, index) => (
            <ListItem key={index}>
              <ListItemAvatar style={{ pointerEvents: "none" }}>
                <Avatar>
                  {approved ? (
                    <CheckCircleIcon style={{ color: green[500] }} />
                  ) : (
                    <CancelIcon style={{ color: red[500] }} />
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={documentName} />
            </ListItem>
          ))}
          {isLoadingImage ? (
            <div>Loading...</div>
          ) : (
            <Box
              component="img"
              sx={{
                m: 2,
                height: 233,
                width: 350,
                maxWidth: "100%",
                borderRadius: 1,
              }}
              alt="The alt text for your image"
              src={sign}
            />
          )}
        </List>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog onClose={handleDialogClose} open={isDialogOpen}>
        <DialogTitle>Safety Checks</DialogTitle>
        <List>
          {[
            {
              documentName: "Suspension System",
              approved: SafetyChecklistData.suspension,
              image: SafetyChecklistData["0"],
            },
            {
              documentName: "Brake System",
              approved: SafetyChecklistData.brake,
              image: SafetyChecklistData["1"],
            },
            {
              documentName: "Steering System",
              approved: SafetyChecklistData.steering,
              image: SafetyChecklistData["2"],
            },
            ,
            {
              documentName: "Tires and Wheels",
              approved: SafetyChecklistData.tireswheels,
              image: SafetyChecklistData["3"],
            },
            ,
            {
              documentName: "Safety Equipments",
              approved: SafetyChecklistData.safetyequipment,
              image: SafetyChecklistData["4"],
            },
            ,
            {
              documentName: "Lights and Reflectors",
              approved: SafetyChecklistData.lights,
              image: SafetyChecklistData["5"],
            },
          ].map(({ documentName, approved, image }, index) => (
            <ListItem key={index}>
              <ListItemAvatar style={{ pointerEvents: "none" }}>
                <Avatar>
                  {approved ? (
                    <CheckCircleIcon style={{ color: green[500] }} />
                  ) : (
                    <CancelIcon style={{ color: red[500] }} />
                  )}
                </Avatar>
              </ListItemAvatar>

              <ListItemText primary={documentName} />
              <img
                src={image || Signature}
                alt=""
                style={{ width: "160px", height: "70px" }}
              />
            </ListItem>
          ))}
        </List>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
