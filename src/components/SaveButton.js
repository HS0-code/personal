import React from "react";

export const SaveButton = ({ laps = [], onSave }) => {
  if (laps.length !== 5) return null;

  return (
    <div style={styles.saveLaps}>
      <button style={styles.saveBtn} onClick={onSave}>
        Save Progress Logs
      </button>
    </div>
  );
};

const styles = {
  saveLaps: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    marginTop: "15px",
  },
  saveBtn: {
    background: "#0f172a",
    color: "#ffffff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "sans-serif",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
};
