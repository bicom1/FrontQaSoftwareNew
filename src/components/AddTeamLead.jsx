// import React, { useState, useEffect } from "react";
// import {
//   Form,
//   Button,
//   Card,
//   Spinner,
//   Container,
//   Row,
//   Col,
//   Table,
//   Modal,
//   InputGroup,
//   Alert,
// } from "react-bootstrap";
// import { toast, ToastContainer } from "react-toastify";
// import teamleadApi from "../features/teamleadApi";

// const TeamLeadManagement = () => {
//   const [teamLeads, setTeamLeads] = useState([]);
//   const [formData, setFormData] = useState({ name: "" });
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedTeamLead, setSelectedTeamLead] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const toastConfig = {
//     position: "top-right",
//     autoClose: 3000,
//     theme: "colored",
//   };

//   // Fetch all team leads
//   const fetchTeamLeads = async () => {
//     try {
//       setFetchLoading(true);
//       const response = await teamleadApi.getTeamLeadsApi();

//       // Check the actual response structure
//       if (response.data && Array.isArray(response.data)) {
//         setTeamLeads(response.data);
//       } else if (Array.isArray(response)) {
//         setTeamLeads(response);
//       } else {
//         setTeamLeads([]);
//         console.error("Unexpected API response structure:", response);
//       }
//     } catch (error) {
//       console.error("Error fetching team leads:", error);
//       toast.error("Failed to fetch team leads", toastConfig);
//       setTeamLeads([]); // Set empty array on error
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTeamLeads();
//   }, []);

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (fieldErrors[name]) {
//       setFieldErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   // Validate form
//   const validateForm = () => {
//     const errors = {};
//     let isValid = true;

//     if (!formData.name.trim()) {
//       errors.name = "Name is required";
//       isValid = false;
//     } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
//       errors.name = "Name should contain only letters and spaces";
//       isValid = false;
//     } else if (formData.name.trim().length < 2) {
//       errors.name = "Name must be at least 2 characters long";
//       isValid = false;
//     }

//     setFieldErrors(errors);
//     return isValid;
//   };

//   // Handle add team lead
//   const handleAddSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       toast.error("Please correct the errors in the form", toastConfig);
//       return;
//     }

//     try {
//       setLoading(true);
//       setFieldErrors({});
//       const dataToSend = { name: formData.name.trim() };

//       const response = await teamleadApi.createTeamLeadApi(dataToSend);

//       toast.success(
//         `Team lead "${formData.name}" created successfully!`,
//         toastConfig
//       );

//       setFormData({ name: "" });
//       setShowAddModal(false);
//       fetchTeamLeads();
//     } catch (error) {
//       console.error("Add API Error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         "Failed to create team lead";
//       toast.error(errorMessage, toastConfig);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle update team lead
//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       toast.error("Please correct the errors in the form", toastConfig);
//       return;
//     }

//     try {
//       setLoading(true);
//       await teamleadApi.updateTeamLeadApi(selectedTeamLead._id, formData);

//       toast.success(
//         `Team lead "${formData.name}" updated successfully!`,
//         toastConfig
//       );

//       setFormData({ name: "" });
//       setShowEditModal(false);
//       setSelectedTeamLead(null);
//       fetchTeamLeads();
//     } catch (error) {
//       console.error("API Error:", error);
//       const errorMessage =
//         error.response?.data?.message || "Failed to update team lead";
//       toast.error(errorMessage, toastConfig);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle delete team lead
//   const handleDelete = async () => {
//     try {
//       setLoading(true);
//       await teamleadApi.deleteTeamLeadApi(selectedTeamLead._id);

//       toast.success(
//         `Team lead "${selectedTeamLead.name}" deleted successfully!`,
//         toastConfig
//       );

//       setShowDeleteModal(false);
//       setSelectedTeamLead(null);
//       fetchTeamLeads();
//     } catch (error) {
//       console.error("API Error:", error);
//       const errorMessage =
//         error.response?.data?.message || "Failed to delete team lead";
//       toast.error(errorMessage, toastConfig);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Open modals
//   const openAddModal = () => {
//     setFormData({ name: "" });
//     setFieldErrors({});
//     setShowAddModal(true);
//   };

//   const openEditModal = (teamLead) => {
//     // Show notification when edit button is clicked
//     toast.info(`Editing team lead: ${teamLead.name}`, toastConfig);

//     setSelectedTeamLead(teamLead);
//     setFormData({ name: teamLead.name });
//     setFieldErrors({});
//     setShowEditModal(true);
//   };

//   const openDeleteModal = (teamLead) => {
//     // Show notification when delete button is clicked
//     toast.warning(`Preparing to delete team lead: ${teamLead.name}`, {
//       ...toastConfig,
//       style: {
//         background: "linear-gradient(90deg, #ff4444, #cc0000)",
//         color: "white",
//       },
//     });

//     setSelectedTeamLead(teamLead);
//     setShowDeleteModal(true);
//   };

//   // Filter team leads
//   const filteredTeamLeads = teamLeads.filter((teamLead) =>
//     teamLead.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <Container className="mt-4">
//       {/* Header Section */}
//       <Row className="mb-4">
//         <Col>
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <h2 className="fw-bold mb-1">Team Lead Management</h2>
//               <p className="text-muted mb-0">
//                 Manage your team leads efficiently
//               </p>
//             </div>
//             <Button
//               style={{ background: "linear-gradient(90deg, #4CAF50, #2196F3)" }}
//               onClick={openAddModal}
//               className="rounded-3 fw-semibold px-4"
//               size="lg"
//             >
//               <i className="fas fa-plus me-2"></i>
//               Add Team Lead
//             </Button>
//           </div>
//         </Col>
//       </Row>

//       {/* Search and Stats Section */}
//       <Row className="mb-4">
//         <Col md={8}>
//           <InputGroup size="lg">
//             <InputGroup.Text className="bg-light border-end-0">
//               <i className="fas fa-search text-muted"></i>
//             </InputGroup.Text>
//             <Form.Control
//               type="text"
//               placeholder="Search team leads by name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="border-start-0 ps-0"
//             />
//           </InputGroup>
//         </Col>
//         <Col md={4}>
//           <Card
//             style={{ background: "linear-gradient(90deg, #4CAF50, #2196F3)" }}
//             className=" text-white h-100"
//           >
//             <Card.Body className="d-flex align-items-center justify-content-between">
//               <div>
//                 <small>{teamLeads.length} Total Team Leads</small>
//               </div>
//               <i className="fas fa-users fa-2x opacity-75"></i>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Team Leads Table */}
//       <Card className="shadow-sm border-0 rounded-4">
//         <Card.Body className="p-0">
//           {fetchLoading ? (
//             <div className="text-center py-5">
//               <Spinner animation="border" variant="primary" />
//               <p className="mt-3 text-muted">Loading team leads...</p>
//             </div>
//           ) : filteredTeamLeads.length === 0 ? (
//             <div className="text-center py-5">
//               <i className="fas fa-users fa-3x text-muted mb-3"></i>
//               <h5 className="text-muted">No team leads found</h5>
//               <p className="text-muted mb-4">
//                 {searchTerm
//                   ? `No results for "${searchTerm}"`
//                   : "Get started by adding your first team lead"}
//               </p>
//               {!searchTerm && (
//                 <Button
//                   variant="primary"
//                   onClick={openAddModal}
//                   className="rounded-3"
//                 >
//                   Add First Team Lead
//                 </Button>
//               )}
//             </div>
//           ) : (
//             <Table responsive hover className="mb-0">
//               <thead className="bg-light">
//                 <tr>
//                   <th className="border-0 fw-semibold text-dark py-3 ps-4">
//                     Name
//                   </th>
//                   <th className="border-0 fw-semibold text-dark py-3">
//                     Created Date
//                   </th>
//                   <th className="border-0 fw-semibold text-dark py-3 text-center pe-4">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredTeamLeads.map((teamLead) => (
//                   <tr key={teamLead._id}>
//                     <td className="py-3 ps-4">
//                       <div className="d-flex align-items-center">
//                         <div
//                           className=" text-white rounded-circle d-flex align-items-center justify-content-center me-3"
//                           style={{
//                             width: "40px",
//                             height: "40px",
//                             fontSize: "16px",
//                             background:
//                               "linear-gradient(90deg, #4CAF50, #2196F3)",
//                           }}
//                         >
//                           {teamLead.name.charAt(0).toUpperCase()}
//                         </div>
//                         <div>
//                           <h6 className="mb-0 fw-semibold">{teamLead.name}</h6>
//                           <small className="text-muted">Team Lead</small>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-3 text-muted">
//                       {formatDate(teamLead.createdAt)}
//                     </td>
//                     <td className="py-3 text-center pe-4">
//                       <Button
//                         variant="outline-primary"
//                         size="sm"
//                         onClick={() => openEditModal(teamLead)}
//                         className="me-2 rounded-3"
//                       >
//                         <i className="fas fa-edit"></i>
//                       </Button>
//                       <Button
//                         variant="outline-danger"
//                         size="sm"
//                         onClick={() => openDeleteModal(teamLead)}
//                         className="rounded-3"
//                       >
//                         <i className="fas fa-trash"></i>
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           )}
//         </Card.Body>
//       </Card>

