import axios from "axios";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Chip } from "@mui/material";

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

const rowsCurrentInventory = transformInventoryData(await fetchInventoryData());

export { rowsCurrentInventory };

const fetchIncomingInventoryData = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/incomingInventory`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const transformIncomingInventoryData = (data) => {
  return data.map((item) => ({
    id: item._inventoryID,
    itemName: item._materialType,
    quantity: item._quantity,
    name: item._name,
    date: item._date,
    location: item._location,
  }));
};

const rowsIncomingInventory = transformIncomingInventoryData(
  await fetchIncomingInventoryData()
);

export { rowsIncomingInventory };

const fetchOutgoingInventoryData = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/outgoingInventory`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const transformOutgoingInventoryData = (data) => {
  return data.map((item) => ({
    id: item._inventoryID,
    itemName: item._itemName,
    quantity: item._quantity,
    destinationLocation: item._location,
    dateDispatched: new Date(item._lastUpdated),
  }));
};

const rowsOutgoingInventory = transformOutgoingInventoryData(
  await fetchOutgoingInventoryData()
);

export { rowsOutgoingInventory };

const transformFleetData = (data) => {
  const transformedData = [];

  if (data) {
    for (const uid in data) {
      if (data.hasOwnProperty(uid)) {
        const userData = data[uid];

        const mappedData = {
          id: uid,
          driverName: userData.driverName,
          bodyNo: userData.bodyNo,
          plateNo: userData.plateNo,
          plateNo2: userData.plateNo2,
          chassisNo: userData.chassisNo,
          engineNo: userData.engineNo,
          model: userData.model,
          mileage: userData.mileage,
          status: userData.status,
          location: userData.location,
        };

        transformedData.push(mappedData);
      }
    }
  }

  return transformedData;
};

const fetchFleetInformation = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-trucks`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const rowsFleetInformation = transformFleetData(await fetchFleetInformation());

export { rowsFleetInformation };

const transformDriverData = (data) => {
  const transformedData = [];
  console.log(data);
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

const rowsDriverManagement = transformDriverData(
  await fetchDriverInformation()
);

export { rowsDriverManagement };

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};
export const columnsDriverManagement = [
  { field: "id", headerName: "ID", flex: 1 },
  {
    field: "profilePicture",
    headerName: "Picture",
    flex: 1,
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
  { field: "driverName", headerName: "Name", flex: 1, editable: true },
  { field: "contact", headerName: "Contact", flex: 1, editable: true },
  {
    field: "date",
    headerName: "Hire Date",
    flex: 1,
    editable: true,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
  },
  { field: "email", headerName: "Email", flex: 1, editable: true },
  { field: "licenseNo", headerName: "License", flex: 1, editable: true },
];

const transformUpcomingInspectionData = (data) => {
  const transformedData = [];
  if (data) {
    for (const uid in data) {
      if (data.hasOwnProperty(uid)) {
        const userData = data[uid];

        for (const id in userData) {
          if (userData.hasOwnProperty(id)) {
            const inspectionData = userData[id];

            const mappedData = {
              uid: uid,
              id: id,
              plateNo: inspectionData.plateNo,
              inspectionType: inspectionData.inspectionType,
              nextInspectionDate: new Date(inspectionData.nextInspectionDate),
              verdict: inspectionData.verdict,
            };

            transformedData.push(mappedData);
          }
        }
      }
    }
  }

  return transformedData;
};

const fetchUpcomingInspection = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-upcominginspection`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const rowsInspectionScheduling = transformUpcomingInspectionData(
  await fetchUpcomingInspection()
);

export { rowsInspectionScheduling };

