// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AgentFeedbackBox = () => {
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [response, setResponse] = useState("");

//   useEffect(() => {
//     axios.get("/api/feedback?agentId=123").then((res) => setFeedbacks(res.data));
//   }, []);

//   const handleSubmit = (id) => {
//     axios.post(`/api/feedback/response`, { feedbackId: id, response })
//       .then(() => {
//         alert("Response submitted!");
//         setResponse("");
//       });
//   };

//   return (
//     <div className="container mt-4">
//       <h4>Feedback & Clarifications</h4>
//       {feedbacks.length === 0 ? (
//         <p>No feedback available</p>
//       ) : (
//         feedbacks.map((fb) => (
//           <div key={fb.id} className="border p-3 rounded mb-3">
//             <p><strong>Remark:</strong> {fb.remark}</p>
//             <textarea
//               className="form-control mb-2"
//               placeholder="Add your clarification..."
//               value={response}
//               onChange={(e) => setResponse(e.target.value)}
//             />
//             <button className="btn btn-primary" onClick={() => handleSubmit(fb.id)}>Submit Response</button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default AgentFeedbackBox;
import React from 'react'

const AgentFeedbackBox = () => {
  return (
    <div>AgentFeedbackBox</div>
  )
}

export default AgentFeedbackBox