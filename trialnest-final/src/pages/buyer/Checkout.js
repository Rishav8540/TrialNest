import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ordersDB, cartDB, notifsDB, authDB } from "../../db";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const PAY = [
  {key:"upi",icon:"📱",label:"UPI / QR Code",sub:"Scan seller QR or pay via UPI ID"},
  {key:"gpay",icon:"💚",label:"Google Pay",sub:"Pay to seller GPay number"},
  {key:"phonepe",icon:"💜",label:"PhonePe",sub:"Pay to seller PhonePe number"},
  {key:"netbanking",icon:"🏦",label:"Net Banking / NEFT",sub:"Transfer to seller bank account"},
  {key:"cod",icon:"💵",label:"Cash on Delivery",sub:"Pay cash when product arrives"},
];

export default function Checkout() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const items    = state?.items    || [];
  const subtotal = state?.subtotal || 0;
  const shipping = state?.shipping || 0;
  const total    = state?.total    || 0;

  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState("");
  const [txnRef, setTxnRef] = useState("");
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [addr, setAddr] = useState({ name:userProfile?.name||"", phone:"", street:"", city:"Bhopal", state_:"Madhya Pradesh", pin:"", landmark:"" });
  const setA = k => e => setAddr(a=>({...a,[k]:e.target.value}));

  // Get seller payment info
  const sellerId = items[0]?.sellerId;
  const allUsers = authDB.getSession ? (() => { try { return JSON.parse(localStorage.getItem("tn_users"))||[]; } catch { return []; } })() : [];
  const sellerUser = allUsers.find(u=>u.uid===sellerId);
  const sellerPayment = sellerUser?.paymentInfo || {};

  function validateAddr() {
    if(!addr.name.trim())   { toast.error("Enter full name"); return false; }
    if(!addr.phone.trim())  { toast.error("Enter phone"); return false; }
    if(!addr.street.trim()) { toast.error("Enter address"); return false; }
    if(!addr.pin.trim())    { toast.error("Enter PIN code"); return false; }
    return true;
  }

  async function placeOrder() {
    if(!payMethod) { toast.error("Select payment method"); return; }
    if(payMethod!=="cod"&&!txnRef.trim()) { toast.error("Enter transaction ID after paying seller"); return; }
    setProcessing(true);
    await new Promise(r=>setTimeout(r,1500));
    try {
      const order = ordersDB.place({
        buyerId:currentUser.uid, buyerName:userProfile.name,
        items, sellerPayment,
        address:`${addr.name}, ${addr.street}, ${addr.city}, ${addr.state_} — ${addr.pin}${addr.landmark?" (Near "+addr.landmark+")":""}`,
        phone:addr.phone, paymentMethod:payMethod, transactionRef:txnRef,
        subtotal, shipping, total,
      });
      cartDB.clearCart(currentUser.uid);
      if(sellerId) notifsDB.add({ userId:sellerId, title:"🛒 New Order!", body:`${userProfile.name} ordered ₹${total.toLocaleString("en-IN")}`, reqId:order.id });
      setOrderId(order.orderId);
      setStep(3);
    } catch { toast.error("Order failed."); }
    finally { setProcessing(false); }
  }

  if(step===3) return (
    <div className="container" style={{padding:"4rem 1.5rem",maxWidth:560}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"5rem",marginBottom:"1rem"}}>🎉</div>
        <h1 style={{fontFamily:"var(--serif)",fontStyle:"italic",fontSize:"2.2rem",marginBottom:"0.5rem"}}>Order Confirmed!</h1>
        <div className="card" style={{textAlign:"left",marginBottom:"1.5rem",marginTop:"1.5rem"}}>
          <div style={{display:"flex",flexDirection:"column",gap:"0.7rem"}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#888",fontSize:"0.82rem"}}>Order ID</span><span style={{fontWeight:800,color:"var(--green)"}}>{orderId}</span></div>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#888",fontSize:"0.82rem"}}>Payment</span><span style={{fontWeight:600}}>{PAY.find(m=>m.key===payMethod)?.label}</span></div>
            {txnRef&&<div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#888",fontSize:"0.82rem"}}>Transaction Ref</span><span style={{fontWeight:600,fontFamily:"var(--mono)",fontSize:"0.78rem"}}>{txnRef}</span></div>}
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#888",fontSize:"0.82rem"}}>Total</span><span style={{fontWeight:900,color:"var(--green)",fontSize:"1.1rem"}}>₹{total.toLocaleString("en-IN")}</span></div>
          </div>
        </div>
        <button className="btn btn-primary btn-full btn-lg" onClick={()=>navigate("/shop")}>Continue Shopping →</button>
        <button className="btn btn-outline btn-full" style={{marginTop:"0.6rem"}} onClick={()=>navigate("/my-orders")}>View My Orders</button>
      </div>
    </div>
  );

  return (
    <div className="container" style={{padding:"2.5rem 1.5rem"}}>
      <h1 style={{fontFamily:"var(--serif)",fontStyle:"italic",fontSize:"2rem",marginBottom:"2rem"}}>Checkout</h1>
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:"2rem",alignItems:"start"}}>
        <div>
          {step===1&&(
            <div className="card">
              <div style={{fontWeight:800,fontSize:"1.05rem",marginBottom:"1.5rem"}}>📍 Delivery Address</div>
              <div className="form-row"><div className="form-group" style={{margin:0}}><label className="form-label">Full Name</label><input className="form-control" value={addr.name} onChange={setA("name")} placeholder="Your Name"/></div><div className="form-group" style={{margin:0}}><label className="form-label">Phone</label><input className="form-control" value={addr.phone} onChange={setA("phone")} placeholder="+91 98765 43210"/></div></div>
              <div className="form-group"><label className="form-label">Street Address</label><input className="form-control" value={addr.street} onChange={setA("street")} placeholder="House/Flat, Street, Area"/></div>
              <div className="form-row"><div className="form-group" style={{margin:0}}><label className="form-label">City</label><input className="form-control" value={addr.city} onChange={setA("city")}/></div><div className="form-group" style={{margin:0}}><label className="form-label">PIN Code</label><input className="form-control" value={addr.pin} onChange={setA("pin")} placeholder="462001"/></div></div>
              <div className="form-group"><label className="form-label">Landmark (optional)</label><input className="form-control" value={addr.landmark} onChange={setA("landmark")} placeholder="Near City Mall"/></div>
              <button className="btn btn-primary btn-full btn-lg" onClick={()=>{if(validateAddr())setStep(2);}}>Continue to Payment →</button>
            </div>
          )}
          {step===2&&(
            <div style={{display:"flex",flexDirection:"column",gap:"1.2rem"}}>
              {(sellerPayment.upiId||sellerPayment.qrCodeImage||sellerPayment.gpayNumber)&&(
                <div className="card" style={{background:"#fffbf0",border:"2px solid #ffe066"}}>
                  <div style={{fontWeight:800,fontSize:"1rem",marginBottom:"1rem"}}>💳 Pay Directly to Seller</div>
                  <div style={{display:"flex",gap:"1.5rem",flexWrap:"wrap",alignItems:"flex-start"}}>
                    {sellerPayment.qrCodeImage&&<div style={{textAlign:"center"}}><img src={sellerPayment.qrCodeImage} alt="QR" style={{width:140,height:140,objectFit:"contain",background:"#fff",padding:6,borderRadius:8,border:"1px solid var(--border)"}}/><div style={{fontSize:"0.7rem",color:"#888",marginTop:"0.3rem"}}>Scan to Pay</div></div>}
                    <div style={{flex:1,fontSize:"0.85rem",lineHeight:2.2}}>
                      {sellerPayment.upiId&&<div>📱 <strong>UPI ID:</strong> <code style={{background:"#fff",padding:"0.1rem 0.5rem",borderRadius:4,border:"1px solid var(--border)"}}>{sellerPayment.upiId}</code></div>}
                      {sellerPayment.gpayNumber&&<div>💚 <strong>GPay:</strong> {sellerPayment.gpayNumber}</div>}
                      {sellerPayment.phonePeNum&&<div>💜 <strong>PhonePe:</strong> {sellerPayment.phonePeNum}</div>}
                      {sellerPayment.paytmNumber&&<div>🔵 <strong>Paytm:</strong> {sellerPayment.paytmNumber}</div>}
                      {sellerPayment.accountNo&&<div>🏦 <strong>A/c:</strong> {sellerPayment.accountNo} · {sellerPayment.bankName}</div>}
                      {sellerPayment.ifscCode&&<div>🔢 <strong>IFSC:</strong> {sellerPayment.ifscCode}</div>}
                    </div>
                  </div>
                  <div style={{marginTop:"1rem",padding:"0.8rem 1rem",background:"rgba(201,168,76,0.1)",borderRadius:6,fontSize:"0.8rem",color:"#856404"}}>
                    ⚠️ Pay ₹{total.toLocaleString("en-IN")} to seller → Copy Transaction ID → Enter below → Place Order
                  </div>
                </div>
              )}
              <div className="card">
                <div style={{fontWeight:800,fontSize:"1rem",marginBottom:"1.2rem"}}>Select Payment Method</div>
                <div style={{display:"flex",flexDirection:"column",gap:"0.6rem",marginBottom:"1.2rem"}}>
                  {PAY.map(m=>(
                    <div key={m.key} onClick={()=>setPayMethod(m.key)} style={{border:`2px solid ${payMethod===m.key?"var(--ink)":"var(--border)"}`,borderRadius:"var(--r-sm)",padding:"0.9rem 1.1rem",cursor:"pointer",background:payMethod===m.key?"var(--ink)":"#fff",color:payMethod===m.key?"var(--paper)":"var(--ink)",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"1rem"}}>
                      <span style={{fontSize:"1.4rem"}}>{m.icon}</span>
                      <div style={{flex:1}}><div style={{fontWeight:700,fontSize:"0.88rem"}}>{m.label}</div><div style={{fontSize:"0.7rem",opacity:0.65}}>{m.sub}</div></div>
                      {payMethod===m.key&&<span>✓</span>}
                    </div>
                  ))}
                </div>
                {payMethod&&payMethod!=="cod"&&(
                  <div className="form-group">
                    <label className="form-label">Transaction ID / UTR Number *</label>
                    <input className="form-control" placeholder="e.g. 426831924502" value={txnRef} onChange={e=>setTxnRef(e.target.value)}/>
                    <div className="form-hint">After paying the seller, enter the transaction reference here.</div>
                  </div>
                )}
                {payMethod==="cod"&&<div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:"var(--r-sm)",padding:"1rem",fontSize:"0.82rem",color:"#15803d",marginBottom:"1rem"}}>💵 Pay ₹{total.toLocaleString("en-IN")} cash when delivered.</div>}
                <div style={{display:"flex",gap:"0.7rem",marginTop:"0.5rem"}}>
                  <button className="btn btn-outline" onClick={()=>setStep(1)}>← Back</button>
                  <button className="btn btn-green btn-lg" style={{flex:1}} disabled={processing} onClick={placeOrder}>
                    {processing?<><div className="spinner" style={{width:18,height:18,borderWidth:2}}/>Processing…</>:`Confirm Order — ₹${total.toLocaleString("en-IN")}`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="card" style={{position:"sticky",top:80}}>
          <div style={{fontWeight:800,marginBottom:"1rem"}}>Order Summary</div>
          {items.map((i,idx)=>(
            <div key={idx} style={{display:"flex",justifyContent:"space-between",fontSize:"0.82rem",padding:"0.4rem 0",borderBottom:"1px solid var(--border)"}}>
              <span style={{color:"#666"}}>{i.productEmoji} {i.productName} ×{i.qty}</span>
              <span style={{fontWeight:600}}>₹{Number(i.productPrice*i.qty).toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div style={{marginTop:"1rem",display:"flex",flexDirection:"column",gap:"0.5rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.83rem"}}><span style={{color:"#888"}}>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.83rem"}}><span style={{color:"#888"}}>Shipping</span><span style={{color:shipping===0?"var(--green)":"var(--ink)"}}>{shipping===0?"FREE":"₹"+shipping}</span></div>
            <div style={{height:1,background:"var(--border)"}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontWeight:800,fontSize:"1rem"}}><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