const transformInspectionRecordsData = (data) => {
  const transformedData = [];
  if (data) {
    for (const uid in data) {
      if (data.hasOwnProperty(uid)) {
        const userData = data[uid];

        for (const id in userData) {
          if (userData.hasOwnProperty(id)) {
            const inspectionData = userData[id];

            const mappedData = {
              uid: uid,
              id: id,
              plateNo: inspectionData.plateNo,
              inspectionType: inspectionData.inspectionType,
              nextInspectionDate: new Date(inspectionData.nextInspectionDate),
              verdict: inspectionData.verdict,
            };

            transformedData.push(mappedData);
          }
        }
      }
    }
  }

  return transformedData;
};

const fetchInspectionRecords = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-inspectionrecords`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const rowsInspectionRecords = transformInspectionRecordsData(
  await fetchInspectionRecords()
);

export { rowsInspectionRecords };

export const columnsInspectionRecords = [
  {
    field: "id",
    headerName: "ID",
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },
  {
    field: "plateNo",
    headerName: "PLATE NO.",
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },
  {
    field: "inspectionType",
    headerName: "INSPECTION TYPE",
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },

  {
    field: "nextInspectionDate",
    headerName: "INSPECTION DATE",
    type: "date",
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },

  {
    field: "verdict",
    headerName: "VERDICT",
    flex: 1.5,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
    renderCell: (params) => {
      if (params.value === "Passed") {
        return (
          <Chip
            label={
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "success.dark",
                }}
              >
                Passed
              </Typography>
            }
            sx={{ bgcolor: "#8dd290" }}
            size="small"
          />
        );
      } else if (params.value === "On-going") {
        return (
          <Chip
            label={
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "info.dark",
                }}
              >
                On-going
              </Typography>
            }
            sx={{ bgcolor: "#90caf9" }}
            size="small"
          />
        );
      } else if (params.value === "Failed") {
        return (
          <Chip
            label={
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "error.dark",
                }}
              >
                Failed
              </Typography>
            }
            sx={{ bgcolor: "#f5c9c9" }}
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
                  color: "warning.dark",
                }}
              >
                Pending
              </Typography>
            }
            sx={{ bgcolor: "#ffc890" }}
            size="small"
          />
        );
      }
    },
  },
];

const transformMaintenanceData = (data) => {
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
            };

            transformedData.push(mappedData);
          }
        }
      }
    }
  }

  return transformedData;
};

const fetchMaintenance = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/fetch-maintenance`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const rowsMaintenanceScheduling = transformMaintenanceData(
  await fetchMaintenance()
);

export { rowsMaintenanceScheduling };

const CustomTable = () => {
  const [expandedRow, setExpandedRow] = useState(null);

  const handleRowClick = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rowsDriverManagement}
        columns={columnsDriverManagement}
        onRowClick={(params) => handleRowClick(params.id)}
        isRowSelectable={() => false}
        isCellEditable={() => false}
      />
      {expandedRow !== null && (
        <div>
          <p>Additional Information:</p>
          <p>
            Plate Number:{" "}
            {rowsDriverManagement[expandedRow - 1].details.plateNum}
          </p>
          <p>Email: {rowsDriverManagement[expandedRow - 1].details.email}</p>
          <p>
            Password: {rowsDriverManagement[expandedRow - 1].details.password}
          </p>
          <p>
            License No.: {rowsDriverManagement[expandedRow - 1].details.license}
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomTable;

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

const rowsMaintenanceRecords = transformMaintenanceRecordData(
  await fetchMaintenanceRecord()
);

export { rowsMaintenanceRecords };

export const columnsTripVerification = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "driverName", headerName: "Plate No.", flex: 2 },
  {
    field: "dateTime",
    headerName: "Date and Time",
    type: "datetime",
    flex: 2,
  },
  {
    field: "approval",
    headerName: "Approval",
    type: "singleSelect",
    valueOptions: ["Approved", "Rejected", "Pending"],
  },
  {
    field: "verdict",
    headerName: "Verdict",
    flex: 2,
  },
];

