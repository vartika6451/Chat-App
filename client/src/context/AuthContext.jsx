"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user credentials are saved in localStorage
    const savedUser = localStorage.getItem("blink_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser = {
      id: "usr-1",
      name: "Vartika Sharma",
      username: "vartikasharma",
      email: email,
      bio: "Creating beautiful pixels and code.",
      avatar: "",
      stats: {
        friends: 42,
        cardsCreated: 12,
        messages: 1337,
      },
    };

    setUser(mockUser);
    localStorage.setItem("blink_user", JSON.stringify(mockUser));
    setLoading(false);
    return mockUser;
  };

  const signup = async (name, username, email, password) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser = {
      id: "usr-" + Math.floor(Math.random() * 1000),
      name,
      username,
      email,
      bio: "Hey there! I am using Blink.",
      avatar: "",
      stats: {
        friends: 0,
        cardsCreated: 0,
        messages: 0,
      },
    };

    setUser(mockUser);
    localStorage.setItem("blink_user", JSON.stringify(mockUser));
    setLoading(false);
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("blink_user");
  };

  const updateUserProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("blink_user", JSON.stringify(updatedUser));
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
