# Architecture

Browser -> Next.js -> Supabase Auth/Postgres/Realtime/Storage.

The browser is never trusted for role, price, order total, dealer assignment, rider assignment, or financial calculations. Those values must be checked server-side/RLS and, for privileged workflows, inside Edge Functions or server actions.

Future customer and rider mobile apps can use the same Supabase backend.
