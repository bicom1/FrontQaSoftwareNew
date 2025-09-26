import React, { useState, useEffect } from "react";
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
  Alert
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import teamleadApi from "../features/teamleadApi";

const TeamLeadManagement = () => {
  const [teamLeads, setTeamLeads] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeamLead, setSelectedTeamLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    theme: "colored",
  };

  // Fetch all team leads
  const fetchTeamLeads = async () => {
  try {
    setFetchLoading(true);
    const response = await teamleadApi.getTeamLeadsApi();
    
    // Check the actual response structure
    if (response.data && Array.isArray(response.data)) {
      setTeamLeads(response.data);
    } else if (Array.isArray(response)) {
      setTeamLeads(response);
    } else {
      setTeamLeads([]);
      console.error("Unexpected API response structure:", response);
    }
  } catch (error) {
    console.error("Error fetching team leads:", error);
    toast.error("Failed to fetch team leads", toastConfig);
    setTeamLeads([]); // Set empty array on error
  } finally {
    setFetchLoading(false);
  }
};

  useEffect(() => {
    fetchTeamLeads();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      errors.name = "Name should contain only letters and spaces";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  // Handle add team lead
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form", toastConfig);
      return;
    }

    try {
      setLoading(true);
      setFieldErrors({});
      const dataToSend = { name: formData.name.trim() };

      const response = await teamleadApi.createTeamLeadApi(dataToSend);

      toast.success(`Team lead "${formData.name}" created successfully!`, toastConfig);

      setFormData({ name: "" });
      setShowAddModal(false);
      fetchTeamLeads();
    } catch (error) {
      console.error("Add API Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create team lead";
      toast.error(errorMessage, toastConfig);
    } finally {
      setLoading(false);
    }
  };

  // Handle update team lead
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form", toastConfig);
      return;
    }

    try {
      setLoading(true);
      await teamleadApi.updateTeamLeadApi(selectedTeamLead._id, formData);

      toast.success(`Team lead "${formData.name}" updated successfully!`, toastConfig);

      setFormData({ name: "" });
      setShowEditModal(false);
      setSelectedTeamLead(null);
      fetchTeamLeads();
    } catch (error) {
      console.error("API Error:", error);
      const errorMessage = error.response?.data?.message || "Failed to update team lead";
      toast.error(errorMessage, toastConfig);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete team lead
  const handleDelete = async () => {
    try {
      setLoading(true);
      await teamleadApi.deleteTeamLeadApi(selectedTeamLead._id);

      toast.success(`Team lead "${selectedTeamLead.name}" deleted successfully!`, toastConfig);

      setShowDeleteModal(false);
      setSelectedTeamLead(null);
      fetchTeamLeads();
    } catch (error) {
      console.error("API Error:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete team lead";
      toast.error(errorMessage, toastConfig);
    } finally {
      setLoading(false);
    }
  };

  // Open modals
  const openAddModal = () => {
    setFormData({ name: "" });
    setFieldErrors({});
    setShowAddModal(true);
  };

  const openEditModal = (teamLead) => {
    setSelectedTeamLead(teamLead);
    setFormData({ name: teamLead.name });
    setFieldErrors({});
    setShowEditModal(true);
  };

  const openDeleteModal = (teamLead) => {
    setSelectedTeamLead(teamLead);
    setShowDeleteModal(true);
  };

  // Filter team leads
  const filteredTeamLeads = teamLeads.filter((teamLead) =>
    teamLead.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Container className="mt-4">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-1">Team Lead Management</h2>
              <p className="text-muted mb-0">Manage your team leads efficiently</p>
            </div>
            <Button
              style={{background: "linear-gradient(90deg, #4CAF50, #2196F3)" }}
              onClick={openAddModal}
              className="rounded-3 fw-semibold px-4"
              size="lg"
            >
              <i className="fas fa-plus me-2"></i>
              Add Team Lead
            </Button>
          </div>
        </Col>
      </Row>

      {/* Search and Stats Section */}
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup size="lg">
            <InputGroup.Text className="bg-light border-end-0">
              <i className="fas fa-search text-muted"></i>
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
          <Card style={{background: "linear-gradient(90deg, #4CAF50, #2196F3)" }} className=" text-white h-100">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <small>{teamLeads.length} Total Team Leads</small>
              </div>
              <i className="fas fa-users fa-2x opacity-75"></i>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Team Leads Table */}
      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body className="p-0">
          {fetchLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading team leads...</p>
            </div>
          ) : filteredTeamLeads.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No team leads found</h5>
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
                  <th className="border-0 fw-semibold text-dark py-3">Created Date</th>
                  <th className="border-0 fw-semibold text-dark py-3 text-center pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeamLeads.map((teamLead) => (
                  <tr key={teamLead._id}>
                    <td className="py-3 ps-4">
                      <div className="d-flex align-items-center">
                        <div 
                          className=" text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: "40px", height: "40px", fontSize: "16px", background: "linear-gradient(90deg, #4CAF50, #2196F3)" }}
                        >
                          {teamLead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h6 className="mb-0 fw-semibold">{teamLead.name}</h6>
                          <small className="text-muted">Team Lead</small>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-muted">{formatDate(teamLead.createdAt)}</td>
                    <td className="py-3 text-center pe-4">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => openEditModal(teamLead)}
                        className="me-2 rounded-3"
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => openDeleteModal(teamLead)}
                        className="rounded-3"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="md" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold text-primary">
            <i className="fas fa-user-plus me-2"></i>
            Add New Team Lead
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Body className="px-4 py-4">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Full Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter team lead name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!fieldErrors.name}
                className="py-2"
                size="lg"
              />
              <Form.Control.Feedback type="invalid" className="d-block">
                {fieldErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 px-4 pb-4">
            <Button variant="light" onClick={() => setShowAddModal(false)} className="rounded-3 px-4">
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="rounded-3 px-4 fw-semibold"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus me-2"></i>
                  Add Team Lead
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="md" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold text-primary">
            <i className="fas fa-edit me-2"></i>
            Edit Team Lead
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateSubmit}>
          <Modal.Body className="px-4 py-4">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Full Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter team lead name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!fieldErrors.name}
                className="py-2"
                size="lg"
              />
              <Form.Control.Feedback type="invalid" className="d-block">
                {fieldErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 px-4 pb-4">
            <Button variant="light" onClick={() => setShowEditModal(false)} className="rounded-3 px-4">
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="rounded-3 px-4 fw-semibold"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  Update Team Lead
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} size="md" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold text-danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-4">
          <Alert variant="warning" className="border-0">
            <Alert.Heading className="h6 fw-bold">
              <i className="fas fa-info-circle me-2"></i>
              Are you sure?
            </Alert.Heading>
            <p className="mb-0">
              This action will permanently delete the team lead 
              <strong> "{selectedTeamLead?.name}"</strong>. 
              This action cannot be undone.
            </p>
          </Alert>
        </Modal.Body>
        <Modal.Footer className="border-0 px-4 pb-4">
          <Button 
            variant="light" 
            onClick={() => setShowDeleteModal(false)}
            className="rounded-3 px-4"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-3 px-4 fw-semibold"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              <>
                🗑️ Delete Team Lead
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </Container>
  );
};

export default TeamLeadManagement;