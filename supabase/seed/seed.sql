-- Development seed: create auth users through Supabase Auth UI or a secure server-side bootstrap.
-- Then replace the UUID placeholders below with the corresponding auth.users IDs.
insert into public.delivery_zones(name,description,delivery_fee,estimated_minutes,priority)
values
('Traffic Chowk','Central Butwal',50,35,10),
('Kalikanagar','Kalikanagar area',50,40,9),
('Devinagar','Devinagar area',60,45,8),
('Golpark','Golpark area',60,45,7),
('Manigram','Manigram area',80,60,6)
on conflict(name) do nothing;

insert into public.products(name,sku,brand,size,unit,category_id)
select 'Coca-Cola 500ml','CC500','Coca-Cola','500ml','bottle',id from public.categories where name='Soft Drinks'
on conflict(sku) do nothing;
insert into public.products(name,sku,brand,size,unit,category_id)
select 'Mineral Water 1L','W1L','Local','1L','bottle',id from public.categories where name='Water'
on conflict(sku) do nothing;
insert into public.products(name,sku,brand,size,unit,category_id)
select 'Red Bull 250ml','RB250','Red Bull','250ml','can',id from public.categories where name='Energy'
on conflict(sku) do nothing;
insert into public.products(name,sku,brand,size,unit,category_id)
select 'Frooti 600ml','FR600','Frooti','600ml','bottle',id from public.categories where name='Juice'
on conflict(sku) do nothing;
