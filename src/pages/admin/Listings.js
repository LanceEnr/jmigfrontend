import React, { useState } from "react";
import ManageListings from "./ManageListings";
import AddListing from "./AddListing";
import EditListing from "./EditListing";

export default function Listings() {
  const [view, setView] = useState("manage"); // 'manage', 'add', or 'edit'
  const [selectedListing, setSelectedListing] = useState(null); // The listing to edit

  const handleAddClick = () => {
    setView("add");
  };

  const handleEditClick = (listing) => {
    setSelectedListing(listing);
    setView("edit");
  };

  const handleBackClick = () => {
    setView("manage");
  };

  if (view === "manage") {
    return (
      <ManageListings
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
      />
    );
  } else if (view === "add") {
    return <AddListing onBackClick={handleBackClick} />;
  } else if (view === "edit") {
    return (
      <EditListing listing={selectedListing} onBackClick={handleBackClick} />
    );
  }
}
