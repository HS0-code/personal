import React, { useState, useEffect, useRef } from "react";
import { Header } from "../components/Header";
import { DataTable } from "../components/DataTable";
import { SaveButton } from "../components/SaveButton";
import { HomePageTable } from "../components/HomePageTable";
import { useUserContext } from "../context/UserContext";
import { firestore } from "../firebase/Firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

export const Homepage = ({ navigateTo }) => {
  const { currentUser } = useUserContext();
  const [userName, setUserName] = useState("Runner");
  const [savedRuns, setSavedRuns] = useState([]);
  const [loadingRuns, setLoadingRuns] = useState(true);

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;
    const fetchUserName = async () => {
      try {
        const docRef = doc(firestore, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().displayName);
        }
      } catch (error) {
        console.error("Error pulling profile name:", error);
      }
    };
    fetchUserName();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(firestore, "runs"),
      where("userId", "==", currentUser.uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const runsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        laps: doc.data().laps || [],
        rawDate: doc.data().createdAt?.toDate() || new Date(0),
      }));
      runsData.sort((a, b) => b.rawDate - a.rawDate);
      setSavedRuns(runsData);
      setLoadingRuns(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

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
    if (!currentUser) return;

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

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsRunning(false);
      setLaps([]);
      setTime(0);
    } catch (error) {
      console.error("Firebase Run Saving Error:", error);
      alert("Failed to upload run to the cloud database.");
    }
  };

  const handleDeleteRun = async (documentId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this recorded run row?",
    );
    if (!confirmation) return;
    try {
      await deleteDoc(doc(firestore, "runs", documentId));
    } catch (error) {
      console.error("Firestore Delete Operation Error:", error);
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

      <h2 style={styles.welcomeText}>Welcome back, {userName}! </h2>

      <div style={styles.workspaceWrapper}>
        <div style={styles.stopwatchCard}>
          <h2 style={styles.cardTitle}>Stopwatch</h2>
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

        <div style={styles.activeTableContainer}>
          <DataTable laps={laps} />
          <SaveButton laps={laps} onSave={handleSaveProgress} />
        </div>

        <div style={styles.historyTableContainer}>
          <h3 style={styles.ledgerTitle}>Saved Runs Ledger</h3>
          {loadingRuns ? (
            <div style={styles.loadingBox}>Loading your history ledger...</div>
          ) : (
            <HomePageTable savedRuns={savedRuns} onDelete={handleDeleteRun} />
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 20px",
    boxSizing: "border-box",
    fontFamily: "sans-serif",
  },
  welcomeText: {
    fontSize: "28px",
    color: "#0f172a",
    margin: "0 0 35px 4px",
    fontWeight: "600",
  },
  workspaceWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: "45px",
  },

  stopwatchCard: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    width: "360px",
    textAlign: "center",
    boxSizing: "border-box",
  },
  cardTitle: { margin: "0 0 16px 0", color: "#333", fontSize: "20px" },
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

  activeTableContainer: {
    width: "100%",
    maxWidth: "800px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },

  historyTableContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  ledgerTitle: {
    margin: "0 0 14px 4px",
    fontSize: "18px",
    color: "#475569",
    fontWeight: "600",
  },
  loadingBox: {
    textAlign: "center",
    padding: "40px",
    color: "#64748b",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #ccc",
  },
};
