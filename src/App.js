import React, { useState, useEffect } from "react";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { Homepage } from "./pages/Homepage";
import { UserContextProvider, useUserContext } from "./context/UserContext";

const AppContent = ({ currentPath, navigateTo }) => {
  const { isUserLoggedIn, loading } = useUserContext();

  // Prevents layout flicker while verifying session validity
  if (loading) {
    return <div style={appStyles.container}>Loading Application...</div>;
  }

  // SECURITY GATE: If logged out, user ONLY sees Sign In or Sign Up forms
  if (!isUserLoggedIn) {
    if (currentPath === "/sign-up") {
      return (
        <div style={appStyles.container}>
          <SignUpPage navigateTo={navigateTo} />
        </div>
      );
    }
    return (
      <div style={appStyles.container}>
        <SignInPage navigateTo={navigateTo} />
      </div>
    );
  }

  // AUTHENTICATED ACCESS: All paths safely route to your main dashboard page
  return (
    <div style={appStyles.container}>
      <Homepage navigateTo={navigateTo} />
    </div>
  );
};

export const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const navigateTo = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  useEffect(() => {
    const handleState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handleState);
    return () => window.removeEventListener("popstate", handleState);
  }, []);

  return (
    <UserContextProvider>
      <AppContent currentPath={currentPath} navigateTo={navigateTo} />
    </UserContextProvider>
  );
};

const appStyles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    width: "100%",
    boxSizing: "border-box",
  },
};

export default App;
