import React from "react";
import { useLocation } from "react-router-dom";

const EditEscalation = () => {
  const location = useLocation();
  const row = location.state?.row; // ✅ row data comes from table

  return (
    <div>
      <h2>Edit Escalation</h2>
      {row ? (
        <div>
          <p><strong>ID:</strong> {row._id}</p>
          <p><strong>Email:</strong> {row.useremail}</p>
          <p><strong>Lead ID:</strong> {row.leadID}</p>
          <p><strong>Agent Name:</strong> {row.agentName}</p>
          {/* add all other fields here */}
        </div>
      ) : (
        <p>No data found</p>
      )}
    </div>
  );
};

export default EditEscalation;
