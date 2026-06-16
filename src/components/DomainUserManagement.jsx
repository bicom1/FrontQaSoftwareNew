import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Form,
  Modal,
  Spinner,
  Table,
} from "react-bootstrap";
import { UserPlus, Trash2, Users } from "lucide-react";
import {
  getallusersApi,
  LeadRegister,
  deleteUserApi,
} from "../features/userApis";
import {
  getAddUserRoleOptions,
  getManageableRoles,
  getVisibleUserRoles,
  normalizeRole,
  ROLE_LABELS,
  ROLES,
} from "../utils/roles";

/**
 * Domain-scoped user management for Agent Admin / QC Admin.
 * Super Admin uses Overview instead.
 */
const DomainUserManagement = ({ title, description }) => {
  const actorRole = useState(() =>
    normalizeRole(localStorage.getItem("userRole") || "")
  )[0];
  const manageable = getManageableRoles(actorRole);
  const defaultRole = manageable[0] || ROLES.AGENT_USER;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: defaultRole,
  });
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [deletingId, setDeletingId] = useState(null);

  const mountedRef = useRef(true);
  const fetchIdRef = useRef(0);

  const loadUsers = async ({ showSpinner = false } = {}) => {
    const fetchId = ++fetchIdRef.current;
    try {
      if (showSpinner) setLoading(true);
      setError("");
      const visibleRoles = getVisibleUserRoles(actorRole);
      const res = await getallusersApi();
      if (!mountedRef.current || fetchId !== fetchIdRef.current) return;
      const list = res?.data?.data || [];
      setUsers(
        list.filter((u) => visibleRoles.includes(normalizeRole(u.role)))
      );
    } catch (e) {
      if (!mountedRef.current || fetchId !== fetchIdRef.current) return;
      setError(e?.response?.data?.message || "Failed to load users");
      setUsers([]);
    } finally {
      if (mountedRef.current && fetchId === fetchIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    loadUsers({ showSpinner: true });
    return () => {
      mountedRef.current = false;
      fetchIdRef.current += 1;
    };
    // Load once when this page mounts — do not re-bind to unstable array deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert({ type: "", message: "" });
    try {
      await LeadRegister({
        ...formData,
        role: formData.role || defaultRole,
      });
      const roleLabel =
        ROLE_LABELS[normalizeRole(formData.role || defaultRole)] ||
        formData.role;
      setAlert({
        type: "success",
        message: `${roleLabel} created successfully. They can log in with ${formData.email.trim().toLowerCase()} and the password you set.`,
      });
      setFormData({ name: "", email: "", password: "", role: defaultRole });
      await loadUsers();
      setTimeout(() => setShowModal(false), 1500);
    } catch (err) {
      setAlert({
        type: "danger",
        message: err?.response?.data?.message || "Failed to create user",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name} (${user.email})?`)) return;
    setDeletingId(user._id);
    try {
      await deleteUserApi(user._id);
      await loadUsers();
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const roleOptions = getAddUserRoleOptions(actorRole);

  return (
    <div className="container-fluid px-0">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h1 className="h4 fw-bold mb-1 d-flex align-items-center gap-2">
            <Users size={22} />
            {title}
          </h1>
          <p className="text-muted small mb-0">{description}</p>
        </div>
        {manageable.length > 0 && (
          <Button variant="dark" onClick={() => setShowModal(true)}>
            <UserPlus size={16} className="me-1" />
            Add {ROLE_LABELS[defaultRole]}
          </Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">
                    No users in your domain yet.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{ROLE_LABELS[normalizeRole(u.role)] || u.role}</td>
                    <td className="text-end">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        disabled={deletingId === u._id}
                        onClick={() => handleDelete(u)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alert.message && (
            <Alert variant={alert.type}>{alert.message}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, email: e.target.value }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, password: e.target.value }))
                }
              />
            </Form.Group>
            {roleOptions.length > 1 ? (
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, role: e.target.value }))
                  }
                >
                  {roleOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            ) : (
              <p className="small text-muted">
                Role: <strong>{ROLE_LABELS[defaultRole]}</strong>
              </p>
            )}
            <Form.Text className="text-muted d-block mb-3">
              The user must log in with this email and password at the login
              page.
            </Form.Text>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Creating..." : "Create User"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default React.memo(DomainUserManagement);
