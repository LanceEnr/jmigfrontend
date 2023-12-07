import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  List,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  ListItem,
  Tooltip,
  Typography,
  Avatar,
  Paper,
  Box,
  Pagination,
  useMediaQuery,
  Grid,
  Divider,
  Chip,
  Stepper,
  Step,
  StepLabel,
  ListItemIcon,
  Modal,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import UserDrawer from "./common/UserDrawer";
import PersonIcon from "@mui/icons-material/Person";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import PrintIcon from "@mui/icons-material/Print";
import ReactToPrint from "react-to-print";

const getColor = (status) => {
  switch (status) {
    case "Available for pickup-PANDI":
      return { main: "success.main", lighter: "#8dd290" };
    case "Available for pickup-MindanaoAve.":
      return { main: "success.main", lighter: "#8dd290" };
    case "Delayed":
      return { main: "error.main", lighter: "#f5c9c9" };
    case "Cancelled":
      return { main: "error.main", lighter: "#f5c9c9" };
    case "Pending":
      return { main: "warning.main", lighter: "#ffc890" };
    case "Fetch from quarry":
      return { main: "warning.main", lighter: "#ffc890" };
    case "Arrived at Pandi":
      return { main: "warning.main", lighter: "#ffc890" };
    case "Arrived at MindanaoAve.":
      return { main: "warning.main", lighter: "#ffc890" };
    default:
      return { main: "", lighter: "" };
  }
};

