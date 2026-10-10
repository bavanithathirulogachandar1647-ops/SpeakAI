import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!API_URL) {
            setError("Backend URL is missing. Please check Vercel settings.");
            return;
        }

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setError(
                    data.message ||
                    data.error ||
                    "Login failed. Please check your email and password."
                );
                return;
            }

            const token = data.access_token || data.token;

            if (token) {
                localStorage.setItem("access_token", token);
            }

            if (data.user_id != null) {
                localStorage.setItem("user_id", String(data.user_id));
            }

            if (data.user_name) {
                localStorage.setItem("user_name", data.user_name);
            }

            if (data.user_email || data.email) {
                localStorage.setItem(
                    "user_email",
                    data.user_email || data.email
                );
            } else {
                localStorage.setItem("user_email", email.trim());
            }

            navigate("/dashboard");
        } catch (err) {
            console.error("Login error:", err);
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
                <h1 style={styles.title}>Welcome Back</h1>
                <p style={styles.subtitle}>
                    Sign in to continue learning with SpeakAI.
                </p>

                <form onSubmit={handleLogin}>
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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        style={styles.input}
                    />

                    {error && (
                        <p role="alert" style={styles.error}>
                            {error}
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
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <p style={styles.footer}>
                    New to SpeakAI?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        style={styles.link}
                    >
                        Create an account
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
        maxWidth: "420px",
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
        marginBottom: "20px",
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