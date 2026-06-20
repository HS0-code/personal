import React, { useState } from "react";
import { signInFunction } from "../firebase/Firebase";

export const SignInPage = ({ navigateTo }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Both fields are required!");
      return;
    }

    try {
      await signInFunction(email, password);
      setEmail("");
      setPassword("");
      navigateTo("/");
    } catch (error) {
      console.error("Firebase Sign In Error:", error);
      alert(error.message || "Invalid login details.");
    }
  };

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>Sign In</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6c757d"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

        <button type="submit" style={styles.submitBtn}>
          Sign In
        </button>
      </form>

      <div style={styles.footerLinks}>
        <button style={styles.link}>Forgot password?</button>
        <span style={styles.divider}>|</span>
        <button onClick={() => navigateTo("/sign-up")} style={styles.link}>
          Create an account
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    fontFamily: "sans-serif",
    background: "#ffffff",
    padding: "50px 45px",
    borderRadius: "24px",
    border: "1px solid #ccc",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
    width: "680px",
    textAlign: "center",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "64px",
    color: "#000",
    margin: "0 0 45px 0",
    fontWeight: "500",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    alignItems: "center",
    width: "100%",
  },
  inputWrapper: { position: "relative", width: "100%" },
  input: {
    width: "100%",
    padding: "24px 28px",
    fontSize: "18px",
    border: "1px solid #ccc",
    borderRadius: "20px",
    outline: "none",
    boxSizing: "border-box",
  },
  eyeButton: {
    position: "absolute",
    right: "24px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  submitBtn: {
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    padding: "20px 0",
    width: "280px",
    fontSize: "20px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "20px",
  },
  footerLinks: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    fontSize: "16px",
  },
  link: {
    color: "#2563eb",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    textDecoration: "none",
    fontSize: "16px",
    fontFamily: "sans-serif",
    fontWeight: "600",
  },
  divider: { color: "#94a3b8" },
};
