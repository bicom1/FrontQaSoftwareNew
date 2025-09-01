// src/components/BitrixLeadDetails.jsx
import React, { useEffect, useState } from "react";
import { getBitrixLeadDetailsById } from "../features/bitrixApi";
import { Phone, User, MapPin, Mail, LoaderCircle } from "lucide-react";

const BitrixLeadDetails = ({ leadId }) => {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        console.log("🔍 Fetching lead for ID:", leadId);
        const res = await getBitrixLeadDetailsById(leadId);
        console.log("✅ Received lead:", res);
        setLead(res || null);
      } catch (err) {
        console.error("❌ Error fetching Bitrix lead:", err);
        setLead(null);
      } finally {
        setLoading(false);
      }
    };

    if (leadId) fetchLead();
  }, [leadId]);

  if (loading) {
    return (
      <div className="text-center py-4 text-muted">
        <LoaderCircle className="mb-2 animate-spin" />
        <p>Loading lead details...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="alert alert-warning">
        No lead data found for ID <strong>{leadId}</strong>
      </div>
    );
  }

  return (
    <div className="row g-3">
      {/* Basic Info */}
      <div className="col-md-6">
        <div className="border rounded p-3 shadow-sm bg-light h-100">
          <h5 className="mb-3 d-flex align-items-center">
            <User size={20} className="me-2 text-primary" />
            Basic Info
          </h5>
          <p><strong>Name:</strong> {lead.data.NAME || "N/A"} {lead.data.LAST_NAME || ""}</p>
          <p><strong>Status:</strong> {lead.data.STATUS_DESCRIPTION || "N/A"}</p>
          <p><strong>Source:</strong> {lead.data.SOURCE_DESCRIPTION || "N/A"}</p>
        </div>
      </div>

      Contact Info
      <div className="col-md-6">
        <div className="border rounded p-3 shadow-sm bg-light h-100">
          <h5 className="mb-3 d-flex align-items-center">
            <Mail size={20} className="me-2 text-success" />
            Contact Info
          </h5>
          <p><strong>Email:</strong> {lead.data.EMAIL?.[0]?.VALUE || "N/A"}</p>
          <p><strong>Phone:</strong> {lead.data.PHONE.VALUE?.[0]?.VALUE || "N/A"}</p>
          <p><strong>City:</strong> {lead.data.ADDRESS_CITY || "N/A"}</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="col-12">
        <div className="border rounded p-3 shadow-sm bg-light">
          <h5 className="mb-3 d-flex align-items-center">
            <MapPin size={20} className="me-2 text-warning" />
            Additional Details
          </h5>
          <p><strong>Company:</strong> {lead.data.COMPANY_TITLE || "N/A"}</p>
          <p><strong>Assigned To:</strong> {lead.data.ASSIGNED_BY_NAME || "N/A"}</p>
          <p><strong>Created On:</strong> {lead.data.DATE_CREATE || "N/A"}</p>
          <p><strong>Comments:</strong> {lead.data.COMMENTS || "No comments"}</p>
        </div>
      </div>
    </div>
  );
};

export default BitrixLeadDetails;
