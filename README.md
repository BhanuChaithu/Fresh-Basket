# 🧺 FRESH BASKET — Fresh Vegetables & Fruits Delivery in Bengaluru

> **"Fresh Produce. Honest Prices. Delivered with Care."**

A complete, functional, responsive e-commerce platform built for **FRESH BASKET**, designed to operate at **₹0 monthly software and hosting cost** by leveraging modern free tiers (Vercel Free Hobby Plan, Supabase Free PostgreSQL, and WhatsApp click-to-chat).

---

## 🌟 Highlights & Key Features

### 1. Zero Software Cost Architecture (₹0/month)
- **Vercel Hobby Plan**: Zero hosting bills, global high-speed edge CDN, automated CI/CD deployments.
- **Supabase Free Plan**: Managed PostgreSQL database, Row Level Security (RLS), and authentication.
- **₹0 WhatsApp Ordering**: Native WhatsApp click-to-chat (`wa.me`) integration generates structured, itemized messages without paid messaging APIs.
- **Zero-Fee Payments**: Cash on Delivery (COD) and direct manual UPI transfers (Google Pay, PhonePe, Paytm, BHIM) with 0% gateway transaction fees.

### 2. Dual-Mode Storage Engine (Out-of-the-Box Local & Cloud Sync)
- Works immediately upon cloning via an automated persistent local store (`.data/fresh_basket_db.json`), requiring **zero setup steps** to test browsing, cart, checkout, and admin updates.
- Connects automatically to **Supabase PostgreSQL** when `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided.

### 3. All 14 Customer-Facing Pages
1. **Home (`/`)**: Hero section, Bengaluru delivery location selector, product search, shop-by-category, featured vegetables, featured fruits, family vegetable baskets, vitality fruit baskets, hydroponic microgreens, how it works, delivery information, FAQs, and WhatsApp buttons.
2. **Shop (`/shop`)**: Complete catalogue with category filters, search by produce name, sort by price (low to high, high to low), availability filtering, and responsive produce cards.
3. **Product Details (`/product/[id]`)**: High-res licensed imagery, standard units (₹/kg, ₹/500 g, ₹/pack, ₹/basket), current price, previous strike-through price, discount badge, origin tag, storage guidelines, quantity stepper, and "Order on WhatsApp" button.
4. **Shopping Cart (`/cart`)**: Item list, quantity adjustments, item removal, free delivery threshold tracker (`Add ₹X more for FREE delivery`), subtotal and delivery charge breakdown, and "Send Cart to WhatsApp" button.
5. **Checkout (`/checkout`)**: Frictionless guest checkout collecting customer name, 10-digit mobile number, address, locality, PIN code with instant serviceability check, delivery slot selector, delivery instructions, and payment method (Cash on Delivery or Manual UPI QR).
6. **Order Confirmation (`/order-confirmation/[token]`)**: Displays unique Order Number (e.g. `#FB-202610-101`), live visual fulfillment timeline, itemized snapshot, and 1-click WhatsApp order confirmation.
7. **Order Lookup (`/track-order`)**: Secure tracking by Order Number + Mobile Number OR secure lookup token without sequential guessing.
8. **About Us (`/about`)**: Direct farm sourcing philosophy, zero cold storage, and transparent pricing.
9. **Contact (`/contact`)**: Operational base in Bengaluru, contact numbers, email, and inquiry form.
10. **Frequently Asked Questions (`/faq`)**: Common customer questions on produce sourcing, delivery slots, and replacements.
11. **Privacy Policy (`/privacy-policy`)**: Strict zero-data-selling guarantee and customer privacy protections.
12. **Terms and Conditions (`/terms-and-conditions`)**: Agricultural weight tolerances, pre-order supplier fulfillment model.
13. **Delivery Policy (`/delivery-policy`)**: Bengaluru zones, cut-offs (9 PM for morning slot, 12 PM for evening slot), and fees.
14. **Cancellation and Refund Policy (`/cancellation-and-refund-policy`)**: Doorstep inspection guarantee and zero-penalty cancellation cutoffs.

