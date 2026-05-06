import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsDB } from "../../db";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function SellerProducts() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  function refresh() { setProducts(productsDB.getBySeller(currentUser.uid)); }
  useEffect(()=>{ refresh(); },[]);

  function handleDelete(p) {
    if(!window.confirm(`Delete "${p.name}"?`)) return;
    productsDB.delete(p.id); toast.success("Deleted."); refresh();
  }
  function toggleStock(p) {
    productsDB.toggleStock(p.id);
    toast.success(p.inStock?`"${p.name}" marked Out of Stock`:`"${p.name}" is In Stock!`);
    refresh();
  }

  const inStock = products.filter(p=>p.inStock).length;
  const outOfStock = products.filter(p=>!p.inStock).length;

  return (
    <div>
      <div className="dash-topbar">
        <div><div className="dash-title">My Products</div><div className="dash-subtitle" style={{display:"flex",alignItems:"center",gap:"0.8rem",flexWrap:"wrap"}}><span>{products.length} total</span>{inStock>0&&<span className="badge badge-accepted">✅ {inStock} In Stock</span>}{outOfStock>0&&<span className="badge badge-rejected">🚫 {outOfStock} Out of Stock</span>}</div></div>
        <Link to="/seller/products/new" className="btn btn-primary">+ Add Product</Link>
      </div>
      {products.length===0?(<div className="empty-state"><div className="empty-state-icon">📦</div><h3>No products yet</h3><Link to="/seller/products/new" className="btn btn-primary" style={{marginTop:"1rem"}}>Add First Product</Link></div>):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"1.2rem"}}>
          {products.map(p=>(
            <div key={p.id} className="card" style={{padding:0,overflow:"hidden",opacity:p.inStock?1:0.82}}>
              <div style={{height:170,background:"var(--cream)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
                {p.images?.[0]?<img src={p.images[0]} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:"4rem"}}>{p.emoji||"📦"}</span>}
                {!p.inStock&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{background:"var(--red)",color:"#fff",fontWeight:800,fontSize:"0.8rem",padding:"0.4rem 0.9rem",borderRadius:4}}>🚫 OUT OF STOCK</span></div>}
                <div style={{position:"absolute",top:8,right:8,display:"flex",gap:4}}>
                  <Link to={`/seller/products/edit/${p.id}`} className="btn btn-sm btn-outline" style={{background:"rgba(255,255,255,0.92)",fontSize:"0.7rem",padding:"0.3rem 0.6rem"}}>✏️</Link>
                  <button className="btn btn-sm btn-red" style={{background:"rgba(255,255,255,0.92)",fontSize:"0.7rem",padding:"0.3rem 0.6rem"}} onClick={()=>handleDelete(p)}>🗑️</button>
                </div>
              </div>
              <div style={{padding:"1.1rem 1.2rem"}}>
                <div style={{fontFamily:"var(--mono)",fontSize:"0.6rem",letterSpacing:"0.1em",textTransform:"uppercase",color:"#aaa",marginBottom:"0.2rem"}}>{p.category}</div>
                <div style={{fontWeight:700,fontSize:"0.95rem",marginBottom:"0.3rem"}}>{p.name}</div>
                <div style={{fontSize:"0.75rem",color:"#888",lineHeight:1.5,marginBottom:"0.8rem"}}>{p.description?.substring(0,70)}{p.description?.length>70?"…":""}</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.8rem"}}><div style={{fontWeight:800,fontSize:"1rem"}}>₹{Number(p.price).toLocaleString("en-IN")}</div><div style={{fontSize:"0.72rem",color:"#aaa",fontFamily:"var(--mono)"}}>Stock: {p.stockCount||0}</div></div>
                <button onClick={()=>toggleStock(p)} className={`btn btn-full btn-sm ${p.inStock?"btn-red":"btn-green"}`}>{p.inStock?"🚫 Mark Out of Stock":"✅ Mark In Stock"}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
