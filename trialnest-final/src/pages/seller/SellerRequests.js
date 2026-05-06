import React, { useState, useEffect } from "react";
import { requestsDB, notifsDB } from "../../db";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const TABS = ["All","Pending","Accepted","Rejected","Completed"];

export default function SellerRequests() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [tab, setTab] = useState("All");
  function refresh() { setRequests(requestsDB.getBySeller(currentUser.uid)); }
  useEffect(()=>{ refresh(); },[]);

  function handleAction(req, action) {
    requestsDB.update(req.id, { status:action });
    notifsDB.add({ userId:req.buyerId, title:action==="accepted"?"🎉 Trial Accepted!":"❌ Trial Rejected", body:action==="accepted"?`Your trial for "${req.productName}" on ${req.date} at ${req.slot} is confirmed!`:`Sorry, your request for "${req.productName}" was declined.`, reqId:req.id });
    toast.success(action==="accepted"?"Accepted! Buyer notified.":"Rejected.");
    refresh();
  }

  const filtered = requests.filter(r=>{ if(tab==="All") return true; if(tab==="Pending") return r.status==="pending"; if(tab==="Accepted") return r.status==="accepted"&&!r.buyerDecision; if(tab==="Rejected") return r.status==="rejected"; if(tab==="Completed") return !!r.buyerDecision; return true; });
  const counts = { All:requests.length, Pending:requests.filter(r=>r.status==="pending").length, Accepted:requests.filter(r=>r.status==="accepted"&&!r.buyerDecision).length, Rejected:requests.filter(r=>r.status==="rejected").length, Completed:requests.filter(r=>!!r.buyerDecision).length };

  return (
    <div>
      <div className="dash-topbar"><div><div className="dash-title">Trial Requests</div><div className="dash-subtitle">Review and manage incoming bookings.</div></div>{counts.Pending>0&&<span className="badge badge-new" style={{fontSize:"0.75rem",padding:"0.35rem 0.8rem"}}>{counts.Pending} pending</span>}</div>
      <div style={{display:"flex",gap:"0.3rem",marginBottom:"1.5rem",flexWrap:"wrap"}}>
        {TABS.map(t=>(<button key={t} className={`btn btn-sm ${tab===t?"btn-primary":"btn-outline"}`} onClick={()=>setTab(t)}>{t} {counts[t]>0&&<span style={{opacity:0.7}}>({counts[t]})</span>}</button>))}
      </div>
      {filtered.length===0?(<div className="empty-state"><div className="empty-state-icon">🗂️</div><h3>No {tab.toLowerCase()} requests</h3></div>):(
        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          {filtered.map(r=>(
            <div key={r.id} className={`request-card ${r.status==="pending"?"is-new":r.status}`}>
              <div className="req-header">
                <div style={{display:"flex",alignItems:"flex-start",gap:"0.8rem"}}>
                  <span style={{fontSize:"2rem"}}>{r.productEmoji||"📦"}</span>
                  <div><div className="req-product-name">{r.productName}</div><div className="req-buyer-info">👤 {r.buyerName}{r.buyerPhone&&<> · 📞 {r.buyerPhone}</>} · ₹{Number(r.productPrice).toLocaleString("en-IN")}</div></div>
                </div>
                <div className="req-badges">
                  <span className={`badge badge-${r.trialType}`}>{r.trialType==="home"?"🏠 Home":"🏪 Store"}</span>
                  {r.buyerDecision?<span className={`badge badge-${r.buyerDecision==="bought"?"bought":"cancelled"}`}>{r.buyerDecision==="bought"?"🛒 Purchased":"🚫 Cancelled"}</span>:<span className={`badge badge-${r.status}`}>{r.status==="pending"?"⏳ Pending":r.status==="accepted"?"✅ Accepted":"❌ Rejected"}</span>}
                </div>
              </div>
              <div className="req-meta">
                <div className="req-meta-item">📅 <strong>{r.date}</strong></div>
                <div className="req-meta-item">🕐 <strong>{r.slot}</strong></div>
                <div className="req-meta-item">⏱ <strong>{r.duration}</strong></div>
                {r.address&&r.address!=="Store Visit"&&<div className="req-meta-item">📍 <strong>{r.address}</strong></div>}
              </div>
              {r.status==="pending"&&!r.buyerDecision&&(<div style={{display:"flex",gap:"0.6rem"}}><button className="btn btn-green btn-sm" onClick={()=>handleAction(r,"accepted")}>✓ Accept Trial</button><button className="btn btn-red btn-sm" onClick={()=>handleAction(r,"rejected")}>✗ Reject</button></div>)}
              {r.status==="accepted"&&!r.buyerDecision&&<div style={{fontSize:"0.8rem",color:"var(--green)",fontStyle:"italic"}}>✅ Confirmed — awaiting buyer's post-trial decision…</div>}
              {r.buyerDecision==="bought"&&<div style={{fontSize:"0.82rem",fontWeight:700,color:"var(--green)"}}>🎉 Buyer purchased! ₹{Number(r.productPrice).toLocaleString("en-IN")}</div>}
              {r.buyerDecision==="cancelled"&&<div style={{fontSize:"0.82rem",color:"#aaa"}}>Buyer decided not to purchase after trial.</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
