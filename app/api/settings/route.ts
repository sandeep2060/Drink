import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export type SystemSettingsData = {
  system_name: string;
  tagline: string | null;
  logo_url: string | null;
  logo_text: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  contact_phone: string | null;
  alternate_phone: string | null;
  contact_email: string | null;
  whatsapp_number: string | null;
  support_email: string | null;
  business_address: string | null;
  business_latitude: number | null;
  business_longitude: number | null;
  currency: string;
  currency_symbol: string;
  timezone: string;
  default_delivery_fee: number;
  free_delivery_threshold: number;
  commission_rate: number;
  minimum_order: number;
  maintenance_mode: boolean;
  customer_registration_enabled: boolean;
  cod_enabled: boolean;
  online_payment_enabled: boolean;
  dark_mode_enabled: boolean;
  footer_text: string | null;
  terms_text: string | null;
  privacy_text: string | null;
  cancellation_policy: string | null;
  delivery_policy: string | null;
};

export type BusinessHourItem = {
  day_of_week: number;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
  second_open_time: string | null;
  second_close_time: string | null;
};

async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return null;

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Handled in Server Components/Middleware
        }
      },
    },
  });
}

export async function GET() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase configuration missing.' }, { status: 500 });
  }

  try {
    const [settingsRes, hoursRes] = await Promise.all([
      supabase.from('system_settings').select('*').maybeSingle(),
      supabase.from('business_hours').select('*').order('day_of_week', { ascending: true }),
    ]);

    if (settingsRes.error) {
      return NextResponse.json({ error: settingsRes.error.message }, { status: 400 });
    }

    return NextResponse.json({
      settings: settingsRes.data,
      business_hours: hoursRes.data || [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase configuration missing.' }, { status: 500 });
  }

  // Check user auth and role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'MANAGER')) {
    return NextResponse.json({ error: 'Forbidden. Admin or Manager role required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { settings, business_hours } = body as {
      settings: Partial<SystemSettingsData>;
      business_hours?: BusinessHourItem[];
    };

    if (settings) {
      const { error: settingsErr } = await supabase
        .from('system_settings')
        .update({
          ...settings,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', true);

      if (settingsErr) {
        return NextResponse.json({ error: settingsErr.message }, { status: 400 });
      }
    }

    if (business_hours && Array.isArray(business_hours)) {
      for (const hour of business_hours) {
        const { error: hourErr } = await supabase
          .from('business_hours')
          .upsert({
            day_of_week: hour.day_of_week,
            is_open: hour.is_open,
            open_time: hour.open_time || null,
            close_time: hour.close_time || null,
            second_open_time: hour.second_open_time || null,
            second_close_time: hour.second_close_time || null,
          }, { onConflict: 'day_of_week' });

        if (hourErr) {
          return NextResponse.json({ error: `Hours error: ${hourErr.message}` }, { status: 400 });
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Settings updated successfully!' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
