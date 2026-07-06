import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import { UserPlus } from "lucide-react";
import {
  validateInviteTokenApi,
  acceptInviteApi,
} from "../features/userApis";
import { ROLE_LABELS, normalizeRole } from "../utils/roles";
import {
  loginAndRedirect,
  parseAuthFromRegisterResponse,
} from "../utils/authSession";

function AcceptInvite() {
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();
  const token = routeToken || searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [invalidMessage, setInvalidMessage] = useState("");
  const [inviteInfo, setInviteInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const validate = async () => {
      if (!token) {
        setInvalidMessage("Missing invite token. Use the full link from your email.");
        setLoading(false);
        return;
      }

      try {
        const res = await validateInviteTokenApi(token);
        if (res.data?.success && res.data?.data) {
          setInviteInfo(res.data.data);
        } else {
          setInvalidMessage(res.data?.message || "Invalid invite link");
        }
      } catch (err) {
        setInvalidMessage(
          err?.response?.data?.message ||
            "This invite link is invalid or expired"
        );
      } finally {
        setLoading(false);
      }
    };

    validate();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccept = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.password || formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await acceptInviteApi(token, {
        name: formData.name.trim(),
        password: formData.password,
      });

      if (res.data?.success) {
        const auth = parseAuthFromRegisterResponse(res.data);
        if (auth) {
          toast.success("Account activated! Redirecting to your dashboard...");
          loginAndRedirect(auth.user, auth.token);
          return;
        }
        toast.success("Account activated! Please log in.");
      } else {
        toast.error(res.data?.message || "Failed to activate account");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to activate account"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" className="me-2" />
          <span>Validating your invite...</span>
        </div>
      </div>
    );
  }

  if (invalidMessage) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-3">
        <div className="card shadow-sm border-0" style={{ maxWidth: 480, width: "100%" }}>
          <div className="card-body p-4 text-center">
            <UserPlus size={40} className="text-warning mb-3" />
            <h5 className="fw-bold mb-2">Invite link not valid</h5>
            <Alert variant="danger" className="mb-0 text-start">
              {invalidMessage}
            </Alert>
            <p className="text-muted small mt-3 mb-0">
              Ask your admin to resend the invite, or use the full link from the
              email (not the login page).
            </p>
          </div>
        </div>
      </div>
    );
  }

  const roleLabel =
    ROLE_LABELS[normalizeRole(inviteInfo?.role)] || inviteInfo?.role;

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-3">
      <div className="card shadow-sm border-0" style={{ maxWidth: 520, width: "100%" }}>
        <div className="card-header bg-white border-bottom py-3">
          <h5 className="mb-0 d-flex align-items-center gap-2">
            <UserPlus size={22} className="text-primary" />
            Activate Your Account
          </h5>
        </div>

        <div className="card-body p-4">
          <p className="text-muted mb-4">
            You were invited to BICOMM QA. Set your name and password below —
            same as when an admin adds a user, but you choose your own password.
          </p>

          <Form onSubmit={handleAccept}>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                value={inviteInfo?.email || ""}
                readOnly
                disabled
                className="bg-light"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password *</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password (min 8 characters)"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role *</Form.Label>
              <Form.Control
                type="text"
                value={roleLabel}
                readOnly
                disabled
                className="bg-light"
              />
              <Form.Text className="text-muted">
                After activation you will go straight to your dashboard for this
                role — no separate login step.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 pt-2">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Activating...
                  </>
                ) : (
                  "Activate Account"
                )}
              </Button>
            </div>
          </Form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}

export default AcceptInvite;
