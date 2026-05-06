# TrialNest — Try Before You Buy Platform

> A full-stack web application built with **React + Firebase** that lets buyers trial products at home or in-store before purchasing, while sellers manage listings and requests through a real-time dashboard.

---

## 🚀 Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, React Router v6, CSS3                 |
| Backend    | Firebase (serverless — no Node server needed)   |
| Database   | Firebase Firestore (real-time NoSQL)            |
| Storage    | Firebase Storage (product image uploads)        |
| Auth       | Firebase Authentication (Email/Password)        |
| Hosting    | Firebase Hosting / Vercel / Netlify             |

> **Note on Node.js / WebSockets / WebRTC / Agora:**
> This project uses Firebase's real-time listeners (onSnapshot) in place of raw WebSockets — they provide the same live-update capability without a custom server. If you want to add live video product demos, you can integrate Agora Web SDK into the ProductDetail page.

---

## 📁 Project Structure

```
trialnest/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── buyer/
│   │   │   └── BookingModal.js     # Trial booking form (date, slot, address)
│   │   └── shared/
│   │       ├── Navbar.js           # Navigation + real-time notifications
│   │       └── ProtectedRoute.js   # Role-based route guards
│   ├── contexts/
│   │   └── AuthContext.js          # Auth state, signup, login, logout
│   ├── pages/
│   │   ├── Landing.js              # Public homepage
│   │   ├── Login.js                # Sign in page
│   │   ├── Register.js             # Sign up with role selector
│   │   ├── Shop.js                 # Product browsing for buyers
│   │   ├── MyTrials.js             # Buyer's trial requests + buy/cancel
│   │   └── seller/
│   │       ├── SellerLayout.js     # Sidebar dashboard wrapper
│   │       ├── SellerDashboard.js  # Stats overview
│   │       ├── SellerProducts.js   # Product listing management
│   │       ├── ProductForm.js      # Add / Edit product with image upload
│   │       └── SellerRequests.js   # Accept / Reject trial requests
│   ├── firebase.js                 # Firebase config + exports
│   ├── App.js                      # Routes
│   ├── index.js                    # Entry point
│   └── index.css                   # Full design system
├── firestore.rules                 # Security rules
├── .env.example                    # Environment variable template
└── package.json
```

---

## ⚙️ Setup Instructions

### Step 1 — Clone and Install

```bash
git clone https://github.com/yourname/trialnest.git
cd trialnest
npm install
```

### Step 2 — Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add Project"** → name it `trialnest`
3. In Project Settings → **"Add App"** → Web → Register
4. Copy the `firebaseConfig` object

### Step 3 — Enable Firebase Services

In Firebase Console:

| Service | Steps |
|---------|-------|
| **Authentication** | Build → Authentication → Sign-in method → Enable **Email/Password** |
| **Firestore** | Build → Firestore Database → Create database → Start in **test mode** |
| **Storage** | Build → Storage → Get started → Start in **test mode** |

### Step 4 — Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and paste your Firebase values:

```env
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123:web:abc
```

### Step 5 — Run Locally

```bash
npm start
# Opens at http://localhost:3000
```

---

## 🔥 Firestore Collections

| Collection       | Description                                        |
|------------------|----------------------------------------------------|
| `users`          | User profiles with `role: "buyer" \| "seller"`     |
| `products`       | Product listings with images, price, sellerId      |
| `trialRequests`  | Booking requests with status, slot, address        |
| `notifications`  | Real-time alerts for buyers and sellers            |

### Key Fields — `trialRequests`

```js
{
  productId, productName, productPrice, productImage,
  sellerId, sellerName,
  buyerId, buyerName, buyerPhone,
  trialType: "home" | "store",
  date, slot, duration, address,
  status: "pending" | "accepted" | "rejected",
  buyerDecision: null | "bought" | "cancelled",
  createdAt, updatedAt
}
```

---

## 🗺️ User Flow

### Buyer Flow
```
Register (role: buyer)
  → Browse Shop
  → Click "Book Trial"
  → Choose: Home Trial / Store Visit
  → Fill: Date, Time Slot, Address (if home)
  → Submit → Firestore trialRequests created
  → Wait for seller acceptance (live notification)
  → After trial: click "Buy It!" or "Not This Time"
```

### Seller Flow
```
Register (role: seller)
  → Seller Dashboard (stats overview)
  → Add Product (name, category, price, images, description)
  → Receive notification: "New Trial Request"
  → Review Request → Accept ✓ or Reject ✗
  → Buyer gets notified
  → See buyer's final decision (bought / cancelled)
  → Revenue tracked in dashboard
```

---

## 🌐 Deployment

### Option A — Firebase Hosting (Recommended)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# → select "build" as public directory
# → configure as SPA: Yes
npm run build
firebase deploy
```

### Option B — Vercel (Easiest)

```bash
npm install -g vercel
vercel --prod
# Add .env variables in Vercel dashboard
```

### Option C — Netlify

```bash
npm run build
# Drag the "build" folder to netlify.com/drop
# Add env variables in Site Settings → Environment
```

---

## 🔒 Firestore Security Rules

Deploy from `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

---

## 📸 Firebase Storage Rules

In Firebase Console → Storage → Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🧪 Test the App

1. Register a **Seller** account
2. Add a product with images and price
3. Register a **Buyer** account (use different browser / incognito)
4. Browse Shop → Book a trial
5. Switch back to Seller → Dashboard shows pending request
6. Accept the trial → Buyer gets notified
7. Buyer clicks "Buy It!" → Revenue appears on dashboard

---

## 🎓 College Presentation Points

- **Authentication** — Role-based sign up (buyer/seller) using Firebase Auth
- **Real-time Database** — Firestore `onSnapshot` for live updates without polling
- **Cloud Storage** — Firebase Storage for product image uploads with progress bar
- **Notifications** — Cross-user real-time notification system via Firestore
- **Role-based Access Control** — Protected routes, different UIs per role
- **Full CRUD** — Products: Create, Read, Update, Delete with image management
- **State Management** — React Context API for global auth state
- **Responsive Design** — Mobile-friendly CSS with CSS variables design system

---

## 👤 Author

**Rishabh Kumar Gupta** — Engineering Student  
GitHub: [@rishabhkumargupta](https://github.com/rishabhkumargupta)

---

*TrialNest — Experience it first. Then commit.*
