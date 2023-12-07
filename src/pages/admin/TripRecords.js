import React, { useState, useEffect, useRef } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
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
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";
import { green, red } from "@mui/material/colors";
import Signature from "../../assets/white.jpg";

import axios from "axios";

const transformTripOngoing = (data, data2, data3) => {
  const transformedData = [];

  if (data && data2 && data3) {
    for (const uid in data) {
      const userData = data[uid];
      const userData2 = data2[uid];
      const userData3 = data3[uid];

      for (const id in userData) {
        if (userData.hasOwnProperty(id)) {
          const mappedData = {
            uid: uid,
            id: id,
            driver: userData[id].driverName,
            datetime: userData[id].dateTime,
            cargoType: userData[id].cargo,
            cargoWeight: userData[id].weight,
            avgSpeed: userData2[id].average_speed ?? 0,
            maxSpeed: userData2[id].max_speed ?? 0,
            harshBraking: userData2[id].harsh_braking_count ?? 0,
            sua: userData2[id].sudden_acceleration_count ?? 0,
          };

          transformedData.push(mappedData);
        }
      }
    }
  }

  return transformedData;
};

export default function TripVerification() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [documentChecklist, setDocumentChecklist] = useState([]);
  const [selectedID, setSelectedID] = useState(null);
  const [driver, setDriver] = useState(null);
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
        `${process.env.REACT_APP_API_URL}/fetch-tripHistory`
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
        `${process.env.REACT_APP_API_URL}/fetch-documentCheckRecord`
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
        `${process.env.REACT_APP_API_URL}/fetch-schecklistrecord`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
  const fetchDocumentChecklist = async (id, driver) => {
    try {
      setDocumentChecklistData({
        driversLicenseChecked: false,
        localTransportPermitChecked: false,
        orcrChecked: false,
      });

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-documentCheckRecord/${id}/${driver}`
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
  const fetchsetSafetyChecklistData = async (id, driver) => {
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
        `${process.env.REACT_APP_API_URL}/fetch-sCheckRecord/${id}/${driver}`
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
  const fetchSignatureImage = async (id, driver) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-signaturerecord/${id}/${driver}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching signature image:", error);
      return Signature;
    }
  };
  useEffect(() => {
    fetchSignatureImage(selectedID, driver)
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
  }, [selectedID, driver]);

  useEffect(() => {
    const fetchData = async () => {
      const tripData = await fetchTripOngoing();
      const documentData = await fetchDocuments();
      const safetyData = await fetchSafetyCheck();

      const updatedData = transformTripOngoing(
        tripData,
        documentData,
        safetyData
      );

      setRows(updatedData);
    };

    fetchData();
  }, []);

  const handleClickOpen = (id, driver) => {
    setSelectedID(id);
    setDriver(driver);
    setId(id);
    fetchDocumentChecklist(id, driver)
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

  const handleDialogOpen = (id, driver) => {
    setSelectedID(id);
    setId(id);
    fetchsetSafetyChecklistData(id, driver)
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
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },

    {
      field: "datetime",
      headerName: "DATE AND TIME",
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "cargoType",
      headerName: "CARGO TYPE",
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: "cargoWeight",
      headerName: "CARGO WEIGHT",
      flex: 1,
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
          onClick={() => handleClickOpen(params.row.id, params.row.driver)}
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
          onClick={() => handleDialogOpen(params.row.id, params.row.driver)}
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
  ];

  return (
    <Box style={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableColumnFilter
        disableColumnSelector
        density="comfortable"
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
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
            },
            {
              documentName: "Brake System",
              approved: SafetyChecklistData.brake,
            },
            {
              documentName: "Steering System",
              approved: SafetyChecklistData.steering,
            },
            ,
            {
              documentName: "Tires and Wheels",
              approved: SafetyChecklistData.tireswheels,
            },
            ,
            {
              documentName: "Safety Equipments",
              approved: SafetyChecklistData.safetyequipment,
            },
            ,
            {
              documentName: "Lights and Reflectors",
              approved: SafetyChecklistData.lights,
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
              <img
                src={Signature}
                alt="Rectangle Picture"
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
