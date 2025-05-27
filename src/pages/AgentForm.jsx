import React, { useState } from 'react';

const AgentForm = () => {
  const [evaluation, setEvaluation] = useState({
    email: "user@example.com",
    leadId: "",
    agentName: "",
    teamleader: "",
    mod: "",
    greetings: "",
    accuracy: "",
    building: "",
    presenting: "",
    closing: "",
    bonus: "",
    evaluationsummary: "",
    rating: 0
  });

  const [userRate, setUserRate] = useState({
    greeting: { rateVal: 0 },
    accuracy: { rateVal: 0 },
    building: { rateVal: 0 },
    presenting: { rateVal: 0 },
    closing: { rateVal: 0 },
    bonus: { rateVal: 0 },
  });

  // Static team leaders data
  const teamLeaders = [
    { _id: "1", leadName: "John Smith" },
    { _id: "2", leadName: "Sarah Johnson" },
    { _id: "3", leadName: "Mike Wilson" },
    { _id: "4", leadName: "Emily Davis" }
  ];

  const handleChange = (name, value) => {
    setEvaluation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Calculate total rating
    const total = Object.values(userRate).reduce((sum, cat) => sum + cat.rateVal, 0);
    
    console.log("Form submitted:", { ...evaluation, rating: total });
    alert("Form submitted successfully!");
  };

  return (
    <div className="d-flex justify-content-center p-4">
      <div className="w-100" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div className="rounded d-flex justify-content-center flex-column align-items-center bg-primary text-white p-4 mb-4">
          <h1 className="fw-bold mb-2">AGENT EVALUATION</h1>
          <h3 className="text-light">Evaluation Form</h3>
        </div>

        {/* Email Field */}
        <div className="card mb-4">
          <div className="card-body">
            <label className="form-label fw-bold">
              Enter your email:
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter Your Email Here"
              value={evaluation.email}
              readOnly
              style={{ backgroundColor: '#f8f9fa' }}
            />
          </div>
        </div>

        {/* Lead ID */}
        <div className="card mb-4">
          <div className="card-body">
            <label className="form-label fw-bold">
              Lead ID:
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Your Lead ID Here"
              value={evaluation.leadId}
              onChange={(e) => handleChange("leadId", e.target.value)}
            />
          </div>
        </div>

        {/* Agent Name */}
        <div className="card mb-4">
          <div className="card-body">
            <label className="form-label fw-bold">
              Agent Name:
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Agent Name Here"
              value={evaluation.agentName}
              onChange={(e) => handleChange("agentName", e.target.value)}
            />
          </div>
        </div>

        {/* Team Leader */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0 fw-bold">Team Leader</h5>
          </div>
          <div className="card-body">
            {teamLeaders.map((leader, index) => (
              <div key={index} className="form-check mb-2 p-2 bg-light rounded">
                <input
                  className="form-check-input"
                  type="radio"
                  name="teamleader"
                  id={`leader-${leader._id}`}
                  value={leader.leadName}
                  checked={evaluation.teamleader === leader.leadName}
                  onChange={(e) => handleChange("teamleader", e.target.value)}
                />
                <label className="form-check-label" htmlFor={`leader-${leader._id}`}>
                  {leader.leadName}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Mode of Communication */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0 fw-bold">Mode of Communication</h5>
          </div>
          <div className="card-body bg-light">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="communication"
                id="chat"
                value="Chat"
                checked={evaluation.mod === "Chat"}
                onChange={(e) => handleChange("mod", e.target.value)}
              />
              <label className="form-check-label" htmlFor="chat">
                Chat
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="communication"
                id="call"
                value="Call"
                checked={evaluation.mod === "Call"}
                onChange={(e) => handleChange("mod", e.target.value)}
              />
              <label className="form-check-label" htmlFor="call">
                Call
              </label>
            </div>
          </div>
        </div>

        {/* Greetings */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="fw-bold">Greetings</h5>
            <p className="text-muted">
              Demonstrates enthusiasm and a positive tone throughout the call.
            </p>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="greetings"
                id="greetings-good"
                value="uses"
                checked={evaluation.greetings === "uses"}
                onChange={(e) => {
                  handleChange("greetings", e.target.value);
                  setUserRate(pre => ({ ...pre, greeting: { rateVal: 16 } }));
                }}
              />
              <label className="form-check-label" htmlFor="greetings-good">
                Uses a professional and friendly greeting within the first 3 seconds, 
                including the company name and their own name
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="greetings"
                id="greetings-bad"
                value="mark"
                checked={evaluation.greetings === "mark"}
                onChange={(e) => {
                  handleChange("greetings", e.target.value);
                  setUserRate(pre => ({ ...pre, greeting: { rateVal: 0 } }));
                }}
              />
              <label className="form-check-label" htmlFor="greetings-bad">
                Not up to the mark
              </label>
            </div>
          </div>
        </div>

        {/* Accuracy & Compliance */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="fw-bold">Accuracy & Compliance</h5>
            <p className="text-muted">
              Provides accurate and up-to-date information about the company's products 
              or services, adhering to all relevant scripts and policies.
            </p>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="accuracy"
                id="accuracy-good"
                value="questions"
                checked={evaluation.accuracy === "questions"}
                onChange={(e) => {
                  handleChange("accuracy", e.target.value);
                  setUserRate(pre => ({ ...pre, accuracy: { rateVal: 16 } }));
                }}
              />
              <label className="form-check-label" htmlFor="accuracy-good">
                Asks clear and concise questions to accurately identify the customer's 
                needs or inquiries.
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="accuracy"
                id="accuracy-bad"
                value="mark"
                checked={evaluation.accuracy === "mark"}
                onChange={(e) => {
                  handleChange("accuracy", e.target.value);
                  setUserRate(pre => ({ ...pre, accuracy: { rateVal: 0 } }));
                }}
              />
              <label className="form-check-label" htmlFor="accuracy-bad">
                Not up to the mark
              </label>
            </div>
          </div>
        </div>

        {/* Building Rapport & Discovery */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="fw-bold">Building Rapport & Discovery</h5>
            <p className="text-muted">
              Identifies potential pain points or opportunities where the product/service 
              can provide value to the customer.
            </p>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="building"
                id="building-good"
                value="skills"
                checked={evaluation.building === "skills"}
                onChange={(e) => {
                  handleChange("building", e.target.value);
                  setUserRate(pre => ({ ...pre, building: { rateVal: 16 } }));
                }}
              />
              <label className="form-check-label" htmlFor="building-good">
                Demonstrates active listening skills and asks open-ended questions 
                to understand the customer's needs and potential interest in the product/service.
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="building"
                id="building-bad"
                value="mark"
                checked={evaluation.building === "mark"}
                onChange={(e) => {
                  handleChange("building", e.target.value);
                  setUserRate(pre => ({ ...pre, building: { rateVal: 0 } }));
                }}
              />
              <label className="form-check-label" htmlFor="building-bad">
                Not up to the mark
              </label>
            </div>
          </div>
        </div>

        {/* Presenting Solutions */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="fw-bold">Presenting Solutions & Making the Sale</h5>
            <p className="text-muted">
              Clearly and concisely presents the product/service features and benefits 
              tailored to the customer's needs identified earlier.
            </p>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="presenting"
                id="presenting-good"
                value="appointment"
                checked={evaluation.presenting === "appointment"}
                onChange={(e) => {
                  handleChange("presenting", e.target.value);
                  setUserRate(pre => ({ ...pre, presenting: { rateVal: 16 } }));
                }}
              />
              <label className="form-check-label" htmlFor="presenting-good">
                Attempts to overcome objections professionally using established techniques 
                and effectively guides the customer towards booking an appointment.
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="presenting"
                id="presenting-bad"
                value="mark"
                checked={evaluation.presenting === "mark"}
                onChange={(e) => {
                  handleChange("presenting", e.target.value);
                  setUserRate(pre => ({ ...pre, presenting: { rateVal: 0 } }));
                }}
              />
              <label className="form-check-label" htmlFor="presenting-bad">
                Not up to the mark
              </label>
            </div>
          </div>
        </div>

        {/* Call Closing */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="fw-bold">Call Closing & Securing Commitment</h5>
            <p className="text-muted">
              Confirms the customer's details and secures their commitment for the sale 
              or appointment. Thanks the customer for their time and offers further assistance if needed.
            </p>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="closing"
                id="closing-good"
                value="Professionally"
                checked={evaluation.closing === "Professionally"}
                onChange={(e) => {
                  handleChange("closing", e.target.value);
                  setUserRate(pre => ({ ...pre, closing: { rateVal: 16 } }));
                }}
              />
              <label className="form-check-label" htmlFor="closing-good">
                Professionally summarizes key points discussed and clearly outlines 
                the next steps, including the call to action (e.g., callback, appointment booking).
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="closing"
                id="closing-bad"
                value="mark"
                checked={evaluation.closing === "mark"}
                onChange={(e) => {
                  handleChange("closing", e.target.value);
                  setUserRate(pre => ({ ...pre, closing: { rateVal: 0 } }));
                }}
              />
              <label className="form-check-label" htmlFor="closing-bad">
                Not up to the mark
              </label>
            </div>
          </div>
        </div>

        {/* Bonus Point */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="fw-bold">Bonus Point</h5>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="bonus"
                id="bonus-good"
                value="customer"
                checked={evaluation.bonus === "customer"}
                onChange={(e) => {
                  handleChange("bonus", e.target.value);
                  setUserRate(pre => ({ ...pre, bonus: { rateVal: 16 } }));
                }}
              />
              <label className="form-check-label" htmlFor="bonus-good">
                Goes above and beyond by exceeding customer expectations, offering 
                additional solutions, demonstrating exceptional product knowledge, 
                or successfully overcoming a significant objection.
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="bonus"
                id="bonus-bad"
                value="mark"
                checked={evaluation.bonus === "mark"}
                onChange={(e) => {
                  handleChange("bonus", e.target.value);
                  setUserRate(pre => ({ ...pre, bonus: { rateVal: 0 } }));
                }}
              />
              <label className="form-check-label" htmlFor="bonus-bad">
                Not up to the mark
              </label>
            </div>
          </div>
        </div>

        {/* Evaluation Summary */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="fw-bold">Evaluation Summary</h5>
            <label className="form-label">Other</label>
            <textarea
              className="form-control"
              placeholder="Your Answer"
              rows="4"
              value={evaluation.evaluationsummary}
              onChange={(e) => handleChange("evaluationsummary", e.target.value)}
            />
          </div>
        </div>

        {/* Rating Display */}
        <div className="card mb-4">
          <div className="card-body text-center">
            <h5 className="fw-bold">Current Rating</h5>
            <div className="display-4 text-primary">
              {Object.values(userRate).reduce((sum, cat) => sum + cat.rateVal, 0)} / 96
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="d-grid">
          <button
            type="button"
            className="btn btn-success btn-lg"
            onClick={handleSubmit}
          >
            Submit Evaluation
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentForm;