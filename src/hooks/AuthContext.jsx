// src/hooks/AuthContext.js

import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    role: null,
    isLoading: true,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded);

        const now = Date.now() / 1000;
        if (decoded.exp < now) throw new Error("Token expired");

        setAuth({
          isAuthenticated: true,
          user: decoded.email,
          role: decoded.role,
          isLoading: false,
        });
      } catch (err) {
        console.error("Invalid or expired token");
        localStorage.removeItem("token");
        setAuth({
          isAuthenticated: false,
          user: null,
          role: null,
          isLoading: false,
        });
      }
    } else {
      setAuth((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, []);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem("token", token);
      setAuth({
        isAuthenticated: true,
        user: decoded.email,
        role: decoded.role,
        isLoading: false,
      });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({
      isAuthenticated: false,
      user: null,
      role: null,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, login, logout, setIsLoggedIn, isLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
