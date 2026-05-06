// src/components/buyer/BookingModal.js
import React, { useState } from "react";
import { requestsDB, notifsDB } from "../../db";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const SLOTS = ["9:00 AM","10:30 AM","12:00 PM","1:30 PM","3:00 PM","4:30 PM","6:00 PM"];

export default function BookingModal({ product, onClose }) {
  const { currentUser, userProfile } = useAuth();
  const [trialType, setTrialType] = useState("");
  const [slot, setSlot]           = useState("");
  const [form, setForm]           = useState({ date:"", duration:"1 hour", street:"", city:"Bhopal", pin:"", landmark:"", phone:"" });
  const [loading, setLoading]     = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const today = new Date().toISOString().split("T")[0];

  function submit(e) {
    e.preventDefault();
    if (!trialType) return toast.error("Select trial type.");
    if (!slot)      return toast.error("Select a time slot.");
    if (!form.date) return toast.error("Pick a date.");
    if (trialType==="home" && (!form.street||!form.city||!form.pin)) return toast.error("Fill in delivery address.");
    setLoading(true);
    try {
      const address = trialType==="home"
        ? `${form.street}, ${form.city} — ${form.pin}${form.landmark?` (Near ${form.landmark})`:""}`
        : "Store Visit";

      const req = requestsDB.add({
        productId:    product.id,
        productName:  product.name,
        productPrice: product.price,
        productEmoji: product.emoji,
        productImage: product.images?.[0]||null,
        sellerId:     product.sellerId,
        sellerName:   product.sellerName,
        buyerId:      currentUser.uid,
        buyerName:    userProfile.name,
        buyerPhone:   form.phone,
        trialType, date: form.date, slot, duration: form.duration, address,
        status: "pending", buyerDecision: null,
      });

      notifsDB.add({
        userId: product.sellerId,
        title:  "🔔 New Trial Request",
        body:   `${userProfile.name} wants to trial "${product.name}" on ${form.date} at ${slot}`,
        reqId:  req.id,
      });

      toast.success("Trial booked successfully! 🎉");
      onClose();
    } catch (err) {
      toast.error("Failed to book. Try again.");
    } finally { setLoading(false); }
  }

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box">
        {/* Banner */}
        <div style={{height:150,display:"flex",alignItems:"center",justifyContent:"center",background:"var(--ink)",borderRadius:"var(--r-lg) var(--r-lg) 0 0",position:"relative",overflow:"hidden"}}>
          {product.images?.[0]
            ? <img src={product.images[0]} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            : <span style={{fontSize:"5rem"}}>{product.emoji||"📦"}</span>
          }
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(15,15,18,0.7) 0%,transparent 60%)"}}/>
          <div style={{position:"absolute",bottom:"1rem",left:"1.5rem"}}>
            <div style={{color:"var(--paper)",fontWeight:700,fontSize:"1rem"}}>{product.name}</div>
            <div style={{color:"var(--gold-light)",fontFamily:"var(--mono)",fontSize:"0.78rem"}}>₹{Number(product.price).toLocaleString("en-IN")}</div>
          </div>
        </div>
        <button className="modal-close" style={{position:"absolute",top:"1rem",right:"1rem",background:"rgba(255,255,255,0.15)",color:"#fff"}} onClick={onClose}>✕</button>

        <form onSubmit={submit}>
          <div style={{padding:"1.5rem 1.8rem 2rem"}}>

            <div className="divider">Choose Trial Type</div>
            <div className="trial-type-grid" style={{marginBottom:"1.3rem"}}>
              <div className={`trial-type-card ${trialType==="home"?"selected":""}`} onClick={()=>setTrialType("home")}>
                <span className="ttype-icon">🏠</span>
                <span className="ttype-label">Home Trial</span>
                <span className="ttype-sub">We deliver to your door</span>
              </div>
              <div className={`trial-type-card ${trialType==="store"?"selected":""}`} onClick={()=>setTrialType("store")}>
                <span className="ttype-icon">🏪</span>
                <span className="ttype-label">Store Visit</span>
                <span className="ttype-sub">Try at our location</span>
              </div>
            </div>

            <div className="divider">Date & Time</div>
            <div className="form-row" style={{marginBottom:"1rem"}}>
              <div className="form-group" style={{margin:0}}>
                <label className="form-label">Preferred Date</label>
                <input className="form-control" type="date" min={today} value={form.date} onChange={set("date")} required/>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label className="form-label">Duration</label>
                <select className="form-control" value={form.duration} onChange={set("duration")}>
                  <option>30 minutes</option><option>1 hour</option><option>2 hours</option><option>Half day</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Time Slot</label>
              <div className="slot-grid">
                {SLOTS.map(s=>(
                  <button key={s} type="button" className={`slot-btn ${slot===s?"selected":""}`} onClick={()=>setSlot(s)}>{s}</button>
                ))}
              </div>
            </div>

            {trialType==="home" && <>
              <div className="divider">Delivery Address</div>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input className="form-control" placeholder="e.g. 42, MG Road, Sector 5" value={form.street} onChange={set("street")} required/>
              </div>
              <div className="form-row">
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">City</label>
                  <input className="form-control" placeholder="Bhopal" value={form.city} onChange={set("city")} required/>
                </div>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">PIN Code</label>
                  <input className="form-control" placeholder="462001" value={form.pin} onChange={set("pin")} required/>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Landmark (optional)</label>
                <input className="form-control" placeholder="Near City Mall" value={form.landmark} onChange={set("landmark")}/>
              </div>
            </>}

            <div className="divider">Your Contact</div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-control" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")}/>
            </div>

            <button className="btn btn-primary btn-full btn-lg" disabled={loading} style={{marginTop:"0.5rem"}}>
              {loading?"Booking…":"Confirm Trial Booking →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
