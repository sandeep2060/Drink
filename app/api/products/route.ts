import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

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

// GET all products directly from Database
export async function GET() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ products: [] });
  }

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, brand, category_id, description, size, unit, image_url, active, created_at, categories(name)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const mapped = (products || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      brand: p.brand || 'Brand',
      category: p.categories?.name || 'Beer & Craft',
      description: p.description || '',
      size: p.size || 'Standard',
      unit: p.unit || 'unit',
      price: 350,
      costPrice: 270,
      stockQuantity: 50,
      imageUrl: p.image_url || '/brands/barahsinghe-craft-lager.webp',
      active: p.active ?? true,
      alcoholic: true,
      abv: 5.0,
      chilled: true,
      popular: false,
      dealerName: 'Butwal Central Liquors (Traffic Chowk)',
      createdAt: p.created_at,
    }));

    return NextResponse.json({ products: mapped });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch products' }, { status: 500 });
  }
}

// POST create product directly in Database
export async function POST(request: NextRequest) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase configuration missing.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { name, brand, category, description, size, unit, image_url, active } = body;

    // Fetch category ID by name
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', `%${category || 'Soft'}%`)
      .maybeSingle();

    const { data: newProd, error } = await supabase
      .from('products')
      .insert({
        name,
        brand,
        category_id: catData?.id || null,
        description,
        size,
        unit,
        image_url,
        active: active ?? true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, product: newProd });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error creating product' }, { status: 500 });
  }
}

// PATCH toggle status or update product in Database
export async function PATCH(request: NextRequest) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase configuration missing.' }, { status: 500 });
  }

  try {
    const { id, active, ...updates } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('products')
      .update({
        ...(active !== undefined ? { active } : {}),
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update product' }, { status: 500 });
  }
}
