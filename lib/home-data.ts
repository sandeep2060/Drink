import { createClient } from '@supabase/supabase-js';

type CategoryRow = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

type ProductRow = {
  id: string;
  name: string;
  brand: string | null;
  size: string | null;
  unit: string | null;
  image_url: string | null;
  category_id: string | null;
};

type ListingRow = {
  selling_price: number | string;
  product: ProductRow | ProductRow[] | null;
};

type BusinessHoursRow = {
  day_of_week: number;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
  second_open_time: string | null;
  second_close_time: string | null;
};

type SettingsRow = {
  system_name: string;
  tagline: string | null;
  logo_url: string | null;
  contact_phone: string | null;
  alternate_phone: string | null;
  contact_email: string | null;
  support_email: string | null;
  business_address: string | null;
  timezone: string | null;
  currency_symbol: string | null;
  default_delivery_fee: number | string | null;
  maintenance_mode: boolean;
};

export type HomeCategory = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  productImageUrl: string | null;
};

export type HomeProduct = {
  id: string;
  name: string;
  brand: string | null;
  size: string | null;
  unit: string | null;
  imageUrl: string | null;
  price: number;
  categoryId: string | null;
};

export type HomeData = {
  systemName: string;
  tagline: string;
  logoUrl: string | null;
  phone: string | null;
  email: string | null;
  businessAddress: string;
  timezone: string;
  currencySymbol: string;
  deliveryFee: number | null;
  maintenanceMode: boolean;
  categories: HomeCategory[];
  products: HomeProduct[];
  openStatus: 'open' | 'closed' | 'unknown';
  openLabel: string;
};

const schemaCategories = [
  { id: 'soft-drinks', name: 'Soft Drinks', description: 'Colas, fizzy drinks and more', sort_order: 1 },
  { id: 'water', name: 'Water', description: 'Bottled water for every day', sort_order: 2 },
  { id: 'juice', name: 'Juice', description: 'Fruit drinks and juices', sort_order: 3 },
  { id: 'energy', name: 'Energy', description: 'Energy and sports drinks', sort_order: 4 },
];

function getNepalClock(timezone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return {
    weekday: weekdays.indexOf(values.weekday),
    minuteOfDay: Number(values.hour) * 60 + Number(values.minute),
  };
}

