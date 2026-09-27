create extension if not exists pgcrypto;

create type public.app_role as enum ('ADMIN','MANAGER','DEALER','RIDER','CUSTOMER');
create type public.account_status as enum ('ACTIVE','INACTIVE','SUSPENDED','BLOCKED');
create type public.order_status as enum ('PENDING','SEARCHING_DEALER','DEALER_ASSIGNED','DEALER_ACCEPTED','PREPARING','READY_FOR_PICKUP','RIDER_ASSIGNED','RIDER_AT_DEALER','PICKED_UP','OUT_FOR_DELIVERY','RIDER_AT_CUSTOMER','DELIVERED','FAILED','CANCELLED','REFUNDED');
create type public.presence_status as enum ('ONLINE','OFFLINE');
create type public.rider_work_status as enum ('AVAILABLE','ASSIGNED','GOING_TO_DEALER','AT_DEALER','PICKING_UP','OUT_FOR_DELIVERY','AT_CUSTOMER','PAUSED','OFF_SHIFT','SUSPENDED');
create type public.attendance_status as enum ('PRESENT','LATE','ABSENT','HALF_DAY','ON_LEAVE');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  role public.app_role not null default 'CUSTOMER',
  status public.account_status not null default 'ACTIVE',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.system_settings (
  id boolean primary key default true check (id),
  system_name text not null default 'DrinkDrop',
  tagline text default 'Drinks → Nearby → Fast Delivery',
  logo_url text,
  logo_text text default 'DD',
  primary_color text default '#2563eb',
  secondary_color text default '#0f172a',
  contact_phone text,
  alternate_phone text,
  contact_email text,
  whatsapp_number text,
  support_email text,
  business_address text,
  business_latitude numeric,
  business_longitude numeric,
  currency text not null default 'NPR',
  currency_symbol text not null default 'Rs.',
  timezone text not null default 'Asia/Kathmandu',
  default_delivery_fee numeric(12,2) not null default 50,
  free_delivery_threshold numeric(12,2) not null default 1000,
  commission_rate numeric(5,2) not null default 10,
  minimum_order numeric(12,2) not null default 100,
  maintenance_mode boolean not null default false,
  customer_registration_enabled boolean not null default true,
  cod_enabled boolean not null default true,
  online_payment_enabled boolean not null default false,
  dark_mode_enabled boolean not null default true,
  footer_text text,
  terms_text text,
  privacy_text text,
  cancellation_policy text,
  delivery_policy text,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create table public.business_hours (
  id bigserial primary key,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  is_open boolean not null default true,
  open_time time,
  close_time time,
  second_open_time time,
  second_close_time time,
  unique(day_of_week)
);

create table public.special_closures (
  id uuid primary key default gen_random_uuid(),
  closure_date date not null,
  is_closed boolean not null default true,
  open_time time,
  close_time time,
  reason text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique(closure_date)
);

create table public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  delivery_fee numeric(12,2) not null default 50,
  free_delivery_threshold numeric(12,2),
  estimated_minutes integer not null default 45,
  max_radius_km numeric(8,2),
  priority integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text unique,
  brand text,
  category_id uuid references public.categories(id),
  description text,
  size text,
  unit text,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dealers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id),
  name text not null,
  owner_name text,
  phone text,
  address text,
  latitude numeric,
  longitude numeric,
  service_radius_km numeric(8,2) default 5,
  commission_rate numeric(5,2),
  accepting_orders boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dealer_products (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  selling_price numeric(12,2) not null,
  cost_price numeric(12,2),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  reserved_quantity integer not null default 0 check (reserved_quantity >= 0),
  minimum_stock integer not null default 5,
  available boolean not null default true,
  updated_at timestamptz not null default now(),
  unique(dealer_id, product_id)
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'Home',
  address text not null,
  landmark text,
  latitude numeric not null,
  longitude numeric not null,
  phone text,
  zone_id uuid references public.delivery_zones(id),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.riders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id),
  phone text,
  presence public.presence_status not null default 'OFFLINE',
  work_status public.rider_work_status not null default 'OFF_SHIFT',
  current_zone_id uuid references public.delivery_zones(id),
  last_seen_at timestamptz,
  last_latitude numeric,
  last_longitude numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid not null references public.profiles(id),
  dealer_id uuid references public.dealers(id),
  rider_id uuid references public.riders(id),
  address_id uuid references public.addresses(id),
  zone_id uuid references public.delivery_zones(id),
  status public.order_status not null default 'PENDING',
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  delivery_fee numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  payment_method text not null default 'COD',
  payment_status text not null default 'PENDING',
  cod_collected numeric(12,2) not null default 0,
  dealer_amount numeric(12,2) not null default 0,
  platform_commission numeric(12,2) not null default 0,
  rider_earning numeric(12,2) not null default 0,
  notes text,
  placed_at timestamptz not null default now(),
  accepted_at timestamptz,
  ready_at timestamptz,
  picked_up_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  dealer_product_id uuid references public.dealer_products(id),
  product_name_snapshot text not null,
  unit_price numeric(12,2) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(12,2) not null
);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  previous_status public.order_status,
  new_status public.order_status not null,
  changed_by uuid references public.profiles(id),
  note text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz not null default now()
);

