# Supabase setup

## 1. Create project
Create a Supabase project and keep the project URL and publishable key.

## 2. Configure environment
Copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Never use the service-role key as a `NEXT_PUBLIC_` variable.

## 3. Apply database migration
Run `supabase/migrations/0001_initial_schema.sql`, then each later numbered migration in order, in Supabase SQL Editor or through the Supabase CLI.

For email confirmation, set the Supabase Auth **Site URL** to your app origin and add these **Redirect URLs**:

```text
http://localhost:3000/login
https://your-production-domain/login
```

Set `NEXT_PUBLIC_SUPABASE_URL` to the project root only (for example, `https://your-project.supabase.co`). Do not append `/auth/v1` or another path; the Supabase client adds its API paths automatically.

## 4. Add production catalog/zones
The seed file is intentionally empty. Add approved delivery zones and real products through a controlled admin process; no sample business records are included.

## 5. Auth
Enable Email/Password in Supabase Auth. Create the first admin through a secure server-side bootstrap. Do not make the public signup form capable of selecting ADMIN or MANAGER.

## 6. Storage
Create private/public buckets according to the product images and branding policy you choose. Apply storage RLS before production use.

## 7. Realtime
Enable Realtime only for tables/channels that need it, such as order status and notifications. Keep rider location updates throttled.
