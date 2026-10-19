-- ========================================================================
-- FRESH BASKET - SUPABASE POSTGRESQL DATABASE SCHEMA & RLS POLICIES
-- Target platform: Supabase Free Tier (PostgreSQL 15+)
-- Software cost: ₹0/month
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADMIN PROFILES
-- Maps to Supabase auth.users for secure administrator login
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'manager')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. PRODUCT CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON UPDATE CASCADE,
    category_name TEXT,
    image_url TEXT NOT NULL,
    unit TEXT NOT NULL, -- e.g. "₹/kg", "₹/500 g", "₹/bunch", "₹/basket"
    current_price NUMERIC(10, 2) NOT NULL CHECK (current_price >= 0),
    previous_price NUMERIC(10, 2) CHECK (previous_price IS NULL OR previous_price >= 0),
    is_available BOOLEAN NOT NULL DEFAULT true,
    min_quantity INTEGER NOT NULL DEFAULT 1 CHECK (min_quantity >= 1),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_sample_data BOOLEAN NOT NULL DEFAULT true, -- clearly identifies sample data
    origin TEXT,
    storage_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for speedy customer searches & category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON public.products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- 4. PRODUCT PRICE HISTORY
-- Logs every price change timestamped with previous and new price
CREATE TABLE IF NOT EXISTS public.price_history (
    id TEXT PRIMARY KEY DEFAULT ('ph-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6)),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    old_price NUMERIC(10, 2) NOT NULL,
    new_price NUMERIC(10, 2) NOT NULL,
    changed_by TEXT DEFAULT 'admin',
    changed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_price_history_product ON public.price_history(product_id);

-- 5. DELIVERY AREAS (Bengaluru Serviceable PIN Codes)
CREATE TABLE IF NOT EXISTS public.delivery_areas (
    id TEXT PRIMARY KEY,
    pincode VARCHAR(10) NOT NULL UNIQUE,
    area_name TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    min_order_value NUMERIC(10, 2) NOT NULL DEFAULT 199.00,
    delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 35.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_delivery_areas_pincode ON public.delivery_areas(pincode);

-- 6. BUSINESS SETTINGS
CREATE TABLE IF NOT EXISTS public.business_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    store_name TEXT NOT NULL DEFAULT 'Fresh Basket',
    slogan TEXT NOT NULL DEFAULT 'Fresh Produce. Honest Prices. Delivered with Care.',
    whatsapp_number TEXT NOT NULL DEFAULT '919876543210',
    display_phone TEXT NOT NULL DEFAULT '+91 98765 43210',
    contact_email TEXT NOT NULL DEFAULT 'hello@freshbasket.in',
    city TEXT NOT NULL DEFAULT 'Bengaluru',
    state TEXT NOT NULL DEFAULT 'Karnataka',
    service_notes TEXT,
    upi_id TEXT NOT NULL DEFAULT 'freshbasket@upi',
    upi_account_name TEXT NOT NULL DEFAULT 'Fresh Basket Bengaluru',
    free_delivery_threshold NUMERIC(10, 2) NOT NULL DEFAULT 299.00,
    standard_delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 35.00,
    minimum_order_value NUMERIC(10, 2) NOT NULL DEFAULT 199.00,
    cod_enabled BOOLEAN NOT NULL DEFAULT true,
    manual_upi_enabled BOOLEAN NOT NULL DEFAULT true,
    delivery_slots JSONB NOT NULL DEFAULT '["Morning Slot: 07:00 AM – 10:00 AM (Next Day)", "Evening Slot: 04:00 PM – 07:00 PM (Same Day / Next Day)", "Next-Day Farm Harvest Pre-order"]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    lookup_token TEXT NOT NULL UNIQUE, -- Secure, unpredictable random token for public lookup
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_address TEXT NOT NULL,
    neighbourhood TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    delivery_slot TEXT NOT NULL,
    delivery_instructions TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_charge NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending confirmation' CHECK (status IN (
        'Pending confirmation',
        'Confirmed',
        'Awaiting procurement',
        'Preparing',
        'Ready for dispatch',
        'Out for delivery',
        'Delivered',
        'Cancelled'
    )),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('Cash on Delivery', 'Manual UPI')),
    payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Verified', 'Paid on Delivery')),
    upi_reference TEXT,
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_orders_lookup_token ON public.orders(lookup_token);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 8. ORDER ITEMS (Immutable historical snapshot)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    unit TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 1),
    total_price NUMERIC(10, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Categories: Anyone can read active categories; Admins have full access
CREATE POLICY "Public can view active categories" ON public.categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins have full category access" ON public.categories
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Products: Anyone can view active products; Admins have full access
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (is_available = true);

CREATE POLICY "Admins have full product access" ON public.products
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Delivery areas: Anyone can read active delivery areas
CREATE POLICY "Public can view delivery areas" ON public.delivery_areas
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage delivery areas" ON public.delivery_areas
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Business settings: Anyone can view store settings; Admins can update
CREATE POLICY "Public can view business settings" ON public.business_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can update business settings" ON public.business_settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Orders:
-- 1. Public can create new orders (Server action or checkout API validates values)
CREATE POLICY "Public can insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);

-- 2. Public can view order details ONLY if they provide the exact secure lookup_token
CREATE POLICY "Public can view order by lookup token" ON public.orders
    FOR SELECT USING (lookup_token = current_setting('request.headers', true)::json->>'x-lookup-token' OR auth.role() = 'authenticated');

-- 3. Authenticated Admins have full control over orders
CREATE POLICY "Admins have full order access" ON public.orders
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Order Items:
CREATE POLICY "Public can insert order items" ON public.order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins have full order items access" ON public.order_items
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Admin Profiles: Only authenticated users can view/manage their admin profile
CREATE POLICY "Admins can view their own profile" ON public.admin_profiles
    FOR SELECT TO authenticated USING (auth.uid() = id);
