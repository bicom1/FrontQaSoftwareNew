// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaInfoCircle, FaCheck } from "react-icons/fa";

function Login({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [focusedField, setFocusedField] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isForgotPasswordHovered, setIsForgotPasswordHovered] = useState(false);
  const [isSignupHovered, setIsSignupHovered] = useState(false);

  // Check for saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email address is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock credentials check
        if (formData.email === "admin@example.com" && formData.password === "admin123") {
          // Save email if remember me is checked
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", formData.email);
          } else {
            localStorage.removeItem("rememberedEmail");
          }
          
          toast.success("Login successful! Redirecting...");
          setTimeout(() => {
            setIsLoggedIn(true);
          }, 1500);
        } else {
          toast.error("Invalid email or password");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleForgotPassword = () => {
    toast.info("Password reset link sent to your email address");
  };

  // Custom style objects
  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    card: {
      width: "100%",
      maxWidth: "440px",
      borderRadius: "16px",
      boxShadow: "0 12px 28px rgba(0, 0, 0, 0.2)",
      background: "#ffffff",
      padding: "40px",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
    },
    cardBefore: {
      content: "''",
      position: "absolute",
      top: "0",
      left: "0",
      width: "6px",
      height: "100%",
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
      width: "60px",
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
      border: "1px solid #e0e0e0",
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
    buttonBefore: {
      content: "''",
      position: "absolute",
      top: "0",
      left: "-100%",
      width: "100%",
      height: "100%",
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
      transition: "all 0.6s ease",
    },
    buttonBeforeHover: {
      left: "100%",
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
    checkboxGroup: {
      display: "flex",
      alignItems: "center",
      marginBottom: "25px",
    },
    checkbox: {
      appearance: "none",
      width: "20px",
      height: "20px",
      border: "2px solid #d1d1d1",
      borderRadius: "5px",
      marginRight: "10px",
      position: "relative",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    checkboxChecked: {
      border: "2px solid #2575fc",
      backgroundColor: "#2575fc",
    },
    checkboxIcon: {
      position: "absolute",
      top: "2px",
      left: "2px",
      color: "#ffffff",
      fontSize: "14px",
    },
    checkboxLabel: {
      fontSize: "14px",
      color: "#555",
      fontWeight: "500",
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
    divider: {
      display: "flex",
      alignItems: "center",
      marginTop: "25px",
      marginBottom: "20px",
    },
    dividerLine: {
      flex: "1",
      height: "1px",
      backgroundColor: "#e0e0e0",
    },
    dividerText: {
      padding: "0 15px",
      color: "#777",
      fontSize: "14px",
    },
    signupText: {
      marginTop: "25px", 
      textAlign: "center", 
      fontSize: "15px", 
      color: "#555",
      fontWeight: "500",
    },
    signupLink: {
      color: "#2575fc", 
      cursor: "pointer",
      fontWeight: "600",
      marginLeft: "5px",
      transition: "all 0.3s ease",
    },
    signupLinkHover: {
      color: "#6a11cb",
      textDecoration: "underline",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardBefore}></div>
        <h2 style={styles.header}>
          Welcome Back
          <span style={styles.headerUnderline}></span>
        </h2>
        
        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <div 
              style={{
                ...styles.inputGroup,
                ...(focusedField === "email" ? styles.inputGroupFocus : {})
              }}
            >
              <FaEnvelope 
                style={{
                  ...styles.icon,
                  ...styles.leftIcon,
                  ...(focusedField === "email" ? styles.iconFocus : {})
                }} 
              />
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...styles.input,
                  ...(focusedField === "email" ? styles.inputFocus : {}),
                  ...(formErrors.email ? styles.inputError : {})
                }}
              />
            </div>
            {formErrors.email && (
              <div style={styles.errorText}>
                <FaEnvelope style={{ marginRight: "6px", fontSize: "12px" }} />
                {formErrors.email}
              </div>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div 
              style={{
                ...styles.inputGroup,
                ...(focusedField === "password" ? styles.inputGroupFocus : {})
              }}
            >
              <FaLock 
                style={{
                  ...styles.icon,
                  ...styles.leftIcon,
                  ...(focusedField === "password" ? styles.iconFocus : {})
                }} 
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...styles.input,
                  ...(focusedField === "password" ? styles.inputFocus : {}),
                  ...(formErrors.password ? styles.inputError : {})
                }}
              />
              <div 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  ...styles.icon,
                  ...styles.rightIcon,
                  ...(focusedField === "password" ? styles.iconFocus : {})
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            {formErrors.password && (
              <div style={styles.errorText}>
                <FaLock style={{ marginRight: "6px", fontSize: "12px" }} />
                {formErrors.password}
              </div>
            )}
          </div>
          
          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              style={{
                ...styles.checkbox,
                ...(rememberMe ? styles.checkboxChecked : {})
              }}
            />
            {rememberMe && (
              <div style={styles.checkboxIcon}>✓</div>
            )}
            <label htmlFor="rememberMe" style={styles.checkboxLabel}>
              Remember me
            </label>
          </div>
          
          <button 
            type="submit" 
            style={{
              ...styles.button,
              ...(isButtonHovered ? styles.buttonHover : {}),
              ...(isSubmitting ? { opacity: 0.7, cursor: "not-allowed" } : {})
            }}
            disabled={isSubmitting}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            <div 
              style={{
                ...styles.buttonBefore,
                ...(isButtonHovered ? styles.buttonBeforeHover : {})
              }}
            ></div>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          
          <div style={styles.forgotPassword}>
            <span 
              onClick={handleForgotPassword}
              style={{
                ...styles.forgotPasswordLink,
                ...(isForgotPasswordHovered ? styles.forgotPasswordLinkHover : {})
              }}
              onMouseEnter={() => setIsForgotPasswordHovered(true)}
              onMouseLeave={() => setIsForgotPasswordHovered(false)}
            >
              Forgot Password?
            </span>
          </div>
        </form>
        
        
      </div>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}

export default Login;
