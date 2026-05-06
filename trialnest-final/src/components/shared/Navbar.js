// src/components/shared/Navbar.js
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { notifsDB, cartDB } from "../../db";
import toast from "react-hot-toast";

export default function Navbar() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs,    setNotifs]    = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const menuRef  = useRef();
  const notifRef = useRef();

  const isSeller = userProfile?.role==="seller";
  const isActive = path => location.pathname.startsWith(path);

  function refreshData() {
    if (!currentUser) return;
    setNotifs(notifsDB.getForUser(currentUser.uid));
    if (!isSeller) setCartCount(cartDB.getCount(currentUser.uid));
  }

  useEffect(() => { refreshData(); }, [currentUser, location]);

  const unread = notifs.filter(n=>!n.read).length;

  function markRead(id)  { notifsDB.markRead(id); refreshData(); }
  function clearAll()    { notifsDB.markAllRead(currentUser.uid); refreshData(); }

  useEffect(() => {
    function h(e) {
      if (menuRef.current  && !menuRef.current.contains(e.target))  setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", h);
    return ()=>document.removeEventListener("mousedown", h);
  }, []);

  function handleLogout() { logout(); toast.success("Signed out!"); navigate("/login"); }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-brand">Trial<span>Nest</span></Link>

        <div className="nav-links hide-sm">
          {currentUser && isSeller && <>
            <Link to="/seller/dashboard" className={`nav-link ${isActive("/seller/dashboard")?"active":""}`}>Dashboard</Link>
            <Link to="/seller/products"  className={`nav-link ${isActive("/seller/products") ?"active":""}`}>Products</Link>
            <Link to="/seller/requests"  className={`nav-link ${isActive("/seller/requests") ?"active":""}`}>Requests</Link>
          </>}
          {currentUser && !isSeller && <>
            <Link to="/shop"      className={`nav-link ${isActive("/shop")     ?"active":""}`}>Shop</Link>
            <Link to="/my-trials" className={`nav-link ${isActive("/my-trials")?"active":""}`}>My Trials</Link>
            <Link to="/my-orders" className={`nav-link ${isActive("/my-orders")?"active":""}`}>Orders</Link>
          </>}
          {!currentUser && <Link to="/shop" className={`nav-link ${isActive("/shop")?"active":""}`}>Shop</Link>}
        </div>

        <div className="nav-right">
          {currentUser ? <>
            {/* Cart (buyer only) */}
            {!isSeller && (
              <Link to="/cart" style={{position:"relative",textDecoration:"none"}}>
                <button className="notif-btn">
                  🛒
                  {cartCount>0 && <div className="notif-dot" style={{background:"var(--green)"}}>{cartCount}</div>}
                </button>
              </Link>
            )}

            {/* Notifications */}
            <div className="dropdown" ref={notifRef}>
              <button className="notif-btn" onClick={()=>setNotifOpen(o=>!o)}>
                🔔
                {unread>0 && <div className="notif-dot">{unread}</div>}
              </button>
              {notifOpen && (
                <div className="notif-panel">
                  <div className="notif-panel-hdr">
                    Notifications
                    {unread>0 && <button onClick={clearAll} style={{fontSize:"0.7rem",border:"none",background:"none",color:"#aaa",cursor:"pointer"}}>Mark all read</button>}
                  </div>
                  {notifs.length===0
                    ? <div style={{padding:"2rem",textAlign:"center",fontSize:"0.8rem",color:"#bbb"}}>No notifications yet</div>
                    : notifs.slice(0,15).map(n=>(
                      <div key={n.id} className={`notif-item ${n.read?"":"unread"}`} onClick={()=>markRead(n.id)}>
                        <div style={{display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                          {!n.read && <div className="notif-unread-dot" style={{marginTop:3,flexShrink:0}}/>}
                          <div>
                            <div className="notif-item-title">{n.title}</div>
                            <div className="notif-item-sub">{n.body}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="dropdown" ref={menuRef}>
              <button className="avatar-btn" onClick={()=>setMenuOpen(o=>!o)}>
                <div className="avatar-circle">{(userProfile?.name||"U")[0].toUpperCase()}</div>
                <span className="avatar-name hide-sm">{userProfile?.name?.split(" ")[0]}</span>
                <span className={`badge badge-${userProfile?.role}`}>{userProfile?.role}</span>
              </button>
              {menuOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header-info">
                    <div className="dropdown-name">{userProfile?.name}</div>
                    <div className="dropdown-email">{currentUser.email}</div>
                  </div>
                  <div className="dropdown-sep"/>
                  {isSeller ? <>
                    <Link to="/seller/dashboard" className="dropdown-item" onClick={()=>setMenuOpen(false)}>📊 Dashboard</Link>
                    <Link to="/seller/products"  className="dropdown-item" onClick={()=>setMenuOpen(false)}>📦 My Products</Link>
                    <Link to="/seller/requests"  className="dropdown-item" onClick={()=>setMenuOpen(false)}>📋 Trial Requests</Link>
                  </> : <>
                    <Link to="/shop"      className="dropdown-item" onClick={()=>setMenuOpen(false)}>🛍️ Shop</Link>
                    <Link to="/cart"      className="dropdown-item" onClick={()=>setMenuOpen(false)}>🛒 Cart {cartCount>0&&`(${cartCount})`}</Link>
                    <Link to="/my-trials" className="dropdown-item" onClick={()=>setMenuOpen(false)}>📦 My Trials</Link>
                    <Link to="/my-orders" className="dropdown-item" onClick={()=>setMenuOpen(false)}>📋 My Orders</Link>
                  </>}
                  <div className="dropdown-sep"/>
                  <button className="dropdown-item text-red" onClick={handleLogout}>🚪 Sign Out</button>
                </div>
              )}
            </div>
          </> : (
            <div style={{display:"flex",gap:"0.6rem"}}>
              <Link to="/login"    className="btn btn-outline btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
