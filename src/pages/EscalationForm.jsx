import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const EscalationForm = () => {
  const [otherReason, setOtherReason] = useState("");
  const [escalation, setEscalation] = useState({
    email: "user@example.com",
    leadId: "",
    evaluatedBy: "",
    agentName: "",
    teamLeader: "",
    leadSource: "",
    leadStatus: "",
    escSeverity: "",
    issueIden: "",
    escAction: "",
    successmaration: "",
    userrating: "",
    audio: null,
  });

  // Static data for team leaders
  const leaders = [
    { _id: "1", leadName: "John Smith" },
    { _id: "2", leadName: "Sarah Johnson" },
    { _id: "3", leadName: "Mike Davis" },
    { _id: "4", leadName: "Emily Wilson" }
  ];

  const handlerEscalation = (name, value) => {
    setEscalation((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const handlerOtherChange = (e) => {
    const value = e.target.value;
    setOtherReason(value);
    if (value.trim() !== "") {
      handlerEscalation("escAction", value);
    }
  };

  const handlerEscForm = () => {
    // Basic validation
    if (
      escalation.leadId.trim() === "" ||
      escalation.evaluatedBy.trim() === "" ||
      escalation.agentName.trim() === "" ||
      escalation.teamLeader.trim() === "" ||
      escalation.leadSource.trim() === "" ||
      escalation.leadStatus.trim() === "" ||
      escalation.escSeverity.trim() === "" ||
      escalation.issueIden.trim() === "" ||
      escalation.userrating.trim() === "" ||
      (escalation.escAction === "Call" && otherReason.trim() === "") ||
      escalation.successmaration.trim() === ""
    ) {
      alert("Please fill all required fields!");
      return;
    }
    
    console.log("Form Data:", escalation);
    alert("Form submitted successfully! Check console for data.");
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            {/* Header */}
            <div className="card shadow-sm mb-4">
              <div className="card-body text-center py-5">
                <h1 className="display-4 fw-bold text-dark mb-2">BI COMM</h1>
                <h2 className="h2 fw-semibold text-danger">Escalation Form</h2>
              </div>
            </div>

            {/* Email Field */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <label className="form-label fw-medium">
                  Enter your email:
                </label>
                <input
                  type="email"
                  placeholder="Enter Your Email Here"
                  value={escalation.email}
                  readOnly
                  className="form-control bg-light text-muted"
                />
              </div>
            </div>

            {/* Lead ID */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <label className="form-label fw-medium">
                  Lead ID:
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Lead ID Here"
                  value={escalation.leadId}
                  onChange={(e) => handlerEscalation("leadId", e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            {/* Evaluated By */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <label className="form-label fw-medium">
                  Evaluated by:
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Name Here"
                  value={escalation.evaluatedBy}
                  onChange={(e) => handlerEscalation("evaluatedBy", e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            {/* Agent Name */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <label className="form-label fw-medium">
                  Agent Name:
                </label>
                <input
                  type="text"
                  placeholder="Enter Agent Name Here"
                  value={escalation.agentName}
                  onChange={(e) => handlerEscalation("agentName", e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            {/* Team Leader */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h3 className="h5 fw-semibold mb-3">Team Leader</h3>
                <div className="d-grid gap-2">
                  {leaders.map((leader) => (
                    <div key={leader._id} className="form-check p-3 border rounded hover-bg-light">
                      <input
                        type="radio"
                        name="teamLeader"
                        value={leader.leadName}
                        checked={escalation.teamLeader === leader.leadName}
                        onChange={(e) => handlerEscalation("teamLeader", e.target.value)}
                        className="form-check-input"
                        id={`leader-${leader._id}`}
                      />
                      <label className="form-check-label" htmlFor={`leader-${leader._id}`}>
                        {leader.leadName}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lead Source */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h3 className="h5 fw-semibold mb-3">Lead Source</h3>
                <div className="d-grid gap-2">
                  {["Facebook", "Instagram", "Live chat", "Call", "WhatsApp", "PPC"].map((source) => (
                    <div key={source} className="form-check p-2 hover-bg-light rounded">
                      <input
                        type="radio"
                        name="leadSource"
                        value={source}
                        checked={escalation.leadSource === source}
                        onChange={(e) => handlerEscalation("leadSource", e.target.value)}
                        className="form-check-input"
                        id={`source-${source}`}
                      />
                      <label className="form-check-label" htmlFor={`source-${source}`}>
                        {source}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Rating */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h3 className="h5 fw-semibold mb-3">User Rating</h3>
                <select
                  value={escalation.userrating}
                  onChange={(e) => handlerEscalation("userrating", e.target.value)}
                  className="form-select"
                >
                  <option value="">Select rating</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="bad">Bad</option>
                </select>
              </div>
            </div>

            {/* Lead Status */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h4 className="h5 fw-semibold mb-2">Lead Status</h4>
                <p className="text-muted mb-3">What is the parked status of the lead?</p>
                <textarea
                  placeholder="Your Answer"
                  rows="3"
                  value={escalation.leadStatus}
                  onChange={(e) => handlerEscalation("leadStatus", e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            {/* Escalation Severity */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h3 className="h5 fw-semibold mb-3">Escalation Severity</h3>
                <div className="d-grid gap-2">
                  {[
                    "Urgent Action required",
                    "High",
                    "Repeated"
                  ].map((severity) => (
                    <div key={severity} className="form-check p-3 border rounded hover-bg-light">
                      <input
                        type="radio"
                        name="escSeverity"
                        value={severity}
                        checked={escalation.escSeverity === severity}
                        onChange={(e) => handlerEscalation("escSeverity", e.target.value)}
                        className="form-check-input"
                        id={`severity-${severity}`}
                      />
                      <label className="form-check-label" htmlFor={`severity-${severity}`}>
                        {severity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Issue Identification */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h3 className="h5 fw-semibold mb-3">Issue Identification</h3>
                <div className="d-grid gap-2">
                  {[
                    { value: "Facebook", label: "Product Knowledge: Sales rep lacked knowledge of product features and benefits" },
                    { value: "Instagram", label: "Sales Process: Deviation from established sales process (e.g., not qualifying leads, not handling objections properly)." },
                    { value: "Live chat", label: "Communication: Poor communication skills (e.g., unclear explanations, unprofessional language)." },
                    { value: "Call", label: "Customer Focus: Not actively listening to customer needs, aggressive sales tactics." },
                    { value: "WhatsApp", label: "SOP's: Failing to update BITRIX or BOOKING Software in a proper manner" }
                  ].map((issue) => (
                    <div key={issue.value} className="form-check p-3 border rounded hover-bg-light">
                      <input
                        type="radio"
                        name="issueIden"
                        value={issue.value}
                        checked={escalation.issueIden === issue.value}
                        onChange={(e) => handlerEscalation("issueIden", e.target.value)}
                        className="form-check-input"
                        id={`issue-${issue.value}`}
                      />
                      <label className="form-check-label small" htmlFor={`issue-${issue.value}`}>
                        {issue.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Escalation Action */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h3 className="h5 fw-semibold mb-3">Escalation Action</h3>
                <div className="d-grid gap-2">
                  {[
                    { value: "Facebook", label: "Coaching Required: Recommend coaching for the sales rep by the Sales Manager." },
                    { value: "Instagram", label: "Additional Training Needed: Recommend specific sales training for the rep." },
                    { value: "Live chat", label: "Policy Violation: Report potential policy violation to the Sales Manager." },
                    { value: "Call", label: "Other" }
                  ].map((action) => (
                    <div key={action.value} className="form-check p-3 border rounded hover-bg-light">
                      <input
                        type="radio"
                        name="escAction"
                        value={action.value}
                        checked={escalation.escAction === action.value}
                        onChange={(e) => handlerEscalation("escAction", e.target.value)}
                        className="form-check-input"
                        id={`action-${action.value}`}
                      />
                      <label className="form-check-label small" htmlFor={`action-${action.value}`}>
                        {action.label}
                      </label>
                    </div>
                  ))}
                </div>
                
                {escalation.escAction === "Call" && (
                  <textarea
                    placeholder="Please specify other action..."
                    rows="3"
                    value={otherReason}
                    onChange={handlerOtherChange}
                    className="form-control mt-3"
                  />
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h4 className="h5 fw-semibold mb-2">Additional Information</h4>
                <p className="text-muted mb-3">Provide any additional information relevant to the issue</p>
                <textarea
                  placeholder="Your Answer"
                  rows="3"
                  value={escalation.successmaration}
                  onChange={(e) => handlerEscalation("successmaration", e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="h5 fw-semibold mb-3">
                  Attach relevant recording (call) or transcript (chat)
                </h5>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handlerEscalation("audio", e.target.files[0])}
                  className="form-control"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="card shadow-sm">
              <div className="card-body">
                <button
                  type="button"
                  onClick={handlerEscForm}
                  className="btn btn-success btn-lg w-100"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-bg-light:hover {
          background-color: var(--bs-gray-100) !important;
        }
      `}</style>
    </div>
  );
};

export default EscalationForm;