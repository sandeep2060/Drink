# Supabase setup

## 1. Create project
Create a Supabase project and keep the project URL and publishable key.

## 2. Configure environment
Copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Never use the service-role key as a `NEXT_PUBLIC_` variable.

## 3. Apply database migration
Run `supabase/migrations/0001_initial_schema.sql` in Supabase SQL Editor, or apply it through the Supabase CLI.

## 4. Seed catalog/zones
Run `supabase/seed/seed.sql`.

## 5. Auth
Enable Email/Password in Supabase Auth. Create the first admin through a secure server-side bootstrap. Do not make the public signup form capable of selecting ADMIN or MANAGER.

## 6. Storage
Create private/public buckets according to the product images and branding policy you choose. Apply storage RLS before production use.

## 7. Realtime
Enable Realtime only for tables/channels that need it, such as order status and notifications. Keep rider location updates throttled.
