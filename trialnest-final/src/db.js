// src/db.js — Full localStorage database (no backend needed)
const KEYS = {
  users:"tn_users", products:"tn_products", requests:"tn_requests",
  notifs:"tn_notifs", session:"tn_session", cart:"tn_cart", orders:"tn_orders",
};

function read(key)        { try { return JSON.parse(localStorage.getItem(key))||[]; } catch { return []; } }
function write(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
function uid()            { return Math.random().toString(36).slice(2)+Date.now().toString(36); }

// ─── AUTH ───
export const authDB = {
  signup(name, email, password, role, extra={}) {
    const users = read(KEYS.users);
    if (users.find(u=>u.email===email)) throw new Error("Email already registered.");
    const user = { uid:uid(), name, email, password, role, createdAt:new Date().toISOString(), paymentInfo:{}, ...extra };
    write(KEYS.users, [...users, user]);
    write(KEYS.session, user);
    return user;
  },
  login(email, password) {
    const user = read(KEYS.users).find(u=>u.email===email&&u.password===password);
    if (!user) throw new Error("Invalid email or password.");
    write(KEYS.session, user);
    return user;
  },
  logout()    { localStorage.removeItem(KEYS.session); },
  getSession(){ try { return JSON.parse(localStorage.getItem(KEYS.session)); } catch { return null; } },
  updateUser(uid, data) {
    const users = read(KEYS.users).map(u=>u.uid===uid?{...u,...data}:u);
    write(KEYS.users, users);
    const session = read(KEYS.session);
    if (session?.uid===uid) write(KEYS.session, {...session,...data});
    return users.find(u=>u.uid===uid);
  },
};

// ─── PRODUCTS ───
export const productsDB = {
  getAll()        { return read(KEYS.products).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)); },
  getBySeller(id) { return productsDB.getAll().filter(p=>p.sellerId===id); },
  getById(id)     { return productsDB.getAll().find(p=>p.id===id)||null; },
  add(data) {
    const p = { ...data, id:uid(), createdAt:new Date().toISOString(), inStock:true };
    write(KEYS.products, [...read(KEYS.products), p]);
    return p;
  },
  update(id, data) {
    write(KEYS.products, read(KEYS.products).map(p=>p.id===id?{...p,...data,updatedAt:new Date().toISOString()}:p));
  },
  delete(id) { write(KEYS.products, read(KEYS.products).filter(p=>p.id!==id)); },
  toggleStock(id) {
    const p = productsDB.getById(id);
    if (p) productsDB.update(id, { inStock:!p.inStock });
  },
};

// ─── CART ───
export const cartDB = {
  getCart(userId)   { return read(KEYS.cart).filter(c=>c.userId===userId); },
  getCount(userId)  { return cartDB.getCart(userId).reduce((s,c)=>s+c.qty,0); },
  addToCart(userId, product, qty=1) {
    const all = read(KEYS.cart);
    const idx = all.findIndex(c=>c.userId===userId&&c.productId===product.id);
    if (idx>-1) { all[idx].qty+=qty; write(KEYS.cart, all); }
    else write(KEYS.cart, [...all, { id:uid(), userId, productId:product.id, productName:product.name, productPrice:product.price, productEmoji:product.emoji, productImage:product.images?.[0]||null, sellerName:product.sellerName, sellerId:product.sellerId, qty, addedAt:new Date().toISOString() }]);
  },
  updateQty(userId, productId, qty) {
    if (qty<=0) return cartDB.removeFromCart(userId, productId);
    write(KEYS.cart, read(KEYS.cart).map(c=>c.userId===userId&&c.productId===productId?{...c,qty}:c));
  },
  removeFromCart(userId, productId) { write(KEYS.cart, read(KEYS.cart).filter(c=>!(c.userId===userId&&c.productId===productId))); },
  clearCart(userId) { write(KEYS.cart, read(KEYS.cart).filter(c=>c.userId!==userId)); },
};

// ─── ORDERS ───
export const ordersDB = {
  getAll()        { return read(KEYS.orders).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)); },
  getByBuyer(uid) { return ordersDB.getAll().filter(o=>o.buyerId===uid); },
  getBySeller(uid){ return ordersDB.getAll().filter(o=>o.items?.some(i=>i.sellerId===uid)); },
  place(data) {
    const o = { ...data, id:uid(), orderId:"ORD-"+uid().toUpperCase().slice(0,8), createdAt:new Date().toISOString(), status:"confirmed" };
    write(KEYS.orders, [...read(KEYS.orders), o]);
    return o;
  },
  updateStatus(id, status) { write(KEYS.orders, read(KEYS.orders).map(o=>o.id===id?{...o,status}:o)); },
};

