"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api.js";

const AuthContext = createContext(null);

const extractErrorMessage = (error, defaultMsg) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.request) {
    return "Server is unreachable. Please make sure the backend server is running.";
  }
  return error.message || defaultMsg;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("blink_token");
      if (token) {
        try {
          console.log("🔐 [AUTH] Restoring session from local storage...");
          const res = await api.get("/auth/me");
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem("blink_user", JSON.stringify(res.data.user));
          } else {
            logout();
          }
        } catch (error) {
          console.error("❌ [AUTH] Failed to restore session:", error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        const { user, token } = res.data;
        setUser(user);
        localStorage.setItem("blink_token", token);
        localStorage.setItem("blink_user", JSON.stringify(user));
        setLoading(false);
        return user;
      }
    } catch (error) {
      setLoading(false);
      const errMsg = extractErrorMessage(error, "Failed to log in");
      throw new Error(errMsg);
    }
  };

  const signup = async (name, username, email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, username, email, password });
      if (res.data.success) {
        const { user, token } = res.data;
        setUser(user);
        localStorage.setItem("blink_token", token);
        localStorage.setItem("blink_user", JSON.stringify(user));
        setLoading(false);
        return user;
      }
    } catch (error) {
      setLoading(false);
      const errMsg = extractErrorMessage(error, "Failed to sign up");
      throw new Error(errMsg);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("blink_token");
    localStorage.removeItem("blink_user");
    localStorage.removeItem("blink_active_chat");
  };

  const updateUserProfile = async (updatedData) => {
    try {
      const res = await api.put("/users/profile", updatedData);
      if (res.data.success) {
        const updatedUser = res.data.user;
        setUser((prev) => ({ ...prev, ...updatedUser }));
        localStorage.setItem("blink_user", JSON.stringify({ ...user, ...updatedUser }));
        return updatedUser;
      }
    } catch (error) {
      console.error("❌ [AUTH] Profile update error:", error);
      const errMsg = extractErrorMessage(error, "Failed to update profile");
      throw new Error(errMsg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
