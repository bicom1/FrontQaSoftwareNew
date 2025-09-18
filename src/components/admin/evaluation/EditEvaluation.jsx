//EditEvaluation.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
// import { createWebhookEscalationApi } from "../../../features/escalationsApi";

const EditEvaluation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const row = location.state?.row;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  

  // State for form fields
  const [formData, setFormData] = useState(row || {
    useremail: '',
    leadID: '',
    agentName: '',
    mod:'',
    teamleader: '',
    greetings: '',
    accuracy: '',
    building: '',
    presenting: '',
    closing: '',
    bonus: '',
    evaluationsummary: '',
    rating: ''
  });



  // Function to check if all required fields are filled
  const isFormComplete = () => {
    const requiredFields = [
      'useremail', 'leadID', 'agentName','mod', 'teamleader',
      'greetings', 'accuracy', 'building', 'presenting', 'closing',
      'bonus', 'evaluationsummary', 'rating'
    ];
    
    return requiredFields.every(field => 
      formData[field] && formData[field].toString().trim() !== ''
    );
  };

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
      // Determine status based on form completion
      const status = isFormComplete() ? 'published' : 'draft';
      const updatedFormData = {
        ...formData,
        status: status
      };

      // Send the updated data to your API
      await createWebhookEscalationApi(row.id, updatedFormData);
      alert(`Evaluation ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
      navigate(-1); // Go back to previous page
    } catch (err) {
      setError(err.message || "Failed to update Evaluation");
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
          <h2>Edit Evalutions</h2>
        </div>
        <div style={noDataStyle}>
          <p>No evaluation data found. Please go back and select an evaluation to edit.</p>
          <button style={buttonStyle} onClick={handleCancel}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const completionPercentage = (() => {
    const requiredFields = [
      'useremail', 'leadID', 'agentName','mod', 'teamleader',
      'greetings', 'accuracy', 'building', 'presenting', 'closing',
      'bonus', 'evaluationsummary', 'rating'
    ];
    const filledFields = requiredFields.filter(field => 
      formData[field] && formData[field].toString().trim() !== ''
    ).length;
    return Math.round((filledFields / requiredFields.length) * 100);
  })();

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={handleCancel}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2>Edit Evaluation</h2>
          <div style={progressContainerStyle}>
            <div style={progressBarStyle}>
              <div 
                style={{
                  ...progressFillStyle,
                  width: `${completionPercentage}%`,
                  backgroundColor: completionPercentage === 100 ? '#10b981' : '#3b82f6'
                }}
              ></div>
            </div>
            <span style={progressTextStyle}>
              {completionPercentage}% Complete {completionPercentage === 100 && '✓'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGridStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Email *</label>
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
            <label style={labelStyle}>Lead ID *</label>
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
            <label style={labelStyle}>Agent Name *</label>
            <input
              type="text"
              name="agentName"
              value={formData.agentName}
              onChange={handleInputChange}
              style={inputStyle}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Team Leader *</label>
            <input
              type="text"
              name="teamleader"
              value={formData.teamleader}
              onChange={handleInputChange}
              style={inputStyle}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Greetings *</label>
            <input
              type="text"
              name="greetings"
              value={formData.greetings}
              onChange={handleInputChange}
              style={inputStyle}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Accuracy *</label>
            <input
              name="accuracy"
              value={formData.accuracy}
              onChange={handleInputChange}
              style={inputStyle}
              required
            >
            </input>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Presnting *</label>
            <input
              name="presenting"
              value={formData.presenting}
              onChange={handleInputChange}
              style={inputStyle}
              required
            >
            </input>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Closing*</label>
            <textarea
              name="closing"
              value={formData.closing}
              onChange={handleInputChange}
              style={{...inputStyle, minHeight: '80px'}}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Bonus*</label>
            <textarea
              name="bonus"
              value={formData.bonus}
              onChange={handleInputChange}
              style={{...inputStyle, minHeight: '80px'}}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Evaluationsummary *</label>
            <textarea
              name="evaluationsummary"
              value={formData.evaluationsummary}
              onChange={handleInputChange}
              style={{...inputStyle, minHeight: '80px'}}
              required
            />
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
            style={{
              ...submitButtonStyle,
              backgroundColor: isFormComplete() ? '#10b981' : '#3b82f6'
            }}
            disabled={isSubmitting}
          >
            <Save size={18} style={{ marginRight: '8px' }} />
            {isSubmitting 
              ? 'Saving...' 
              : isFormComplete() 
                ? 'Publish' 
                : 'Save as Draft'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

// Additional styles for progress indicator
const progressContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginTop: '8px'
};

const progressBarStyle = {
  width: '200px',
  height: '8px',
  backgroundColor: '#e5e7eb',
  borderRadius: '4px',
  overflow: 'hidden'
};

const progressFillStyle = {
  height: '100%',
  transition: 'width 0.3s ease, background-color 0.3s ease'
};

const progressTextStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#374151'
};

// Existing styles
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
  alignItems: 'flex-start',
  marginBottom: '32px',
  paddingBottom: '16px',
  borderBottom: '2px solid #e5e7eb'
};

const backButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '16px',
  marginTop: '4px',
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

export default EditEvaluation;