//       {/* Add Modal */}
//      <Modal
//   show={showAddModal}
//   onHide={() => setShowAddModal(false)}
//   size="md"
//   centered
// >
//   <Modal.Header closeButton className="bg-light">
//     <Modal.Title className="fw-bold text-primary">
//       <i className="fas fa-user-plus me-2"></i>
//       Add New Team Lead
//     </Modal.Title>
//   </Modal.Header>

//   <Form onSubmit={handleAddSubmit}>
//     <Modal.Body className="px-4 py-4">
//       {/* Name */}
//       <Form.Group className="mb-3">
//         <Form.Label className="fw-semibold">
//           Full Name <span className="text-danger">*</span>
//         </Form.Label>
//         <Form.Control
//           type="text"
//           name="name"
//           placeholder="Enter team lead name"
//           value={formData.name}
//           onChange={handleChange}
//           isInvalid={!!fieldErrors.name}
//         />
//         <Form.Control.Feedback type="invalid">
//           {fieldErrors.name}
//         </Form.Control.Feedback>
//       </Form.Group>

//       {/* Email */}
//       <Form.Group className="mb-3">
//         <Form.Label className="fw-semibold">
//           Email <span className="text-danger">*</span>
//         </Form.Label>
//         <Form.Control
//           type="email"
//           name="email"
//           placeholder="Enter email address"
//           value={formData.email}
//           onChange={handleChange}
//           isInvalid={!!fieldErrors.email}
//         />
//         <Form.Control.Feedback type="invalid">
//           {fieldErrors.email}
//         </Form.Control.Feedback>
//       </Form.Group>

