import React, { useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { fileToBase64 } from "../../db";
import toast from "react-hot-toast";

export default function SellerPaymentSettings() {
  const { currentUser, updateUser } = useAuth();
  const pi = currentUser?.paymentInfo || {};
  const fileRef = useRef();
  const [form, setForm] = useState({ upiId:pi.upiId||"", gpayNumber:pi.gpayNumber||"", phonePeNum:pi.phonePeNum||"", paytmNumber:pi.paytmNumber||"", accountName:pi.accountName||"", bankName:pi.bankName||"", accountNo:pi.accountNo||"", ifscCode:pi.ifscCode||"" });
  const [qrPreview, setQrPreview] = useState(pi.qrCodeImage||"");
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  async function handleQrChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setQrPreview(b64);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(()=>{
      updateUser({ paymentInfo:{ ...form, qrCodeImage:qrPreview } });
      toast.success("Payment info saved! ✅");
      setLoading(false);
    }, 800);
  }

  return (
    <div style={{maxWidth:640}}>
      <div className="dash-topbar" style={{marginBottom:"1.5rem"}}>
        <div><div className="dash-title">Payment Settings</div><div className="dash-subtitle">Buyers will use these details to pay you after purchase.</div></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="card" style={{marginBottom:"1.2rem"}}>
          <div style={{fontWeight:800,fontSize:"1rem",marginBottom:"1.2rem"}}>📱 UPI Payment Details</div>
          <div className="form-group"><label className="form-label">Primary UPI ID</label><input className="form-control" placeholder="yourname@paytm" value={form.upiId} onChange={set("upiId")}/><div className="form-hint">e.g. rishabh@paytm or 9876543210@ybl</div></div>
          <div className="form-row">
            <div className="form-group" style={{margin:0}}><label className="form-label">GPay Number</label><input className="form-control" placeholder="9876543210" value={form.gpayNumber} onChange={set("gpayNumber")}/></div>
            <div className="form-group" style={{margin:0}}><label className="form-label">PhonePe Number</label><input className="form-control" placeholder="9876543210" value={form.phonePeNum} onChange={set("phonePeNum")}/></div>
          </div>
          <div className="form-group"><label className="form-label">Paytm Number</label><input className="form-control" placeholder="9876543210" value={form.paytmNumber} onChange={set("paytmNumber")}/></div>
        </div>
        <div className="card" style={{marginBottom:"1.2rem"}}>
          <div style={{fontWeight:800,fontSize:"1rem",marginBottom:"1.2rem"}}>📷 Payment QR Code</div>
          <p style={{fontSize:"0.82rem",color:"#888",marginBottom:"1rem"}}>Upload your UPI QR code. Buyers can scan it to pay you directly.</p>
          <div style={{display:"flex",alignItems:"flex-start",gap:"1.5rem",flexWrap:"wrap"}}>
            {qrPreview&&<div style={{textAlign:"center"}}><img src={qrPreview} alt="QR" style={{width:150,height:150,objectFit:"contain",border:"1px solid var(--border)",borderRadius:8,padding:8,background:"#fff"}}/><div style={{fontSize:"0.7rem",color:"#aaa",marginTop:"0.3rem"}}>Current QR</div></div>}
            <div style={{flex:1}}>
              <div className="upload-zone" onClick={()=>fileRef.current?.click()} style={{minHeight:100}}>
                <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleQrChange}/>
                <div style={{fontSize:"1.5rem",marginBottom:"0.3rem"}}>📸</div>
                <div style={{fontWeight:600,fontSize:"0.85rem"}}>{qrPreview?"Change QR Code":"Upload QR Code"}</div>
                <div style={{fontSize:"0.72rem",color:"#aaa",marginTop:"0.2rem"}}>PNG or JPG</div>
              </div>
            </div>
          </div>
        </div>
        <div className="card" style={{marginBottom:"1.2rem"}}>
          <div style={{fontWeight:800,fontSize:"1rem",marginBottom:"1.2rem"}}>🏦 Bank Account Details</div>
          <div className="form-row">
            <div className="form-group" style={{margin:0}}><label className="form-label">Account Holder Name</label><input className="form-control" placeholder="Rishabh Kumar Gupta" value={form.accountName} onChange={set("accountName")}/></div>
            <div className="form-group" style={{margin:0}}><label className="form-label">Bank Name</label><input className="form-control" placeholder="SBI / HDFC" value={form.bankName} onChange={set("bankName")}/></div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{margin:0}}><label className="form-label">Account Number</label><input className="form-control" placeholder="XXXX XXXX XXXX" value={form.accountNo} onChange={set("accountNo")}/></div>
            <div className="form-group" style={{margin:0}}><label className="form-label">IFSC Code</label><input className="form-control" placeholder="SBIN0001234" value={form.ifscCode} onChange={set("ifscCode")}/></div>
          </div>
        </div>
        {(form.upiId||qrPreview)&&(
          <div className="card" style={{marginBottom:"1.2rem",background:"#fffbf0",border:"1px solid #ffe066"}}>
            <div style={{fontWeight:700,marginBottom:"0.8rem",fontSize:"0.88rem"}}>👁 Preview — What buyers see at checkout:</div>
            <div style={{display:"flex",gap:"1rem",flexWrap:"wrap",alignItems:"flex-start"}}>
              {qrPreview&&<img src={qrPreview} alt="QR" style={{width:100,height:100,objectFit:"contain",background:"#fff",padding:6,borderRadius:6,border:"1px solid var(--border)"}}/>}
              <div style={{fontSize:"0.83rem",lineHeight:2}}>
                {form.upiId&&<div>📱 <strong>UPI:</strong> {form.upiId}</div>}
                {form.gpayNumber&&<div>💚 <strong>GPay:</strong> {form.gpayNumber}</div>}
                {form.phonePeNum&&<div>💜 <strong>PhonePe:</strong> {form.phonePeNum}</div>}
                {form.accountNo&&<div>🏦 <strong>A/c:</strong> {form.accountNo} · {form.bankName}</div>}
              </div>
            </div>
          </div>
        )}
        <button className="btn btn-primary btn-full btn-lg" disabled={loading}>{loading?<><div className="spinner" style={{width:18,height:18,borderWidth:2}}/>Saving…</>:"Save Payment Info →"}</button>
      </form>
    </div>
  );
}
