# Manual acceptance checklist

- [ ] Demo login opens all five role dashboards.
- [ ] Admin settings load and save from the configured Supabase database.
- [ ] Manager sees dispatch board and rider states.
- [ ] Dealer sees inventory and orders.
- [ ] Rider can toggle start/end shift in demo.
- [ ] Customer can add products to cart.
- [ ] Reports page renders sales chart.
- [ ] Orders table renders status badges.
- [ ] Supabase migration runs without SQL errors.
- [ ] RLS blocks cross-user access after real Auth users are configured.
- [ ] Signup requires full name, email, valid Nepali mobile, gender, BS birth date, password confirmation, and location permission.
- [ ] Signup rejects users under 18 in both the form and the Supabase auth trigger.
- [ ] Signup stores the BS and Gregorian birth dates and captured location in the customer profile.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
