import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import {  updateEscalationApi,  } from "../../../features/escalationsApi";

const EditEscalation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const row = location.state?.row;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // State for form fields
  const [formData, setFormData] = useState(row || {
    useremail: '',
    leadID: '',
    evaluatedby: '',
    agentName: '',
    teamleader: '',
    leadSource: '',
    leadStatus: '',
    escSeverity: '',
    issueIden: '',
    escAction: '',
    documentation: '',
    successmaration: '',
    userrating: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      // Send the updated data to your API
      await updateEscalationApi(row._id, formData);
      alert('Escalation updated successfully!');
      navigate(-1); // Go back to previous page
    } catch (err) {
      setError(err.message || "Failed to update escalation");
      console.error('Update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  if (!row) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2>Edit Escalation</h2>
        </div>
        <div style={noDataStyle}>
          <p>No escalation data found. Please go back and select an escalation to edit.</p>
          <button style={buttonStyle} onClick={handleCancel}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={handleCancel}>
          <ArrowLeft size={20} />
        </button>
        <h2>Edit Escalation</h2>
      </div>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGridStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="useremail"
              value={formData.useremail}
              onChange={handleInputChange}
              style={inputStyle}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Lead ID</label>
            <input
              type="text"
              name="leadID"
              value={formData.leadID}
              onChange={handleInputChange}
              style={inputStyle}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Evaluated By</label>
            <input
              type="text"
              name="evaluatedby"
              value={formData.evaluatedby}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Agent Name</label>
            <input
              type="text"
              name="agentName"
              value={formData.agentName}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Team Leader</label>
            <input
              type="text"
              name="teamleader"
              value={formData.teamleader}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Lead Source</label>
            <input
              type="text"
              name="teamleader"
              value={formData.leadsource}
              onChange={handleInputChange}
              style={inputStyle}
            />
          
              {/* <option value="">Select Source</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Social Media">Social Media</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Email Campaign">Email Campaign</option> */}
        
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Lead Status</label>
            <select
              name="leadStatus"
              value={formData.leadStatus}
              onChange={handleInputChange}
              style={inputStyle}
            >
              <option value="">Select Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Unqualified">Unqualified</option>
              <option value="Converted">Converted</option>
              <option value="Escalated">Escalated</option>
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Escalation Severity</label>
            <select
              name="escSeverity"
              value={formData.escSeverity}
              onChange={handleInputChange}
              style={inputStyle}
            >
              <option value="">Select Severity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Issue Identified</label>
            <textarea
              name="issueIden"
              value={formData.issueIden}
              onChange={handleInputChange}
              style={{...inputStyle, minHeight: '80px'}}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Escalation Action</label>
            <textarea
              name="escAction"
              value={formData.escAction}
              onChange={handleInputChange}
              style={{...inputStyle, minHeight: '80px'}}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Documentation</label>
            <textarea
              name="documentation"
              value={formData.documentation}
              onChange={handleInputChange}
              style={{...inputStyle, minHeight: '80px'}}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Success Metrics</label>
            <textarea
              name="successmaration"
              value={formData.successmaration}
              onChange={handleInputChange}
              style={{...inputStyle, minHeight: '80px'}}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>User Rating</label>
            <select
              name="userrating"
              value={formData.userrating}
              onChange={handleInputChange}
              style={inputStyle}
            >
              <option value="">Select Rating</option>
              <option value="1">1 - Very Poor</option>
              <option value="2">2 - Poor</option>
              <option value="3">3 - Average</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
        </div>

        <div style={buttonContainerStyle}>
          <button 
            type="button" 
            style={cancelButtonStyle} 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            style={submitButtonStyle}
            disabled={isSubmitting}
          >
            <Save size={18} style={{ marginRight: '8px' }} />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Styles

const errorStyle = {
  backgroundColor: '#fee',
  color: '#c33',
  padding: '12px',
  borderRadius: '4px',
  marginBottom: '20px',
  border: '1px solid #fcc'
};


const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '24px',
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '32px',
  paddingBottom: '16px',
  borderBottom: '2px solid #e5e7eb'
};

const backButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '16px',
  padding: '8px',
  backgroundColor: '#f3f4f6',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  ':hover': {
    backgroundColor: '#e5e7eb'
  }
};

const formStyle = {
  backgroundColor: '#ffffff',
  padding: '32px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
};

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '24px',
  marginBottom: '32px'
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const labelStyle = {
  marginBottom: '8px',
  fontWeight: '600',
  color: '#374151',
  fontSize: '14px'
};

const inputStyle = {
  padding: '12px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '16px',
  transition: 'border-color 0.2s ease',
  ':focus': {
    outline: 'none',
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  }
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '16px',
  paddingTop: '24px',
  borderTop: '1px solid #e5e7eb'
};

const buttonStyle = {
  padding: '12px 24px',
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  ':hover': {
    backgroundColor: '#2563eb'
  }
};

const cancelButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#6b7280',
  ':hover': {
    backgroundColor: '#4b5563'
  }
};

const submitButtonStyle = {
  ...buttonStyle,
  display: 'flex',
  alignItems: 'center'
};

const noDataStyle = {
  textAlign: 'center',
  padding: '48px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
};

export default EditEscalation;