//       {/* Department */}
//       <Form.Group className="mb-3">
//         <Form.Label className="fw-semibold">
//           Department <span className="text-danger">*</span>
//         </Form.Label>
//         <Form.Control
//           type="text"
//           name="department"
//           placeholder="Enter department"
//           value={formData.department}
//           onChange={handleChange}
//           isInvalid={!!fieldErrors.department}
//         />
//         <Form.Control.Feedback type="invalid">
//           {fieldErrors.department}
//         </Form.Control.Feedback>
//       </Form.Group>
//     </Modal.Body>

//     <Modal.Footer className="border-0 px-4 pb-4">
//       <Button
//         variant="light"
//         onClick={() => setShowAddModal(false)}
//       >
//         Cancel
//       </Button>

//       <Button
//         variant="primary"
//         type="submit"
//         disabled={loading}
//       >
//         {loading ? (
//           <>
//             <Spinner size="sm" className="me-2" />
//             Creating...
//           </>
//         ) : (
//           <>
//             <i className="fas fa-plus me-2"></i>
//             Add Team Lead
//           </>
//         )}
//       </Button>
//     </Modal.Footer>
//   </Form>
// </Modal>

//       {/* Edit Modal */}
//      <Modal.Body className="px-4 py-4">
//   {/* Name */}
//   <Form.Group className="mb-3">
//     <Form.Label className="fw-semibold">
//       Full Name <span className="text-danger">*</span>
//     </Form.Label>
//     <Form.Control
//       type="text"
//       name="name"
//       placeholder="Enter team lead name"
//       value={formData.name}
//       onChange={handleChange}
//       isInvalid={!!fieldErrors.name}
//       className="py-2"
//       size="lg"
//     />
//     <Form.Control.Feedback type="invalid">
//       {fieldErrors.name}
//     </Form.Control.Feedback>
//   </Form.Group>

