import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ordersDB } from "../../db";
import { useAuth } from "../../contexts/AuthContext";
const STATUS = { confirmed:{bg:"#d1e7dd",color:"#0a5235",label:"✅ Confirmed"}, processing:{bg:"#fff3cd",color:"#856404",label:"⚙️ Processing"}, shipped:{bg:"#e0ecf8",color:"#1d3557",label:"🚚 Shipped"}, delivered:{bg:"#d1e7dd",color:"#0a5235",label:"📦 Delivered"}, cancelled:{bg:"#f8d7da",color:"#8c1a22",label:"❌ Cancelled"} };
export default function MyOrders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  useEffect(()=>{ setOrders(ordersDB.getByBuyer(currentUser.uid)); },[]);
  return (
    <div className="container" style={{padding:"2.5rem 1.5rem"}}>
      <div style={{marginBottom:"2rem"}}><h1 style={{fontFamily:"var(--serif)",fontStyle:"italic",fontSize:"2rem"}}>My Orders</h1><p style={{color:"#888",fontSize:"0.83rem",marginTop:"0.3rem"}}>{orders.length} order{orders.length!==1?"s":""}</p></div>
      {orders.length===0?(<div className="empty-state"><div className="empty-state-icon">📦</div><h3>No orders yet</h3><Link to="/shop" className="btn btn-primary" style={{marginTop:"1rem"}}>Start Shopping</Link></div>):(
        <div style={{display:"flex",flexDirection:"column",gap:"1.2rem"}}>
          {orders.map(o=>{ const s=STATUS[o.status]||STATUS.confirmed; return (
            <div key={o.id} className="card">
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"1rem",flexWrap:"wrap",gap:"0.5rem"}}>
                <div><div style={{fontFamily:"var(--mono)",fontSize:"0.65rem",color:"#aaa",textTransform:"uppercase"}}>Order ID</div><div style={{fontWeight:800}}>{o.orderId}</div><div style={{fontSize:"0.72rem",color:"#aaa"}}>{new Date(o.createdAt).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}</div></div>
                <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}><span style={{padding:"0.3rem 0.8rem",borderRadius:999,fontSize:"0.7rem",fontWeight:700,background:s.bg,color:s.color}}>{s.label}</span><span style={{padding:"0.3rem 0.8rem",borderRadius:999,fontSize:"0.7rem",fontWeight:700,background:"#f0ede6",color:"#555"}}>{o.paymentMethod==="cod"?"💵 COD":o.paymentMethod?.toUpperCase()}</span></div>
              </div>
              {o.items?.map((i,idx)=>(<div key={idx} style={{display:"flex",alignItems:"center",gap:"0.8rem",padding:"0.5rem",background:"var(--cream)",borderRadius:6,marginBottom:"0.4rem"}}><span style={{fontSize:"1.5rem"}}>{i.productEmoji||"📦"}</span><div style={{flex:1}}><div style={{fontWeight:600,fontSize:"0.85rem"}}>{i.productName}</div><div style={{fontSize:"0.72rem",color:"#aaa"}}>Qty: {i.qty}</div></div><div style={{fontWeight:700}}>₹{Number(i.productPrice*i.qty).toLocaleString("en-IN")}</div></div>))}
              {o.transactionRef&&<div style={{fontSize:"0.78rem",color:"#666",margin:"0.6rem 0",fontFamily:"var(--mono)"}}>🔖 Txn Ref: <strong>{o.transactionRef}</strong></div>}
              <div style={{display:"flex",justifyContent:"space-between",paddingTop:"0.8rem",borderTop:"1px solid var(--border)"}}><div style={{fontSize:"0.8rem",color:"#888"}}>📍 {o.address}</div><div style={{fontWeight:800}}>₹{Number(o.total).toLocaleString("en-IN")}</div></div>
            </div>
          );})}
        </div>
      )}
    </div>
  );
}
