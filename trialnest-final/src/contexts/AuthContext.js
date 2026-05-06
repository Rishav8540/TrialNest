import React, { createContext, useContext, useState, useEffect } from "react";
import { authDB, seedDemoData } from "../db";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { seedDemoData(); const s = authDB.getSession(); if(s) setCurrentUser(s); setLoading(false); }, []);
  function signup(email, password, name, role) { const u = authDB.signup(name,email,password,role); setCurrentUser(u); return u; }
  function login(email, password) { const u = authDB.login(email,password); setCurrentUser(u); return u; }
  function logout() { authDB.logout(); setCurrentUser(null); }
  function updateUser(data) { if(!currentUser) return; const u = authDB.updateUser(currentUser.uid, data); setCurrentUser(u); }
  return <AuthContext.Provider value={{currentUser,userProfile:currentUser,signup,login,logout,updateUser,loading}}>{!loading&&children}</AuthContext.Provider>;
}