export default function OrdersTable1(props) {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const itemsPerPage = 6;
  const [page, setPage] = useState(1);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [name, setName] = useState(null);
  const [materialType, setMaterialType] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [amount, setAmount] = useState(null);
  const [status, setStatus] = useState(null);
  const [orderDet, setOrderDet] = useState(null);
  const componentRef = React.useRef();

  const steps = ["Processing", "In Transit", "Completed"];
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleListItemClick = (
    orderId,
    price,
    materialType,
    name,
    orderDet,
    quantity,
    status
  ) => {
    setSelectedOrderId(orderId);
    setAmount(price);
    setMaterialType(materialType);
    const modifiedString = name.replace(/_/g, " ");
    setName(modifiedString);
    setOrderDet(orderDet);
    setQuantity(quantity);
    setStatus(status);
    openModal();
  };
  const getStepperColor = (status, index) => {
    switch (status) {
      case "Pending":
        return index === 0 ? "warning.main" : "";
      case "Fetch from quarry":
        return index === 0 || index === 1 ? "warning.main" : "error.main";
      case "Arrived at Pandi":
        return index === 0 || index === 1 ? "info.main" : "error.main";
      case "Arrived at MindanaoAve.":
        return index === 0 || index === 1 ? "info.main" : "error.main";
      case "Delayed":
        return index === 0 || index === 1 ? "warning.main" : "error.main";
      case "In Transit":
        return index === 0 || index === 1 ? "info.main" : "error.main";
      case "Available for pickup-MindanaoAve.":
        return index === 0 || index === 1 ? "success.main" : "error.main";
      case "Available for pickup-PANDI":
        return index === 0 || index === 1 ? "success.main" : "error.main";
      case "Completed":
        return "success.main";
      case "Cancelled":
        return "error.main";
      default:
        return "error.main";
    }
  };

  const description = `${materialType} - ${quantity} cu. mt.`;
  const price = `Amount: ₱${Number(amount * quantity).toLocaleString("en-US")}`;

  const modalBody = (
    <Grid
      id="modal-body"
      ref={componentRef}
      container
      justifyContent="center"
      alignItems="center"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Grid
        item
        xs={11}
        sm={8}
        md={6}
        lg={4}
        component={Box}
        sx={{
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "16px",
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" component="div">
              Receipt
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold", ml: 1 }}
            >
              #{selectedOrderId}
            </Typography>
            {!fullScreen && (
              <Chip
                label={status}
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#2196f3",

                  ml: 1,
                }}
              />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <ReactToPrint
              trigger={() => (
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="print"
                  sx={{
                    mr: 1,
                  }}
                >
                  <PrintIcon />
                </IconButton>
              )}
              content={() => componentRef.current}
            />

            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseModal}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Divider style={{ borderStyle: "dashed", borderColor: "#bd8512" }} />

        {!fullScreen && (
          <Box sx={{ width: "100%", py: 2 }}>
            <Stepper activeStep={2}>
              {steps.map((label, index) => (
                <Step key={label} completed={index <= 2}>
                  <StepLabel
                    StepIconProps={{
                      style: {
                        color: getStepperColor(status, index),
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        <ListItem>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary={name} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Inventory2Icon />
          </ListItemIcon>
          <ListItemText primary={description} />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary={price} />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography sx={{ color: "success.main" }}>{orderDet}</Typography>
            }
          />
        </ListItem>
      </Grid>
    </Grid>
  );

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (event, value) => {
    setPage(value);
  };

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const storedUsername = localStorage.getItem("userName");
    if (storedUsername) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/order?userName=${storedUsername}`
        )
        .then((response) => {
          setOrders(response.data);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
    }
  }, []);
  return (
    <div>
      <List
        component="nav"
        sx={{
          px: 0,
          py: 0,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: "bold", my: 1 }}
          >
            <ShoppingCartIcon
              sx={{ color: "#83948a", mr: 2, verticalAlign: "middle" }}
            />
            Orders
          </Typography>
          {isMobile && (
            <UserDrawer
              onActiveComponentChange={props.onActiveComponentChange}
            />
          )}
        </Box>
        {orders.length === 0 ? (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ textAlign: "center", mt: 2 }}
          >
            You have no orders
          </Typography>
        ) : (
          orders
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((item, index) => (
              <Paper elevation={2} sx={{ my: 1 }} key={item.orderNumber}>
                <ListItem
                  onClick={() =>
                    handleListItemClick(
                      item._orderNum,
                      item._price,
                      item._materialType,
                      item._name,
                      item._orderDet,
                      item._quantity,
                      item._status
                    )
                  }
                  sx={{ cursor: "pointer" }}
                >
                  <ListItemAvatar>
                    <Tooltip title={item._status}>
                      <Avatar
                        sx={{
                          bgcolor: getColor(item._status).lighter,
                          color: getColor(item._status).main,
                        }}
                      >
                        {item._status === "Available for pickup-PANDI" && (
                          <CheckIcon sx={{ pointerEvents: "none" }} />
                        )}
                        {item._status ===
                          "Available for pickup-MindanaoAve." && (
                          <CheckIcon sx={{ pointerEvents: "none" }} />
                        )}
                        {item._status === "Delayed" && (
                          <CloseIcon sx={{ pointerEvents: "none" }} />
                        )}
                        {item._status === "Cancelled" && (
                          <CloseIcon sx={{ pointerEvents: "none" }} />
                        )}
                        {item._status === "Pending" && (
                          <AccessTimeIcon sx={{ pointerEvents: "none" }} />
                        )}
                        {item._status === "Fetch from quarry" && (
                          <AccessTimeIcon sx={{ pointerEvents: "none" }} />
                        )}
                        {item._status === "Arrived at Pandi" && (
                          <AccessTimeIcon sx={{ pointerEvents: "none" }} />
                        )}
                        {item._status === "Arrived at MindanaoAve." && (
                          <AccessTimeIcon sx={{ pointerEvents: "none" }} />
                        )}
                      </Avatar>
                    </Tooltip>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography
                        sx={{ fontWeight: "bold" }}
                        variant="subtitle1"
                      >{`Order #${item._orderNum}`}</Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ color: "#83948a" }}
                          variant="body2"
                          noWrap
                        >
                          {item._date}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Stack alignItems="flex-end">
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "#bd8512" }}
                        noWrap
                      >
                        ₱
                        {Number(item._price * item._quantity).toLocaleString(
                          "en-US"
                        )}
                      </Typography>
                      <Typography
                        sx={{ color: "#83948a" }}
                        variant="body2"
                        noWrap
                      >
                        {item._materialType} - {item._quantity} cu. mt
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
              </Paper>
            ))
        )}
      </List>
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {modalBody}
      </Modal>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={Math.ceil(orders.length / itemsPerPage)}
          page={page}
          onChange={handleChange}
          shape="rounded"
        />
      </Box>
    </div>
  );
}
