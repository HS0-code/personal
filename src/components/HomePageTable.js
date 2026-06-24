import React from "react";

export const HomePageTable = ({ savedRuns = [], onDelete }) => {
  const formatTime = (totalMs) => {
    if (totalMs === undefined) return "";
    const min = String(Math.floor((totalMs % 3600000) / 60000)).padStart(
      2,
      "0",
    );
    const sec = String(Math.floor((totalMs % 60000) / 1000)).padStart(2, "0");
    const ms = String(Math.floor((totalMs % 1000) / 10)).padStart(2, "0");
    return `${min}:${sec}:${ms}`;
  };

  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.theadRow}>
            <th style={{ ...styles.th, width: "15%" }}></th>
            <th style={styles.th}>Lap 1</th>
            <th style={styles.th}>Lap 2</th>
            <th style={styles.th}>Lap 3</th>
            <th style={styles.th}>Lap 4</th>
            <th style={styles.th}>Lap 5</th>
            <th
              style={{
                ...styles.th,
                width: "15%",
                textAlign: "center",
                borderRight: "none",
              }}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {savedRuns.length === 0 ? (
            <tr>
              <td colSpan="7" style={styles.emptyCell}>
                No saved workouts found. Go track some laps!
              </td>
            </tr>
          ) : (
            savedRuns.map((run, index) => (
              <tr key={run.id} style={styles.tbodyRow}>
                {/* Row label calculated chronologically */}
                <td
                  style={{ ...styles.td, fontWeight: "600", color: "#0f172a" }}
                >
                  Run {savedRuns.length - index}
                </td>

                {/* Dynamically reads values straight out of your database array */}
                <td style={styles.td}>{formatTime(run.laps[0]?.timeMs)}</td>
                <td style={styles.td}>{formatTime(run.laps[1]?.timeMs)}</td>
                <td style={styles.td}>{formatTime(run.laps[2]?.timeMs)}</td>
                <td style={styles.td}>{formatTime(run.laps[3]?.timeMs)}</td>
                <td style={styles.td}>{formatTime(run.laps[4]?.timeMs)}</td>

                {/* Fully operational delete cell block */}
                <td
                  style={{
                    ...styles.td,
                    textAlign: "center",
                    borderRight: "none",
                  }}
                >
                  <button
                    onClick={() => onDelete(run.id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableWrapper: {
    width: "100%",
    background: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    fontFamily: "sans-serif",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  theadRow: {
    background: "#f8f9fa",
    borderBottom: "1px solid #ccc",
  },
  th: {
    padding: "16px 20px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#0f172a",
    borderRight: "1px solid #ccc",
  },
  tbodyRow: {
    borderBottom: "1px solid #ccc",
  },
  td: {
    padding: "16px 20px",
    fontSize: "14px",
    color: "#334155",
    borderRight: "1px solid #ccc",
    fontFamily: "monospace",
  },
  emptyCell: {
    padding: "40px 0",
    textAlign: "center",
    fontSize: "14px",
    color: "#64748b",
    background: "#ffffff",
    fontFamily: "sans-serif",
  },
  deleteBtn: {
    backgroundColor: "#ffffff",
    color: "#0f172a",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "8px 20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "sans-serif",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    transition: "all 0.2s",
  },
};
