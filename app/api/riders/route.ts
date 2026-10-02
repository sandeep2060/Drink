import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

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
        } catch {}
      },
    },
  });
}

function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// GET all riders
export async function GET() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase configuration missing.' }, { status: 500 });
  }

  try {
    const { data: riders, error } = await supabase
      .from('riders')
      .select(`
        id,
        phone,
        presence,
        work_status,
        current_zone_id,
        created_at,
        profile_id,
        profile:profiles!profile_id (
          id,
          full_name,
          email,
          phone,
          status,
          role,
          created_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ riders: riders || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch riders' }, { status: 500 });
  }
}

// POST create rider
export async function POST(request: NextRequest) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client missing.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      name,
      dob,
      gender,
      contact_number,
      citizen_number,
      email,
      password,
      area,
      vehicle_type,
      vehicle_number,
      emergency_contact,
    } = body;

    if (!name || !contact_number || !citizen_number || !email || !password || !area) {
      return NextResponse.json(
        { error: 'Required fields missing: Name, Contact Number, Citizenship Number, Email, Password, and Area are mandatory.' },
        { status: 400 }
      );
    }

    const adminClient = getSupabaseAdminClient();

    let userId: string;

    if (adminClient) {
      // Create user via Admin API (doesn't change current admin's session)
      const { data: newUser, error: createErr } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: name,
          phone: contact_number,
          role: 'RIDER',
        },
      });

      if (createErr || !newUser.user) {
        return NextResponse.json({ error: createErr?.message || 'Failed to create user account' }, { status: 400 });
      }

      userId = newUser.user.id;
    } else {
      // Fallback: Signup via standard client
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: contact_number,
            role: 'RIDER',
          },
        },
      });

      if (signUpErr || !signUpData.user) {
        return NextResponse.json({ error: signUpErr?.message || 'Failed to sign up rider account' }, { status: 400 });
      }

      userId = signUpData.user.id;
    }

    // Upsert into public.profiles
    const { error: profileErr } = await supabase.from('profiles').upsert({
      id: userId,
      full_name: name,
      email: email,
      phone: contact_number,
      role: 'RIDER',
      status: 'ACTIVE',
      updated_at: new Date().toISOString(),
    });

    if (profileErr) {
      console.error('Profile upsert error:', profileErr);
    }

    // Get zone ID for specified area if available
    const { data: zone } = await supabase
      .from('delivery_zones')
      .select('id')
      .ilike('name', `%${area}%`)
      .maybeSingle();

    // Insert into public.riders
    const { data: riderData, error: riderErr } = await supabase
      .from('riders')
      .insert({
        profile_id: userId,
        phone: contact_number,
        presence: 'OFFLINE',
        work_status: 'AVAILABLE',
        current_zone_id: zone?.id || null,
      })
      .select()
      .single();

    if (riderErr) {
      return NextResponse.json({ error: `Rider record error: ${riderErr.message}` }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Rider account created successfully!',
      rider: riderData,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error creating rider' }, { status: 500 });
  }
}

// PATCH toggle active/inactive status or update password
export async function PATCH(request: NextRequest) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase configuration missing.' }, { status: 500 });
  }

  try {
    const { rider_id, profile_id, status, new_password } = await request.json();

    if (!profile_id) {
      return NextResponse.json({ error: 'Profile ID required' }, { status: 400 });
    }

    // Update status in profiles table if requested
    if (status) {
      const { error: statusErr } = await supabase
        .from('profiles')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', profile_id);

      if (statusErr) {
        return NextResponse.json({ error: statusErr.message }, { status: 400 });
      }

      // Also sync work_status in riders table
      if (status === 'INACTIVE' || status === 'SUSPENDED') {
        await supabase
          .from('riders')
          .update({ work_status: 'SUSPENDED', presence: 'OFFLINE' })
          .eq('profile_id', profile_id);
      } else if (status === 'ACTIVE') {
        await supabase
          .from('riders')
          .update({ work_status: 'AVAILABLE' })
          .eq('profile_id', profile_id);
      }
    }

    // Update password using Admin Client if provided
    if (new_password) {
      const adminClient = getSupabaseAdminClient();
      if (adminClient) {
        const { error: passErr } = await adminClient.auth.admin.updateUserById(profile_id, {
          password: new_password,
        });

        if (passErr) {
          return NextResponse.json({ error: passErr.message }, { status: 400 });
        }
      } else {
        return NextResponse.json(
          { error: 'Password update requires SUPABASE_SERVICE_ROLE_KEY configuration.' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true, message: 'Rider updated successfully!' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update rider' }, { status: 500 });
  }
}
