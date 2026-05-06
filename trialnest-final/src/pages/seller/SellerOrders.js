import React, { useState, useEffect } from "react";
import { ordersDB } from "../../db";
import { useAuth } from "../../contexts/AuthContext";
const STATUS_OPTIONS = ["confirmed","processing","shipped","delivered","cancelled"];
export default function SellerOrders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  function refresh() { setOrders(ordersDB.getBySeller(currentUser.uid)); }
  useEffect(()=>{ refresh(); },[]);
  function updateStatus(id, status) { ordersDB.updateStatus(id,status); refresh(); }
  const revenue = orders.reduce((s,o)=>s+Number(o.total||0),0);
  return (
    <div>
      <div className="dash-topbar"><div><div className="dash-title">Orders Received</div><div className="dash-subtitle">{orders.length} order{orders.length!==1?"s":""} · Revenue ₹{revenue.toLocaleString("en-IN")}</div></div></div>
      {orders.length===0?(<div className="empty-state"><div className="empty-state-icon">📋</div><h3>No orders yet</h3><p>Orders from buyers will appear here.</p></div>):(
        <div style={{display:"flex",flexDirection:"column",gap:"1.2rem"}}>
          {orders.map(o=>(
            <div key={o.id} className="card">
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"1rem",flexWrap:"wrap",gap:"0.5rem"}}>
                <div><div style={{fontFamily:"var(--mono)",fontSize:"0.65rem",color:"#aaa",textTransform:"uppercase"}}>Order ID</div><div style={{fontWeight:800}}>{o.orderId}</div><div style={{fontSize:"0.75rem",color:"#888"}}>👤 {o.buyerName} · {new Date(o.createdAt).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}</div></div>
                <div style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
                  <span style={{padding:"0.3rem 0.8rem",borderRadius:999,fontSize:"0.7rem",fontWeight:700,background:"#d1e7dd",color:"#0a5235"}}>{o.paymentMethod==="cod"?"💵 COD":"✅ "+o.paymentMethod?.toUpperCase()}</span>
                  <select className="form-control" style={{fontSize:"0.75rem",padding:"0.3rem 0.6rem",width:"auto"}} value={o.status} onChange={e=>updateStatus(o.id,e.target.value)}>
                    {STATUS_OPTIONS.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              {o.items?.map((i,idx)=>(<div key={idx} style={{display:"flex",alignItems:"center",gap:"0.8rem",padding:"0.5rem",background:"var(--cream)",borderRadius:6,marginBottom:"0.4rem"}}><span style={{fontSize:"1.5rem"}}>{i.productEmoji||"📦"}</span><div style={{flex:1}}><div style={{fontWeight:600,fontSize:"0.85rem"}}>{i.productName}</div><div style={{fontSize:"0.72rem",color:"#aaa"}}>Qty: {i.qty}</div></div><div style={{fontWeight:700}}>₹{Number(i.productPrice*i.qty).toLocaleString("en-IN")}</div></div>))}
              {o.transactionRef&&<div style={{fontSize:"0.78rem",color:"#666",margin:"0.5rem 0",fontFamily:"var(--mono)"}}>🔖 Txn Ref: <strong>{o.transactionRef}</strong></div>}
              <div style={{display:"flex",justifyContent:"space-between",paddingTop:"0.8rem",borderTop:"1px solid var(--border)"}}><div style={{fontSize:"0.8rem",color:"#888"}}>📍 {o.address}</div><div style={{fontWeight:800}}>₹{Number(o.total).toLocaleString("en-IN")}</div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