function parseTime(value: string | null) {
  if (!value) return null;
  const match = value.match(/^(\d{1,2}):(\d{2})/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

function formatTime(value: string | null, timezone: string) {
  const minutes = parseTime(value);
  if (minutes === null) return '';
  void timezone;
  const hour = Math.floor(minutes / 60);
  const minute = String(minutes % 60).padStart(2, '0');
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute} ${hour < 12 ? 'AM' : 'PM'}`;
}

function calculateOpenStatus(hours: BusinessHoursRow[], timezone: string) {
  if (!hours.length) return { openStatus: 'unknown' as const, openLabel: 'Hours not listed' };
  let clock: ReturnType<typeof getNepalClock>;
  try {
    clock = getNepalClock(timezone);
  } catch {
    return { openStatus: 'unknown' as const, openLabel: 'Hours not listed' };
  }

  const today = hours.find(row => row.day_of_week === clock.weekday);
  const intervals = today?.is_open
    ? [[today.open_time, today.close_time], [today.second_open_time, today.second_close_time]] as const
    : [];
  const isOpen = intervals.some(([start, end]) => {
    const startMinutes = parseTime(start);
    const endMinutes = parseTime(end);
    return startMinutes !== null && endMinutes !== null && clock.minuteOfDay >= startMinutes && clock.minuteOfDay < endMinutes;
  });

  if (isOpen) {
    const closing = intervals
      .map(([, end]) => ({ raw: end, minute: parseTime(end) }))
      .filter((time): time is { raw: string; minute: number } => time.raw !== null && time.minute !== null && time.minute > clock.minuteOfDay)
      .sort((a, b) => a.minute - b.minute)[0];
    return {
      openStatus: 'open' as const,
      openLabel: closing ? `Open now · closes ${formatTime(closing.raw, timezone)}` : 'Open now',
    };
  }

  for (let offset = 0; offset <= 7; offset += 1) {
    const weekday = (clock.weekday + offset) % 7;
    const day = hours.find(row => row.day_of_week === weekday);
    if (!day?.is_open) continue;
    const opening = [day.open_time, day.second_open_time]
      .map(raw => ({ raw, minute: parseTime(raw) }))
      .filter((time): time is { raw: string; minute: number } => time.raw !== null && time.minute !== null)
      .sort((a, b) => a.minute - b.minute)
      .find(time => offset > 0 || time.minute > clock.minuteOfDay);
    if (opening) {
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = offset === 0 ? '' : offset === 1 ? 'tomorrow ' : `on ${weekdays[weekday]} `;
      return { openStatus: 'closed' as const, openLabel: `Closed · opens ${dayName}${formatTime(opening.raw, timezone)}` };
    }
  }

  return { openStatus: 'closed' as const, openLabel: 'Closed today' };
}

export async function getHomeData(): Promise<HomeData> {
  const fallbackTimezone = 'Asia/Kathmandu';
  const defaultData: HomeData = {
    systemName: 'DrinkDrop',
    tagline: 'Drinks Delivered Fast',
    logoUrl: null,
    phone: null,
    email: null,
    businessAddress: 'Butwal, Nepal',
    timezone: fallbackTimezone,
    currencySymbol: 'Rs.',
    deliveryFee: null,
    maintenanceMode: false,
    categories: schemaCategories.map(category => ({ ...category, imageUrl: null, productImageUrl: null })),
    products: [],
    openStatus: 'unknown',
    openLabel: 'Hours not listed',
  };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return defaultData;

  try {
    const projectUrl = new URL(url);
    if (!['https:', 'http:'].includes(projectUrl.protocol) || projectUrl.pathname !== '/' || projectUrl.search || projectUrl.hash) return defaultData;
    const supabase = createClient(projectUrl.origin, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const [categoryResult, listingResult, settingsResult, hoursResult] = await Promise.all([
      supabase.from('categories').select('id,name,description,image_url,sort_order').eq('active', true).order('sort_order'),
      supabase.from('dealer_products')
        .select('selling_price,stock_quantity,product:products!inner(id,name,brand,size,unit,image_url,category_id,active),dealer:dealers!inner(active,accepting_orders)')
        .eq('available', true)
        .gt('stock_quantity', 0)
        .eq('product.active', true)
        .eq('dealer.active', true)
        .eq('dealer.accepting_orders', true)
        .order('selling_price', { ascending: true })
        .limit(8),
      supabase.from('system_settings').select('system_name,tagline,logo_url,contact_phone,alternate_phone,contact_email,support_email,business_address,timezone,currency_symbol,default_delivery_fee,maintenance_mode').maybeSingle(),
      supabase.from('business_hours').select('day_of_week,is_open,open_time,close_time,second_open_time,second_close_time').order('day_of_week'),
    ]);

    const settings = settingsResult.data as SettingsRow | null;
    const rawCategories = (categoryResult.data ?? []) as CategoryRow[];
    const sourceCategories = rawCategories.length ? rawCategories : schemaCategories;
    const listings = (listingResult.data ?? []) as unknown as ListingRow[];
    const products = new Map<string, HomeProduct>();
    for (const listing of listings) {
      const product = Array.isArray(listing.product) ? listing.product[0] : listing.product;
      if (!product || products.has(product.id)) continue;
      products.set(product.id, {
        id: product.id,
        name: product.name,
        brand: product.brand,
        size: product.size,
        unit: product.unit,
        imageUrl: product.image_url,
        price: Number(listing.selling_price),
        categoryId: product.category_id,
      });
    }
    const productRows = [...products.values()];
    const hours = (hoursResult.data ?? []) as BusinessHoursRow[];
    const timezone = settings?.timezone || fallbackTimezone;
    const open = calculateOpenStatus(hours, timezone);

    return {
      ...defaultData,
      systemName: settings?.system_name || defaultData.systemName,
      tagline: settings?.tagline || defaultData.tagline,
      logoUrl: settings?.logo_url || null,
      phone: settings?.contact_phone || settings?.alternate_phone || null,
      email: settings?.contact_email || settings?.support_email || null,
      businessAddress: settings?.business_address || defaultData.businessAddress,
      timezone,
      currencySymbol: settings?.currency_symbol || defaultData.currencySymbol,
      deliveryFee: settings?.default_delivery_fee !== null && settings?.default_delivery_fee !== undefined
        ? Number(settings.default_delivery_fee)
        : defaultData.deliveryFee,
      maintenanceMode: settings?.maintenance_mode ?? false,
      categories: sourceCategories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        imageUrl: 'image_url' in category ? category.image_url : null,
        productImageUrl: productRows.find(product => product.categoryId === category.id)?.imageUrl ?? null,
      })),
      products: productRows,
      ...open,
    };
  } catch {
    return defaultData;
  }
}