export const rowsTripVerification = [
  {
    id: 1,
    plateNo: "ABC123",
    verdict: "Pass",
    inspectionDate: new Date("2024-01-01"),
  },
  {
    id: 2,
    plateNo: "XYZ789",
    verdict: "Fail",
    inspectionDate: new Date("2024-02-01"),
  },
  // Add more rows as needed
];

export const columnsCurrentInventory = [
  { field: "id", headerName: "ID", flex: 1 },
  {
    field: "itemName",
    headerName: "Item Name",
    flex: 2,
    editable: true,
  },
  {
    field: "quantity",
    headerName: "Quantity (cub. mt.)",
    flex: 2,
    editable: true,
  },
  {
    field: "location",
    headerName: "Location",
    flex: 2,
    editable: true,
    type: "singleSelect",
    valueOptions: ["Pandi", "Mindanao Ave."],
  },
  {
    field: "lastUpdated",
    headerName: "Last Updated",
    type: "datetime",
    flex: 3,
  },
];

export const columnsIncomingInventory = [
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
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },

  {
    field: "quantity",
    headerName: "QUANTITY",
    flex: 1,
    valueFormatter: (params) => `${params.value} cu. mt.`,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },
  {
    field: "name",
    headerName: "DRIVER NAME",
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },
  {
    field: "location",
    headerName: "LOCATION",
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },
  {
    field: "date",
    headerName: "DATE ORDERED",
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },
];

export const columnsOutgoingInventory = [
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
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },

  {
    field: "quantity",
    headerName: "QUANTITY",
    flex: 1,
    valueFormatter: (params) => `${params.value} cu. mt.`,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },
  {
    field: "name",
    headerName: "DRIVER NAME",
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },
  {
    field: "location",
    headerName: "LOCATION",
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },
  {
    field: "date",
    headerName: "DATE ORDERED",
    flex: 2,
    renderHeader: (params) => (
      <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "12px" }}>
        {params.colDef.headerName}
      </Typography>
    ),
  },
];

const fetchOrderData = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/get-order`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// Function to transform the data into the desired format
const transformOrderData = (data) => {
  return data.map((item) => ({
    id: item._orderNum,
    customerName: item._name,
    product: item._materialType,
    price: item._price,
    quantity: item._quantity,
    orderDet: item._orderDet,
    lastUpdated: item._date,
    status: item._status,
  }));
};

// Fetch and transform the data for outgoing inventory
const rowsManageOrders = transformOrderData(await fetchOrderData());

// Export the transformed data
export { rowsManageOrders };

const fetchFAQData = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/get-faq`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// Function to transform the data into the desired format
const transformFAQData = (data) => {
  return data.map((item) => ({
    id: item._faqNum,
    question: item._question,
    answer: item._answer,
  }));
};

// Fetch and transform the data for outgoing inventory
const rowsFaqs = transformFAQData(await fetchFAQData());

export { rowsFaqs };

export const columnsUserManagement = [
  { field: "id", headerName: "Username", flex: 1 },
  { field: "name", headerName: "Name", flex: 2 },
  { field: "contact", headerName: "Contact", flex: 2 },
  { field: "orderCount", headerName: "Order Count", flex: 1 },
  { field: "clv", headerName: "Customer Lifetime Value", flex: 2 },
];

const fetchUsers = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/get-customers`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const fetchOrders = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/get-order`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

const transformUsersData = async () => {
  const users = await fetchUsers();
  const orders = await fetchOrders();
  const usersWithOrders = users.map((user) => {
    const userOrders = orders.filter(
      (order) => order._name === `${user._fName}_${user._lName}`
    );
    const clv = userOrders.reduce((totalCLV, order) => {
      const orderValue = order._price * order._quantity;
      return totalCLV + orderValue;
    }, 0);
    return {
      id: user._userName,
      name: `${user._fName} ${user._lName}`,
      contact: user._phone,
      orderCount: userOrders.length,
      clv,
    };
  });
  return usersWithOrders;
};

const rowsUserManagement = await transformUsersData();

export { rowsUserManagement };
