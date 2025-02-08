"use client";

import { AuthContextProps, User } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { clearUserData, getToken, setToken, setUserDetails } from "@/lib/utils";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    setToken(token);
    setUserDetails(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearUserData();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
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
