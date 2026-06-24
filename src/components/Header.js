import React, { useState } from "react";
import { signOutFunction } from "../firebase/Firebase";

export const Header = ({ navigateTo }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOutFunction();
      navigateTo("/sign-in");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <header style={styles.header}>
      {/* Left Title */}
      <h1 onClick={() => navigateTo("/")} style={styles.brandText}>
        Stopwatch
      </h1>

      {/* Center Navigation - Stopwatch Button Deleted */}
      <nav style={styles.navLinks}>
        <button onClick={() => navigateTo("/")} style={styles.navBtn}>
          Home
        </button>
      </nav>

      {/* Right Profile Dropdown Area */}
      <div style={styles.profileArea}>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          style={styles.avatarButton}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#64748b">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
        </div>

        {showDropdown && (
          <div style={styles.dropdown}>
            <button onClick={handleSignOut} style={styles.dropdownBtn}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "12px",
    padding: "14px 30px",
    marginBottom: "40px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    boxSizing: "border-box",
  },
  brandText: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
    fontFamily: "sans-serif",
    cursor: "pointer",
  },
  navLinks: { display: "flex", gap: "24px" },
  navBtn: {
    background: "none",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    color: "#475569",
    cursor: "pointer",
    fontFamily: "sans-serif",
  },
  profileArea: { position: "relative" },
  avatarButton: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    backgroundColor: "#f1f5f9",
    border: "1px solid #ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "52px",
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "4px",
    zIndex: 100,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    width: "130px",
  },
  dropdownBtn: {
    width: "100%",
    padding: "10px",
    backgroundColor: "transparent",
    color: "#ef4444",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "center",
    fontFamily: "sans-serif",
  },
};
