import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/Firebase";

const UserContextInstance = createContext();

export const UserContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        setIsUserLoggedIn(true);
        setCurrentUser(userInfo);
      } else {
        setIsUserLoggedIn(false);
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContextInstance.Provider
      value={{ currentUser, isUserLoggedIn, loading }}
    >
      {children}
    </UserContextInstance.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContextInstance);
};
