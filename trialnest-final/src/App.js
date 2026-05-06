import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/shared/Navbar";
import { RequireSeller, RequireBuyer, RedirectIfAuth } from "./components/shared/ProtectedRoute";

import Landing              from "./pages/Landing";
import Login                from "./pages/Login";
import Register             from "./pages/Register";
import Shop                 from "./pages/Shop";
import MyTrials             from "./pages/MyTrials";
import Cart                 from "./pages/buyer/Cart";
import Checkout             from "./pages/buyer/Checkout";
import MyOrders             from "./pages/buyer/MyOrders";
import SellerLayout         from "./pages/seller/SellerLayout";
import SellerDashboard      from "./pages/seller/SellerDashboard";
import SellerProducts       from "./pages/seller/SellerProducts";
import ProductForm          from "./pages/seller/ProductForm";
import SellerRequests       from "./pages/seller/SellerRequests";
import SellerOrders         from "./pages/seller/SellerOrders";
import SellerPaymentSettings from "./pages/seller/SellerPaymentSettings";

function AppRoutes() {
  const { currentUser, userProfile } = useAuth();
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={currentUser?<Navigate to={userProfile?.role==="seller"?"/seller/dashboard":"/shop"} replace/>:<Landing/>}/>
        <Route path="/shop" element={<Shop/>}/>
        <Route path="/login"    element={<RedirectIfAuth><Login/></RedirectIfAuth>}/>
        <Route path="/register" element={<RedirectIfAuth><Register/></RedirectIfAuth>}/>
        <Route path="/my-trials" element={<RequireBuyer><MyTrials/></RequireBuyer>}/>
        <Route path="/cart"      element={<RequireBuyer><Cart/></RequireBuyer>}/>
        <Route path="/checkout"  element={<RequireBuyer><Checkout/></RequireBuyer>}/>
        <Route path="/my-orders" element={<RequireBuyer><MyOrders/></RequireBuyer>}/>
        <Route path="/seller" element={<RequireSeller><SellerLayout/></RequireSeller>}>
          <Route index element={<Navigate to="dashboard" replace/>}/>
          <Route path="dashboard"         element={<SellerDashboard/>}/>
          <Route path="products"          element={<SellerProducts/>}/>
          <Route path="products/new"      element={<ProductForm/>}/>
          <Route path="products/edit/:id" element={<ProductForm/>}/>
          <Route path="requests"          element={<SellerRequests/>}/>
          <Route path="orders"            element={<SellerOrders/>}/>
          <Route path="payment-settings"  element={<SellerPaymentSettings/>}/>
        </Route>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes/>
        <Toaster position="bottom-right" toastOptions={{ style:{fontFamily:"var(--sans)",fontSize:"0.85rem",borderRadius:8}, success:{iconTheme:{primary:"#2d6a4f",secondary:"#fff"}} }}/>
      </AuthProvider>
    </BrowserRouter>
  );
}
