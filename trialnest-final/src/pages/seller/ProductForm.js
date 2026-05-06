import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productsDB, fileToBase64 } from "../../db";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const CATEGORIES = ["Electronics","Fashion","Footwear","Home Appliance","Kitchen","Furniture","Sports","Books","Beauty","Toys","Other"];
const EMOJIS = ["📦","🎧","👟","👕","📷","🌀","🍰","📱","💻","🎮","🪑","🔧","💄","👖","🎒"];

export default function ProductForm() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const fileRef = useRef();
  const [form, setForm] = useState({ name:"", category:"Electronics", description:"", price:"", condition:"New", trialDuration:"1 hour", emoji:"📦", stockCount:10 });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  useEffect(()=>{
    if(!isEdit) return;
    const p = productsDB.getById(id);
    if(!p) return;
    setForm({ name:p.name, category:p.category, description:p.description, price:p.price, condition:p.condition||"New", trialDuration:p.trialDuration||"1 hour", emoji:p.emoji||"📦", stockCount:p.stockCount||10 });
    setImages(p.images||[]);
  },[id,isEdit]);

  async function addFiles(files) {
    const valid = Array.from(files).filter(f=>f.type.startsWith("image/")).slice(0,6-images.length);
    for(const file of valid) { const b64 = await fileToBase64(file); setImages(prev=>[...prev,b64]); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if(!form.name.trim()) return toast.error("Product name required.");
    if(!form.price||isNaN(form.price)) return toast.error("Enter valid price.");
    if(images.length===0) return toast.error("Add at least one image.");
    setLoading(true);
    setTimeout(()=>{
      const data = { ...form, price:Number(form.price), images, sellerId:currentUser.uid, sellerName:userProfile.name };
      if(isEdit) { productsDB.update(id,data); toast.success("Product updated!"); }
      else       { productsDB.add(data); toast.success("Product listed! 🎉"); }
      navigate("/seller/products");
      setLoading(false);
    }, 800);
  }

  return (
    <div style={{maxWidth:660}}>
      <div className="dash-topbar" style={{marginBottom:"1.5rem"}}>
        <div><div className="dash-title">{isEdit?"Edit Product":"Add New Product"}</div><div className="dash-subtitle">{isEdit?"Update product details":"List a product for trial bookings"}</div></div>
        <button className="btn btn-outline btn-sm" onClick={()=>navigate("/seller/products")}>← Back</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="card" style={{marginBottom:"1.2rem"}}>
          <div style={{fontWeight:700,marginBottom:"1rem"}}>Product Images *</div>
          <div className={`upload-zone ${drag?"drag-over":""}`} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);addFiles(e.dataTransfer.files);}} onClick={()=>fileRef.current?.click()}>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>addFiles(e.target.files)}/>
            <div style={{fontSize:"2rem",marginBottom:"0.4rem"}}>📸</div>
            <div style={{fontWeight:600,fontSize:"0.88rem"}}>Drop images or click to upload</div>
            <div style={{fontSize:"0.74rem",color:"#aaa",marginTop:"0.25rem"}}>PNG, JPG · Max 6 images</div>
          </div>
          {images.length>0&&(<div className="upload-preview">{images.map((img,i)=>(<div key={i} className="upload-thumb"><img src={img} alt=""/><button type="button" className="upload-thumb-remove" onClick={()=>setImages(p=>p.filter((_,j)=>j!==i))}>✕</button></div>))}</div>)}
        </div>
        <div className="card" style={{marginBottom:"1.2rem"}}>
          <div style={{fontWeight:700,marginBottom:"1rem"}}>Product Details</div>
          <div className="form-row"><div className="form-group" style={{margin:0}}><label className="form-label">Product Name *</label><input className="form-control" placeholder="e.g. Sony WH-1000XM5" value={form.name} onChange={set("name")} required/></div><div className="form-group" style={{margin:0}}><label className="form-label">Category *</label><select className="form-control" value={form.category} onChange={set("category")}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div></div>
          <div className="form-group"><label className="form-label">Description *</label><textarea className="form-control" placeholder="Describe your product…" value={form.description} onChange={set("description")} required/></div>
          <div className="form-row"><div className="form-group" style={{margin:0}}><label className="form-label">Price (₹) *</label><input className="form-control" type="number" placeholder="29990" value={form.price} onChange={set("price")} min={1} required/></div><div className="form-group" style={{margin:0}}><label className="form-label">Stock Count</label><input className="form-control" type="number" value={form.stockCount} onChange={set("stockCount")} min={0}/></div></div>
          <div className="form-row"><div className="form-group" style={{margin:0}}><label className="form-label">Condition</label><select className="form-control" value={form.condition} onChange={set("condition")}>{["New","Like New","Good","Fair"].map(c=><option key={c}>{c}</option>)}</select></div><div className="form-group" style={{margin:0}}><label className="form-label">Trial Duration</label><select className="form-control" value={form.trialDuration} onChange={set("trialDuration")}>{["30 minutes","1 hour","2 hours","Half day","Full day"].map(d=><option key={d}>{d}</option>)}</select></div></div>
          <div className="form-group"><label className="form-label">Emoji (fallback icon)</label><select className="form-control" value={form.emoji} onChange={set("emoji")}>{EMOJIS.map(e=><option key={e} value={e}>{e}</option>)}</select></div>
        </div>
        <button className="btn btn-primary btn-lg btn-full" disabled={loading}>{loading?<><div className="spinner" style={{width:18,height:18,borderWidth:2}}/>Saving…</>:`${isEdit?"Update":"List"} Product →`}</button>
      </form>
    </div>
  );
}
