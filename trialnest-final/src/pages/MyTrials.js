// src/pages/MyTrials.js
import React, { useState, useEffect } from "react";
import { requestsDB, notifsDB } from "../db";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function MyTrials() {
  const { currentUser, userProfile } = useAuth();
  const [trials, setTrials] = useState([]);

  function refresh() { setTrials(requestsDB.getByBuyer(currentUser.uid)); }
  useEffect(() => { refresh(); }, []);

  function makeDecision(trial, decision) {
    requestsDB.update(trial.id, { buyerDecision: decision, decidedAt: new Date().toISOString() });
    notifsDB.add({
      userId: trial.sellerId,
      title:  decision==="bought" ? "🎉 Purchase Confirmed!" : "Trial Cancelled",
      body:   `${userProfile.name} ${decision==="bought"?"purchased":"cancelled after trialling"} "${trial.productName}"`,
      reqId:  trial.id,
    });
    toast.success(decision==="bought" ? "🎉 Purchase confirmed!" : "No worries! Keep exploring.");
    refresh();
  }

  return (
    <div className="container" style={{padding:"2.5rem 1.5rem"}}>
      <div style={{marginBottom:"2rem"}}>
        <h1 style={{fontFamily:"var(--serif)",fontStyle:"italic",fontSize:"2rem"}}>My Trial Requests</h1>
        <p style={{color:"#888",fontSize:"0.83rem",marginTop:"0.3rem"}}>Track your bookings and make your final decision after each trial.</p>
      </div>

      {trials.length===0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>No trial requests yet</h3>
          <p>Visit the shop and book your first trial.</p>
          <Link to="/shop" className="btn btn-primary" style={{marginTop:"1rem"}}>Browse Products</Link>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          {trials.map(t => <TrialCard key={t.id} trial={t} onDecide={makeDecision}/>)}
        </div>
      )}
    </div>
  );
}

function TrialCard({ trial: t, onDecide }) {
  return (
    <div className={`request-card ${t.status}`} style={{display:"flex",flexDirection:"column",gap:"0.8rem"}}>
      <div className="req-header">
        <div>
          <div className="req-product-name" style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
            <span style={{fontSize:"1.5rem"}}>{t.productEmoji||"📦"}</span>
            {t.productName}
          </div>
          <div className="req-buyer-info">₹{Number(t.productPrice).toLocaleString("en-IN")} · by {t.sellerName}</div>
        </div>
        <div className="req-badges">
          <span className={`badge badge-${t.trialType}`}>{t.trialType==="home"?"🏠 Home":"🏪 Store"}</span>
          {!t.buyerDecision && <span className={`badge badge-${t.status}`}>
            {t.status==="pending"?"⏳ Pending":t.status==="accepted"?"✅ Accepted":"❌ Rejected"}
          </span>}
          {t.buyerDecision==="bought"    && <span className="badge badge-bought">🛒 Purchased</span>}
          {t.buyerDecision==="cancelled" && <span className="badge badge-cancelled">🚫 Cancelled</span>}
        </div>
      </div>

      <div className="req-meta">
        <div className="req-meta-item">📅 <strong>{t.date}</strong></div>
        <div className="req-meta-item">🕐 <strong>{t.slot}</strong></div>
        <div className="req-meta-item">⏱ <strong>{t.duration}</strong></div>
        {t.address && t.address!=="Store Visit" && <div className="req-meta-item">📍 <strong>{t.address}</strong></div>}
      </div>

      {t.status==="pending" && !t.buyerDecision &&
        <div style={{fontSize:"0.82rem",color:"#aaa",fontStyle:"italic"}}>⏳ Waiting for seller to confirm…</div>}
      {t.status==="rejected" &&
        <div style={{fontSize:"0.82rem",color:"var(--red)"}}>❌ Seller couldn't accommodate this. Try another slot.</div>}
      {t.status==="accepted" && !t.buyerDecision && (
        <div>
          <div style={{fontSize:"0.82rem",fontWeight:700,color:"var(--green)",marginBottom:"0.6rem"}}>✅ Trial confirmed! How did it go?</div>
          <div style={{display:"flex",gap:"0.6rem"}}>
            <button className="btn btn-green btn-sm" onClick={()=>onDecide(t,"bought")}>✅ Buy It!</button>
            <button className="btn btn-red  btn-sm" onClick={()=>onDecide(t,"cancelled")}>❌ Not This Time</button>
          </div>
        </div>
      )}
      {t.buyerDecision==="bought"    && <div style={{fontSize:"0.83rem",color:"var(--green)",fontWeight:600}}>🎉 Great choice! Order confirmed.</div>}
      {t.buyerDecision==="cancelled" && <div style={{fontSize:"0.83rem",color:"#888"}}>No problem. Keep browsing!</div>}
    </div>
  );
}
