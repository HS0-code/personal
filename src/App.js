import React from "react";
import { Stopwatch } from "./components/Stopwatch";

export const App = () => {
  return (
    <div style={appStyles.container}>
      <Stopwatch />
    </div>
  );
};

const appStyles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
};

export default App;