// ─── REQUESTS ───
export const requestsDB = {
  getAll()        { return read(KEYS.requests).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)); },
  getByBuyer(uid) { return requestsDB.getAll().filter(r=>r.buyerId===uid); },
  getBySeller(uid){ return requestsDB.getAll().filter(r=>r.sellerId===uid); },
  add(data) {
    const r = { ...data, id:uid(), createdAt:new Date().toISOString() };
    write(KEYS.requests, [...read(KEYS.requests), r]);
    return r;
  },
  update(id, data) { write(KEYS.requests, read(KEYS.requests).map(r=>r.id===id?{...r,...data}:r)); },
};

// ─── NOTIFICATIONS ───
export const notifsDB = {
  getForUser(uid) { return read(KEYS.notifs).filter(n=>n.userId===uid).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)); },
  add(data)       { write(KEYS.notifs, [...read(KEYS.notifs), { ...data, id:uid(), read:false, createdAt:new Date().toISOString() }]); },
  markRead(id)    { write(KEYS.notifs, read(KEYS.notifs).map(n=>n.id===id?{...n,read:true}:n)); },
  markAllRead(uid){ write(KEYS.notifs, read(KEYS.notifs).map(n=>n.userId===uid?{...n,read:true}:n)); },
};

// ─── IMAGE ───
export function fileToBase64(file) {
  return new Promise((resolve,reject)=>{ const r=new FileReader(); r.onload=e=>resolve(e.target.result); r.onerror=reject; r.readAsDataURL(file); });
}

// ─── SEED DEMO DATA ───
export function seedDemoData() {
  if (localStorage.getItem("tn_seeded3")) return;
  const seller = { uid:"seller_demo", name:"Arjun Sharma", email:"seller@demo.com", password:"demo123", role:"seller", createdAt:new Date().toISOString(),
    paymentInfo:{ upiId:"arjun@paytm", gpayNumber:"9876543210", phonePeNum:"9876543210", paytmNumber:"9876543210", accountName:"Arjun Sharma", bankName:"SBI", accountNo:"1234567890", ifscCode:"SBIN0001234", qrCodeImage:"" }
  };
  const buyer = { uid:"buyer_demo", name:"Priya Singh", email:"buyer@demo.com", password:"demo123", role:"buyer", createdAt:new Date().toISOString(), paymentInfo:{} };
  write(KEYS.users, [seller, buyer]);
  write(KEYS.products, [
    { id:"p1", name:"Sony WH-1000XM5",   category:"Electronics",   price:29990, description:"Premium noise-cancelling wireless headphones with 30hr battery.", emoji:"🎧", images:[], sellerId:"seller_demo", sellerName:"Arjun Sharma", condition:"New", trialDuration:"1 hour",    inStock:true,  stockCount:8,  createdAt:new Date().toISOString() },
    { id:"p2", name:"Nike Air Max 270",   category:"Footwear",      price:12995, description:"Lightweight running shoe with Max Air cushioning for all-day comfort.", emoji:"👟", images:[], sellerId:"seller_demo", sellerName:"Arjun Sharma", condition:"New", trialDuration:"30 minutes",inStock:true,  stockCount:15, createdAt:new Date().toISOString() },
    { id:"p3", name:"Dyson V15 Detect",  category:"Home Appliance", price:54900, description:"Intelligent vacuum with laser dust detection and HEPA filtration.", emoji:"🌀", images:[], sellerId:"seller_demo", sellerName:"Arjun Sharma", condition:"New", trialDuration:"2 hours",   inStock:false, stockCount:0,  createdAt:new Date().toISOString() },
    { id:"p4", name:"Levi's 511 Slim",   category:"Fashion",       price:3999,  description:"Classic slim fit stretch denim jeans for everyday wear.", emoji:"👖", images:[], sellerId:"seller_demo", sellerName:"Arjun Sharma", condition:"New", trialDuration:"30 minutes",inStock:true,  stockCount:25, createdAt:new Date().toISOString() },
    { id:"p5", name:"KitchenAid Mixer",  category:"Kitchen",       price:38500, description:"5.5Qt tilt-head stand mixer — perfect for baking enthusiasts.", emoji:"🍰", images:[], sellerId:"seller_demo", sellerName:"Arjun Sharma", condition:"New", trialDuration:"2 hours",   inStock:true,  stockCount:4,  createdAt:new Date().toISOString() },
    { id:"p6", name:"Nikon Z50 Camera",  category:"Photography",   price:67995, description:"Compact mirrorless 20.9MP camera with 4K video and fast autofocus.", emoji:"📷", images:[], sellerId:"seller_demo", sellerName:"Arjun Sharma", condition:"New", trialDuration:"Half day",  inStock:true,  stockCount:3,  createdAt:new Date().toISOString() },
  ]);
  localStorage.setItem("tn_seeded3","1");
}