create table public.rider_attendance (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid not null references public.riders(id) on delete cascade,
  attendance_date date not null,
  status public.attendance_status not null default 'PRESENT',
  check_in_at timestamptz,
  check_out_at timestamptz,
  break_seconds integer not null default 0,
  active_seconds integer not null default 0,
  check_in_latitude numeric,
  check_in_longitude numeric,
  check_out_latitude numeric,
  check_out_longitude numeric,
  notes text,
  created_at timestamptz not null default now(),
  unique(rider_id, attendance_date)
);

create table public.rider_locations (
  id bigserial primary key,
  rider_id uuid not null references public.riders(id) on delete cascade,
  order_id uuid references public.orders(id),
  latitude numeric not null,
  longitude numeric not null,
  accuracy numeric,
  recorded_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null,
  order_id uuid references public.orders(id),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique,
  customer_id uuid references public.profiles(id),
  order_id uuid references public.orders(id),
  subject text not null,
  category text,
  priority text not null default 'NORMAL',
  status text not null default 'OPEN',
  assigned_manager_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  message text not null,
  created_at timestamptz not null default now()
);

create table public.ledger_transactions (
  id uuid primary key default gen_random_uuid(),
  account_type text not null check (account_type in ('DEALER','RIDER','CUSTOMER','PLATFORM')),
  account_id uuid not null,
  order_id uuid references public.orders(id),
  transaction_type text not null,
  debit numeric(12,2) not null default 0,
  credit numeric(12,2) not null default 0,
  description text,
  immutable_snapshot jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigserial primary key,
  actor_id uuid references public.profiles(id),
  actor_role public.app_role,
  action text not null,
  entity_type text,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index orders_customer_idx on public.orders(customer_id, created_at desc);
create index orders_dealer_idx on public.orders(dealer_id, status, created_at desc);
create index orders_rider_idx on public.orders(rider_id, status, created_at desc);
create index orders_zone_idx on public.orders(zone_id, created_at desc);
create index order_items_product_idx on public.order_items(product_id);
create index dealer_products_product_idx on public.dealer_products(product_id, available);
create index rider_locations_rider_time_idx on public.rider_locations(rider_id, recorded_at desc);
create index notifications_user_idx on public.notifications(user_id, created_at desc);
create index ledger_account_idx on public.ledger_transactions(account_type, account_id, created_at desc);
create index audit_logs_created_idx on public.audit_logs(created_at desc);

insert into public.system_settings(id, system_name, contact_phone, contact_email, business_address)
values(true,'DrinkDrop','+977 9800000000','support@drinkdrop.local','Butwal, Rupandehi, Nepal')
on conflict (id) do nothing;

insert into public.business_hours(day_of_week,is_open,open_time,close_time) values
(0,true,'09:00','21:00'),(1,true,'09:00','21:00'),(2,true,'09:00','21:00'),(3,true,'09:00','21:00'),(4,true,'09:00','21:00'),(5,true,'09:00','21:00'),(6,true,'10:00','18:00')
on conflict (day_of_week) do nothing;

insert into public.categories(name,sort_order) values
('Soft Drinks',1),('Water',2),('Juice',3),('Energy',4)
on conflict (name) do nothing;

create or replace function public.is_admin_or_manager()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id=auth.uid() and role in ('ADMIN','MANAGER') and status='ACTIVE') $$;

create or replace function public.current_role()
returns public.app_role language sql stable security definer set search_path = public
as $$ select role from public.profiles where id=auth.uid() and status='ACTIVE' limit 1 $$;

alter table public.profiles enable row level security;
alter table public.system_settings enable row level security;
alter table public.business_hours enable row level security;
alter table public.special_closures enable row level security;
alter table public.delivery_zones enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.dealers enable row level security;
alter table public.dealer_products enable row level security;
alter table public.addresses enable row level security;
alter table public.riders enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.rider_attendance enable row level security;
alter table public.rider_locations enable row level security;
alter table public.notifications enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;
alter table public.ledger_transactions enable row level security;
alter table public.audit_logs enable row level security;

