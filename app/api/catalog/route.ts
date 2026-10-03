import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return NextResponse.json({ categories: [], products: [] });
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {},
    },
  });

  try {
    const [categoriesRes, dealerProductsRes, directProductsRes] = await Promise.all([
      supabase.from('categories').select('*').eq('active', true).order('sort_order'),
      supabase.from('dealer_products')
        .select('id, selling_price, stock_quantity, product:products!inner(id, name, brand, size, unit, image_url, category_id, active), dealer:dealers!inner(active, accepting_orders)')
        .eq('available', true)
        .gt('stock_quantity', 0)
        .eq('product.active', true)
        .eq('dealer.active', true)
        .eq('dealer.accepting_orders', true)
        .order('selling_price', { ascending: true })
        .limit(18),
      supabase.from('products')
        .select('id, name, brand, size, unit, image_url, category_id, active')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(18),
    ]);

    const categories = categoriesRes.data || [];
    const dealerData = dealerProductsRes.data || [];
    const directData = directProductsRes.data || [];

    let products: any[] = [];

    if (dealerData.length > 0) {
      products = dealerData.map((item: any) => {
        const p = Array.isArray(item.product) ? item.product[0] : item.product;
        return {
          id: p?.id || item.id,
          name: p?.name || 'Drink Item',
          brand: p?.brand || 'Brand',
          size: p?.size || 'Standard',
          unit: p?.unit || 'unit',
          imageUrl: p?.image_url || null,
          price: Number(item.selling_price || 0),
          categoryId: p?.category_id || null,
          stockQuantity: item.stock_quantity,
        };
      });
    } else if (directData.length > 0) {
      products = directData.map((p: any) => ({
        id: p.id,
        name: p.name,
        brand: p.brand || 'Brand',
        size: p.size || 'Standard',
        unit: p.unit || 'unit',
        imageUrl: p.image_url || null,
        price: 350,
        categoryId: p.category_id || null,
        stockQuantity: 50,
      }));
    }

    return NextResponse.json({ categories, products });
  } catch (err: any) {
    return NextResponse.json({ categories: [], products: [], error: err.message });
  }
}
