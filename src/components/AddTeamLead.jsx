import React, { useState } from "react";
import { Form, Button, Card, Spinner, Container, Row, Col, Alert } from "react-bootstrap";
import { toast } from "react-hot-toast";
import teamleadApi from "../features/teamleadApi"; 
import { ToastContainer } from "react-toastify";

const AddTeamLead = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  // const [errorDetails, setErrorDetails] = useState(null);
   const [fieldErrors, setFieldErrors] = useState({});

    const toastConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
  const errors = {};
  let isValid = true;

  // Name validation
  if (!formData.name.trim()) {
    errors.name = "Name is required";
    isValid = false;
  } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
    errors.name = "Name should contain only letters and spaces";
    isValid = false;
  }

  // Email validation - Only gmail.com addresses
  if (!formData.email.trim()) {
    errors.email = "Email is required";
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    } else if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      errors.email = "Only Gmail addresses are allowed (@gmail.com)";
      isValid = false;
    }
  }

  // Password validation
  if (!formData.password) {
    errors.password = "Password is required";
    isValid = false;
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
    isValid = false;
  }

  setFieldErrors(errors);
  return isValid;
};


  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Show general validation error
      toast.error("Please correct the errors in the form", toastConfig);
      return;
    }

    try {
      setLoading(true);
      setFieldErrors({}); // Clear all field errors

      const response = await teamleadApi.createTeamLeadApi(formData);
      
      // Show success toast
      toast.success(`Team lead "${formData.name}" created successfully!`, {
        ...toastConfig,
        icon: "✅",
      });
      
      // Reset form
      setFormData({ name: "", email: "", password: "" });
      
    } catch (error) {
      console.error("API Error:", error);
      
      const errorMessage = error.response?.data?.message || "Failed to create team lead";
      const errorData = error.response?.data;
      
      // Show error toast
      toast.error(errorMessage, {
        ...toastConfig,
        icon: "❌",
      });

      // Handle field-specific errors from server
      if (errorData?.errors) {
        const serverErrors = {};
        Object.keys(errorData.errors).forEach(key => {
          serverErrors[key] = errorData.errors[key].message;
        });
        setFieldErrors(serverErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
     <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg rounded-4 border-0">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h3 className="fw-bold text-primary">Add Team Lead</h3>
                <p className="text-muted">Create a new team lead account</p>
              </div>
              
              <Form onSubmit={handleSubmit} noValidate>
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
                  />
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {fieldErrors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Email Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter team lead email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!fieldErrors.email}
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {fieldErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    Password <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter a secure password (min. 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!fieldErrors.password}
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {fieldErrors.password}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Must be at least 6 characters long
                  </Form.Text>
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="rounded-3 py-2 fw-semibold"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Creating Team Lead...
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
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </Container>
  );
};

export default AddTeamLead;