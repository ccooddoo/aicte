// src/contexts/AuthProvider.js
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ Import JWT decoder

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        setIsAuthenticated(true);  // ✅ Ensure re-render
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  }, [isAuthenticated]);  // ✅ Depend on `isAuthenticated` for updates

  const login = (token) => {
    try {
      localStorage.setItem("token", token);
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
      setIsAuthenticated(true);  // ✅ Immediately update state
    } catch (error) {
      console.error("Invalid login token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);  // ✅ Ensure UI updates instantly
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
