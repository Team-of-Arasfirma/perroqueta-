"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  clearAuth,
  getAuth,
  getCurrentAdmin,
  loginAdmin,
  saveAuth,
} from "@/services/adminAuthService";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const stored = getAuth();

    if (!stored.token) {
      setStatus("ready");
      return;
    }

    getCurrentAdmin(stored.token)
      .then((data) => {
        setToken(stored.token);
        setUser(data.user);
        setStatus("ready");
      })
      .catch(() => {
        clearAuth();
        setStatus("ready");
      });
  }, []);

  const signIn = async (credentials, remember) => {
    const data = await loginAdmin(credentials);
    saveAuth(data, remember);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const signOut = () => {
    clearAuth();
    setToken("");
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ user, token, status, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
