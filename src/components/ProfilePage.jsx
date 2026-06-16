import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Spinner,
  Badge,
} from "react-bootstrap";
import { getProfileApi, patchUserApi } from "../features/userApis";
import { normalizeProfileResponse } from "../utils/profileUtils";
import AccountShell from "./account/AccountShell";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const load = async () => {
    try {
      setLoading(true);
      const res = await getProfileApi();
      const u = normalizeProfileResponse(res.data);
      setUser(u);
      setName((u?.name || "").toString());
      setEmail((u?.email || "").toString());
      setMessage({ type: "", text: "" });
    } catch (e) {
      setMessage({
        type: "danger",
        text:
          e?.response?.data?.message ||
          e.message ||
          "Could not load your profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?._id) return;
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await patchUserApi(user._id, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
      });
      const updated = normalizeProfileResponse(res.data?.data || res.data);
      setUser(updated);
      setName((updated?.name || "").toString());
      setEmail((updated?.email || "").toString());

      const raw = localStorage.getItem("user");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          parsed.name = updated?.name ?? parsed.name;
          parsed.email = updated?.email ?? parsed.email;
          localStorage.setItem("user", JSON.stringify(parsed));
        } catch {
          /* ignore */
        }
      }

      window.dispatchEvent(new Event("qasoft-profile-changed"));
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setMessage({
        type: "danger",
        text:
          err?.response?.data?.message ||
          err.message ||
          "Could not save changes.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AccountShell
        active="profile"
        title="Profile"
        subtitle="Your account"
      >
        <div className="d-flex align-items-center gap-2 text-muted py-5">
          <Spinner animation="border" size="sm" />
          Loading profile…
        </div>
      </AccountShell>
    );
  }

  return (
    <AccountShell
      active="profile"
      title="Profile"
      subtitle="Update how you appear in the application"
    >
      {message.text ? (
        <Alert variant={message.type === "success" ? "success" : "danger"}>
          {message.text}
        </Alert>
      ) : null}

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3 fw-semibold border-bottom">
          Contact & identity
        </Card.Header>
        <Card.Body className="p-4">
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3" controlId="profileName">
              <Form.Label className="small text-muted text-uppercase fw-bold">
                Full name
              </Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Your name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="profileEmail">
              <Form.Label className="small text-muted text-uppercase fw-bold">
                Work email
              </Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@company.com"
              />
              <Form.Text className="text-muted">
                Changing email must stay unique in the system. You will use it
                to sign in.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small text-muted text-uppercase fw-bold">
                Role
              </Form.Label>
              <div>
                <Badge bg="secondary" className="text-capitalize fs-6 fw-normal">
                  {user?.role || "—"}
                </Badge>
                <Form.Text className="d-block text-muted mt-2">
                  Role changes are managed by an administrator.
                </Form.Text>
              </div>
            </Form.Group>

            <div className="d-flex flex-wrap gap-2 justify-content-end pt-2 border-top">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => load()}
                disabled={saving}
              >
                Reset
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </AccountShell>
  );
};

export default ProfilePage;
