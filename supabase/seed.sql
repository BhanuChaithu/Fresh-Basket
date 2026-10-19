-- ========================================================================
-- FRESH BASKET - SUPABASE POSTGRESQL SEED DATA
-- Bengaluru initial sample data (clearly flagged as is_sample_data = true)
-- ========================================================================

-- Insert Categories
INSERT INTO public.categories (id, name, slug, description, icon, display_order, is_active)
VALUES
('cat-veg', 'Vegetables', 'vegetables', 'Crisp, locally sourced everyday cooking vegetables from Bengaluru farm belts.', 'Carrot', 1, true),
('cat-fruits', 'Fruits', 'fruits', 'Naturally ripened, sweet and nutrient-rich table fruits.', 'Apple', 2, true),
('cat-leafy', 'Leafy Vegetables', 'leafy-vegetables', 'Freshly harvested greens and keerais, washed and bundled with care.', 'Sprout', 3, true),
('cat-veg-baskets', 'Vegetable Baskets', 'vegetable-baskets', 'Curated weekly vegetable combos for small to large Bengaluru families.', 'ShoppingBag', 4, true),
('cat-fruit-baskets', 'Fruit Baskets', 'fruit-baskets', 'Hand-picked assortment of seasonal immunity and breakfast fruits.', 'Gift', 5, true),
('cat-microgreens', 'Microgreens', 'microgreens', 'Hydroponic, nutrient-dense live microgreens for salads, smoothies & garnish.', 'Leaf', 6, true),
('cat-seasonal', 'Seasonal Produce', 'seasonal-produce', 'Limited-harvest seasonal delights procured directly during peak harvest.', 'Sun', 7, true)
ON CONFLICT (id) DO NOTHING;

