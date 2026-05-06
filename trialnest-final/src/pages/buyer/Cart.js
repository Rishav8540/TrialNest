import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartDB } from "../../db";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function Cart() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  function refresh() { setItems(cartDB.getCart(currentUser.uid)); }
  useEffect(()=>{ refresh(); },[]);

  function updateQty(productId, qty) { cartDB.updateQty(currentUser.uid, productId, qty); refresh(); }
  function remove(productId) { cartDB.removeFromCart(currentUser.uid, productId); toast.success("Removed!"); refresh(); }

  const subtotal = items.reduce((s,i)=>s+(i.productPrice*i.qty),0);
  const shipping = subtotal>499?0:49;
  const total    = subtotal+shipping;

  return (
    <div className="container" style={{padding:"2.5rem 1.5rem"}}>
      <div style={{marginBottom:"2rem"}}>
        <h1 style={{fontFamily:"var(--serif)",fontStyle:"italic",fontSize:"2rem"}}>Shopping Cart</h1>
        <p style={{color:"#888",fontSize:"0.83rem",marginTop:"0.3rem"}}>{items.length===0?"Your cart is empty.":`${items.reduce((s,i)=>s+i.qty,0)} item(s)`}</p>
      </div>
      {items.length===0?(
        <div className="empty-state"><div className="empty-state-icon">🛒</div><h3>Cart is empty</h3><p>Browse and add products.</p><Link to="/shop" className="btn btn-primary" style={{marginTop:"1rem"}}>Browse Products</Link></div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:"2rem",alignItems:"start"}}>
          <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            {items.map(item=>(
              <div key={item.id} className="card" style={{display:"flex",gap:"1.2rem",alignItems:"center",padding:"1.2rem"}}>
                <div style={{width:80,height:80,borderRadius:8,overflow:"hidden",background:"var(--cream)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {item.productImage?<img src={item.productImage} alt={item.productName} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:"2.5rem"}}>{item.productEmoji||"📦"}</span>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:"0.95rem",marginBottom:"0.2rem"}}>{item.productName}</div>
                  <div style={{fontSize:"0.74rem",color:"#aaa",fontFamily:"var(--mono)"}}>by {item.sellerName}</div>
                  <div style={{fontWeight:800,fontSize:"1rem",marginTop:"0.3rem"}}>₹{Number(item.productPrice).toLocaleString("en-IN")}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                  <button className="btn btn-outline btn-icon btn-sm" onClick={()=>updateQty(item.productId,item.qty-1)}>−</button>
                  <span style={{fontWeight:700,minWidth:24,textAlign:"center"}}>{item.qty}</span>
                  <button className="btn btn-outline btn-icon btn-sm" onClick={()=>updateQty(item.productId,item.qty+1)}>+</button>
                </div>
                <div style={{fontWeight:800,minWidth:90,textAlign:"right"}}>₹{Number(item.productPrice*item.qty).toLocaleString("en-IN")}</div>
                <button className="btn btn-ghost btn-icon btn-sm" style={{color:"var(--red)"}} onClick={()=>remove(item.productId)}>🗑️</button>
              </div>
            ))}
          </div>
          <div className="card" style={{position:"sticky",top:80}}>
            <div style={{fontWeight:800,fontSize:"1.1rem",marginBottom:"1.5rem"}}>Order Summary</div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.8rem",marginBottom:"1.2rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.85rem"}}><span style={{color:"#888"}}>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.85rem"}}><span style={{color:"#888"}}>Shipping</span><span style={{color:shipping===0?"var(--green)":"var(--ink)"}}>{shipping===0?"FREE":"₹"+shipping}</span></div>
              <div style={{height:1,background:"var(--border)"}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"1rem"}}><span style={{fontWeight:800}}>Total</span><span style={{fontWeight:900}}>₹{total.toLocaleString("en-IN")}</span></div>
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={()=>navigate("/checkout",{state:{items,subtotal,shipping,total}})}>Proceed to Checkout →</button>
            <Link to="/shop" className="btn btn-ghost btn-full btn-sm" style={{marginTop:"0.6rem",textAlign:"center"}}>← Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}
