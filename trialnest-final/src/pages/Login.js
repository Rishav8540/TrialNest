// src/pages/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({ email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = login(form.email, form.password);
      toast.success("Welcome back! 👋");
      navigate(user.role === "seller" ? "/seller/dashboard" : "/shop");
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ position:"relative", zIndex:1 }}>
          <div className="auth-logo">TrialNest</div>
          <h1 className="auth-heading">Welcome<br/>back.</h1>
          <p className="auth-sub" style={{ marginTop:"1.5rem" }}>
            Sign in to continue your try-before-you-buy experience.
          </p>
          <div style={{ marginTop:"2.5rem", padding:"1.5rem", background:"rgba(255,255,255,0.06)", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize:"0.7rem", fontFamily:"var(--mono)", color:"rgba(250,249,246,0.4)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"0.6rem" }}>
              Demo Accounts
            </div>
            <div style={{ fontSize:"0.8rem", color:"rgba(250,249,246,0.75)", lineHeight:2 }}>
              <strong style={{color:"var(--gold-light)"}}>Seller:</strong> seller@demo.com / demo123<br/>
              <strong style={{color:"var(--gold-light)"}}>Buyer:</strong> buyer@demo.com / demo123
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap fade-in">
          <div className="auth-form-title">Sign In</div>
          <div className="auth-form-sub">Enter your credentials to continue</div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-control" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" placeholder="Your password" value={form.password} onChange={set("password")} required />
            </div>
            <button className="btn btn-primary btn-full btn-lg" disabled={loading} style={{marginTop:"0.3rem"}}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>
          <div className="divider" style={{margin:"1.4rem 0"}}>new here?</div>
          <p style={{textAlign:"center",fontSize:"0.83rem",color:"#888"}}>
            Don't have an account?{" "}
            <Link to="/register" style={{color:"var(--ink)",fontWeight:700,textDecoration:"none"}}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
