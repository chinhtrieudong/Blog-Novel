"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserResponse } from "@/types/api";
import apiClient from "@/lib/api-client";

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: {
    email?: string;
    username: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const response = await apiClient.getProfile();
          setUser(response.data);
        }
      }
    } catch (error) {
      console.error("Failed to check auth status:", error);
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      await apiClient.login({ username, password });
      // After successful login, get the user profile
      const profileResponse = await apiClient.getProfile();
      setUser(profileResponse.data);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: {
    email?: string;
    username: string;
    password: string;
  }) => {
    try {
      const response = await apiClient.register(data);
      setUser(response.data);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if API call fails
      setUser(null);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const response = await apiClient.updateProfile(data);
      setUser(response.data);
    } catch (error) {
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
