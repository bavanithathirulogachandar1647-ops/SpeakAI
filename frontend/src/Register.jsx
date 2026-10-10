import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!API_URL) {
      setError("Backend URL is missing. Please check Vercel settings.");
      return;
    }

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          data.message ||
          data.error ||
          "Registration failed. Please try again."
        );
        return;
      }

      setSuccess("Account created successfully! You can now log in.");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      window.setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        "Cannot connect to the server. Please check the backend and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>
          Join SpeakAI and start your language-learning journey.
        </p>

        <form onSubmit={handleRegister}>
          <label htmlFor="name" style={styles.label}>
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            style={styles.input}
          />

          <label htmlFor="email" style={styles.label}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            style={styles.input}
          />

          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
            style={styles.input}
          />

          <label htmlFor="confirmPassword" style={styles.label}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
            style={styles.input}
          />

          {error && (
            <p role="alert" style={styles.error}>
              {error}
            </p>
          )}

          {success && (
            <p role="status" style={styles.success}>
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={styles.link}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    background: "linear-gradient(135deg, #e0e7ff, #f5f3ff, #eff6ff)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    padding: "36px",
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 12px 40px rgba(30, 41, 59, 0.12)",
    boxSizing: "border-box",
  },
  title: {
    margin: "0 0 10px",
    color: "#312e81",
    fontSize: "30px",
    textAlign: "center",
  },
  subtitle: {
    margin: "0 0 28px",
    color: "#64748b",
    textAlign: "center",
    lineHeight: 1.5,
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#334155",
    fontSize: "14px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "13px",
    marginBottom: "18px",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    fontSize: "15px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "9px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    padding: "10px",
    background: "#fef2f2",
    color: "#b91c1c",
    borderRadius: "8px",
    fontSize: "14px",
    lineHeight: 1.5,
  },
  success: {
    padding: "10px",
    background: "#f0fdf4",
    color: "#166534",
    borderRadius: "8px",
    fontSize: "14px",
    lineHeight: 1.5,
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
  },
  link: {
    border: "none",
    background: "none",
    color: "#4f46e5",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },
};