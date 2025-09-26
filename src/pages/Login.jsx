import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { LoginApi, forgotPasswordApi } from "../features/userApis";
import { useNavigate } from "react-router-dom";

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isForgotPasswordHovered, setIsForgotPasswordHovered] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let errors = {};
    if (!formData.email) errors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) errors.email = "Invalid email";
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 6)
      errors.password = "Minimum 6 characters required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const res = await LoginApi(formData);
      if (res.data.success) {
        // Save token
        localStorage.setItem("token", res.data.token);

        // Save full user object
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Save role separately if you need
        localStorage.setItem("userRole", res.data.user.role);

        toast.success("Login successful!");
        setTimeout(() => {
          onLoginSuccess?.(); 
          const role = res.data.user.role?.toLowerCase();
          navigate(role === "agent" ? "/agent" : "/dashboard");
        }, 1000);
      } else {
        toast.error(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error("Enter your email first");
      return;
    }
    try {
      const res = await forgotPasswordApi({ email: formData.email });
      toast.info(res.data.message || "Reset link sent to your email");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error sending reset link");
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
      animation: "gradientShift 8s ease infinite",
      position: "relative",
      overflow: "hidden",
    },
    // Add a subtle overlay for better text readability
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.1)",
      zIndex: 1,
    },
    card: {
      width: "100%",
      maxWidth: "440px",
      borderRadius: "16px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
      background: "#ffffff",
      padding: "40px",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
      zIndex: 2,
    },
    header: {
      textAlign: "center",
      marginBottom: "35px",
      color: "#333",
      fontSize: "30px",
      fontWeight: "700",
      position: "relative",
      paddingBottom: "12px",
    },
    headerUnderline: {
      content: "''",
      position: "absolute",
      bottom: "0",
      left: "50%",
      transform: "translateX(-50%)",
      width: "80px",
      height: "4px",
      background: "linear-gradient(90deg, #2575fc, #6a11cb)",
      borderRadius: "2px",
    },
    formGroup: {
      marginBottom: "25px",
      position: "relative",
    },
    label: {
      display: "block",
      marginBottom: "10px",
      fontWeight: "600",
      color: "#444",
      fontSize: "15px",
      transition: "all 0.3s ease",
    },
    inputGroup: {
      position: "relative",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
      transition: "all 0.3s ease",
    },
    inputGroupFocus: {
      boxShadow: "0 4px 8px rgba(37, 117, 252, 0.2)",
    },
    input: {
      width: "100%",
      padding: "15px 45px",
      borderRadius: "8px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e0e0e0",
      fontSize: "16px",
      transition: "all 0.3s ease",
      outline: "none",
      backgroundColor: "#f9fafc",
    },
    inputFocus: {
      borderColor: "#2575fc",
      backgroundColor: "#ffffff",
    },
    inputError: {
      borderColor: "#ff5252",
      boxShadow: "0 4px 8px rgba(255, 82, 82, 0.15)",
    },
    errorText: {
      color: "#ff5252",
      fontSize: "13px",
      marginTop: "6px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
    },
    button: {
      width: "100%",
      padding: "15px",
      borderRadius: "8px",
      border: "none",
      background: "linear-gradient(90deg, #2575fc, #6a11cb)",
      color: "white",
      fontSize: "17px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(37, 117, 252, 0.3)",
      position: "relative",
      overflow: "hidden",
    },
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 15px rgba(37, 117, 252, 0.35)",
    },
    forgotPassword: {
      textAlign: "right",
      marginTop: "15px",
    },
    forgotPasswordLink: {
      color: "#2575fc",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      cursor: "pointer",
      position: "relative",
      display: "inline-block",
    },
    forgotPasswordLinkHover: {
      color: "#6a11cb",
      transform: "translateX(3px)",
    },
    icon: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#999",
      transition: "all 0.3s ease",
      zIndex: "2",
    },
    iconFocus: {
      color: "#2575fc",
    },
    leftIcon: {
      left: "15px",
    },
    rightIcon: {
      right: "15px",
      cursor: "pointer",
    },
  };

  // Add CSS for the animation
  const gradientAnimationCSS = `
    @keyframes gradientShift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  `;

  return (
    <>
      <style>{gradientAnimationCSS}</style>
      <div style={styles.container}>
        <div style={styles.overlay}></div>
        <div style={styles.card}>
          <h2 style={styles.header}>
            BICOMM.
            <span style={styles.headerUnderline}></span>
          </h2>
          <form onSubmit={handleLogin} noValidate>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="email">
                Email Address
              </label>
              <div
                style={{
                  ...styles.inputGroup,
                  ...(focusedField === "email" ? styles.inputGroupFocus : {}),
                }}
              >
                <FaEnvelope
                  style={{
                    ...styles.icon,
                    ...styles.leftIcon,
                    ...(focusedField === "email" ? styles.iconFocus : {}),
                  }}
                />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...styles.input,
                    ...(focusedField === "email" ? styles.inputFocus : {}),
                    ...(formErrors.email ? styles.inputError : {}),
                  }}
                />
              </div>
              {formErrors.email && (
                <div style={styles.errorText}>{formErrors.email}</div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="password">
                Password
              </label>
              <div
                style={{
                  ...styles.inputGroup,
                  ...(focusedField === "password" ? styles.inputGroupFocus : {}),
                }}
              >
                <FaLock
                  style={{
                    ...styles.icon,
                    ...styles.leftIcon,
                    ...(focusedField === "password" ? styles.iconFocus : {}),
                  }}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...styles.input,
                    ...(focusedField === "password" ? styles.inputFocus : {}),
                    ...(formErrors.password ? styles.inputError : {}),
                  }}
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ ...styles.icon, ...styles.rightIcon }}
                  role="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {formErrors.password && (
                <div style={styles.errorText}>{formErrors.password}</div>
              )}
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                ...(isButtonHovered ? styles.buttonHover : {}),
                ...(isSubmitting ? { opacity: 0.6, cursor: "not-allowed" } : {}),
              }}
              disabled={isSubmitting}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            <div style={styles.forgotPassword}>
              <span
                onClick={handleForgotPassword}
                style={{
                  ...styles.forgotPasswordLink,
                  ...(isForgotPasswordHovered ? styles.forgotPasswordLinkHover : {}),
                }}
                onMouseEnter={() => setIsForgotPasswordHovered(true)}
                onMouseLeave={() => setIsForgotPasswordHovered(false)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleForgotPassword();
                }}
              >
                Forgot Password?
              </span>
            </div>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </div>
    </>
  );
}

export default Login;