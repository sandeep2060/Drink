# Drinks Delivery Platform

A multi-dealer drinks delivery marketplace and operations dashboard designed for Butwal, Nepal.

## Included

- Admin, Manager, Dealer, Rider and Customer web interfaces
- Admin-controlled branding, contact details, business hours and fees
- Manager dispatch workflow
- Rider shift/attendance UX
- Dealer inventory UX
- Customer storefront UX
- Orders, reports and analytics screens
- Supabase PostgreSQL schema + RLS policies + seed SQL
- Demo mode for testing without Supabase
- Production Supabase Auth login path
- Mobile-first rider/customer UI foundation

## Quick test — no Supabase required

1. Install Node.js 20+.
2. Extract the ZIP.
3. Open terminal in the project folder.
4. Run:

```bash
npm install
npm run dev
```

5. Open http://localhost:3000/login
6. Select Admin, Manager, Dealer, Rider or Customer.

Demo mode is enabled by default.

## Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Set:

```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

4. Run `supabase/migrations/0001_initial_schema.sql` in the Supabase SQL Editor or via Supabase CLI migrations.
5. Run `supabase/seed/seed.sql`.
6. Create the first Admin through a secure server-side bootstrap process, then create Manager/Dealer/Rider users through the application.
7. Restart the dev server.

## Important production note

The included web UI is a working foundation and demo environment. The Supabase migration establishes the real data model and RLS boundary, but production privileged operations such as creating Auth users, posting immutable ledger transactions, atomic inventory reservation, OTP verification and advanced report exports should be implemented as server actions/Edge Functions before public launch.

## Quality commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Future mobile apps

Use React Native + Expo against the same Supabase Auth/Postgres/Realtime backend. Do not create a second database for mobile.
