import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaLock, FaKey } from "react-icons/fa";
import {
  forgotPasswordApi,
  verifyOtpApi,
  resetPasswordApi,
  LoginApi,
} from "../features/userApis";
import { loginAndRedirect } from "../utils/authSession";

const STEPS = { EMAIL: 1, OTP: 2, PASSWORD: 3 };

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      toast.error("Email is required");
      return;
    }
    setEmail(normalized);
    setLoading(true);
    try {
      const res = await forgotPasswordApi(normalized);
      toast.success(res.data.message || "OTP sent to your email");
      setStep(STEPS.OTP);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("OTP is required");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOtpApi({ email: email.trim().toLowerCase(), otp: otp.trim() });
      toast.success(res.data.message || "OTP verified");
      setStep(STEPS.PASSWORD);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await resetPasswordApi({
        email: email.trim().toLowerCase(),
        newPassword,
      });
      toast.success(res.data.message || "Password updated");

      try {
        const loginRes = await LoginApi({
          email: email.trim().toLowerCase(),
          password: newPassword,
        });
        if (loginRes.data.success) {
          toast.success("Redirecting to your dashboard...");
          loginAndRedirect(loginRes.data.user, loginRes.data.token);
          return;
        }
      } catch (loginErr) {
        console.error("Auto-login after reset failed:", loginErr);
      }

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
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
    inputWrap: { position: "relative", marginBottom: "18px" },
    input: {
      width: "100%",
      padding: "14px 14px 14px 42px",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
      fontSize: "16px",
    },
    icon: { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#999" },
    button: {
      width: "100%",
      padding: "14px",
      border: "none",
      borderRadius: "8px",
      background: "linear-gradient(90deg, #2575fc, #6a11cb)",
      color: "#fff",
      fontWeight: 600,
      cursor: "pointer",
    },
    link: { display: "block", textAlign: "center", marginTop: "16px", color: "#2575fc", textDecoration: "none" },
    steps: { display: "flex", justifyContent: "center", gap: "8px", marginBottom: "20px" },
    stepDot: (active) => ({
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      background: active ? "#2575fc" : "#ddd",
    }),
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>
        <p style={styles.subtitle}>
          {step === STEPS.EMAIL && "Enter your email to receive an OTP"}
          {step === STEPS.OTP && "Enter the 6-digit OTP sent to your email"}
          {step === STEPS.PASSWORD && "Set your new password"}
        </p>

        <div style={styles.steps}>
          <span style={styles.stepDot(step >= STEPS.EMAIL)} />
          <span style={styles.stepDot(step >= STEPS.OTP)} />
          <span style={styles.stepDot(step >= STEPS.PASSWORD)} />
        </div>

        {step === STEPS.EMAIL && (
          <form onSubmit={handleSendOtp}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrap}>
              <FaEnvelope style={styles.icon} />
              <input
                type="email"
                style={styles.input}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === STEPS.OTP && (
          <form onSubmit={handleVerifyOtp}>
            <label style={styles.label}>OTP</label>
            <div style={styles.inputWrap}>
              <FaKey style={styles.icon} />
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                style={styles.input}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {step === STEPS.PASSWORD && (
          <form onSubmit={handleResetPassword}>
            <label style={styles.label}>New Password</label>
            <div style={styles.inputWrap}>
              <FaLock style={styles.icon} />
              <input
                type="password"
                style={styles.input}
                placeholder="Min 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.inputWrap}>
              <FaLock style={styles.icon} />
              <input
                type="password"
                style={styles.input}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        <Link to="/login" style={styles.link}>
          Back to Login
        </Link>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}

export default ForgotPassword;
