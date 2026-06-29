import React, { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Modal, Spinner, Table } from "react-bootstrap";
import { Circle, Users } from "lucide-react";
import { getUsersByPresenceApi } from "../features/userApis";
import { ROLE_LABELS, normalizeRole } from "../utils/roles";

const POLL_MS = 15000;

const formatWhen = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
};

const UserPresenceModal = ({ show, onHide, status = "active" }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isActive = status === "active";
  const title = isActive ? "Active Users" : "Inactive Users";

  const loadUsers = useCallback(async () => {
    if (!show) return;
    try {
      setError("");
      const res = await getUsersByPresenceApi(status);
      if (res?.success) {
        setUsers(Array.isArray(res.data) ? res.data : []);
      } else {
        setUsers([]);
        setError(res?.message || "Failed to load users");
      }
    } catch (err) {
      setUsers([]);
      setError(
        err?.response?.data?.message || "Failed to load users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [show, status]);

  useEffect(() => {
    if (!show) return undefined;
    setLoading(true);
    loadUsers();
    const timer = setInterval(loadUsers, POLL_MS);
    return () => clearInterval(timer);
  }, [show, loadUsers]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="d-flex align-items-center gap-2">
          <Users size={22} className={isActive ? "text-success" : "text-danger"} />
          {title}
          <Badge bg={isActive ? "success" : "danger"} className="ms-1">
            {users.length}
          </Badge>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        {error && (
          <Alert variant="danger" className="mx-3">
            {error}
          </Alert>
        )}

        {loading && users.length === 0 ? (
          <div className="text-center py-5">
            <Spinner animation="border" size="sm" className="me-2" />
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="text-center text-muted py-5">
            No {isActive ? "active" : "inactive"} users found
          </div>
        ) : (
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Active</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="text-capitalize fw-semibold">{user.name || "—"}</td>
                  <td>{user.email || "—"}</td>
                  <td>
                    {ROLE_LABELS[normalizeRole(user.role)] ||
                      normalizeRole(user.role)}
                  </td>
                  <td className="small text-muted">
                    {formatWhen(user.lastActive)}
                  </td>
                  <td>
                    <span
                      className={`d-inline-flex align-items-center gap-1 badge rounded-pill ${
                        user.isOnline ? "text-bg-success" : "text-bg-secondary"
                      }`}
                    >
                      <Circle size={8} fill="currentColor" />
                      {user.isOnline ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default UserPresenceModal;
