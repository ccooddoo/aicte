import React, { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token")); // ✅ Track authentication status

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        setIsAuthenticated(true); // ✅ Trigger re-render
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  }, []);

  const login = (token) => {
    try {
      const decodedUser = jwtDecode(token);
      localStorage.setItem("token", token);
      setUser(decodedUser);
      setIsAuthenticated(true); // ✅ Immediately update state
    } catch (error) {
      console.error("Invalid login token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false); // ✅ Trigger re-render
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setIsAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;