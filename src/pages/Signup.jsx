import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { signupApi } from "../features/userApis";
import { ROLES } from "../utils/roles";
import {
  loginAndRedirect,
  parseAuthFromRegisterResponse,
  redirectToRoleDashboard,
} from "../utils/authSession";
import { Link } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ROLES.AGENT_USER,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(formData.email.trim()))
      errors.email = "Invalid email";
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 8)
      errors.password = "Minimum 8 characters required";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await signupApi({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      });

      if (res.data.success) {
        const auth = parseAuthFromRegisterResponse(res.data);
        if (auth) {
          toast.success("Account created! Redirecting to your dashboard...");
          loginAndRedirect(auth.user, auth.token);
          return;
        }
        toast.success("Account created!");
        redirectToRoleDashboard(res.data.user?.role || ROLES.AGENT_USER);
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(-45deg, #6a11cb, #2575fc, #ff6b6b, #4ecdc4)",
      backgroundSize: "400% 400%",
      padding: "20px",
    },
    card: {
      width: "100%",
      maxWidth: "440px",
      borderRadius: "16px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
      background: "#fff",
      padding: "40px",
    },
    title: { textAlign: "center", marginBottom: "8px", fontWeight: 700, fontSize: "26px" },
    subtitle: { textAlign: "center", color: "#666", marginBottom: "24px" },
    label: { display: "block", marginBottom: "8px", fontWeight: 600 },
    inputWrap: { position: "relative", marginBottom: "8px" },
    input: {
      width: "100%",
      padding: "14px 14px 14px 42px",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
      fontSize: "16px",
      marginBottom: "8px",
    },
    icon: { position: "absolute", left: "14px", top: "18px", color: "#999" },
    button: {
      width: "100%",
      padding: "14px",
      border: "none",
      borderRadius: "8px",
      background: "linear-gradient(90deg, #2575fc, #6a11cb)",
      color: "#fff",
      fontWeight: 600,
      cursor: "pointer",
      marginTop: "8px",
    },
    link: { display: "block", textAlign: "center", marginTop: "16px", color: "#2575fc", textDecoration: "none" },
    errorText: { color: "#dc3545", fontSize: "13px", marginBottom: "8px" },
    select: {
      width: "100%",
      padding: "14px",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
      fontSize: "16px",
      marginBottom: "12px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>
          Create an account — you will go straight to your dashboard
        </p>

        <form onSubmit={handleSignup} autoComplete="off">
          <label style={styles.label}>Full Name</label>
          <div style={styles.inputWrap}>
            <FaUser style={styles.icon} />
            <input
              type="text"
              name="name"
              style={styles.input}
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          {formErrors.name && <div style={styles.errorText}>{formErrors.name}</div>}

          <label style={styles.label}>Email</label>
          <div style={styles.inputWrap}>
            <FaEnvelope style={styles.icon} />
            <input
              type="email"
              name="email"
              style={styles.input}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          {formErrors.email && <div style={styles.errorText}>{formErrors.email}</div>}

          <label style={styles.label}>Role</label>
          <select
            name="role"
            style={styles.select}
            value={formData.role}
            onChange={handleChange}
          >
            <option value={ROLES.AGENT_USER}>Agent User</option>
            <option value={ROLES.QC_USER}>QC User</option>
          </select>

          <label style={styles.label}>Password</label>
          <div style={styles.inputWrap}>
            <FaLock style={styles.icon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              style={styles.input}
              placeholder="Min 8 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>
          {formErrors.password && (
            <div style={styles.errorText}>{formErrors.password}</div>
          )}

          <label style={styles.label}>Confirm Password</label>
          <div style={styles.inputWrap}>
            <FaLock style={styles.icon} />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              style={styles.input}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>
          {formErrors.confirmPassword && (
            <div style={styles.errorText}>{formErrors.confirmPassword}</div>
          )}

          <label style={{ fontSize: "13px", color: "#666" }}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            Show password
          </label>

          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <Link to="/login" style={styles.link}>
          Already have an account? Login
        </Link>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}

export default Signup;
