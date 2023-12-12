import React, { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import Typography from "../../components/common/Typography";
import AddIcon from "@mui/icons-material/Add";

import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";

import {
  List,
  ListItem,
  ListItemText,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  IconButton,
  DialogContentText,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  Modal,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";

const JobOrderModal = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  jobOrder,
  formData,
  setFormData,
}) => {
  const [origin, setOrigin] = useState(formData.origin);
  const [destination, setDestination] = useState(formData.destination);
  const [driverName, setDriverName] = useState(formData.driverName);
  const [cargo, setCargo] = useState(formData.cargo);
  const [weight, setWeight] = useState(formData.weight);
  const [dateTime, setDateTime] = useState(formData.dateTime);
  const [drivers, setDrivers] = useState([]);
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [UID, setUID] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleFieldChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (jobOrder) {
      const source = jobOrder;
      console.log(source.extendedProps);

      const extendedProps = source.extendedProps || {};

      setFormData({
        origin: extendedProps.origin || "",
        destination: extendedProps.destination || "",
        driverName: extendedProps.driverName || "",
        cargo: extendedProps.cargo || "",
        weight: extendedProps.weight || 0,
        dateTime: source.start || "",
        instructions: extendedProps.instructions || "",
        UID: extendedProps.uid || "",
      });

      // Set state values for fields
      setOrigin(extendedProps.origin || "");
      setDestination(extendedProps.destination || "");
      setDriverName(extendedProps.driverName || "");
      setCargo(extendedProps.cargo || "");
      setWeight(extendedProps.weight || 0);
      setDateTime(extendedProps.dateTime || "");
      setInstructions(extendedProps.instructions || "");
      setUID(extendedProps.uid || "");
    } else {
      // Reset form data if jobOrder is null
      setFormData({
        origin: "",
        destination: "",
        driverName: "",
        cargo: "",
        weight: "",
        dateTime: "",
        instructions: "",
      });

      // Reset state values for fields
      setOrigin("");
      setDestination("");
      setDriverName("");
      setCargo("");
      setWeight("");
      setDateTime("");
      setInstructions("");
    }
  }, [jobOrder, setFormData]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/get-products3`
        );
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);
  useEffect(() => {
    async function fetchDrivers() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/fetch-trucks`
        );
        if (response.ok) {
          const data = await response.json();
          const driverNames = Object.keys(data).map(
            (key) => data[key].driverName
          );
          const uid = Object.keys(data).map((key) => data[key].id);
          setDrivers(driverNames);
          setUID(uid);
        } else {
          console.error("Failed to fetch drivers");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchDrivers();
  }, []);

  const handleSubmit = () => {
    if (isFormComplete) {
      onSubmit(formData, jobOrder);
    }
  };

  const isFormComplete = () => {
    return (
      origin !== "" &&
      destination !== "" &&
      driverName !== "" &&
      cargo !== "" &&
      weight !== "" &&
      dateTime !== "" &&
      instructions !== ""
    );
  };
  const isSubmitDisabled =
    jobOrder && jobOrder.extendedProps.status !== "order";

  const isDeleteDisabled =
    jobOrder && jobOrder.extendedProps.status !== "order";

  useEffect(() => {
    const currentDate = new Date();

    currentDate.setDate(currentDate.getDate() + 1);

    currentDate.setHours(0, 0, 0, 0);

    const minDateFormatted = currentDate.toISOString().slice(0, 16);

    setDateTime(minDateFormatted);
  }, []);
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
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
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            {jobOrder ? "Edit Job Order" : "Create Job Order"}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider
          style={{
            borderStyle: "dashed",
            borderColor: "#bd8512",
            marginBottom: "4px",
          }}
        />

        <Box sx={{ my: 2 }}>
          <FormControl sx={{ mb: 2 }} fullWidth>
            <InputLabel id="driver-label">Driver Name:</InputLabel>
            <Select
              labelId="driver-label"
              id="driverName"
              name="driverName"
              disabled={isDeleteDisabled}
              value={driverName}
              onChange={(event) => {
                setDriverName(event.target.value);
                handleFieldChange("driverName", event.target.value);
              }}
              fullWidth
              required
              label="Driver Name"
            >
              {drivers.map((driverName) => (
                <MenuItem key={driverName} value={driverName}>
                  {driverName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="origin-label">Origin</InputLabel>
            <Select
              labelId="origin-label"
              value={origin}
              disabled={isDeleteDisabled}
              onChange={(event) => {
                setOrigin(event.target.value);
                handleFieldChange("origin", event.target.value);
              }}
              label="Origin"
              required
            >
              <MenuItem value="DFS Pampanga">DFS Pampanga</MenuItem>
              <MenuItem value="Gainersand Corporation">
                Gainersand Corporation
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="destination-label">Destination</InputLabel>
            <Select
              labelId="destination-label"
              value={destination}
              disabled={isDeleteDisabled}
              onChange={(event) => {
                setDestination(event.target.value);
                handleFieldChange("destination", event.target.value);
              }}
              label="Destination"
              required
            >
              <MenuItem value="Pandi">Pandi</MenuItem>
              <MenuItem value="Mindanao">Mindanao Ave.</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="product-label">Product</InputLabel>
            <Select
              labelId="product-label"
              id="productName"
              name="cargo"
              value={cargo}
              disabled={isDeleteDisabled}
              required
              onChange={(event) => {
                setCargo(event.target.value);
                handleFieldChange("cargo", event.target.value);
              }}
              label="Product"
            >
              {products.map((product, index) => (
                <MenuItem key={index} value={product}>
                  {product}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Weight"
              type="number"
              value={weight}
              onChange={(event) => {
                setWeight(event.target.value);
                handleFieldChange("weight", event.target.value);
              }}
              disabled={isDeleteDisabled}
              fullWidth
              required
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Instructions"
              onChange={(event) => {
                setInstructions(event.target.value);
                handleFieldChange("instructions", event.target.value);
              }}
              fullWidth
              value={instructions}
              disabled={isDeleteDisabled}
              required
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Date Time"
              type="datetime-local"
              value={dateTime}
              required
              disabled={isDeleteDisabled}
              onChange={(event) => {
                setDateTime(event.target.value);
                handleFieldChange("dateTime", event.target.value);
              }}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start" />,
                required: true,
                inputProps: { min: dateTime },
              }}
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", mt: 2 }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!isFormComplete || isSubmitDisabled}
          >
            Submit
          </Button>
          {jobOrder && (
            <Button
              onClick={() => onDelete(jobOrder)}
              color="error"
              variant="contained"
              className="MuiButton-error"
              startIcon={<CancelIcon />}
              disabled={isDeleteDisabled}
              sx={{ ml: 1 }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

const ValidationDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  onCancel2,
  formData,
}) => {
  const handleConfirm = async () => {
    try {
      console.log(formData);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/addJob`,
        formData
      );
      if (response.status === 200) {
        console.log("Data submitted successfully!");
        toast.success("Job added/edited successfully!");
        window.location.reload();
      } else {
        console.error("Failed to submit data");
        toast.error("Please try again!");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }

    onConfirm();
  };

  return (
    <Dialog open={isOpen} onClose={onCancel}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please note, once you proceed, the changes will be saved.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const DeleteValidationDialog = ({
  isOpen,
  onConfirm2,
  onCancel,
  onCancel2,
  formData,
}) => {
  const handleConfirm2 = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/deleteJob`,
        formData
      );
      if (response.status === 200) {
        console.log("Data submitted successfully!");
        toast.success("Job deleted successfully!");
      } else {
        console.error("Failed to submit data");
        toast.error("Please try again!");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
    onConfirm2();
  };

  return (
    <Dialog open={isOpen} onClose={onCancel2}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please note, once you proceed, the job order will be canceled.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel2} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleConfirm2} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main component
const JobOrderSystem = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [action, setAction] = useState(null);
  const [formattedEvents, setFormattedEvents] = useState([]);

  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    driverName: "",
    cargo: "",
    weight: "",
    dateTime: "",
    UID: "",
    instructions: "",
  });

  useEffect(() => {
    async function fetchJobOrders() {
      try {
        const jobOrdersResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-job-orders`
        );

        const jobRecordsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-job-records`
        );

        if (jobOrdersResponse.status === 200) {
          const jobOrdersData = jobOrdersResponse.data;
          const jobRecordsData = jobRecordsResponse.data;

          const uniqueDateTimes = new Set();

          const jobOrders = Object.values(jobOrdersData)
            .map((jobOrderData) => {
              const driverName = jobOrderData.driverName;
              const cargo = jobOrderData.cargo;
              const weight = jobOrderData.weight;
              const dateTime = jobOrderData.dateTime;
              const origin = jobOrderData.origin;
              const destination = jobOrderData.destination;
              const instructions = jobOrderData.instructions;
              const uid = jobOrderData.UID;

              if (!uniqueDateTimes.has(dateTime)) {
                uniqueDateTimes.add(dateTime);

                return {
                  title: `${driverName} - ${cargo} - ${weight} cu. mt.- (${origin}- ${destination})`,
                  start: dateTime,
                  status: "order",
                  driverName,
                  cargo,
                  weight,
                  dateTime,
                  origin,
                  destination,
                  instructions,
                  uid,
                };
              }

              return null;
            })
            .filter(Boolean);

          const jobRecords = Object.values(jobRecordsData)
            .map((uidData) => {
              return Object.values(uidData).map((idData) => {
                const driverName = idData.driverName;
                const cargo = idData.cargo;
                const weight = idData.weight;
                const dateTime = idData.dateTime;
                const origin = idData.origin;
                const destination = idData.destination;
                const instructions = idData.instructions;
                if (!uniqueDateTimes.has(dateTime)) {
                  uniqueDateTimes.add(dateTime);

                  return {
                    title: `${driverName} - ${cargo} - ${weight} cu. mt.- (${origin}- ${destination})`,
                    start: dateTime,
                    status: "records",
                    driverName,
                    cargo,
                    weight,
                    dateTime,
                    origin,
                    destination,
                    instructions,
                  };
                }

                return null;
              });
            })
            .flat()
            .filter(Boolean);

          const mergedEvents = [...jobOrders, ...jobRecords];

          setEvents(mergedEvents);
        } else {
          console.error("Failed to fetch job orders or job records");
        }
      } catch (error) {
        console.error("Error fetching job orders or job records:", error);
      }
    }

    fetchJobOrders();
  }, []);

  const handleCreateClick = () => {
    setSelectedEvent(null); // Clear selected event
    setModalOpen(true);
  };
  const handleDelete = (event) => {
    setAction(() => () => {
      setEvents(events.filter((e) => e.id !== event.id)); // Compare ids here
      setModalOpen(false);
    });
    setDeteleteDiaglogOpen(true);
  };

  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [deteleteDiaglogOpen, setDeteleteDiaglogOpen] = useState(false);

  const handleSubmit = (jobOrderData, event) => {
    setAction(() => () => {
      if (event) {
        // Edit existing event
        event.setProp(
          "title",
          `${jobOrderData.driverName} - ${jobOrderData.cargo} - ${jobOrderData.weight} - ${jobOrderData.origin} to ${jobOrderData.destination}`
        );

        event.setStart(jobOrderData.dateTime);
        event.setExtendedProp("driverName", jobOrderData.driverName);
        event.setExtendedProp("cargo", jobOrderData.cargo);
        event.setExtendedProp("weight", jobOrderData.weight);
        event.setExtendedProp("origin", jobOrderData.origin);
        event.setExtendedProp("destination", jobOrderData.destination);
      } else {
        setEvents([
          ...events,
          {
            id: Math.random().toString(),
            title: `${jobOrderData.driverName} - ${jobOrderData.cargo} - ${jobOrderData.weight} - ${jobOrderData.origin} to ${jobOrderData.destination}`,
            start: jobOrderData.dateTime,
            extendedProps: {
              driverName: jobOrderData.driverName,
              cargo: jobOrderData.cargo,
              weight: jobOrderData.weight,
              origin: jobOrderData.origin,
              destination: jobOrderData.destination,
            },
          },
        ]);
      }

      setModalOpen(false);
    });
    setValidationDialogOpen(true);
  };

  const handleEventClick = ({ event }) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  function renderEventContent(eventInfo) {
    const backgroundColor =
      eventInfo.event.extendedProps.status === "order"
        ? "info.light"
        : "success.light";

    return (
      <Box
        sx={{
          color: "white",
          backgroundColor: backgroundColor,
          p: 1,
          m: 1,
          overflow: "hidden",
          wordWrap: "break-word",
          whiteSpace: "normal",
          borderRadius: 1,
          cursor: "pointer",
        }}
      >
        <Typography variant="overline" sx={{ fontWeight: "bold" }}>
          {eventInfo.timeText}
        </Typography>
        <Typography variant="caption"> - {eventInfo.event.title}</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ my: 4 }}>
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
          Job Orders
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateClick}
          startIcon={<AddIcon />}
          sx={{ ml: 1 }}
        >
          Create Job Order
        </Button>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <Paper
            sx={{
              mt: 1,
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: "74vh",
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: "bold", py: 1 }}
              gutterBottom
            >
              ONGOING JOB ORDERS
            </Typography>
            <Divider />
            <Box
              sx={{
                px: 1,
                overflow: "auto",
                "&::-webkit-scrollbar": {
                  width: "0.5em",
                },
                "&::-webkit-scrollbar-track": {
                  boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                  webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(169,169,169,1)", // Default grey color
                  borderRadius: "10px", // Slightly rounded corners
                },
              }}
            >
              <List dense={true}>
                {events.filter((event) => event.status === "order").length >
                0 ? (
                  events
                    .filter((event) => event.status === "order")
                    .map((event) => (
                      <ListItem
                        sx={{
                          color: "white",
                          backgroundColor: "info.light",
                          p: 1,
                          overflow: "hidden",
                          borderRadius: 1,
                          mb: 1,
                        }}
                        key={event.id}
                      >
                        <ListItemText sx={{ color: "white" }}>
                          <Box>
                            <Typography
                              sx={{ fontWeight: "bold" }}
                              variant="overline"
                            >
                              {event.driverName}
                            </Typography>
                          </Box>
                          <Box mb={1}>
                            <Typography variant="caption">
                              {event.weight} cu. mt. of {event.cargo}
                            </Typography>
                          </Box>
                          <Box mb={1}>
                            <Typography variant="caption">
                              {event.origin} to {event.destination}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption">
                              {new Date(event.start).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </ListItemText>
                      </ListItem>
                    ))
                ) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ textAlign: "center", mt: 2 }}
                  >
                    No ongoing job orders
                  </Typography>
                )}
              </List>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={10}>
          <Paper
            sx={{
              mt: 1,
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <JobOrderModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              jobOrder={selectedEvent}
              formData={formData}
              setFormData={setFormData}
            />
            <FullCalendar
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
                interactionPlugin,
              ]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,dayGridDay,listWeek",
              }}
              initialView="dayGridMonth"
              events={events}
              eventClick={handleEventClick}
              eventContent={renderEventContent}
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                meridiem: "short",
              }}
              height={"74vh"}
              width={"100%"}
            />

            <ValidationDialog
              isOpen={validationDialogOpen}
              onConfirm={() => {
                action(formData);
                setValidationDialogOpen(false);
              }}
              onCancel={() => setValidationDialogOpen(false)}
              formData={formData} // Pass formData as a prop
            />
            <DeleteValidationDialog
              isOpen={deteleteDiaglogOpen}
              onConfirm2={() => {
                action(formData);
                setDeteleteDiaglogOpen(false);
              }}
              onCancel2={() => setDeteleteDiaglogOpen(false)}
              formData={formData} // Pass formData as a prop
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobOrderSystem;
