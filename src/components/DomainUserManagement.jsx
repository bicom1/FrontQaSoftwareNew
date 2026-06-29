import React, { useEffect, useRef, useState } from "react";
import { Alert, Form, Modal, Spinner, Table } from "react-bootstrap";
import { Search, UserPlus, Users, Crown, Pencil, Trash2 } from "lucide-react";
import { getallusersApi, LeadRegister, deleteUserApi, patchUserApi } from "../features/userApis";
import {
  getAddUserRoleOptions,
  getManageableRoles,
  getVisibleUserRoles,
  normalizeRole,
  ROLE_LABELS,
  ROLES,
} from "../utils/roles";
import GradientButton, {
  GRADIENT_HEADER_STYLE,
} from "./common/GradientButton";

const formatCreatedAt = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Domain-scoped user management.
 * Agent Admin: add/view agent users.
 * QC Admin: create, update, delete QC users.
 */
const DomainUserManagement = ({
  title,
  sectionTitle = "Team Members",
  description,
  viewOnly = false,
  analyticsLayout = false,
}) => {
  const actorRole = useState(() =>
    normalizeRole(localStorage.getItem("userRole") || "")
  )[0];
  const manageable = getManageableRoles(actorRole);
  const readOnly = viewOnly;
  const canAddUsers = !readOnly && manageable.length > 0;
  const canManageUsers = canAddUsers;
  const canDeleteUsers = canManageUsers;
  const defaultRole = manageable[0] || ROLES.AGENT_USER;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: defaultRole,
  });
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [editAlert, setEditAlert] = useState({ type: "", message: "" });
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
        message: `${roleLabel} created successfully.`,
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

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
    });
    setEditAlert({ type: "", message: "" });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditForm({ name: "", email: "", password: "" });
    setEditAlert({ type: "", message: "" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser?._id) return;
    setUpdating(true);
    setEditAlert({ type: "", message: "" });
    try {
      const payload = {
        name: editForm.name.trim(),
        email: editForm.email.trim().toLowerCase(),
      };
      if (editForm.password.trim()) {
        payload.password = editForm.password;
      }
      await patchUserApi(editingUser._id, payload);
      setEditAlert({ type: "success", message: "User updated successfully." });
      await loadUsers();
      setTimeout(() => closeEditModal(), 1200);
    } catch (err) {
      setEditAlert({
        type: "danger",
        message: err?.response?.data?.message || "Failed to update user",
      });
    } finally {
      setUpdating(false);
    }
  };

  const roleOptions = getAddUserRoleOptions(actorRole);

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      (ROLE_LABELS[normalizeRole(u.role)] || u.role || "")
        .toLowerCase()
        .includes(q)
    );
  });

  const displayCount = loading ? "—" : users.length;
  const filteredCount = filteredUsers.length;

  const pageHeader = (
    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
      <div>
        <h1 className="fw-bold h4 mb-1">
          {analyticsLayout ? title : (
            <span className="d-flex align-items-center gap-2">
              <Users size={22} />
              {title}
            </span>
          )}
        </h1>
        {description ? (
          <p className="text-muted small mb-0">{description}</p>
        ) : null}
      </div>
      {analyticsLayout ? (
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {canAddUsers && (
            <GradientButton onClick={() => setShowModal(true)} size="sm">
              <UserPlus size={16} className="me-1" />
              Add User
            </GradientButton>
          )}
          <div className="stat-card mini">
            <div className="stat-value">{displayCount}</div>
            <div className="stat-label">{sectionTitle}</div>
          </div>
        </div>
      ) : canAddUsers ? (
        <GradientButton onClick={() => setShowModal(true)} size="sm">
          <UserPlus size={16} className="me-1" />
          Add {ROLE_LABELS[defaultRole]}
        </GradientButton>
      ) : null}
    </div>
  );

  const tableCard = (
    <div className="card border-0 shadow-sm rounded-4">
      <div
        className={`${
          analyticsLayout
            ? "card-header bg-white d-flex justify-content-between align-items-center py-3"
            : "text-white px-3 py-2"
        }`}
        style={
          analyticsLayout
            ? undefined
            : { ...GRADIENT_HEADER_STYLE, borderRadius: "0.5rem 0.5rem 0 0" }
        }
      >
        {analyticsLayout ? (
          <>
            <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
              <Crown size={20} className="text-warning" />
              {sectionTitle}
            </h5>
            <span
              style={{
                background: "linear-gradient(90deg, #4CAF50, #2196F3)",
              }}
              className="badge rounded-pill px-3 py-2 text-white"
            >
              {displayCount} {displayCount === 1 ? "User" : "Users"}
            </span>
          </>
        ) : (
          sectionTitle
        )}
      </div>
      <div className={analyticsLayout ? "card-body" : undefined}>
        <div className={analyticsLayout ? "mb-4" : "px-3 pt-3"}>
          <div className="position-relative">
            <Search
              size={16}
              className="position-absolute top-50 translate-middle-y ms-3 text-muted"
            />
            <Form.Control
              className="ps-5"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm.trim() && !loading && (
            <small className="text-muted d-block mt-2">
              {filteredCount} matching
            </small>
          )}
        </div>
        <Table responsive hover className="mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Last Updated</th>
              {canManageUsers && <th className="text-end">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={canManageUsers ? 6 : 5}
                  className="text-center text-muted py-4"
                >
                  {searchTerm.trim()
                    ? "No users match your search."
                    : "No users in your domain yet."}
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td className="fw-semibold">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{ROLE_LABELS[normalizeRole(u.role)] || u.role}</td>
                  <td className="text-muted small">
                    {formatCreatedAt(u.createdAt)}
                  </td>
                  <td className="text-muted small">
                    {formatCreatedAt(u.updatedAt)}
                  </td>
                  {canManageUsers && (
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <GradientButton
                          size="sm"
                          className="px-2"
                          onClick={() => openEditModal(u)}
                          title="Edit user"
                        >
                          <Pencil size={14} />
                        </GradientButton>
                        <GradientButton
                          size="sm"
                          className="px-2"
                          disabled={deletingId === u._id}
                          onClick={() => handleDelete(u)}
                          title="Delete user"
                        >
                          {deletingId === u._id ? (
                            "..."
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </GradientButton>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );

  return (
    <div
      className={
        analyticsLayout
          ? "container-fluid px-4 py-3 analytics-dashboard"
          : "container-fluid px-0"
      }
    >
      {pageHeader}

      {!analyticsLayout && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body py-3">
            <div
              className="text-white px-3 py-2 mb-3 d-inline-block"
              style={GRADIENT_HEADER_STYLE}
            >
              Total Team Users
            </div>
            <div className="d-flex align-items-center gap-3">
              <h2 className="mb-0 fw-bold" style={{ fontSize: "2.5rem" }}>
                {displayCount}
              </h2>
              {searchTerm.trim() && !loading && (
                <span className="text-muted small">
                  ({filteredCount} matching)
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        tableCard
      )}
      {canAddUsers && (
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
              <GradientButton type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create User"}
              </GradientButton>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {canManageUsers && (
        <Modal show={showEditModal} onHide={closeEditModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editAlert.message && (
              <Alert variant={editAlert.type}>{editAlert.message}</Alert>
            )}
            {editingUser && (
              <div className="small text-muted mb-3">
                <div>
                  Created: {formatCreatedAt(editingUser.createdAt)}
                </div>
                <div>
                  Last updated: {formatCreatedAt(editingUser.updatedAt)}
                </div>
              </div>
            )}
            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New password (optional)</Form.Label>
                <Form.Control
                  type="password"
                  minLength={8}
                  placeholder="Leave blank to keep current password"
                  value={editForm.password}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, password: e.target.value }))
                  }
                />
              </Form.Group>
              <div className="d-flex gap-2">
                <GradientButton type="submit" disabled={updating}>
                  {updating ? "Saving..." : "Save Changes"}
                </GradientButton>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {analyticsLayout && (
        <style>{`
          .analytics-dashboard {
            font-family: "Inter", "Segoe UI", sans-serif;
            background: #f8fafc;
            min-height: 100vh;
          }
          .stat-card.mini {
            background: white;
            border-radius: 12px;
            padding: 0.75rem 1rem;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
            min-width: 120px;
          }
          .stat-value {
            font-size: 1.75rem;
            font-weight: 700;
            color: #1e293b;
          }
          .stat-label {
            font-size: 0.875rem;
            color: #64748b;
          }
        `}</style>
      )}
    </div>
  );
};

export default React.memo(DomainUserManagement);
