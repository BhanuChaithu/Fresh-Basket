# FRESH BASKET — ₹0 ZERO-COST DEPLOYMENT & ADMIN GUIDE

Welcome to **Fresh Basket**! This project is architected to operate at **₹0 monthly software and hosting cost** by leveraging the generous, legally permitted free tiers of **Vercel Hobby** and **Supabase Free Tier (PostgreSQL)**, combined with native WhatsApp click-to-chat messaging.

---

## 1. Zero-Cost Technology Stack Overview

| Component | Service | Plan | Monthly Cost | Notes / Quotas |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend & API** | Next.js 16 + React 19 + Tailwind CSS | Vercel Free Hobby Tier | **₹0** | Fast global CDN, automated deployments, free `*.vercel.app` domain. |
| **Database & Auth** | Supabase PostgreSQL 15 | Supabase Free Tier | **₹0** | 500 MB database, Row Level Security (RLS), 50,000 monthly active users. |
| **Messaging** | WhatsApp Click-to-Chat (`wa.me`) | Native WhatsApp Protocol | **₹0** | Zero paid API fees. Direct buyer-to-seller encrypted messaging. |
| **Payments** | Cash on Delivery & Manual UPI | Self-settled UPI (0% MDR) | **₹0** | Customer scans your phone's UPI QR / VPA. Direct bank settlement with 0 fees. |
| **Code Storage** | GitHub | Free Public/Private Repo | **₹0** | Unlimited commits and automated CI/CD integration with Vercel. |

---

## 2. Step-by-Step Free Tier Deployment Instructions

### Step 1: Push Code to GitHub (Free)
1. If you don't already have one, create a free account at [github.com](https://github.com).
2. Create a new repository named `fresh-basket` (Public or Private).
3. In your local project folder (`d:\fresh basket`), push your code:
   ```bash
   git init
   git add .
   git commit -m "Fresh Basket initial production release"
   git branch -M main
   git remote add origin https://github.com/<your-username>/fresh-basket.git
   git push -u origin main
   ```

---

### Step 2: Set Up Supabase Free Database (₹0)
1. Sign up for a free account at [supabase.com](https://supabase.com).
2. Click **New Project**:
   - **Name**: `fresh-basket-bengaluru`
   - **Database Password**: Enter a strong password and save it securely.
   - **Region**: Select `ap-south-1 (Mumbai, India)` for low latency in Bengaluru.
   - **Pricing Plan**: Choose **Free Plan (₹0/month)**.
3. Once the database is provisioned (approx. 60 seconds), go to the **SQL Editor** on the left menu.
4. Open the SQL file provided in this repository:
   - Copy contents of [supabase/migrations/20261019000000_fresh_basket_schema.sql](file:///d:/fresh%20basket/supabase/migrations/20261019000000_fresh_basket_schema.sql)
   - Paste into Supabase SQL Editor and click **Run**.
5. Copy contents of [supabase/seed.sql](file:///d:/fresh%20basket/supabase/seed.sql) to populate initial sample categories, produce items, and Bengaluru delivery areas, then click **Run**.
6. Retrieve your API Keys:
   - Navigate to **Project Settings** (gear icon) -> **API**.
   - Copy **Project URL** (`https://<project-ref>.supabase.co`).
   - Copy **Project API Key (anon/public)**.
   - Copy **Project API Key (service_role)**. Keep this secret!

---

### Step 3: Deploy to Vercel Free Hobby Plan (₹0)
1. Sign up or log into [vercel.com](https://vercel.com) using your GitHub account.
2. Click **Add New Project** and select the `fresh-basket` GitHub repository.
3. In the **Environment Variables** section, add the following keys:

| Environment Variable | Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xyzcompany.supabase.co` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase Anon Public Key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Supabase Service Role Key |
| `ADMIN_SECRET_KEY` | `<generate-a-random-32-char-string>` | Cryptographic secret for admin session tokens |
| `ADMIN_DEFAULT_EMAIL` | `admin@freshbasket.in` | Store owner admin login email |
| `ADMIN_DEFAULT_PASSWORD` | `<your-secure-admin-password>` | Store owner admin password |
| `NEXT_PUBLIC_APP_URL` | `https://fresh-basket-bengaluru.vercel.app` | Your free Vercel deployment URL |

4. Click **Deploy**. Vercel will build the application in under 60 seconds and assign a free public production URL (e.g. `https://fresh-basket.vercel.app`).

---

## 3. How to Create & Manage Administrators Securely

1. **Default Administrator**:
   - The platform is pre-configured with secure environment-backed credentials:
     - **Email**: `admin@freshbasket.in` (configurable in `ADMIN_DEFAULT_EMAIL`)
     - **Password**: `FreshBasket2026!` (change to your own in `ADMIN_DEFAULT_PASSWORD`)
   - Go to your public website: `https://<your-app>.vercel.app/admin/login`
   - Log in to access the full administration dashboard.

2. **Using Supabase Auth (Optional Multi-Admin)**:
   - In Supabase, go to **Authentication** -> **Users** -> **Add User**.
   - Enter your email and password, and check "Auto Confirm User".
   - In SQL Editor, run:
     ```sql
     INSERT INTO public.admin_profiles (id, email, full_name, role)
     VALUES ('<user-uuid-from-auth-users>', 'your-email@domain.com', 'Store Manager', 'admin');
     ```

---

## 4. How to Update Prices & Produce Without Redeploying

1. Log into `/admin/login`.
2. Click **Products & Prices** on the sidebar.
3. You have two options:
   - **Quick Price Update**: Click directly on any price (e.g., `₹38`), enter the new price (e.g., `42`), and click the checkmark.
   - **Full Product Edit**: Click the Edit icon to change images, description, minimum quantity, or toggle availability (In Stock / Out of Stock).
4. **Immediate Public Sync**: The updated price is saved to the PostgreSQL database and appears **instantly** to all public website visitors across mobile, tablet, and desktop without requiring a Vercel rebuild or redeployment!

---

## 5. Free-Tier Limits & Quota Monitoring

| Platform | Free Plan Limits | How to Monitor / Avoid Overages |
| :--- | :--- | :--- |
| **Vercel** | 100 GB Bandwidth / month<br>Unlimited static asset delivery | Monitor at `vercel.com/dashboard/usage`. Ensure product images are optimized WebP/CDN URLs rather than large 10MB camera files. |
| **Supabase** | 500 MB Database Storage<br>1 GB File Storage<br>50,000 Monthly Active Users<br>2 Free Projects | Monitor at `supabase.com/dashboard/project/<ref>/settings/usage`. Inactivity pause: Supabase free projects pause if no queries occur for 7 days; any visit unpauses it in 10 seconds. |
| **WhatsApp** | Unlimited click-to-chat links | Zero cost. Uses standard customer mobile WhatsApp app. |

---

## 6. Business Data Backup Procedure

To ensure your business data is never lost:
1. Log into your Supabase project dashboard.
2. Go to **Database** -> **Backups**.
3. Click **Download Backup** once a week, or use the standard PostgreSQL `pg_dump` command:
   ```bash
   pg_dump "postgres://postgres.<ref>:<password>@aws-0-ap-south-1.pooler.supabase.com:6543/postgres" > fresh_basket_backup.sql
   ```
4. If running locally without Supabase, your database is automatically persisted in `.data/fresh_basket_db.json`. Simply copy this file to create an offline snapshot.
