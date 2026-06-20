import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { useUserContext } from "../context/UserContext";
import { firestore } from "../firebase/Firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";

export const Homepage = ({ navigateTo }) => {
  const { currentUser } = useUserContext();
  const [userName, setUserName] = useState("Runner");
  const [savedRuns, setSavedRuns] = useState([]);
  const [loadingRuns, setLoadingRuns] = useState(true);

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
        date:
          doc.data().createdAt?.toDate().toLocaleDateString() || "Recent Run",
      }));

      runsData.sort((a, b) => b.rawDate - a.rawDate);

      setSavedRuns(runsData);
      setLoadingRuns(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

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

      <div style={styles.mainGrid}>
        <div style={styles.cardsGrid}>
          {loadingRuns ? (
            <div style={styles.statusMessage}>
              Loading your history ledger...
            </div>
          ) : savedRuns.length === 0 ? (
            <div style={styles.statusMessage}>
              No saved workouts found. Go track some laps!
            </div>
          ) : (
            savedRuns.map((run, index) => (
              <div key={run.id} style={styles.runCard}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>
                    Run #{savedRuns.length - index}
                  </h3>
                  <span style={styles.cardDate}>{run.date}</span>
                </div>
                <div style={styles.dividerLine} />
                <ul style={styles.lapList}>
                  {run.laps.map((lap, i) => (
                    <li key={i} style={styles.lapRow}>
                      <span style={styles.lapNumber}>Lap {lap.lapNumber}</span>
                      <span style={styles.lapTime}>
                        {formatTime(lap.timeMs)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        <div style={styles.sidebar}>
          <button
            onClick={() => navigateTo("/stopwatch")}
            style={styles.actionBtn}
          >
            Go to Stopwatch
          </button>
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
    margin: "0 0 30px 4px",
    fontWeight: "600",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 280px",
    gap: "40px",
    alignItems: "start",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  statusMessage: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "40px",
    color: "#64748b",
    fontSize: "16px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  runCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "12px",
    padding: "24px",
    boxSizing: "border-box",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
    color: "#0f172a",
  },
  cardDate: {
    fontSize: "13px",
    color: "#64748b",
  },
  dividerLine: {
    height: "1px",
    backgroundColor: "#e2e8f0",
    marginBottom: "16px",
  },
  lapList: {
    listStyleType: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  lapRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "15px",
  },
  lapNumber: {
    color: "#64748b",
    fontWeight: "500",
  },
  lapTime: {
    fontFamily: "monospace",
    fontWeight: "600",
    color: "#0f172a",
    fontSize: "16px",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
  },
  actionBtn: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "16px 24px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "center",
    boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.15)",
  },
};
