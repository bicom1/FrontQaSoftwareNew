import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { getProfileApi, forgotPasswordApi } from "../features/userApis";
import { normalizeProfileResponse } from "../utils/profileUtils";
import AccountShell from "./account/AccountShell";

const DENSITY_KEY = "qasoft:uiDensity";

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [density, setDensity] = useState(
    () => localStorage.getItem(DENSITY_KEY) || "comfortable"
  );
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState({ type: "", text: "" });
  const [resetSending, setResetSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getProfileApi();
        const u = normalizeProfileResponse(res.data);
        setUser(u);
        setResetEmail((u?.email || "").toString());
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    localStorage.setItem(DENSITY_KEY, density);
    document.documentElement.dataset.uiDensity = density;
  }, [density]);

  const sendReset = async (e) => {
    e.preventDefault();
    const email = resetEmail.trim();
    if (!email) return;
    setResetSending(true);
    setResetStatus({ type: "", text: "" });
    try {
      await forgotPasswordApi(email);
      setResetStatus({
        type: "success",
        text: "A 6-digit OTP has been sent to your email. Use Forgot Password on the login page to complete the reset.",
      });
    } catch (err) {
      setResetStatus({
        type: "danger",
        text:
          err?.response?.data?.message ||
          err.message ||
          "Could not send reset email.",
      });
    } finally {
      setResetSending(false);
    }
  };

  if (loading) {
    return (
      <AccountShell
        active="settings"
        title="Settings"
        subtitle="Workspace preferences"
      >
        <div className="d-flex align-items-center gap-2 text-muted py-5">
          <Spinner animation="border" size="sm" />
          Loading…
        </div>
      </AccountShell>
    );
  }

  return (
    <AccountShell
      active="settings"
      title="Settings"
      subtitle="Security and how the dashboard feels"
    >
      <div className="d-flex flex-column gap-4">
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3 fw-semibold border-bottom">
            Appearance
          </Card.Header>
          <Card.Body className="p-4">
            <Form.Label className="small text-muted text-uppercase fw-bold d-block mb-2">
              List density
            </Form.Label>
            <Form.Select
              value={density}
              onChange={(e) => setDensity(e.target.value)}
              style={{ maxWidth: "320px" }}
            >
              <option value="comfortable">Comfortable (default)</option>
              <option value="compact">Compact</option>
            </Form.Select>
            <Form.Text className="text-muted d-block mt-2">
              Applies on this browser only. Use it if you prefer tighter spacing
              in forms and tables.
            </Form.Text>
          </Card.Body>
        </Card>

        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3 fw-semibold border-bottom">
            Password & sign-in
          </Card.Header>
          <Card.Body className="p-4">
            <p className="text-muted small mb-3">
              Password changes use the secure reset flow. We will email a link
              to the address below (same as your account email unless you edit
              it for a different mailbox).
            </p>
            {resetStatus.text ? (
              <Alert variant={resetStatus.type === "success" ? "success" : "danger"}>
                {resetStatus.text}
              </Alert>
            ) : null}
            <Form onSubmit={sendReset} className="d-flex flex-column gap-3" style={{ maxWidth: "420px" }}>
              <Form.Group controlId="resetEmail">
                <Form.Label className="small text-muted text-uppercase fw-bold">
                  Email for reset link
                </Form.Label>
                <Form.Control
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <div>
                <Button type="submit" variant="dark" disabled={resetSending}>
                  {resetSending ? "Sending…" : "Email me a reset link"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3 fw-semibold border-bottom">
            Profile details
          </Card.Header>
          <Card.Body className="p-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="text-muted small mb-0">
              Signed in as{" "}
              <strong className="text-dark text-capitalize">
                {user?.name || "—"}
              </strong>
              {user?.email ? (
                <>
                  {" "}
                  · <span className="text-break">{user.email}</span>
                </>
              ) : null}
            </div>
            <Button as={Link} to="/dashboard/profile" variant="outline-primary">
              Edit profile
            </Button>
          </Card.Body>
        </Card>
      </div>
    </AccountShell>
  );
};

export default SettingsPage;
