// src/pages/Register.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const { signup } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedRole)                  return toast.error("Please select your role.");
    if (!form.name.trim())              return toast.error("Enter your name.");
    if (form.password.length < 6)       return toast.error("Password must be 6+ characters.");
    if (form.password !== form.confirm) return toast.error("Passwords don't match.");
    setLoading(true);
    try {
      signup(form.email, form.password, form.name.trim(), selectedRole);
      toast.success("Account created! Welcome 🎉");
      navigate(selectedRole === "seller" ? "/seller/dashboard" : "/shop");
    } catch(err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{position:"relative",zIndex:1}}>
          <div className="auth-logo">TrialNest</div>
          <h1 className="auth-heading">Experience it<br/>before you<br/>commit.</h1>
          <p className="auth-sub" style={{marginTop:"1.5rem"}}>Try-before-you-buy with cart, payment and delivery.</p>
          <div style={{marginTop:"2rem",display:"flex",flexDirection:"column",gap:"0.8rem"}}>
            {["🛍️ Try before you buy","🏠 Home trial delivery","💳 Pay seller directly","🛒 Cart & checkout","🔔 Live notifications"].map(f=>(
              <div key={f} style={{fontSize:"0.83rem",color:"rgba(250,249,246,0.65)"}}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap fade-in">
          <div className="auth-form-title">Create Account</div>
          <div className="auth-form-sub">Join TrialNest — choose your role</div>
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label className="form-label">I am a</label>
              <div className="role-grid">
                <div className={`role-card ${selectedRole==="buyer"?"selected":""}`} onClick={()=>setSelectedRole("buyer")}>
                  <div className="role-card-icon">🛍️</div>
                  <span className="role-card-label">Buyer</span>
                  <span className="role-card-sub">Browse, trial & buy</span>
                </div>
                <div className={`role-card ${selectedRole==="seller"?"selected":""}`} onClick={()=>setSelectedRole("seller")}>
                  <div className="role-card-icon">🏪</div>
                  <span className="role-card-label">Seller</span>
                  <span className="role-card-sub">List & manage products</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" placeholder="Rishabh Kumar Gupta" value={form.name} onChange={set("name")} required/>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-control" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required/>
            </div>
            <div className="form-row">
              <div className="form-group" style={{margin:0}}>
                <label className="form-label">Password</label>
                <input className="form-control" type="password" placeholder="6+ characters" value={form.password} onChange={set("password")} required/>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label className="form-label">Confirm</label>
                <input className="form-control" type="password" placeholder="Repeat" value={form.confirm} onChange={set("confirm")} required/>
              </div>
            </div>
            <button className="btn btn-primary btn-full btn-lg" disabled={loading} style={{marginTop:"0.5rem"}}>
              {loading ? "Creating…" : "Create Account →"}
            </button>
          </form>

          <div className="divider" style={{margin:"1.4rem 0"}}>or</div>
          <p style={{textAlign:"center",fontSize:"0.83rem",color:"#888"}}>
            Already have an account?{" "}
            <Link to="/login" style={{color:"var(--ink)",fontWeight:700,textDecoration:"none"}}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}