import React, { useState } from "react";
import { signUpFunction, firestore } from "../firebase/Firebase";
import { doc, setDoc } from "firebase/firestore";

export const SignUpPage = ({ navigateTo }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("All fields are required!");
      return;
    }

    try {
      const userCredential = await signUpFunction(email, password);
      const user = userCredential.user;

      await setDoc(doc(firestore, "users", user.uid), {
        displayName: name,
        email: email,
        createdAt: new Date(),
      });

      setName("");
      setEmail("");
      setPassword("");
      navigateTo("/");
    } catch (error) {
      console.error("Firebase Sign Up Error:", error);
      alert(error.message || "Failed to create account.");
    }
  };

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>Sign Up</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Your Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </div>

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
          Sign Up
        </button>
      </form>

      <div style={styles.footerLinks}>
        <span style={styles.text}>Already have an account?</span>
        <button onClick={() => navigateTo("/sign-in")} style={styles.link}>
          Sign In
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
    gap: "8px",
    fontSize: "16px",
  },
  text: { color: "#495057" },
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
};
