import React, { createContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null); 
  const [tokens, setTokens] = useState(() => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    return access && refresh ? { access, refresh } : null;
  });

  const login = async (username, password) => {
    try {
      const response = await axios.post("/api/token", {
        username,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      setTokens({ access, refresh });

      // Try to fetch user info (check teacher, student, else admin)
      const role = await detectUserRole(access);
      const user = { username, role };
      setUser(user);
      navigate("/dashboard");
    } catch (err) {
      throw err.response?.data || { detail: "Login failed." };
    }
  };

  const detectUserRole = async (token) => {
    try {
      const res = await axios.get("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.role;
      
    } catch (_) {
      console.log("Error to load role")
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setTokens(null);
    setUser(null);
    navigate("/login");
    window.location.href = "/login";
  };

  // On first load, try restoring user
  useEffect(() => {
    const init = async () => {
      if (tokens?.access && !user) {
        try {
          const role = await detectUserRole(tokens.access);
          setUser({ username: "unknown", role });
        } catch (_) {
          logout();
        }
      }
    };
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, tokens, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
