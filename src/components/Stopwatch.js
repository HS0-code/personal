import React, { useState, useRef } from "react";
import { DataTable } from "./DataTable";
import { SaveButton } from "./SaveButton";
import { Header } from "./Header";
import { useUserContext } from "../context/UserContext";
import { firestore } from "../firebase/Firebase";
import { collection, addDoc } from "firebase/firestore";

export const Stopwatch = ({ navigateTo }) => {
  const { currentUser } = useUserContext();
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
    if (isRunning && laps.length < 5) {
      setLaps([...laps, time]);
    }
  };

  const handleReset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleSaveProgress = async () => {
    if (!currentUser) {
      alert("You must be logged in to save runs!");
      return;
    }

    try {
      const structuredLaps = laps.map((lapTime, index) => ({
        lapNumber: index + 1,
        timeMs: lapTime,
      }));

      await addDoc(collection(firestore, "runs"), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        laps: structuredLaps,
        createdAt: new Date(),
      });

      // Clear everything out on successful save
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsRunning(false);
      setLaps([]);
      setTime(0);
      alert("Run saved successfully! Check the Homepage ledger.");
    } catch (error) {
      console.error("Firebase Run Saving Error:", error);
      alert("Failed to upload run to the cloud database.");
    }
  };

  const formatTime = (totalMs) => {
    if (totalMs === undefined) return "00:00:00";
    const min = String(Math.floor((totalMs % 3600000) / 60000)).padStart(
      2,
      "0",
    );
    const sec = String(Math.floor((totalMs % 60000) / 1000)).padStart(2, "0");
    const ms = String(Math.floor((totalMs % 1000) / 10)).padStart(2, "0");
    return `${min}:${sec}:${ms}`;
  };

  return (
    <div style={styles.container}>
      <Header navigateTo={navigateTo} />

      <div style={styles.contentArea}>
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
                ...(isRunning && laps.length < 5
                  ? styles.activeLapBtn
                  : styles.disabledLapBtn),
              }}
              onClick={handleLap}
              disabled={!isRunning || laps.length >= 5}
            >
              Lap
            </button>
            <button style={styles.btn} onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        <div style={styles.tableWrapper}>
          <DataTable laps={laps} />
          <SaveButton laps={laps} onSave={handleSaveProgress} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 20px",
    boxSizing: "border-box",
  },
  contentArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: "30px",
  },
  card: {
    fontFamily: "sans-serif",
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    width: "360px",
    textAlign: "center",
    boxSizing: "border-box",
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
  activeLapBtn: { background: "#fff", color: "#000", borderColor: "#ccc" },
  disabledLapBtn: {
    background: "#f0f0f0",
    color: "#aaa",
    borderColor: "#e0e0e0",
    cursor: "not-allowed",
  },
  tableWrapper: {
    width: "100%",
    maxWidth: "800px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
};