//   {/* Email */}
//   <Form.Group className="mb-3">
//     <Form.Label className="fw-semibold">
//       Email <span className="text-danger">*</span>
//     </Form.Label>
//     <Form.Control
//       type="email"
//       name="email"
//       placeholder="Enter email address"
//       value={formData.email}
//       onChange={handleChange}
//       isInvalid={!!fieldErrors.email}
//       className="py-2"
//       size="lg"
//     />
//     <Form.Control.Feedback type="invalid">
//       {fieldErrors.email}
//     </Form.Control.Feedback>
//   </Form.Group>

//   {/* Department */}
//   <Form.Group className="mb-3">
//     <Form.Label className="fw-semibold">
//       Department <span className="text-danger">*</span>
//     </Form.Label>
//     <Form.Control
//       type="text"
//       name="department"
//       placeholder="Enter department"
//       value={formData.department}
//       onChange={handleChange}
//       isInvalid={!!fieldErrors.department}
//       className="py-2"
//       size="lg"
//     />
//     <Form.Control.Feedback type="invalid">
//       {fieldErrors.department}
//     </Form.Control.Feedback>
//   </Form.Group>
// </Modal.Body>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         show={showDeleteModal}
//         onHide={() => setShowDeleteModal(false)}
//         size="md"
//         centered
//       >
//         <Modal.Header closeButton className="bg-light">
//           <Modal.Title className="fw-bold text-danger">
//             <i className="fas fa-exclamation-triangle me-2"></i>
//             Confirm Deletion
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="px-4 py-4">
//           <Alert variant="warning" className="border-0">
//             <Alert.Heading className="h6 fw-bold">
//               <i className="fas fa-info-circle me-2"></i>
//               Are you sure?
//             </Alert.Heading>
//             <p className="mb-0">
//               This action will permanently delete the team lead
//               <strong> "{selectedTeamLead?.name}"</strong>. This action cannot
//               be undone.
//             </p>
//           </Alert>
//         </Modal.Body>
//         <Modal.Footer className="border-0 px-4 pb-4">
//           <Button
//             variant="light"
//             onClick={() => setShowDeleteModal(false)}
//             className="rounded-3 px-4"
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="danger"
//             onClick={handleDelete}
//             disabled={loading}
//             className="rounded-3 px-4 fw-semibold"
//           >
//             {loading ? (
//               <>
//                 <Spinner size="sm" className="me-2" />
//                 Deleting...
//               </>
//             ) : (
//               <>🗑️ Delete Team Lead</>
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <ToastContainer position="top-right" autoClose={3000} theme="colored" />
//     </Container>
//   );
// };

// export default TeamLeadManagement;
import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  Button,
  Card,
  Spinner,
  Container,
  Row,
  Col,
  Table,
  Modal,
  InputGroup,
  Alert,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import teamleadApi from "../features/teamleadApi";

// ─── Bootstrap Icons ──────────────────────────────────────────────────────────
if (!document.getElementById("bi-css")) {
  const link = document.createElement("link");
  link.id = "bi-css";
  link.rel = "stylesheet";
  link.href =
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
  document.head.appendChild(link);
}

const GRADIENT = "linear-gradient(90deg, #4CAF50, #2196F3)";
const EMPTY_FORM = { name: "", email: "", department: "" };
const TOAST_CONFIG = { position: "top-right", autoClose: 3000, theme: "colored" };
const DEFAULT_DEPARTMENTS = [
  "Sales",
  "Quality Control",
  "Marketing",
  "Customer Support",
  "Operations",
];