### 4. Protected Administrator Dashboard (`/admin`)
- **Secure Login (`/admin/login`)**: Protected by cryptographically signed HMAC session cookies and Supabase Auth integration.
- **Dashboard Overview (`/admin`)**: Live KPI metrics (total orders, pending orders, revenue, active products) and recent orders table.
- **Products & Prices (`/admin/products`)**:
  - **Live Price Updates**: Update any product price with 1 click; updates are saved to the database and reflect **instantly on public storefront without a redeploy**!
  - **Stock Status Toggle**: Mark produce In Stock or Out of Stock in real time.
  - **Full Editor**: Add and edit produce, categories, units, descriptions, origin, and sample data tags.
- **Orders Management (`/admin/orders`)**:
  - Live fulfillment status dropdown (`Pending confirmation`, `Confirmed`, `Awaiting procurement`, `Preparing`, `Ready for dispatch`, `Out for delivery`, `Delivered`, `Cancelled`).
  - Update payment status (`Pending`, `Verified`, `Paid on Delivery`).
  - View full delivery addresses, customer phone numbers, and print packing slips.
- **Manual Order Entry (`/admin/new-order`)**: Enter orders received over WhatsApp or direct phone calls into the website database.
- **Delivery & Settings (`/admin/settings`)**: Configure serviceable Bengaluru PIN codes, standard delivery fee, free delivery threshold, WhatsApp business phone number, and UPI payment details.

---

## 🚀 Quickstart & Local Testing

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public storefront.

### 3. Log in to the Admin Dashboard
- **URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@freshbasket.in`
- **Password**: `FreshBasket2026!`

### 4. Run Automated End-to-End Tests
```bash
node test-suite.mjs
```

---

## 📁 Repository Structure

```
d:\fresh basket\
├── supabase/
│   ├── migrations/
│   │   └── 20261019000000_fresh_basket_schema.sql  # PostgreSQL schema & RLS policies
│   └── seed.sql                                    # Bengaluru sample produce & PIN codes
├── src/
│   ├── app/
│   │   ├── (public)/                               # Customer pages (1-14)
│   │   ├── admin/                                  # Protected admin dashboard
│   │   ├── api/                                    # Serverless API routes (auth, products, orders, checkout)
│   │   ├── globals.css                             # Brand colors & styling
│   │   └── layout.tsx                              # App root layout & SEO
│   ├── components/
│   │   ├── Navbar.tsx                              # Responsive brand header & search
│   │   ├── Footer.tsx                              # Policies & contact footer
│   │   ├── FloatingWhatsApp.tsx                    # Native WhatsApp chat widget
│   │   ├── LocationModal.tsx                       # Bengaluru PIN code checker
│   │   ├── ProductCard.tsx                         # Produce card with price & cart stepper
│   │   ├── CartDrawer.tsx                          # Slide-over basket with free delivery bar
│   │   ├── OrderStatusTimeline.tsx                 # Live fulfillment timeline
│   │   └── admin/                                  # Admin header & navigation
│   ├── context/
│   │   ├── CartContext.tsx                         # Persistent cart state
│   │   └── DeliveryContext.tsx                     # Bengaluru location & WhatsApp generator
│   └── lib/
│       ├── types.ts                                # Core TypeScript interfaces
│       ├── store.ts                                # Dual-mode database repository
│       ├── local-data.ts                           # Verified seed produce & Bengaluru zones
│       ├── auth.ts                                 # Cryptographic session handling
│       └── supabase.ts                             # Supabase client connector
├── .env.example                                    # Sample environment configuration
├── DEPLOYMENT_AND_ADMIN_GUIDE.md                   # Complete ₹0 deployment tutorial
├── test-suite.mjs                                  # End-to-end integration test suite
└── package.json
```

---

## 🔒 Security & Server-Side Integrity
1. **Server-Side Price Validation**: When a customer checks out, the server recalculates all line totals and delivery charges against the database price. Client-submitted prices are never trusted.
2. **Unpredictable Order Tokens**: Order tracking links use random cryptographic tokens (`tok_...`) preventing sequential order ID enumeration.
3. **Protected Admin Routes**: Administrator endpoints reject unauthenticated requests with HTTP 401 Unauthorized.
4. **Row Level Security (RLS)**: Public visitors can only query active categories and available products.