-- Insert Business Settings
INSERT INTO public.business_settings (
    id, store_name, slogan, whatsapp_number, display_phone, contact_email,
    city, state, service_notes, upi_id, upi_account_name,
    free_delivery_threshold, standard_delivery_charge, minimum_order_value,
    cod_enabled, manual_upi_enabled
) VALUES (
    'main',
    'Fresh Basket',
    'Fresh Produce. Honest Prices. Delivered with Care.',
    '919876543210',
    '+91 98765 43210',
    'hello@freshbasket.in',
    'Bengaluru',
    'Karnataka',
    'Pre-order cutoff: 09:00 PM for morning delivery (07:00 AM - 10:00 AM). 12:00 PM for evening delivery (04:00 PM - 07:00 PM).',
    'freshbasket@upi',
    'PALETI ANITHA',
    0.00,
    0.00,
    199.00,
    true,
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert Serviceable Bengaluru Delivery Areas (All Free Delivery ₹0)
INSERT INTO public.delivery_areas (id, pincode, area_name, is_active, min_order_value, delivery_charge)
VALUES
('area-1', '560001', 'Bengaluru GPO / MG Road / Brigade Road', true, 199.00, 0.00),
('area-2', '560034', 'Koramangala (Blocks 1-8) / ST Bed', true, 199.00, 0.00),
('area-3', '560038', 'Indiranagar / Defence Colony / HAL 2nd Stage', true, 199.00, 0.00),
('area-4', '560102', 'HSR Layout (Sectors 1 to 7)', true, 199.00, 0.00),
('area-5', '560068', 'Madivala / Bommanahalli / Rupena Agrahara', true, 199.00, 0.00),
('area-6', '560076', 'BTM Layout 2nd Stage / Bannerghatta Rd', true, 199.00, 0.00),
('area-7', '560041', 'Jayanagar (4th, 7th, 9th Block)', true, 199.00, 0.00),
('area-8', '560078', 'JP Nagar (Phases 1 to 6)', true, 199.00, 0.00),
('area-9', '560103', 'Bellandur / EcoSpace / Outer Ring Rd', true, 249.00, 0.00),
('area-10', '560066', 'Whitefield / ITPL / Kadugodi', true, 299.00, 0.00),
('area-11', '560035', 'Sarjapur Road / Doddakannelli', true, 249.00, 0.00)
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Products (Marked as is_sample_data = true per prompt specifications)
INSERT INTO public.products (
    id, name, slug, description, category_id, category_name, image_url, unit,
    current_price, previous_price, is_available, min_quantity, is_featured, is_sample_data,
    origin, storage_notes
) VALUES
('prod-tomato-hybrid', 'Farm Fresh Tomato (Hybrid)', 'farm-fresh-tomato-hybrid', 'Firm, juicy hybrid tomatoes perfect for everyday gravies, rasam, and curries.', 'cat-veg', 'Vegetables', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80', '₹/kg', 38.00, 45.00, true, 1, true, true, 'Kolar, Karnataka', 'Store at room temperature away from direct sunlight.'),
('prod-potato-agra', 'Premium Jyoti Potatoes', 'premium-jyoti-potatoes', 'Smooth-skinned, earth-free medium-sized potatoes. Low moisture content.', 'cat-veg', 'Vegetables', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80', '₹/kg', 36.00, 42.00, true, 1, true, true, 'Hassan, Karnataka', 'Store in a cool, well-ventilated dark place.'),
('prod-onion-medium', 'Bengaluru Red Onions', 'bengaluru-red-onions', 'Pungent, dry, double-layered red onions essential for Indian tadka and curries.', 'cat-veg', 'Vegetables', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80', '₹/kg', 44.00, 52.00, true, 1, true, true, 'Chitradurga, Karnataka', 'Keep in an open basket with good air circulation.'),
('prod-carrot-ooty', 'Tender Ooty Carrots', 'tender-ooty-carrots', 'Sweet, crunchy high-altitude orange carrots from the Nilgiri hills.', 'cat-veg', 'Vegetables', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80', '₹/500 g', 39.00, 48.00, true, 1, true, true, 'Ooty / Nilgiris', 'Refrigerate in a paper bag or perforated crisper bin.'),
('prod-capsicum-green', 'Crisp Green Capsicum (Bell Pepper)', 'crisp-green-capsicum', 'Glossy, thick-walled green bell peppers. Ideal for stir-fries and curries.', 'cat-veg', 'Vegetables', 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop&q=80', '₹/500 g', 35.00, 40.00, true, 1, false, true, 'Doddaballapur, Karnataka', 'Refrigerate in vegetable drawer.'),
('prod-bhindi-okra', 'Tender Lady Finger (Bhindi)', 'tender-lady-finger-bhindi', 'Snappy, fresh green bhindi without fibrous threads. Perfect for kurkuri bhindi.', 'cat-veg', 'Vegetables', 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&auto=format&fit=crop&q=80', '₹/500 g', 32.00, 38.00, true, 1, false, true, 'Malur, Karnataka', 'Keep dry before refrigerating.'),

-- Fruits
('prod-banana-yelakki', 'Yellaki Bananas (Mini Sweet)', 'yellaki-bananas-mini-sweet', 'Bengaluru favorite petite bananas with intense sweet aroma and creamy texture.', 'cat-fruits', 'Fruits', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80', '₹/500 g', 42.00, 50.00, true, 1, true, true, 'Mysuru, Karnataka', 'Store at room temperature. Do not refrigerate.'),
('prod-pomegranate-arils', 'Ruby Pomegranate (Anar)', 'ruby-pomegranate-anar', 'Deep ruby-red arils bursting with sweet-tart juice. High in antioxidants.', 'cat-fruits', 'Fruits', 'https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=800&auto=format&fit=crop&q=80', '₹/kg', 185.00, 210.00, true, 1, true, true, 'Bagalkot, Karnataka', 'Can be stored at room temperature or refrigerated.'),
('prod-apple-shimla', 'Himachal Royal Delicious Apples', 'himachal-royal-delicious-apples', 'Crisp, aromatic mountain apples with vibrant blush and sweet crunch. Wax-free.', 'cat-fruits', 'Fruits', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80', '₹/kg (4-5 pcs)', 195.00, 230.00, true, 1, true, true, 'Kinnaur / Shimla, HP', 'Refrigerate to preserve crispness.'),

-- Leafy
('prod-palak-spinach', 'Fresh Farm Palak (Spinach)', 'fresh-farm-palak-spinach', 'Tender, mud-washed spinach leaves with juicy green stalks. Harvested early morning.', 'cat-leafy', 'Leafy Vegetables', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80', '₹/bunch (~250 g)', 24.00, 30.00, true, 1, true, true, 'Anekal, Karnataka', 'Wrap in dry cotton cloth or paper towel and refrigerate.'),
('prod-coriander-fresh', 'Aromatic Bengaluru Coriander Leaves', 'aromatic-bengaluru-coriander-leaves', 'Intensely fragrant country coriander leaves (Nati Kothambari). Crisp stalks.', 'cat-leafy', 'Leafy Vegetables', 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800&auto=format&fit=crop&q=80', '₹/bunch (~150 g)', 18.00, 22.00, true, 1, false, true, 'Devanahalli, Karnataka', 'Trim stems slightly, stand upright in 1 inch of clean water.'),

-- Combos & Baskets
('prod-veg-basket-essential', 'Weekly Essential Veggie Basket (Family of 3-4)', 'weekly-essential-veggie-basket', 'Complete balanced combo: 2kg Potato, 2kg Onion, 2kg Tomato, Carrots, Beans, Capsicum, Palak & Coriander.', 'cat-veg-baskets', 'Vegetable Baskets', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80', '₹/basket (~8.5 kg)', 399.00, 475.00, true, 1, true, true, 'Direct Farm Consolidation', 'Items packed in breathable jute/paper bags.'),
('prod-fruit-basket-vitality', 'Daily Vitality Fruit Basket', 'daily-vitality-fruit-basket', 'Breakfast fruit combo with 1kg Apples, 1kg Bananas, 2 Pomegranates, 1 Papaya & Sweet Lime.', 'cat-fruit-baskets', 'Fruit Baskets', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=80', '₹/basket (~4 kg)', 489.00, 560.00, true, 1, true, true, 'Karnataka & Himachal growers', 'Keep fruits ventilated; separate bananas from apples.'),

-- Microgreens
('prod-microgreens-radish', 'Spicy Radish & Sunflower Microgreens Pack', 'spicy-radish-sunflower-microgreens-pack', 'Live hydroponic microgreens with up to 40x the nutrient concentration of mature plants.', 'cat-microgreens', 'Microgreens', 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=800&auto=format&fit=crop&q=80', '₹/box (100 g)', 99.00, 120.00, true, 1, true, true, 'Hydroponic Unit, Sarjapur', 'Keep chilled in airtight box with moisture pad.')
ON CONFLICT (id) DO NOTHING;