// Normalize department — works regardless of what the backend field is named
const getDept = (tl) =>
  tl?.department || tl?.dept || tl?.departmentName || tl?.Department || "";

// ─── FormFields (outside parent to prevent remount on every render) ───────────
const FormFields = ({ formData, handleChange, fieldErrors, departmentOptions }) => (
  <>
    <Form.Group className="mb-3">
      <Form.Label className="fw-semibold">
        Full Name <span className="text-danger">*</span>
      </Form.Label>
      <InputGroup>
        <InputGroup.Text>
          <i className="bi bi-person-fill text-primary" />
        </InputGroup.Text>
        <Form.Control
          type="text"
          name="name"
          placeholder="Enter full name"
          value={formData.name}
          onChange={handleChange}
          isInvalid={!!fieldErrors.name}
        />
        <Form.Control.Feedback type="invalid">{fieldErrors.name}</Form.Control.Feedback>
      </InputGroup>
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label className="fw-semibold">
        Email <span className="text-danger">*</span>
      </Form.Label>
      <InputGroup>
        <InputGroup.Text>
          <i className="bi bi-envelope-fill text-primary" />
        </InputGroup.Text>
        <Form.Control
          type="email"
          name="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={handleChange}
          isInvalid={!!fieldErrors.email}
        />
        <Form.Control.Feedback type="invalid">{fieldErrors.email}</Form.Control.Feedback>
      </InputGroup>
    </Form.Group>

    <Form.Group className="mb-1">
      <Form.Label className="fw-semibold">
        Department <span className="text-danger">*</span>
      </Form.Label>
      <InputGroup>
        <InputGroup.Text>
          <i className="bi bi-building-fill text-primary" />
        </InputGroup.Text>
        <Form.Select
          name="department"
          value={formData.department}
          onChange={handleChange}
          isInvalid={!!fieldErrors.department}
        >
          <option value="">Select department</option>
          {departmentOptions.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">{fieldErrors.department}</Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  </>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const TeamLeadManagement = () => {
  const [teamLeads, setTeamLeads]             = useState([]);
  const [formData, setFormData]               = useState(EMPTY_FORM);
  const [loading, setLoading]                 = useState(false);
  const [fetchLoading, setFetchLoading]       = useState(true);
  const [fieldErrors, setFieldErrors]         = useState({});
  const [showAddModal, setShowAddModal]       = useState(false);
  const [showEditModal, setShowEditModal]     = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeamLead, setSelectedTeamLead] = useState(null);
  const [searchTerm, setSearchTerm]           = useState("");

  const departmentOptions = React.useMemo(() => {
    const fromLeads = teamLeads.map(getDept).filter(Boolean);
    const current = formData.department ? [formData.department] : [];
    return [...new Set([...DEFAULT_DEPARTMENTS, ...fromLeads, ...current])].sort();
  }, [teamLeads, formData.department]);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchTeamLeads = useCallback(async () => {
    try {
      setFetchLoading(true);
      const response = await teamleadApi.getTeamLeadsApi();
      const data = response.data ?? response;
      setTeamLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching team leads:", error);
      toast.error("Failed to fetch team leads", TOAST_CONFIG);
      setTeamLeads([]);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamLeads();
  }, [fetchTeamLeads]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      errors.name = "Name should contain only letters and spaces";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }
    if (!formData.department.trim()) {
      errors.department = "Department is required";
    } else if (formData.department.trim().length < 2) {
      errors.department = "Department must be at least 2 characters";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Add ────────────────────────────────────────────────────────────────────
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the errors in the form", TOAST_CONFIG);
      return;
    }
    try {
      setLoading(true);
      await teamleadApi.createTeamLeadApi({
        name:       formData.name.trim(),
        email:      formData.email.trim(),
        department: formData.department.trim(),
      });
      toast.success(`Team lead "${formData.name}" created successfully!`, TOAST_CONFIG);
      setFormData(EMPTY_FORM);
      setShowAddModal(false);
      fetchTeamLeads();
    } catch (error) {
      console.error("Add API Error:", error);
      toast.error(
        error.response?.data?.message || error.response?.data?.error || "Failed to create team lead",
        TOAST_CONFIG
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Edit ───────────────────────────────────────────────────────────────────
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the errors in the form", TOAST_CONFIG);
      return;
    }
    try {
      setLoading(true);
      await teamleadApi.updateTeamLeadApi(selectedTeamLead._id, {
        name:       formData.name.trim(),
        email:      formData.email.trim(),
        department: formData.department.trim(),
      });
      toast.success(`Team lead "${formData.name}" updated successfully!`, TOAST_CONFIG);
      setFormData(EMPTY_FORM);
      setShowEditModal(false);
      setSelectedTeamLead(null);
      fetchTeamLeads();
    } catch (error) {
      console.error("API Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update team lead",
        TOAST_CONFIG
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      setLoading(true);
      await teamleadApi.deleteTeamLeadApi(selectedTeamLead._id);
      toast.success(`Team lead "${selectedTeamLead.name}" deleted successfully!`, TOAST_CONFIG);
      setShowDeleteModal(false);
      setSelectedTeamLead(null);
      fetchTeamLeads();
    } catch (error) {
      console.error("API Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete team lead",
        TOAST_CONFIG
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Modal openers ──────────────────────────────────────────────────────────
  const openAddModal = () => {
    setFormData(EMPTY_FORM);
    setFieldErrors({});
    setShowAddModal(true);
  };

  const openEditModal = (teamLead) => {
    setSelectedTeamLead(teamLead);
    setFormData({
      name:       teamLead.name  || "",
      email:      teamLead.email || "",
      department: getDept(teamLead),  // uses normalized getter
    });
    setFieldErrors({});
    setShowEditModal(true);
    toast.info(`Editing team lead: ${teamLead.name}`, TOAST_CONFIG);
  };

  const openDeleteModal = (teamLead) => {
    setSelectedTeamLead(teamLead);
    setShowDeleteModal(true);
    toast.warning(`Preparing to delete: ${teamLead.name}`, TOAST_CONFIG);
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const filteredTeamLeads = teamLeads.filter((tl) =>
    tl.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Container className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-1">Team Lead Management</h2>
              <p className="text-muted mb-0">Manage your team leads efficiently</p>
            </div>
            <Button
              style={{ background: GRADIENT, border: "none" }}
              onClick={openAddModal}
              className="rounded-3 fw-semibold px-4"
              size="lg"
            >
              <i className="bi bi-person-plus-fill me-2" />
              Add Team Lead
            </Button>
          </div>
        </Col>
      </Row>

      {/* Search + Stats */}
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup size="lg">
            <InputGroup.Text className="bg-light border-end-0">
              <i className="bi bi-search text-muted" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search team leads by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0 ps-0"
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Card style={{ background: GRADIENT }} className="text-white h-100">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <small>{teamLeads.length} Total Team Leads</small>
              </div>
              <i className="bi bi-people-fill" style={{ fontSize: "2rem", opacity: 0.75 }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body className="p-0">
          {fetchLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading team leads...</p>
            </div>
          ) : filteredTeamLeads.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people" style={{ fontSize: "3rem", color: "#adb5bd" }} />
              <h5 className="text-muted mt-3">No team leads found</h5>
              <p className="text-muted mb-4">
                {searchTerm
                  ? `No results for "${searchTerm}"`
                  : "Get started by adding your first team lead"}
              </p>
              {!searchTerm && (
                <Button variant="primary" onClick={openAddModal} className="rounded-3">
                  Add First Team Lead
                </Button>
              )}
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 fw-semibold text-dark py-3 ps-4">Name</th>
                  <th className="border-0 fw-semibold text-dark py-3">Email</th>
                  <th className="border-0 fw-semibold text-dark py-3">Department</th>
                  <th className="border-0 fw-semibold text-dark py-3">Created Date</th>
                  <th className="border-0 fw-semibold text-dark py-3 text-center pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeamLeads.map((teamLead) => {
                  const dept = getDept(teamLead);
                  return (
                    <tr key={teamLead._id}>
                      <td className="py-3 ps-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="text-white rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold"
                            style={{
                              width: 40, height: 40, fontSize: 16,
                              background: GRADIENT, flexShrink: 0,
                            }}
                          >
                            {teamLead.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h6 className="mb-0 fw-semibold">{teamLead.name}</h6>
                            <small className="text-muted">Team Lead</small>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-muted align-middle">
                        <i className="bi bi-envelope me-1" />
                        {teamLead.email || <span className="fst-italic">—</span>}
                      </td>
                      <td className="py-3 align-middle">
                        {dept ? (
                          <span className="badge bg-primary bg-opacity-10 text-primary fw-normal px-3 py-2 rounded-3 fs-6">
                            <i className="bi bi-building me-1" />
                            {dept}
                          </span>
                        ) : (
                          <span className="badge bg-secondary bg-opacity-10 text-secondary fw-normal px-3 py-2 rounded-3 fs-6">
                            <i className="bi bi-dash-circle me-1" />
                            Not assigned
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-muted align-middle">
                        {formatDate(teamLead.createdAt)}
                      </td>
                      <td className="py-3 text-center pe-4 align-middle">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => openEditModal(teamLead)}
                          className="me-2 rounded-3"
                          title="Edit team lead"
                        >
                          <i className="bi bi-pencil-fill" />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => openDeleteModal(teamLead)}
                          className="rounded-3"
                          title="Delete team lead"
                        >
                          <i className="bi bi-trash3-fill" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* ── Add Modal ── */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="md" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold text-primary">
            <i className="bi bi-person-plus-fill me-2" />
            Add New Team Lead
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Body className="px-4 py-4">
            <FormFields
              formData={formData}
              handleChange={handleChange}
              fieldErrors={fieldErrors}
              departmentOptions={departmentOptions}
            />
          </Modal.Body>
          <Modal.Footer className="border-0 px-4 pb-4">
            <Button variant="light" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading
                ? <><Spinner size="sm" className="me-2" />Creating...</>
                : <><i className="bi bi-plus-circle-fill me-2" />Add Team Lead</>}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="md" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold text-primary">
            <i className="bi bi-pencil-square me-2" />
            Edit Team Lead
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateSubmit}>
          <Modal.Body className="px-4 py-4">
            <FormFields
              formData={formData}
              handleChange={handleChange}
              fieldErrors={fieldErrors}
              departmentOptions={departmentOptions}
            />
          </Modal.Body>
          <Modal.Footer className="border-0 px-4 pb-4">
            <Button variant="light" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button
              style={{ background: GRADIENT, border: "none" }}
              type="submit"
              disabled={loading}
            >
              {loading
                ? <><Spinner size="sm" className="me-2" />Updating...</>
                : <><i className="bi bi-check-circle-fill me-2" />Update Team Lead</>}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ── Delete Modal ── */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} size="md" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold text-danger">
            <i className="bi bi-exclamation-triangle-fill me-2" />
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-4">
          <Alert variant="warning" className="border-0">
            <Alert.Heading className="h6 fw-bold">
              <i className="bi bi-info-circle-fill me-2" />
              Are you sure?
            </Alert.Heading>
            <p className="mb-0">
              This will permanently delete team lead{" "}
              <strong>"{selectedTeamLead?.name}"</strong>. This action cannot be undone.
            </p>
          </Alert>
        </Modal.Body>
        <Modal.Footer className="border-0 px-4 pb-4">
          <Button variant="light" onClick={() => setShowDeleteModal(false)} className="rounded-3 px-4">
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-3 px-4 fw-semibold"
          >
            {loading
              ? <><Spinner size="sm" className="me-2" />Deleting...</>
              : <><i className="bi bi-trash3-fill me-2" />Delete Team Lead</>}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </Container>
  );
};

export default TeamLeadManagement;