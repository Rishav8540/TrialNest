// src/pages/Register.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const ROLES = [
  { key:"buyer",   icon:"🛍️", label:"Buyer",   sub:"Browse, trial & buy products" },
  { key:"seller",  icon:"🏪", label:"Seller",  sub:"List products & manage trials" },
];

export default function Register() {
  const { signup } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"", phone:"", vehicle:"" });
  const [, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  function handleSubmit(e) {
    e.preventDefault();
    if (!role)                          return toast.error("Please select your role.");
    if (!form.name.trim())              return toast.error("Enter your name.");
    if (form.password.length < 6)       return toast.error("Password must be 6+ characters.");
    if (form.password !== form.confirm) return toast.error("Passwords don't match.");
    setLoading(true);
    try {
      const extra = {};
      const user = signup(form.email, form.password, form.name.trim(), role, extra);
      toast.success("Account created! Welcome to TrialNest 🎉");
      navigate(role==="seller" ? "/seller/dashboard" : "/shop");
    } catch(err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{position:"relative",zIndex:1}}>
          <div className="auth-logo">TrialNest</div>
          <h1 className="auth-heading">Experience it<br/>before you<br/>commit.</h1>
          <p className="auth-sub" style={{marginTop:"1.5rem"}}>
            TrialNest connects buyers and sellers through a seamless try-before-you-buy experience.
          </p>
          <div style={{marginTop:"2rem",display:"flex",flexDirection:"column",gap:"0.8rem"}}>
            {["🛍️ Try before you buy","🏠 Home trial delivery","🏪 In-store visit booking","✅ Buy only if you love it","🔔 Real-time notifications","🛒 Cart & instant checkout"].map(f=>(
              <div key={f} style={{fontSize:"0.83rem",color:"rgba(250,249,246,0.65)"}}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap fade-in">
          <div className="auth-form-title">Create Account</div>
          <div className="auth-form-sub">Join TrialNest — choose your role below</div>
          <form onSubmit={handleSubmit}>
            {/* Role */}
            <div className="form-group">
              <label className="form-label">I want to</label>
              <div className="role-grid">
                {ROLES.map(r=>(
                  <div key={r.key} className={`role-card ${role===r.key?"selected":""}`} onClick={()=>setRole(r.key)}>
                    <div className="role-card-icon">{r.icon}</div>
                    <span className="role-card-label">{r.label}</span>
                    <span className="role-card-sub">{r.sub}</span>
                  </div>
                ))}
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
              {loading?"Creating…":"Create Account →"}
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
