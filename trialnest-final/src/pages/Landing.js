// src/pages/Landing.js
import React from "react";
import { Link } from "react-router-dom";

const FEATURES = [
  { icon:"🏠", title:"Home Trial Delivery", desc:"We bring the product to your door. Try it in your own space, with your own time." },
  { icon:"🏪", title:"Store Visit Booking", desc:"Prefer trying in-store? Book a slot and visit our partner stores at your convenience." },
  { icon:"✅", title:"Buy Only If You Love It", desc:"No pressure. After the trial, decide to buy or simply return it — zero obligation." },
  { icon:"🔔", title:"Real-Time Notifications", desc:"Sellers get instant alerts. Buyers get live status updates on every booking." },
  { icon:"🛍️", title:"Seller Dashboard", desc:"List products, upload photos, set prices, and manage all trial requests from one place." },
  { icon:"📊", title:"Trial Analytics", desc:"Sellers see conversion rates, revenue, and buyer decisions in a live dashboard." },
];

const HOW_IT_WORKS = [
  { step:"01", title:"Sign Up as Buyer or Seller", desc:"Create your account and choose your role. Sellers list products. Buyers browse and trial." },
  { step:"02", title:"Browse & Book a Trial", desc:"Find a product you love. Choose home delivery or store visit. Pick a date and time slot." },
  { step:"03", title:"Seller Reviews & Confirms", desc:"The seller gets notified instantly and accepts or rejects your trial request." },
  { step:"04", title:"Try It. Then Decide.", desc:"Experience the product. If you love it, buy it. If not, no worries — just cancel." },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <div className="page-hero" style={{padding:"7rem 1.5rem 6rem"}}>
        <div className="page-hero-inner" style={{maxWidth:1180,margin:"0 auto",position:"relative",zIndex:1}}>
          <div className="section-eyebrow" style={{color:"var(--gold-light)"}}>Try Before You Buy Platform</div>
          <h1 style={{
            fontFamily:"var(--serif)", fontStyle:"italic",
            fontSize:"clamp(2.8rem,7vw,5.5rem)", color:"var(--paper)",
            lineHeight:1.04, maxWidth:800, marginBottom:"1.5rem",
          }}>
            Experience it first.<br/>
            <em style={{color:"var(--gold-light)"}}>Then commit.</em>
          </h1>
          <p style={{fontSize:"1.05rem",color:"rgba(250,249,246,0.6)",maxWidth:500,lineHeight:1.75,marginBottom:"2.5rem"}}>
            TrialNest connects buyers and sellers through a seamless try-before-you-buy experience.
            Book home trials or store visits — completely free.
          </p>
          <div style={{display:"flex",gap:"0.9rem",flexWrap:"wrap"}}>
            <Link to="/register" className="btn btn-gold btn-xl">Start for Free →</Link>
            <Link to="/shop"     className="btn btn-xl" style={{borderColor:"rgba(255,255,255,0.3)",color:"var(--paper)",background:"transparent",border:"1.5px solid rgba(255,255,255,0.25)"}}>Browse Products</Link>
          </div>
          {/* Pills */}
          <div style={{marginTop:"2.5rem",display:"flex",gap:"0.6rem",flexWrap:"wrap"}}>
            {["🏠 Home Trial","🏪 Store Visit","✅ No Commitment","🔔 Live Notifications"].map(p => (
              <span key={p} style={{
                border:"1px solid rgba(255,255,255,0.15)", color:"rgba(250,249,246,0.6)",
                padding:"0.35rem 0.9rem", borderRadius:999, fontSize:"0.78rem",
              }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{padding:"5rem 1.5rem",background:"var(--paper)"}}>
        <div style={{maxWidth:1180,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"3.5rem"}}>
            <div className="section-eyebrow" style={{justifyContent:"center"}}>Why TrialNest</div>
            <h2 className="section-title">Everything you need<br/>to try before you buy</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.2rem"}}>
            {FEATURES.map((f,i) => (
              <div key={f.title} className={`card fade-in fade-in-${(i%4)+1}`} style={{padding:"1.8rem"}}>
                <div style={{fontSize:"2rem",marginBottom:"0.8rem"}}>{f.icon}</div>
                <h3 style={{fontSize:"1rem",fontWeight:800,marginBottom:"0.5rem"}}>{f.title}</h3>
                <p style={{fontSize:"0.82rem",color:"#888",lineHeight:1.65}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{padding:"5rem 1.5rem",background:"var(--cream)"}}>
        <div style={{maxWidth:1180,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"3.5rem"}}>
            <div className="section-eyebrow" style={{justifyContent:"center"}}>The Flow</div>
            <h2 className="section-title">How TrialNest works</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1.5rem"}}>
            {HOW_IT_WORKS.map((s,i) => (
              <div key={s.step} className="fade-in" style={{animationDelay:`${i*0.08}s`}}>
                <div style={{
                  fontFamily:"var(--serif)", fontStyle:"italic", fontSize:"3.5rem",
                  color:"var(--border)", lineHeight:1, marginBottom:"0.8rem",
                }}>{s.step}</div>
                <h3 style={{fontSize:"1rem",fontWeight:800,marginBottom:"0.5rem"}}>{s.title}</h3>
                <p style={{fontSize:"0.82rem",color:"#888",lineHeight:1.65}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roles CTA */}
      <div style={{padding:"5rem 1.5rem",background:"var(--ink)"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem"}}>
          <div style={{
            border:"1px solid rgba(255,255,255,0.1)",borderRadius:"var(--r-lg)",
            padding:"2.5rem", background:"rgba(255,255,255,0.04)",
          }}>
            <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>🛍️</div>
            <h2 style={{color:"var(--paper)",fontSize:"1.4rem",fontWeight:800,marginBottom:"0.6rem"}}>I'm a Buyer</h2>
            <p style={{color:"rgba(250,249,246,0.55)",fontSize:"0.85rem",lineHeight:1.7,marginBottom:"1.5rem"}}>
              Browse products, book home trials or store visits, and only buy if you love it.
            </p>
            <Link to="/register" className="btn btn-gold">Start Trialling →</Link>
          </div>
          <div style={{
            border:"1px solid rgba(201,168,76,0.3)",borderRadius:"var(--r-lg)",
            padding:"2.5rem", background:"rgba(201,168,76,0.06)",
          }}>
            <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>🏪</div>
            <h2 style={{color:"var(--paper)",fontSize:"1.4rem",fontWeight:800,marginBottom:"0.6rem"}}>I'm a Seller</h2>
            <p style={{color:"rgba(250,249,246,0.55)",fontSize:"0.85rem",lineHeight:1.7,marginBottom:"1.5rem"}}>
              List your products, manage trial requests, accept bookings, and convert trials to sales.
            </p>
            <Link to="/register" className="btn btn-primary" style={{background:"var(--paper)",color:"var(--ink)"}}>Start Selling →</Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{background:"var(--ink)",borderTop:"1px solid rgba(255,255,255,0.07)",padding:"2rem 1.5rem",textAlign:"center"}}>
        <div style={{fontFamily:"var(--serif)",fontStyle:"italic",fontSize:"1.2rem",color:"var(--gold-light)",marginBottom:"0.5rem"}}>TrialNest</div>
        <p style={{fontSize:"0.75rem",color:"rgba(250,249,246,0.3)"}}>
          Built with React · Firebase · Firestore · Firebase Storage<br/>
          A project by Rishabh Kumar Gupta
        </p>
      </footer>
    </div>
  );
}
