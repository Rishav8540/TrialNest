import React, { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { requestsDB, productsDB } from "../../db";
import { useAuth } from "../../contexts/AuthContext";

export default function SellerLayout() {
  const { currentUser } = useAuth();
  const [pending,   setPending]  = useState(0);
  const [prodCount, setProdCount]= useState(0);

  useEffect(()=>{
    setPending(requestsDB.getBySeller(currentUser.uid).filter(r=>r.status==="pending").length);
    setProdCount(productsDB.getBySeller(currentUser.uid).length);
  },[]);

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="sidebar-logo">TrialNest</div>
        <div className="sidebar-role">Seller Portal</div>
        <nav><ul className="sidebar-nav">
          <NavLink to="/seller/dashboard"        className={({isActive})=>`sidebar-item ${isActive?"active":""}`}><span className="s-icon">📊</span> Dashboard</NavLink>
          <NavLink to="/seller/products"    end  className={({isActive})=>`sidebar-item ${isActive?"active":""}`}><span className="s-icon">📦</span> My Products</NavLink>
          <NavLink to="/seller/products/new"     className={({isActive})=>`sidebar-item ${isActive?"active":""}`}><span className="s-icon">➕</span> Add Product</NavLink>
          <NavLink to="/seller/requests"         className={({isActive})=>`sidebar-item ${isActive?"active":""}`}><span className="s-icon">📋</span> Trial Requests {pending>0&&<span className="sidebar-badge">{pending}</span>}</NavLink>
          <NavLink to="/seller/orders"           className={({isActive})=>`sidebar-item ${isActive?"active":""}`}><span className="s-icon">🛒</span> Orders</NavLink>
          <NavLink to="/seller/payment-settings" className={({isActive})=>`sidebar-item ${isActive?"active":""}`}><span className="s-icon">💳</span> Payment Setup</NavLink>
        </ul></nav>
        <div className="sidebar-stats">
          <div className="stat-block"><div className="stat-block-num">{prodCount}</div><div className="stat-block-label">Products Listed</div></div>
          <div className="stat-block"><div className="stat-block-num">{pending}</div><div className="stat-block-label">Pending Requests</div></div>
        </div>
      </aside>
      <main className="dash-main"><Outlet/></main>
    </div>
  );
}
