import React from "react";

export const DataTable = ({ laps = [] }) => {
  // Helper to safely format single millisecond values into standard clock text
  const formatTime = (totalMs) => {
    if (totalMs === undefined) return ""; // Keeps boxes blank if lap wasn't clicked yet
    const min = String(Math.floor((totalMs % 3600000) / 60000)).padStart(
      2,
      "0",
    );
    const sec = String(Math.floor((totalMs % 60000) / 1000)).padStart(2, "0");
    const ms = String(Math.floor((totalMs % 1000) / 10)).padStart(2, "0");
    return `${min}:${sec}:${ms}`;
  };

  // Calculates the current lap time minus the previous lap time
  const calculateSplit = () => {
    if (laps.length === 0) return "";
    const lastLapTime = laps[laps.length - 1];
    const previousLapTime = laps.length > 1 ? laps[laps.length - 2] : 0;
    return formatTime(lastLapTime - previousLapTime);
  };

  return (
    <div style={styles.tableSection}>
      <h3 style={styles.tableTitle}>Data Table</h3>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Lap 1</th>
              <th style={styles.th}>Lap 2</th>
              <th style={styles.th}>Lap 3</th>
              <th style={styles.th}>Lap 4</th>
              <th style={styles.th}>Lap 5</th>
              <th style={styles.th}>Split</th>
            </tr>
          </thead>
          <tbody>
            {laps.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.emptyCell}>
                  No runners added yet
                </td>
              </tr>
            ) : (
              // Renders row data step-by-step as laps accumulate (Runner name cell deleted)
              <tr style={styles.tbodyRow}>
                <td style={styles.td}>{formatTime(laps[0])}</td>
                <td style={styles.td}>{formatTime(laps[1])}</td>
                <td style={styles.td}>{formatTime(laps[2])}</td>
                <td style={styles.td}>{formatTime(laps[3])}</td>
                <td style={styles.td}>{formatTime(laps[4])}</td>
                <td
                  style={{ ...styles.td, fontWeight: "600", color: "#2563eb" }}
                >
                  {calculateSplit()}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  tableSection: { width: "100%", fontFamily: "sans-serif" },
  tableTitle: {
    margin: "0 0 12px 4px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#111",
    textAlign: "left",
  },
  tableWrapper: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  theadRow: { background: "#f8f9fa", borderBottom: "1px solid #e2e8f0" },
  th: {
    padding: "16px 20px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#000000",
    borderRight: "1px solid #e2e8f0",
  },
  tbodyRow: { borderBottom: "1px solid #e2e8f0" },
  td: {
    padding: "18px 20px",
    fontSize: "14px",
    color: "#334155",
    borderRight: "1px solid #e2e8f0",
  },
  emptyCell: {
    padding: "40px 0",
    textAlign: "center",
    fontSize: "14px",
    color: "#94a3b8",
    background: "#ffffff",
  },
};
