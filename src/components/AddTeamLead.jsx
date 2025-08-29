import React, { useState } from "react";
import { Form, Button, Card, Spinner, Container, Row, Col, Alert } from "react-bootstrap";
import { toast } from "react-hot-toast";
import teamleadApi from "../features/teamleadApi"; 

const AddTeamLead = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error details when user starts typing
    if (errorDetails) setErrorDetails(null);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      setErrorDetails(null);
      
      console.log("Submitting data:", formData);
      const response = await teamleadApi.createTeamLeadApi(formData);
      
      console.log("API Response:", response);
      
      // Show success toast with team lead name
      toast.success(`Team lead "${formData.name}" created successfully!`, {
        duration: 4000,
        position: "top-center",
      });
      
      // Reset form
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("API Error:", error);
      
      // Extract detailed error information
      const errorMessage = error.response?.data?.message || "Failed to create team lead";
      const errorStatus = error.response?.status;
      const errorData = error.response?.data;
      
      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
      });
      
      // Set detailed error information for debugging
      setErrorDetails({
        message: errorMessage,
        status: errorStatus,
        data: errorData
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg rounded-4">
            <Card.Body>
              <h3 className="text-center mb-4">Add Team Lead</h3>
              
              {/* Display detailed error information for debugging */}
              {errorDetails && (
                <Alert variant="danger" className="mb-4">
                  <Alert.Heading>Error Details</Alert.Heading>
                  <p><strong>Message:</strong> {errorDetails.message}</p>
                  {errorDetails.status && <p><strong>Status Code:</strong> {errorDetails.status}</p>}
                  {errorDetails.data && (
                    <>
                      <p><strong>Server Response:</strong></p>
                      <pre className="bg-light p-2 rounded">
                        {JSON.stringify(errorDetails.data, null, 2)}
                      </pre>
                    </>
                  )}
                  <hr />
                  <p className="mb-0">
                    Check browser console for more details. Ensure your backend API is running and accessible.
                  </p>
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter team lead name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    isInvalid={errorDetails && errorDetails.data?.errors?.name}
                  />
                  {errorDetails && errorDetails.data?.errors?.name && (
                    <Form.Control.Feedback type="invalid">
                      {errorDetails.data.errors.name.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter team lead email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    isInvalid={errorDetails && errorDetails.data?.errors?.email}
                  />
                  {errorDetails && errorDetails.data?.errors?.email && (
                    <Form.Control.Feedback type="invalid">
                      {errorDetails.data.errors.email.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter a secure password (min. 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    isInvalid={errorDetails && errorDetails.data?.errors?.password}
                  />
                  {errorDetails && errorDetails.data?.errors?.password && (
                    <Form.Control.Feedback type="invalid">
                      {errorDetails.data.errors.password.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="rounded-3"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{" "}
                        Saving...
                      </>
                    ) : (
                      "Add Team Lead"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddTeamLead;