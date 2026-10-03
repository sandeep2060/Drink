-- ==========================================
-- COMPLETE CONSOLIDATED SUPABASE SCHEMA
-- Project: Drinks & Grocery Delivery Platform
-- Description: Run this script directly in the Supabase SQL Editor.
-- ==========================================

-- 1. DROP EXISTING TABLES AND TYPES (For Clean Reset)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TABLE IF EXISTS public.order_status_logs CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.riders CASCADE;
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.dealer_products CASCADE;
DROP TABLE IF EXISTS public.dealers CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.brands CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.delivery_zones CASCADE;
DROP TABLE IF EXISTS public.business_hours CASCADE;
DROP TABLE IF EXISTS public.system_settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP TYPE IF EXISTS public.item_type CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;
DROP TYPE IF EXISTS public.order_status CASCADE;
DROP TYPE IF EXISTS public.presence_status CASCADE;
DROP TYPE IF EXISTS public.rider_work_status CASCADE;
DROP TYPE IF EXISTS public.gender CASCADE;

-- 2. CREATE ENUM TYPES
CREATE TYPE public.item_type AS ENUM ('LIQUOR', 'GROCERY');
CREATE TYPE public.app_role AS ENUM ('ADMIN', 'MANAGER', 'DEALER', 'RIDER', 'CUSTOMER');
CREATE TYPE public.order_status AS ENUM (
  'PENDING',
  'SEARCHING_DEALER',
  'DEALER_ASSIGNED',
  'PREPARING',
  'READY_FOR_PICKUP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED'
);
CREATE TYPE public.presence_status AS ENUM ('ONLINE', 'OFFLINE');
CREATE TYPE public.rider_work_status AS ENUM ('OFFLINE', 'AVAILABLE', 'ON_DELIVERY');
CREATE TYPE public.gender AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- 3. PROFILES TABLE (User Accounts & Roles)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  role public.app_role NOT NULL DEFAULT 'CUSTOMER',
  avatar_url TEXT,
  gender public.gender DEFAULT 'MALE',
  date_of_birth DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SYSTEM SETTINGS TABLE (Dynamic Website & Admin Management)
CREATE TABLE public.system_settings (
  id INT PRIMARY KEY DEFAULT 1,
  system_name TEXT NOT NULL DEFAULT 'Drinks & Grocery Delivery',
  site_name TEXT DEFAULT 'Drinks & Grocery Delivery',
  site_description TEXT DEFAULT 'Fast delivery of premium food, drinks, and groceries directly to your doorstep.',
  tagline TEXT DEFAULT 'Drinks → Nearby → Fast Delivery',
  logo_url TEXT,
  logo_text TEXT DEFAULT 'DD',
  primary_color TEXT DEFAULT '#2563eb',
  secondary_color TEXT DEFAULT '#0f172a',
  contact_phone TEXT DEFAULT '+977 9800000000',
  alternate_phone TEXT DEFAULT '+977 9811111111',
  contact_email TEXT DEFAULT 'support@drinksdelivery.com',
  whatsapp_number TEXT DEFAULT '+977 9800000000',
  support_email TEXT DEFAULT 'support@drinksdelivery.com',
  business_address TEXT DEFAULT 'Traffic Chowk, Butwal, Nepal',
  address TEXT DEFAULT 'Traffic Chowk, Butwal, Nepal',
  business_latitude NUMERIC DEFAULT 27.7000,
  business_longitude NUMERIC DEFAULT 83.4500,
  currency TEXT DEFAULT 'NPR',
  currency_symbol TEXT DEFAULT 'NPR ',
  currency_code TEXT DEFAULT 'NPR',
  timezone TEXT DEFAULT 'Asia/Kathmandu',
  vat_percentage NUMERIC DEFAULT 13.00,
  default_delivery_fee NUMERIC DEFAULT 50.00,
  free_delivery_threshold NUMERIC DEFAULT 2000.00,
  commission_rate NUMERIC DEFAULT 10.00,
  minimum_order NUMERIC DEFAULT 200.00,
  min_order_amount NUMERIC DEFAULT 200.00,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  customer_registration_enabled BOOLEAN DEFAULT TRUE,
  allow_customer_signup BOOLEAN DEFAULT TRUE,
  cod_enabled BOOLEAN DEFAULT TRUE,
  enable_cod BOOLEAN DEFAULT TRUE,
  online_payment_enabled BOOLEAN DEFAULT TRUE,
  enable_fonepay_qr BOOLEAN DEFAULT TRUE,
  dark_mode_enabled BOOLEAN DEFAULT FALSE,
  banner_announcement TEXT DEFAULT '🎉 Special Offer: Free delivery on orders over NPR 2000!',
  footer_text TEXT DEFAULT '© 2026 Drinks & Grocery Delivery. All rights reserved.',
  terms_text TEXT DEFAULT 'Standard Terms of Service for Drinks & Grocery Delivery Platform.',
  privacy_text TEXT DEFAULT 'Standard Privacy Policy for Drinks & Grocery Delivery Platform.',
  cancellation_policy TEXT DEFAULT 'Orders can be cancelled before dispatch.',
  delivery_policy TEXT DEFAULT 'Fast local delivery within 30-45 minutes in Butwal.',
  hero_bg_images TEXT[] DEFAULT ARRAY['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1600&auto=format&fit=crop'],
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert Default System Settings
INSERT INTO public.system_settings (id, site_name)
VALUES (1, 'Drinks & Grocery Delivery')
ON CONFLICT (id) DO NOTHING;

-- 5. BUSINESS HOURS TABLE
CREATE TABLE public.business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  opening_time TIME NOT NULL DEFAULT '09:00:00',
  closing_time TIME NOT NULL DEFAULT '22:00:00',
  is_closed BOOLEAN DEFAULT FALSE
);

-- 6. DELIVERY ZONES TABLE
CREATE TABLE public.delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  base_fee NUMERIC NOT NULL DEFAULT 50.00,
  estimated_minutes INT DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CATEGORIES TABLE
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  item_type public.item_type NOT NULL DEFAULT 'LIQUOR',
  description TEXT,
  icon_name TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Categories
INSERT INTO public.categories (name, item_type, display_order) VALUES
('Beer & Craft', 'LIQUOR', 1),
('Whiskey & Spirits', 'LIQUOR', 2),
('Wine', 'LIQUOR', 3),
('Soft Drinks & Soda', 'LIQUOR', 4),
('Energy & Juice', 'LIQUOR', 5),
('Water & Mixers', 'LIQUOR', 6),
('Fresh Snacks & Bakery', 'GROCERY', 7),
('Pantry & Essentials', 'GROCERY', 8),
('Dairy & Beverage', 'GROCERY', 9);

-- 8. BRANDS TABLE
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  item_type public.item_type NOT NULL DEFAULT 'LIQUOR',
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Brands
INSERT INTO public.brands (name, item_type) VALUES
('Tuborg', 'LIQUOR'),
('Carlsberg', 'LIQUOR'),
('Jack Daniel''s', 'LIQUOR'),
('Johnnie Walker', 'LIQUOR'),
('Old Durbar', 'LIQUOR'),
('Khukri', 'LIQUOR'),
('Coca-Cola', 'LIQUOR'),
('Red Bull', 'LIQUOR'),
('Real Juice', 'GROCERY'),
('Wai Wai', 'GROCERY');

-- 9. PRODUCTS TABLE
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  item_type public.item_type NOT NULL DEFAULT 'LIQUOR',
  sub_category TEXT,
  description TEXT,
  size TEXT NOT NULL DEFAULT '750ml',
  unit TEXT NOT NULL DEFAULT 'bottle',
  price NUMERIC NOT NULL,
  cost_price NUMERIC,
  stock_quantity INT NOT NULL DEFAULT 0,
  image_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  alcoholic BOOLEAN DEFAULT TRUE,
  abv NUMERIC(4,1),
  popular BOOLEAN DEFAULT FALSE,
  chilled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. DEALERS TABLE
CREATE TABLE public.dealers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  store_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line TEXT NOT NULL,
  zone TEXT NOT NULL,
  pan_vat_number TEXT,
  status public.presence_status DEFAULT 'ONLINE',
  commission_percentage NUMERIC DEFAULT 5.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. DEALER PRODUCTS (Stock mapping)
CREATE TABLE public.dealer_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID REFERENCES public.dealers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  stock_quantity INT DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  UNIQUE(dealer_id, product_id)
);

-- 12. ADDRESSES TABLE (Customer Saved Addresses)
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Home',
  zone TEXT NOT NULL,
  address_line TEXT NOT NULL,
  landmark TEXT,
  phone TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. RIDERS TABLE (Delivery Personnel Profile)
CREATE TABLE public.riders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle_type TEXT DEFAULT 'Motorbike',
  vehicle_number TEXT,
  license_number TEXT,
  status public.rider_work_status DEFAULT 'AVAILABLE',
  current_location_lat NUMERIC,
  current_location_lng NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ORDERS TABLE
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address_json JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC NOT NULL DEFAULT 50.00,
  tax NUMERIC NOT NULL DEFAULT 0.00,
  discount NUMERIC NOT NULL DEFAULT 0.00,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'COD',
  payment_status TEXT NOT NULL DEFAULT 'PENDING',
  status public.order_status NOT NULL DEFAULT 'PENDING',
  dealer_id UUID REFERENCES public.dealers(id) ON DELETE SET NULL,
  rider_id UUID REFERENCES public.riders(id) ON DELETE SET NULL,
  notes TEXT,
  estimated_delivery_minutes INT DEFAULT 30,
  placed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. ORDER ITEMS TABLE
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  brand TEXT,
  size TEXT,
  unit_price NUMERIC NOT NULL,
  quantity INT NOT NULL,
  line_total NUMERIC NOT NULL,
  image_url TEXT
);

-- 16. ORDER STATUS LOGS (Audit Trail)
CREATE TABLE public.order_status_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  previous_status public.order_status,
  new_status public.order_status NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. AUTOMATIC PROFILE CREATION ON USER SIGNUP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    phone,
    role,
    gender
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Valued Customer'),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'CUSTOMER'),
    COALESCE((NEW.raw_user_meta_data->>'gender')::public.gender, 'MALE')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 18. ENABLE ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealers ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access for Essential Catalog & Settings
CREATE POLICY "Public Read Settings" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Public Read Active Products" ON public.products FOR SELECT USING (true);

-- Allow All Access to Service Role & Authenticated Users for Core App Functions
CREATE POLICY "Authenticated Profile Read" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users Update Own Profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Allow All Operations for Authenticated Users on Orders" ON public.orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow All Operations for Authenticated Users on Order Items" ON public.order_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow All Operations for Authenticated Users on Products" ON public.products FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow All Operations for Authenticated Users on Categories" ON public.categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow All Operations for Authenticated Users on Brands" ON public.brands FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow All Operations for Authenticated Users on Settings" ON public.system_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow All Operations for Authenticated Users on Riders" ON public.riders FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow All Operations for Authenticated Users on Dealers" ON public.dealers FOR ALL TO authenticated USING (true);

-- End of Schema File
