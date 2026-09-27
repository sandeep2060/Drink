alter table public.profiles
  add column if not exists gender text,
  add column if not exists date_of_birth date,
  add column if not exists date_of_birth_bs text,
  add column if not exists signup_latitude double precision,
  add column if not exists signup_longitude double precision,
  add column if not exists signup_location_accuracy_m numeric(10,2);

alter table public.profiles
  drop constraint if exists profiles_gender_check,
  add constraint profiles_gender_check
    check (gender is null or gender in ('FEMALE', 'MALE', 'NON_BINARY', 'OTHER', 'PREFER_NOT_TO_SAY')),
  drop constraint if exists profiles_signup_latitude_check,
  add constraint profiles_signup_latitude_check
    check (signup_latitude is null or signup_latitude between -90 and 90),
  drop constraint if exists profiles_signup_longitude_check,
  add constraint profiles_signup_longitude_check
    check (signup_longitude is null or signup_longitude between -180 and 180),
  drop constraint if exists profiles_signup_location_accuracy_check,
  add constraint profiles_signup_location_accuracy_check
    check (signup_location_accuracy_m is null or signup_location_accuracy_m between 0 and 100000),
  drop constraint if exists profiles_signup_coordinates_pair_check,
  add constraint profiles_signup_coordinates_pair_check
    check ((signup_latitude is null) = (signup_longitude is null));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  full_name_value text := nullif(btrim(new.raw_user_meta_data->>'full_name'), '');
  phone_value text := regexp_replace(coalesce(new.raw_user_meta_data->>'phone', ''), '[[:space:]()-]', '', 'g');
  gender_value text := upper(coalesce(new.raw_user_meta_data->>'gender', ''));
  birth_date_text text := coalesce(new.raw_user_meta_data->>'date_of_birth', '');
  birth_date_bs_value text := coalesce(new.raw_user_meta_data->>'date_of_birth_bs', '');
  birth_date_value date;
  signup_latitude_value double precision;
  signup_longitude_value double precision;
  signup_accuracy_value numeric(10,2);
begin
  if full_name_value is null or new.email is null then
    raise exception 'Full name and email are required to create an account.';
  end if;

  if phone_value ~ '^9[6-8][0-9]{8}$' then
    phone_value := '+977' || phone_value;
  end if;
  if phone_value !~ '^\+9779[6-8][0-9]{8}$' then
    raise exception 'Enter a valid Nepali mobile number.';
  end if;

  if gender_value not in ('FEMALE', 'MALE', 'NON_BINARY', 'OTHER', 'PREFER_NOT_TO_SAY') then
    raise exception 'Select a valid gender option.';
  end if;

  if birth_date_text !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    or birth_date_bs_value !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then
    raise exception 'A valid Bikram Sambat date of birth is required.';
  end if;

  begin
    birth_date_value := birth_date_text::date;
  exception when others then
    raise exception 'A valid date of birth is required.';
  end;

  if birth_date_value > (current_date - interval '18 years')::date then
    raise exception 'You must be at least 18 years old to create an account.';
  end if;

  begin
    signup_latitude_value := (new.raw_user_meta_data->>'signup_latitude')::double precision;
    signup_longitude_value := (new.raw_user_meta_data->>'signup_longitude')::double precision;
    signup_accuracy_value := (new.raw_user_meta_data->>'signup_location_accuracy_m')::numeric(10,2);
  exception when invalid_text_representation or numeric_value_out_of_range then
    raise exception 'Valid sign-up location coordinates are required.';
  end;

  if signup_latitude_value is null or signup_longitude_value is null or signup_accuracy_value is null
    or signup_latitude_value not between -90 and 90
    or signup_longitude_value not between -180 and 180
    or signup_accuracy_value not between 0 and 100000 then
    raise exception 'Valid sign-up location coordinates are required.';
  end if;

  insert into public.profiles (
    id, full_name, email, phone, gender, date_of_birth, date_of_birth_bs,
    signup_latitude, signup_longitude, signup_location_accuracy_m, role, status
  )
  values (
    new.id, full_name_value, new.email, phone_value, gender_value, birth_date_value, birth_date_bs_value,
    signup_latitude_value, signup_longitude_value, signup_accuracy_value, 'CUSTOMER', 'ACTIVE'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();