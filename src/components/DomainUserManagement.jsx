import React, { useEffect, useRef, useState } from "react";
import { Search, UserPlus, Users, Crown, Pencil, Trash2, X } from "lucide-react";
import { getallusersApi, LeadRegister, deleteUserApi, patchUserApi } from "../features/userApis";
import {
  getAddUserRoleOptions,
  getManageableRoles,
  getVisibleUserRoles,
  normalizeRole,
  ROLE_LABELS,
  ROLES,
} from "../utils/roles";

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

/* ---------- Small Tailwind primitives (replace react-bootstrap) ---------- */

const Spinner = ({ size = 20, className = "" }) => (
  <div
    className={`rounded-full border-2 border-current border-t-transparent animate-spin ${className}`}
    style={{ width: size, height: size }}
  />
);

const Banner = ({ variant = "success", children }) => {
  const styles =
    variant === "danger"
      ? "bg-red-50 text-red-700 border-red-100"
      : "bg-green-50 text-green-700 border-green-100";
  return (
    <div className={`rounded-lg border px-4 py-2.5 text-sm mb-4 ${styles}`}>
      {children}
    </div>
  );
};

const GradientButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  size = "md",
  className = "",
}) => {
  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-white shadow-sm transition-opacity disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 ${sizeClasses} ${className}`}
      style={{ background: "linear-gradient(90deg, #4CAF50, #2196F3)" }}
    >
      {children}
    </button>
  );
};

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h5 className="font-bold text-gray-900 text-base mb-0">{title}</h5>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-md p-1 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

const inputClasses =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors";

const Field = ({ label, children }) => (
  <div className="mb-3.5">
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

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

  return (
    <div className={analyticsLayout ? "bg-slate-50 min-h-screen px-4 md:px-6 py-6" : "w-full"}>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2 mb-1">
            {!analyticsLayout && <Users size={22} className="flex-shrink-0" />}
            <span>{title}</span>
          </h1>
          {description && (
            <p className="text-gray-500 text-sm mb-0">{description}</p>
          )}
        </div>

        {analyticsLayout ? (
          <div className="flex items-stretch gap-3 flex-wrap">
            {canAddUsers && (
              <GradientButton onClick={() => setShowModal(true)} size="sm">
                <UserPlus size={16} className="flex-shrink-0" />
                <span>Add User</span>
              </GradientButton>
            )}
            <div className="bg-white rounded-xl shadow-sm px-4 py-2.5 flex flex-col items-center justify-center text-center min-w-[120px]">
              <div className="text-2xl font-bold text-gray-900 leading-tight">
                {displayCount}
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap">
                {sectionTitle}
              </div>
            </div>
          </div>
        ) : (
          canAddUsers && (
            <GradientButton onClick={() => setShowModal(true)} size="sm">
              <UserPlus size={16} className="flex-shrink-0" />
              <span>Add {ROLE_LABELS[defaultRole]}</span>
            </GradientButton>
          )
        )}
      </div>

      {/* Total Team Users (non-analytics layout) */}
      {!analyticsLayout && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 p-5">
          <div className="flex items-center flex-wrap gap-2">
            <span
              className="inline-flex items-center rounded-lg text-white text-sm font-medium px-3 py-1.5 whitespace-nowrap"
              style={{ background: "linear-gradient(90deg, #4CAF50, #2196F3)" }}
            >
              Total Team Users : {displayCount}
            </span>
            {searchTerm.trim() && !loading && (
              <span className="text-gray-400 text-sm whitespace-nowrap">
                ({filteredCount} matching)
              </span>
            )}
          </div>
        </div>
      )}

      {error && <Banner variant="danger">{error}</Banner>}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size={32} className="text-blue-600" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Card header */}
          <div
            className={
              analyticsLayout
                ? "flex flex-wrap justify-between items-center gap-3 px-5 py-4 border-b border-gray-100"
                : "px-5 py-3 text-white text-sm font-medium"
            }
            style={
              analyticsLayout
                ? undefined
                : { background: "linear-gradient(90deg, #4CAF50, #2196F3)" }
            }
          >
            {analyticsLayout ? (
              <>
                <h5 className="font-bold text-gray-900 text-[15px] flex items-center gap-2 mb-0">
                  <Crown size={18} className="text-amber-500 flex-shrink-0" />
                  <span>{sectionTitle}</span>
                </h5>
                <span
                  className="inline-flex items-center rounded-full text-white text-xs font-semibold px-3 py-1.5 whitespace-nowrap"
                  style={{ background: "linear-gradient(90deg, #4CAF50, #2196F3)" }}
                >
                  {displayCount} {displayCount === 1 ? "User" : "Users"}
                </span>
              </>
            ) : (
              <span>{sectionTitle}</span>
            )}
          </div>

          <div className="p-5">
            {/* Search */}
            <div className="relative mb-2">
              <Search
                size={16}
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                className={`${inputClasses} pl-10`}
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm.trim() && !loading && (
              <p className="text-gray-400 text-xs mb-3">
                {filteredCount} matching
              </p>
            )}

            {/* Table */}
            <div className="overflow-x-auto -mx-5 px-5 mt-3">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <th className="text-left font-semibold px-3 py-2.5 rounded-l-lg">
                      Name
                    </th>
                    <th className="text-left font-semibold px-3 py-2.5">Email</th>
                    <th className="text-left font-semibold px-3 py-2.5">Role</th>
                    <th className="text-left font-semibold px-3 py-2.5">Created</th>
                    <th className="text-left font-semibold px-3 py-2.5">
                      Last Updated
                    </th>
                    {canManageUsers && (
                      <th className="text-right font-semibold px-3 py-2.5 rounded-r-lg">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={canManageUsers ? 6 : 5}
                        className="text-center text-gray-400 text-sm py-10"
                      >
                        {searchTerm.trim()
                          ? "No users match your search."
                          : "No users in your domain yet."}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr
                        key={u._id}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-3 py-3 font-semibold text-gray-900 whitespace-nowrap">
                          {u.name}
                        </td>
                        <td className="px-3 py-3 text-gray-700">{u.email}</td>
                        <td className="px-3 py-3 text-gray-700 whitespace-nowrap">
                          {ROLE_LABELS[normalizeRole(u.role)] || u.role}
                        </td>
                        <td className="px-3 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {formatCreatedAt(u.createdAt)}
                        </td>
                        <td className="px-3 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {formatCreatedAt(u.updatedAt)}
                        </td>
                        {canManageUsers && (
                          <td className="px-3 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                title="Edit user"
                                onClick={() => openEditModal(u)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white shadow-sm hover:opacity-90 transition-opacity"
                                style={{
                                  background:
                                    "linear-gradient(90deg, #4CAF50, #2196F3)",
                                }}
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                type="button"
                                title="Delete user"
                                disabled={deletingId === u._id}
                                onClick={() => handleDelete(u)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white shadow-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                                style={{
                                  background:
                                    "linear-gradient(90deg, #4CAF50, #2196F3)",
                                }}
                              >
                                {deletingId === u._id ? (
                                  <Spinner size={14} />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add User modal */}
      {canAddUsers && (
        <Modal show={showModal} onClose={() => setShowModal(false)} title="Add User">
          {alert.message && <Banner variant={alert.type}>{alert.message}</Banner>}
          <form onSubmit={handleSubmit}>
            <Field label="Name">
              <input
                required
                className={inputClasses}
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                required
                className={inputClasses}
                value={formData.email}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, email: e.target.value }))
                }
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                required
                minLength={8}
                className={inputClasses}
                value={formData.password}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, password: e.target.value }))
                }
              />
            </Field>

            {roleOptions.length > 1 ? (
              <Field label="Role">
                <select
                  className={inputClasses}
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
                </select>
              </Field>
            ) : (
              <p className="text-sm text-gray-500 mb-3.5">
                Role: <strong className="text-gray-800">{ROLE_LABELS[defaultRole]}</strong>
              </p>
            )}

            <GradientButton type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <>
                  <Spinner size={16} />
                  <span>Creating...</span>
                </>
              ) : (
                "Create User"
              )}
            </GradientButton>
          </form>
        </Modal>
      )}

      {/* Edit User modal */}
      {canManageUsers && (
        <Modal show={showEditModal} onClose={closeEditModal} title="Edit User">
          {editAlert.message && (
            <Banner variant={editAlert.type}>{editAlert.message}</Banner>
          )}
          {editingUser && (
            <div className="text-xs text-gray-400 mb-4 space-y-0.5">
              <div>Created: {formatCreatedAt(editingUser.createdAt)}</div>
              <div>Last updated: {formatCreatedAt(editingUser.updatedAt)}</div>
            </div>
          )}
          <form onSubmit={handleUpdate}>
            <Field label="Name">
              <input
                required
                className={inputClasses}
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                required
                className={inputClasses}
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, email: e.target.value }))
                }
              />
            </Field>
            <Field label="New password (optional)">
              <input
                type="password"
                minLength={8}
                placeholder="Leave blank to keep current password"
                className={inputClasses}
                value={editForm.password}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, password: e.target.value }))
                }
              />
            </Field>

            <div className="flex items-center gap-2 mt-1">
              <GradientButton type="submit" size="sm" disabled={updating}>
                {updating ? (
                  <>
                    <Spinner size={14} />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </GradientButton>
              <button
                type="button"
                onClick={closeEditModal}
                className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default React.memo(DomainUserManagement);