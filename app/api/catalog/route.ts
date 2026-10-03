import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const IMAGES_FALLBACK = {
  prodBurger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
  prodMargherita: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop',
  prodWings: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=800&auto=format&fit=crop',
  prodCoffee: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop',
  catAsian: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop',
  catDrinks: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
  catDesserts: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
  catCoffee: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop',
};

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

    const fallbackImages = [
      IMAGES_FALLBACK.prodBurger,
      IMAGES_FALLBACK.prodMargherita,
      IMAGES_FALLBACK.prodWings,
      IMAGES_FALLBACK.prodCoffee,
      IMAGES_FALLBACK.catAsian,
      IMAGES_FALLBACK.catDrinks,
      IMAGES_FALLBACK.catDesserts,
      IMAGES_FALLBACK.catCoffee,
    ];

    if (dealerData.length > 0) {
      products = dealerData.map((item: any, idx: number) => {
        const p = Array.isArray(item.product) ? item.product[0] : item.product;
        return {
          id: p?.id || item.id,
          name: p?.name || 'Drink Item',
          brand: p?.brand || 'Brand',
          size: p?.size || 'Standard',
          unit: p?.unit || 'unit',
          imageUrl: p?.image_url || fallbackImages[idx % fallbackImages.length],
          price: Number(item.selling_price || 0),
          categoryId: p?.category_id || null,
          stockQuantity: item.stock_quantity,
        };
      });
    } else if (directData.length > 0) {
      products = directData.map((p: any, idx: number) => ({
        id: p.id,
        name: p.name,
        brand: p.brand || 'Brand',
        size: p.size || 'Standard',
        unit: p.unit || 'unit',
        imageUrl: p.image_url || fallbackImages[idx % fallbackImages.length],
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
