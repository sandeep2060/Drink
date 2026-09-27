# Production hardening still required before public launch

The repository is a runnable web foundation and demo environment. Before accepting real orders, implement and test these privileged workflows against the supplied Supabase schema:

- secure Auth user creation/deactivation Edge Functions
- atomic order creation and stock reservation RPC
- dealer matching logic
- manager rider assignment RPC with concurrency protection
- pickup OTP and delivery OTP verification
- immutable financial ledger posting and reversal/adjustment workflow
- server-side PDF/Excel exports
- production push/SMS/email providers
- map/geocoding provider configuration
- storage bucket policies
- complete RLS integration tests with real Supabase users
- production monitoring, backups and rate limits

These are intentionally documented rather than faked in the demo UI.
