import React, { useState, useRef } from "react";

export const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const timerRef = useRef(null);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      const startTime = Date.now() - time;
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    }
  };

  const handleStop = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    }
  };

  const handleLap = () => {
    if (isRunning) setLaps([...laps, time]);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const formatTime = (totalMs) => {
    const min = String(Math.floor((totalMs % 3600000) / 60000)).padStart(
      2,
      "0",
    );
    const sec = String(Math.floor((totalMs % 60000) / 1000)).padStart(2, "0");
    const ms = String(Math.floor((totalMs % 1000) / 10)).padStart(2, "0");
    return `${min}:${sec}:${ms}`;
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Stopwatch</h2>
      <div style={styles.timerDisplay}>{formatTime(time)}</div>

      <div style={styles.btnRow}>
        <button style={styles.btn} onClick={handleStart}>
          Start
        </button>
        <button style={styles.btn} onClick={handleStop}>
          Stop
        </button>

        <button
          style={{
            ...styles.btn,
            ...(isRunning ? styles.activeLapBtn : styles.disabledLapBtn),
          }}
          onClick={handleLap}
          disabled={!isRunning}
        >
          Lap
        </button>

        <button style={styles.btn} onClick={handleReset}>
          Reset
        </button>
      </div>

      {laps.length > 0 && (
        <div style={styles.lapBox}>
          {laps.map((lapTime, i) => (
            <div key={i} style={styles.lapItem}>
              <span>Lap {i + 1}</span>
              <span>{formatTime(lapTime)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    fontFamily: "sans-serif",
    background: "#fff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "320px",
    textAlign: "center",
  },
  title: { margin: "0 0 16px 0", color: "#333" },
  timerDisplay: { fontSize: "40px", fontWeight: "bold", margin: "20px 0" },
  btnRow: { display: "flex", gap: "8px" },
  btn: {
    flex: 1,
    padding: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    background: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
  activeLapBtn: {
    background: "#fff",
    color: "#000",
    borderColor: "#ccc",
    cursor: "pointer",
  },
  disabledLapBtn: {
    background: "#f0f0f0",
    color: "#aaa",
    borderColor: "#e0e0e0",
    cursor: "not-allowed",
  },
  lapBox: {
    marginTop: "20px",
    borderTop: "1px solid #eee",
    paddingTop: "10px",
  },
  lapItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    color: "#555",
  },
};
