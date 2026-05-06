// src/components/shared/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function RequireSeller({ children }) {
  const { currentUser, userProfile } = useAuth();
  const location = useLocation();
  if (!currentUser)                   return <Navigate to="/login" state={{from:location}} replace/>;
  if (userProfile?.role!=="seller")   return <Navigate to="/shop" replace/>;
  return children;
}

export function RequireBuyer({ children }) {
  const { currentUser, userProfile } = useAuth();
  const location = useLocation();
  if (!currentUser)                   return <Navigate to="/login" state={{from:location}} replace/>;
  if (userProfile?.role!=="buyer")    return <Navigate to="/seller/dashboard" replace/>;
  return children;
}

export function RedirectIfAuth({ children }) {
  const { currentUser, userProfile } = useAuth();
  if (currentUser)
    return <Navigate to={userProfile?.role==="seller"?"/seller/dashboard":"/shop"} replace/>;
  return children;
}
