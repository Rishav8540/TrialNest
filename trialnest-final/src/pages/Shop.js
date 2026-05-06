// src/pages/Shop.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { productsDB, cartDB } from "../db";
import BookingModal from "../components/buyer/BookingModal";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Shop() {
  const { currentUser, userProfile } = useAuth();
  const navigate  = useNavigate();
  const [products, setProducts] = useState([]);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  function refresh() {
    setProducts(productsDB.getAll());
    if (currentUser) setCartCount(cartDB.getCount(currentUser.uid));
  }

  useEffect(() => { refresh(); }, [selected, currentUser]);

  const categories = ["All", ...new Set(products.map(p=>p.category).filter(Boolean))];
  const filtered = products.filter(p => {
    const matchCat  = category==="All" || p.category===category;
    const matchText = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchText;
  });

  function addToCart(p) {
    if (!currentUser) return navigate("/login");
    if (!p.inStock)   return toast.error("This product is out of stock.");
    cartDB.addToCart(currentUser.uid, p, 1);
    setCartCount(cartDB.getCount(currentUser.uid));
    toast.success(`${p.name} added to cart! 🛒`);
  }

  function openBooking(p) {
    if (!currentUser)              return navigate("/login");
    if (userProfile?.role==="seller") return;
    if (!p.inStock) return toast.error("This product is out of stock.");
    setSelected(p);
  }

  return (
    <>
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-eyebrow" style={{color:"var(--gold-light)"}}>Try Before You Buy</div>
          <h1 className="section-title" style={{color:"var(--paper)",marginBottom:"1rem"}}>
            Experience it first.<br/>
            <em style={{color:"var(--gold-light)"}}>Then decide.</em>
          </h1>
          <p style={{fontSize:"0.95rem",color:"rgba(250,249,246,0.6)",maxWidth:480,lineHeight:1.7,marginBottom:"2rem"}}>
            Browse products, book a home trial or store visit, add to cart — buy only if you love it.
          </p>
          {!currentUser ? (
            <div style={{display:"flex",gap:"0.8rem",flexWrap:"wrap"}}>
              <Link to="/register" className="btn btn-gold btn-lg">Get Started Free →</Link>
              <Link to="/login"    className="btn btn-lg" style={{borderColor:"rgba(255,255,255,0.3)",color:"var(--paper)",background:"transparent",border:"1.5px solid rgba(255,255,255,0.25)"}}>Sign In</Link>
            </div>
          ) : userProfile?.role==="buyer" && (
            <Link to="/cart" className="btn btn-gold btn-lg">
              🛒 My Cart {cartCount>0&&`(${cartCount})`}
            </Link>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="container" style={{padding:"2.5rem 1.5rem"}}>
        {/* Filters */}
        <div style={{display:"flex",gap:"1rem",marginBottom:"2rem",flexWrap:"wrap",alignItems:"center"}}>
          <input className="form-control" style={{maxWidth:280}}
            placeholder="🔍  Search products…"
            value={search} onChange={e=>setSearch(e.target.value)}/>
          <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
            {categories.map(c=>(
              <button key={c} className={`btn btn-sm ${category===c?"btn-primary":"btn-outline"}`} onClick={()=>setCategory(c)}>{c}</button>
            ))}
          </div>
          <span style={{marginLeft:"auto",fontFamily:"var(--mono)",fontSize:"0.72rem",color:"#aaa"}}>
            {filtered.length} product{filtered.length!==1?"s":""}
          </span>
        </div>

        {filtered.length===0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛍️</div>
            <h3>No products found</h3>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((p,i)=>(
              <div key={p.id} className={`product-card fade-in fade-in-${(i%4)+1}`} style={{opacity:p.inStock?1:0.75}}>
                <div className="product-img" style={{background:"var(--ink)",position:"relative"}}>
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    : <span style={{fontSize:"5rem"}}>{p.emoji||"📦"}</span>
                  }
                  {p.inStock
                    ? <div className="product-trial-badge">Trial Available</div>
                    : <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"0.3rem"}}>
                        <span style={{fontSize:"2rem"}}>🚫</span>
                        <span style={{color:"#fff",fontWeight:800,fontSize:"0.85rem",letterSpacing:"0.05em"}}>OUT OF STOCK</span>
                      </div>
                  }
                </div>
                <div className="product-body">
                  <div className="product-category">{p.category}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-desc">{p.description}</div>
                  <div style={{fontSize:"0.74rem",color:"#aaa",marginBottom:"0.8rem",fontFamily:"var(--mono)"}}>By {p.sellerName}</div>
                  <div className="product-footer" style={{flexDirection:"column",gap:"0.6rem",alignItems:"stretch"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div className="product-price">₹{Number(p.price).toLocaleString("en-IN")}</div>
                      {!p.inStock && <span className="badge badge-rejected">Out of Stock</span>}
                    </div>
                    {userProfile?.role!=="seller" && (
                      <div style={{display:"flex",gap:"0.5rem"}}>
                        <button className="btn btn-outline btn-sm" style={{flex:1}} onClick={()=>addToCart(p)} disabled={!p.inStock}>
                          🛒 Add to Cart
                        </button>
                        <button className="btn btn-primary btn-sm" style={{flex:1}} onClick={()=>openBooking(p)} disabled={!p.inStock}>
                          Book Trial
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && <BookingModal product={selected} onClose={()=>setSelected(null)}/>}
    </>
  );
}
