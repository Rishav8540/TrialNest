import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsDB, requestsDB, ordersDB } from "../../db";
import { useAuth } from "../../contexts/AuthContext";

export default function SellerDashboard() {
  const { currentUser, userProfile } = useAuth();
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [orders,   setOrders]   = useState([]);

  useEffect(()=>{
    setProducts(productsDB.getBySeller(currentUser.uid));
    setRequests(requestsDB.getBySeller(currentUser.uid));
    setOrders(ordersDB.getBySeller(currentUser.uid));
  },[]);

  const pending   = requests.filter(r=>r.status==="pending").length;
  const accepted  = requests.filter(r=>r.status==="accepted").length;
  const purchased = orders.length;
  const revenue   = orders.reduce((s,o)=>s+Number(o.total||0),0);
  const recent    = requests.filter(r=>r.status==="pending").slice(0,5);
  const hasPayment = userProfile?.paymentInfo?.upiId || userProfile?.paymentInfo?.qrCodeImage;

  return (
    <div>
      <div className="dash-topbar">
        <div><div className="dash-title">Good day, {userProfile?.name?.split(" ")[0]} 👋</div><div className="dash-subtitle">Here's your store overview.</div></div>
        <Link to="/seller/products/new" className="btn btn-primary">+ Add Product</Link>
      </div>

      {!hasPayment&&(
        <div style={{background:"#fffbf0",border:"1px solid #ffe066",borderRadius:"var(--r)",padding:"1rem 1.5rem",marginBottom:"1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap"}}>
          <div><div style={{fontWeight:700,fontSize:"0.9rem"}}>⚠️ Payment info not set up</div><div style={{fontSize:"0.78rem",color:"#856404",marginTop:"0.2rem"}}>Buyers can't pay you until you add your UPI ID or QR code.</div></div>
          <Link to="/seller/payment-settings" className="btn btn-gold btn-sm">Setup Payment →</Link>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"1rem",marginBottom:"2rem"}}>
        {[{label:"Products",value:products.length,icon:"📦",color:"var(--blue)"},{label:"Pending",value:pending,icon:"⏳",color:"var(--gold)"},{label:"Accepted",value:accepted,icon:"✅",color:"var(--green)"},{label:"Orders",value:purchased,icon:"🛒",color:"var(--green-light)"}].map(s=>(
          <div key={s.label} className="card" style={{textAlign:"center",padding:"1.3rem"}}>
            <div style={{fontSize:"1.8rem",marginBottom:"0.3rem"}}>{s.icon}</div>
            <div style={{fontSize:"2rem",fontWeight:900,fontFamily:"var(--serif)",color:s.color}}>{s.value}</div>
            <div style={{fontSize:"0.68rem",color:"#aaa",fontFamily:"var(--mono)",textTransform:"uppercase",letterSpacing:"0.08em"}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{marginBottom:"2rem",display:"flex",alignItems:"center",gap:"2rem",padding:"1.5rem 2rem"}}>
        <div style={{fontSize:"2.5rem"}}>💰</div>
        <div><div style={{fontFamily:"var(--mono)",fontSize:"0.64rem",letterSpacing:"0.1em",textTransform:"uppercase",color:"#aaa",marginBottom:"0.2rem"}}>Total Revenue</div><div style={{fontSize:"2rem",fontWeight:900,fontFamily:"var(--serif)",color:"var(--green)"}}>₹{revenue.toLocaleString("en-IN")}</div></div>
        <Link to="/seller/orders" className="btn btn-outline btn-sm" style={{marginLeft:"auto"}}>View Orders</Link>
      </div>

      <div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"}}>
          <h2 style={{fontWeight:800,fontSize:"1.1rem"}}>Pending Trial Requests</h2>
          <Link to="/seller/requests" className="btn btn-outline btn-sm">View All</Link>
        </div>
        {recent.length===0?(<div className="card" style={{textAlign:"center",padding:"2.5rem",color:"#aaa"}}><div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>🗂️</div><p style={{fontSize:"0.85rem"}}>No pending requests.</p></div>)
        :recent.map(r=>(<div key={r.id} className="card" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",marginBottom:"0.7rem"}}><div><div style={{fontWeight:700,fontSize:"0.9rem"}}>{r.productEmoji} {r.productName}</div><div style={{fontSize:"0.75rem",color:"#aaa",fontFamily:"var(--mono)"}}>{r.buyerName} · {r.trialType==="home"?"Home":"Store"} · {r.date} at {r.slot}</div></div><Link to="/seller/requests" className="btn btn-gold btn-sm">Review</Link></div>))}
      </div>
    </div>
  );
}