create policy profiles_self_or_ops on public.profiles for select using (id=auth.uid() or public.is_admin_or_manager());
create policy profiles_self_update on public.profiles for update using (id=auth.uid()) with check (id=auth.uid());
create policy settings_public_read on public.system_settings for select using (true);
create policy settings_admin_update on public.system_settings for update using (public.current_role()='ADMIN') with check (public.current_role()='ADMIN');
create policy hours_public_read on public.business_hours for select using (true);
create policy hours_admin_write on public.business_hours for all using (public.current_role()='ADMIN') with check (public.current_role()='ADMIN');
create policy closures_admin on public.special_closures for all using (public.current_role()='ADMIN') with check (public.current_role()='ADMIN');
create policy zones_public_read on public.delivery_zones for select using (active=true or public.is_admin_or_manager());
create policy zones_admin_manager_write on public.delivery_zones for all using (public.is_admin_or_manager()) with check (public.is_admin_or_manager());
create policy categories_public_read on public.categories for select using (active=true or public.is_admin_or_manager());
create policy categories_admin_write on public.categories for all using (public.is_admin_or_manager()) with check (public.is_admin_or_manager());
create policy products_public_read on public.products for select using (active=true or public.is_admin_or_manager());
create policy products_admin_manager_write on public.products for all using (public.is_admin_or_manager()) with check (public.is_admin_or_manager());
create policy dealers_ops_read on public.dealers for select using (public.is_admin_or_manager() or profile_id=auth.uid());
create policy dealers_ops_write on public.dealers for all using (public.is_admin_or_manager()) with check (public.is_admin_or_manager());
create policy inventory_public_read on public.dealer_products for select using (available=true or public.is_admin_or_manager() or exists(select 1 from public.dealers d where d.id=dealer_id and d.profile_id=auth.uid()));
create policy inventory_owner_write on public.dealer_products for all using (public.is_admin_or_manager() or exists(select 1 from public.dealers d where d.id=dealer_id and d.profile_id=auth.uid())) with check (public.is_admin_or_manager() or exists(select 1 from public.dealers d where d.id=dealer_id and d.profile_id=auth.uid()));
create policy addresses_owner on public.addresses for all using (customer_id=auth.uid() or public.is_admin_or_manager()) with check (customer_id=auth.uid() or public.is_admin_or_manager());
create policy riders_ops_read on public.riders for select using (public.is_admin_or_manager() or profile_id=auth.uid());
create policy riders_ops_write on public.riders for all using (public.is_admin_or_manager() or profile_id=auth.uid()) with check (public.is_admin_or_manager() or profile_id=auth.uid());
create policy orders_visible on public.orders for select using (customer_id=auth.uid() or public.is_admin_or_manager() or exists(select 1 from public.dealers d where d.id=dealer_id and d.profile_id=auth.uid()) or exists(select 1 from public.riders r where r.id=rider_id and r.profile_id=auth.uid()));
create policy order_items_visible on public.order_items for select using (exists(select 1 from public.orders o where o.id=order_id and (o.customer_id=auth.uid() or public.is_admin_or_manager() or exists(select 1 from public.dealers d where d.id=o.dealer_id and d.profile_id=auth.uid()) or exists(select 1 from public.riders r where r.id=o.rider_id and r.profile_id=auth.uid()))));
create policy order_history_visible on public.order_status_history for select using (exists(select 1 from public.orders o where o.id=order_id and (o.customer_id=auth.uid() or public.is_admin_or_manager() or exists(select 1 from public.dealers d where d.id=o.dealer_id and d.profile_id=auth.uid()) or exists(select 1 from public.riders r where r.id=o.rider_id and r.profile_id=auth.uid()))));
create policy attendance_self_ops on public.rider_attendance for select using (public.is_admin_or_manager() or exists(select 1 from public.riders r where r.id=rider_id and r.profile_id=auth.uid()));
create policy attendance_ops_write on public.rider_attendance for all using (public.is_admin_or_manager() or exists(select 1 from public.riders r where r.id=rider_id and r.profile_id=auth.uid())) with check (public.is_admin_or_manager() or exists(select 1 from public.riders r where r.id=rider_id and r.profile_id=auth.uid()));
create policy rider_locations_ops on public.rider_locations for select using (public.is_admin_or_manager() or exists(select 1 from public.riders r where r.id=rider_id and r.profile_id=auth.uid()));
create policy notifications_owner on public.notifications for select using (user_id=auth.uid() or public.is_admin_or_manager());
create policy notifications_owner_update on public.notifications for update using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy tickets_customer_ops on public.support_tickets for select using (customer_id=auth.uid() or public.is_admin_or_manager());
create policy tickets_ops_write on public.support_tickets for all using (public.is_admin_or_manager() or customer_id=auth.uid()) with check (public.is_admin_or_manager() or customer_id=auth.uid());
create policy support_messages_visible on public.support_messages for select using (exists(select 1 from public.support_tickets t where t.id=ticket_id and (t.customer_id=auth.uid() or public.is_admin_or_manager())));
create policy ledger_admin_read on public.ledger_transactions for select using (public.is_admin_or_manager() or account_id=auth.uid());
create policy audit_admin_read on public.audit_logs for select using (public.current_role()='ADMIN');

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;

do $$ declare t text; begin foreach t in array array['profiles','system_settings','delivery_zones','products','dealers','dealer_products','addresses','riders','orders'] loop execute format('drop trigger if exists trg_%s_updated on public.%I',t,t); execute format('create trigger trg_%s_updated before update on public.%I for each row execute function public.set_updated_at()',t,t); end loop; end $$;
