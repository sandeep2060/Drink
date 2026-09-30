import { getSupabaseBrowserClient } from './supabase';

export type ProductCategory =
  | 'All'
  | 'Beer & Craft'
  | 'Whiskey & Spirits'
  | 'Wine'
  | 'Soft Drinks & Soda'
  | 'Energy & Juice'
  | 'Water & Mixers';

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subCategory?: string;
  description: string;
  size: string;
  unit: string;
  price: number;
  costPrice?: number;
  stockQuantity: number;
  imageUrl?: string;
  active: boolean;
  alcoholic: boolean;
  abv?: number;
  popular?: boolean;
  chilled?: boolean;
  dealerName?: string;
  createdAt?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type DeliveryAddress = {
  id: string;
  label: string;
  zone: string;
  addressLine: string;
  landmark?: string;
  phone: string;
  isDefault: boolean;
};

export type OrderItem = {
  productId: string;
  name: string;
  brand: string;
  size: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  imageUrl?: string;
};

export type OrderStatus =
  | 'PENDING'
  | 'SEARCHING_DEALER'
  | 'DEALER_ASSIGNED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: DeliveryAddress;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'COD' | 'FONEPAY_QR';
  paymentStatus: 'PENDING' | 'PAID';
  status: OrderStatus;
  placedAt: string;
  estimatedDeliveryMinutes: number;
  dealerName: string;
  riderName?: string;
  riderPhone?: string;
  notes?: string;
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-barahsinghe-pilsner',
    name: 'Barahsinghe Craft Pilsner',
    brand: 'Barahsinghe',
    category: 'Beer & Craft',
    description: 'Nepal’s signature craft pilsner brewed with German Weyermann malt and Saaz hops. Crisp, floral and deeply refreshing.',
    size: '650ml Bottle',
    unit: 'bottle',
    price: 365,
    costPrice: 280,
    stockQuantity: 48,
    imageUrl: '/brands/barahsinghe-craft-lager.webp',
    active: true,
    alcoholic: true,
    abv: 5.0,
    popular: true,
    chilled: true,
    dealerName: 'Butwal Central Liquors (Traffic Chowk)',
  },
  {
    id: 'prod-barahsinghe-yak',
    name: 'Barahsinghe Yak Hops Pale Ale',
    brand: 'Barahsinghe',
    category: 'Beer & Craft',
    description: 'Full-bodied craft pale ale brewed with Himalayan water, dry hopped for tropical and pine aromas.',
    size: '500ml Can',
    unit: 'can',
    price: 320,
    costPrice: 245,
    stockQuantity: 36,
    imageUrl: '/brands/barahsinghe-craft-lager.webp',
    active: true,
    alcoholic: true,
    abv: 5.5,
    popular: true,
    chilled: true,
    dealerName: 'Lumbini Beverage Hub (Kalikanagar)',
  },
  {
    id: 'prod-gorkha-beer',
    name: 'Gorkha Premium Beer',
    brand: 'Gorkha',
    category: 'Beer & Craft',
    description: 'Brewed with the finest two-row barley and pure mountain water. An iconic Nepali lager with balanced maltiness.',
    size: '650ml Bottle',
    unit: 'bottle',
    price: 350,
    costPrice: 270,
    stockQuantity: 60,
    imageUrl: '/brands/barahsinghe-craft-lager.webp',
    active: true,
    alcoholic: true,
    abv: 5.5,
    popular: true,
    chilled: true,
    dealerName: 'Butwal Central Liquors (Traffic Chowk)',
  },
  {
    id: 'prod-tuborg-strong',
    name: 'Tuborg Strong Beer',
    brand: 'Tuborg',
    category: 'Beer & Craft',
    description: 'Nepal’s beloved strong lager with rich golden color, clean malt sweetness, and a smooth refreshing finish.',
    size: '650ml Bottle',
    unit: 'bottle',
    price: 375,
    costPrice: 290,
    stockQuantity: 55,
    imageUrl: '/brands/barahsinghe-craft-lager.webp',
    active: true,
    alcoholic: true,
    abv: 6.5,
    popular: true,
    chilled: true,
    dealerName: 'Highway Cold Store (Milanchowk)',
  },
  {
    id: 'prod-carlsberg-elephant',
    name: 'Carlsberg Elephant Strong',
    brand: 'Carlsberg',
    category: 'Beer & Craft',
    description: 'Distinctive European bock-style strong beer. High vinous notes with a warming finish and subtle caramel touches.',
    size: '650ml Bottle',
    unit: 'bottle',
    price: 410,
    costPrice: 320,
    stockQuantity: 30,
    imageUrl: '/brands/barahsinghe-craft-lager.webp',
    active: true,
    alcoholic: true,
    abv: 7.2,
    popular: false,
    chilled: true,
    dealerName: 'Butwal Central Liquors (Traffic Chowk)',
  },
  {
    id: 'prod-arna-light',
    name: 'Arna Premium Light Beer',
    brand: 'Arna',
    category: 'Beer & Craft',
    description: 'Brewed for 25% fewer calories with no compromise on taste. Crisp, light-bodied, perfect for sunny afternoons.',
    size: '650ml Bottle',
    unit: 'bottle',
    price: 320,
    costPrice: 250,
    stockQuantity: 40,
    imageUrl: '/brands/barahsinghe-craft-lager.webp',
    active: true,
    alcoholic: true,
    abv: 4.6,
    popular: false,
    chilled: true,
    dealerName: 'Lumbini Beverage Hub (Kalikanagar)',
  },
  {
    id: 'prod-khukuri-rum',
    name: 'Khukuri XXX Coronation Rum',
    brand: 'Khukuri',
    category: 'Whiskey & Spirits',
    description: 'The Pride of Nepal since 1959. Aged in Himalayan oak casks with notes of dark toffee, molasses, dried fruits, and spice.',
    size: '750ml Bottle',
    unit: 'bottle',
    price: 1650,
    costPrice: 1380,
    stockQuantity: 24,
    active: true,
    alcoholic: true,
    abv: 42.8,
    popular: true,
    dealerName: 'Butwal Central Liquors (Traffic Chowk)',
  },
  {
    id: 'prod-old-durbar-chimney',
    name: 'Old Durbar Black Chimney Peated',
    brand: 'Old Durbar',
    category: 'Whiskey & Spirits',
    description: 'Signature peated malt whisky crafted with Scottish peat smoke and English grain spirits, finished in Oloroso sherry casks.',
    size: '750ml Bottle',
    unit: 'bottle',
    price: 3450,
    costPrice: 2900,
    stockQuantity: 18,
    active: true,
    alcoholic: true,
    abv: 40.0,
    popular: true,
    dealerName: 'Lumbini Beverage Hub (Kalikanagar)',
  },
  {
    id: 'prod-signature-premier',
    name: 'Signature Premier Grain Whisky',
    brand: 'Signature',
    category: 'Whiskey & Spirits',
    description: 'Masterfully blended with 8-year-old aged Scotch malts and mature Indian grain spirits. Smooth, rich, and mellow.',
    size: '750ml Bottle',
    unit: 'bottle',
    price: 2250,
    costPrice: 1890,
    stockQuantity: 20,
    active: true,
    alcoholic: true,
    abv: 42.8,
    popular: false,
    dealerName: 'Highway Cold Store (Milanchowk)',
  },
  {
    id: 'prod-ruslan-vodka',
    name: 'Ruslan Ultra Clean Vodka',
    brand: 'Ruslan',
    category: 'Whiskey & Spirits',
    description: 'Nepal’s pioneer vodka since 1973. Multi-column distilled and cold charcoal filtered for exceptionally pure neutrality.',
    size: '750ml Bottle',
    unit: 'bottle',
    price: 1450,
    costPrice: 1180,
    stockQuantity: 25,
    active: true,
    alcoholic: true,
    abv: 40.0,
    popular: false,
    dealerName: 'Butwal Central Liquors (Traffic Chowk)',
  },
  {
    id: 'prod-8848-vodka',
    name: '8848 Pure Rye Mountain Vodka',
    brand: '8848',
    category: 'Whiskey & Spirits',
    description: 'Crafted from selected grains and pure spring water. Distilled five times to create an ultra-smooth palate.',
    size: '750ml Bottle',
    unit: 'bottle',
    price: 1950,
    costPrice: 1600,
    stockQuantity: 16,
    active: true,
    alcoholic: true,
    abv: 40.0,
    popular: true,
    dealerName: 'Lumbini Beverage Hub (Kalikanagar)',
  },
  {
    id: 'prod-hinwa-wine',
    name: 'Hinwa Sweet Red Wine',
    brand: 'Hinwa',
    category: 'Wine',
    description: 'Handcrafted wild Himalayan berries wine from eastern hills of Nepal. Naturally sweet, fruity and festive.',
    size: '750ml Bottle',
    unit: 'bottle',
    price: 950,
    costPrice: 750,
    stockQuantity: 20,
    active: true,
    alcoholic: true,
    abv: 11.5,
    popular: true,
    dealerName: 'Butwal Central Liquors (Traffic Chowk)',
  },
  {
    id: 'prod-coca-cola-chilled',
    name: 'Coca-Cola Classic (Chilled)',
    brand: 'Coca-Cola',
    category: 'Soft Drinks & Soda',
    description: 'Original crisp taste of Coca-Cola, kept cold and fizzy. Ideal for cooling down or mixing with your favourite pour.',
    size: '1.5L PET Bottle',
    unit: 'bottle',
    price: 180,
    costPrice: 145,
    stockQuantity: 80,
    imageUrl: '/home/drinks-lineup.webp',
    active: true,
    alcoholic: false,
    popular: true,
    chilled: true,
    dealerName: 'Highway Cold Store (Milanchowk)',
  },
  {
    id: 'prod-sprite-chilled',
    name: 'Sprite Lemon-Lime (Chilled)',
    brand: 'Sprite',
    category: 'Soft Drinks & Soda',
    description: 'Clear, effervescent lemon-lime soda delivering an instant burst of cooling hydration.',
    size: '1.5L PET Bottle',
    unit: 'bottle',
    price: 180,
    costPrice: 145,
    stockQuantity: 70,
    imageUrl: '/home/drinks-lineup.webp',
    active: true,
    alcoholic: false,
    popular: true,
    chilled: true,
    dealerName: 'Highway Cold Store (Milanchowk)',
  },
  {
    id: 'prod-fanta-orange',
    name: 'Fanta Orange Sparkle',
    brand: 'Fanta',
    category: 'Soft Drinks & Soda',
    description: 'Bright and bubbly citrus refreshment packed with real fruit flavor and refreshing carbonation.',
    size: '1.5L PET Bottle',
    unit: 'bottle',
    price: 180,
    costPrice: 145,
    stockQuantity: 50,
    imageUrl: '/home/drinks-lineup.webp',
    active: true,
    alcoholic: false,
    popular: false,
    chilled: true,
    dealerName: 'Lumbini Beverage Hub (Kalikanagar)',
  },
  {
    id: 'prod-schweppes-tonic',
    name: 'Schweppes Premium Indian Tonic',
    brand: 'Schweppes',
    category: 'Soft Drinks & Soda',
    description: 'Crafted with fine quinine and sparkling bubbles. The gold standard mixer for spirits and party drinks.',
    size: '330ml Can',
    unit: 'can',
    price: 120,
    costPrice: 90,
    stockQuantity: 40,
    active: true,
    alcoholic: false,
    popular: false,
    chilled: true,
    dealerName: 'Butwal Central Liquors (Traffic Chowk)',
  },
  {
    id: 'prod-schweppes-soda',
    name: 'Schweppes Club Soda (Chilled)',
    brand: 'Schweppes',
    category: 'Soft Drinks & Soda',
    description: 'High pressure effervescent soda water. Crisp neutral taste that lifts beverages without altering flavor.',
    size: '600ml Bottle',
    unit: 'bottle',
    price: 60,
    costPrice: 42,
    stockQuantity: 100,
    active: true,
    alcoholic: false,
    popular: true,
    chilled: true,
    dealerName: 'Highway Cold Store (Milanchowk)',
  },
  {
    id: 'prod-redbull-energy',
    name: 'Red Bull Energy Drink',
    brand: 'Red Bull',
    category: 'Energy & Juice',
    description: 'Appreciated worldwide by top athletes, busy professionals and university students. Vitalizes body and mind.',
    size: '250ml Can',
    unit: 'can',
    price: 220,
    costPrice: 175,
    stockQuantity: 60,
    active: true,
    alcoholic: false,
    popular: true,
    chilled: true,
    dealerName: 'Lumbini Beverage Hub (Kalikanagar)',
  },
  {
    id: 'prod-real-mixed-juice',
    name: 'Real Fruit Power Mixed Fruit',
    brand: 'Real',
    category: 'Energy & Juice',
    description: 'Nutritious blend of 9 natural fruits. Rich in Vitamin C, potassium and antioxidants without preservatives.',
    size: '1 Litre Pack',
    unit: 'pack',
    price: 260,
    costPrice: 210,
    stockQuantity: 45,
    active: true,
    alcoholic: false,
    popular: true,
    chilled: true,
    dealerName: 'Highway Cold Store (Milanchowk)',
  },
  {
    id: 'prod-real-pomegranate',
    name: 'Real Fruit Power Pomegranate',
    brand: 'Real',
    category: 'Energy & Juice',
    description: 'Pure sweet and tart pomegranate goodness. Great on its own over ice or paired with sparkling water.',
    size: '1 Litre Pack',
    unit: 'pack',
    price: 270,
    costPrice: 220,
    stockQuantity: 35,
    active: true,
    alcoholic: false,
    popular: false,
    chilled: true,
    dealerName: 'Highway Cold Store (Milanchowk)',
  },
  {
    id: 'prod-himalayan-water',
    name: 'Himalayan Natural Spring Water (Chilled)',
    brand: 'Himalayan',
    category: 'Water & Mixers',
    description: 'Naturally pure, low mineral spring water sourced directly from high Himalayan aquifers. Served cold.',
    size: '1 Litre Bottle',
    unit: 'bottle',
    price: 35,
    costPrice: 20,
    stockQuantity: 120,
    imageUrl: '/home/water-bottle.webp',
    active: true,
    alcoholic: false,
    popular: true,
    chilled: true,
    dealerName: 'Highway Cold Store (Milanchowk)',
  },
  {
    id: 'prod-aquahundred-case',
    name: 'Aqua Hundred Mineral Water (Case of 12)',
    brand: 'Aqua Hundred',
    category: 'Water & Mixers',
    description: 'Full case of 12 chilled 1L bottles. Ideal for home parties, dinner gatherings, or weekend supplies in Butwal.',
    size: '12 x 1L Pack',
    unit: 'case',
    price: 380,
    costPrice: 280,
    stockQuantity: 25,
    imageUrl: '/home/water-bottle.webp',
    active: true,
    alcoholic: false,
    popular: true,
    chilled: false,
    dealerName: 'Highway Cold Store (Milanchowk)',
  },
];

export const BUTWAL_ZONES = [
  'Traffic Chowk & Central Butwal',
  'Milanchowk & Kalikanagar',
  'Devinagar & Deepnagar',
  'Golpark & Nuwakot Base',
  'Driver Tole & Tilottama North',
  'Belahiya / Sunauli Border Area',
];

export const DEFAULT_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-default-1',
    label: 'Home',
    zone: 'Traffic Chowk & Central Butwal',
    addressLine: 'Ward No. 6, Near Traffic Chowk, Butwal',
    landmark: 'Behind Siddhartha Hotel',
    phone: '+977 9801234567',
    isDefault: true,
  },
  {
    id: 'addr-default-2',
    label: 'Office',
    zone: 'Milanchowk & Kalikanagar',
    addressLine: 'Milanchowk Commercial Complex, 2nd Floor',
    landmark: 'Opposite Global IME Bank',
    phone: '+977 9801234567',
    isDefault: false,
  },
];

const STORAGE_KEYS = {
  PRODUCTS: 'drinkdrop_products_catalog_v1',
  CART: 'drinkdrop_customer_cart_v1',
  ORDERS: 'drinkdrop_customer_orders_v1',
  ADDRESSES: 'drinkdrop_customer_addresses_v1',
  SELECTED_ADDRESS: 'drinkdrop_customer_selected_address_v1',
};

// Safe localStorage helpers
function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('drinkdrop_storage_update'));
  } catch {
    // ignore
  }
}

// Product Management (Shared between Admin & Customer)
export function getCatalogProducts(): Product[] {
  return getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export function saveCatalogProducts(products: Product[]): void {
  setStored(STORAGE_KEYS.PRODUCTS, products);
}

export function addCatalogProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
  const products = getCatalogProducts();
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newProduct, ...products];
  saveCatalogProducts(updated);

  // Background sync to Supabase if connected
  syncProductToSupabase(newProduct);

  return newProduct;
}

export function updateCatalogProduct(id: string, changes: Partial<Product>): Product | null {
  const products = getCatalogProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  const updatedProduct = { ...products[index], ...changes };
  products[index] = updatedProduct;
  saveCatalogProducts([...products]);
  return updatedProduct;
}

export function deleteCatalogProduct(id: string): boolean {
  const products = getCatalogProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  saveCatalogProducts(filtered);
  return true;
}

export function toggleCatalogProductStatus(id: string): boolean {
  const products = getCatalogProducts();
  const product = products.find(p => p.id === id);
  if (!product) return false;
  product.active = !product.active;
  saveCatalogProducts([...products]);
  return product.active;
}

// Async sync to Supabase (non-blocking)
async function syncProductToSupabase(product: Product) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;
  try {
    await supabase.from('products').insert({
      name: product.name,
      brand: product.brand,
      size: product.size,
      unit: product.unit,
      description: product.description,
      image_url: product.imageUrl,
      active: product.active,
    });
  } catch {
    // Keep local version resilient
  }
}

// Cart Management
export function getCustomerCart(): CartItem[] {
  return getStored<CartItem[]>(STORAGE_KEYS.CART, []);
}

export function saveCustomerCart(cart: CartItem[]): void {
  setStored(STORAGE_KEYS.CART, cart);
}

export function addToCustomerCart(product: Product, quantity = 1): CartItem[] {
  const cart = getCustomerCart();
  const existing = cart.find(item => item.product.id === product.id);
  let updated: CartItem[];
  if (existing) {
    updated = cart.map(item =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  } else {
    updated = [...cart, { product, quantity }];
  }
  saveCustomerCart(updated);
  return updated;
}

export function updateCartItemQuantity(productId: string, quantity: number): CartItem[] {
  const cart = getCustomerCart();
  let updated: CartItem[];
  if (quantity <= 0) {
    updated = cart.filter(item => item.product.id !== productId);
  } else {
    updated = cart.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
  }
  saveCustomerCart(updated);
  return updated;
}

export function clearCustomerCart(): void {
  saveCustomerCart([]);
}

// Address Management
export function getCustomerAddresses(): DeliveryAddress[] {
  return getStored<DeliveryAddress[]>(STORAGE_KEYS.ADDRESSES, DEFAULT_ADDRESSES);
}

export function saveCustomerAddresses(addresses: DeliveryAddress[]): void {
  setStored(STORAGE_KEYS.ADDRESSES, addresses);
}

export function addCustomerAddress(address: Omit<DeliveryAddress, 'id'>): DeliveryAddress {
  const addresses = getCustomerAddresses();
  const newAddr: DeliveryAddress = {
    ...address,
    id: `addr-${Date.now()}`,
  };
  let updated = [...addresses];
  if (newAddr.isDefault) {
    updated = updated.map(a => ({ ...a, isDefault: false }));
  }
  updated.unshift(newAddr);
  saveCustomerAddresses(updated);
  return newAddr;
}

export function getSelectedDeliveryAddress(): DeliveryAddress {
  const addresses = getCustomerAddresses();
  const storedId = getStored<string | null>(STORAGE_KEYS.SELECTED_ADDRESS, null);
  if (storedId) {
    const found = addresses.find(a => a.id === storedId);
    if (found) return found;
  }
  const defaultAddr = addresses.find(a => a.isDefault);
  return defaultAddr || addresses[0] || DEFAULT_ADDRESSES[0];
}

export function setSelectedDeliveryAddress(addressId: string): void {
  setStored(STORAGE_KEYS.SELECTED_ADDRESS, addressId);
}

// Orders Management
export function getCustomerOrders(): Order[] {
  return getStored<Order[]>(STORAGE_KEYS.ORDERS, []);
}

export function saveCustomerOrders(orders: Order[]): void {
  setStored(STORAGE_KEYS.ORDERS, orders);
}

export function createCustomerOrder(params: {
  customerName: string;
  customerPhone: string;
  address: DeliveryAddress;
  items: CartItem[];
  paymentMethod: 'COD' | 'FONEPAY_QR';
  notes?: string;
}): Order {
  const orders = getCustomerOrders();
  const subtotal = params.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  // Free delivery for orders over Rs. 1000
  const deliveryFee = subtotal >= 1000 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const orderNumber = `DD-${Math.floor(10000 + Math.random() * 90000)}`;

  const orderItems: OrderItem[] = params.items.map(item => ({
    productId: item.product.id,
    name: item.product.name,
    brand: item.product.brand,
    size: item.product.size,
    unitPrice: item.product.price,
    quantity: item.quantity,
    lineTotal: item.product.price * item.quantity,
    imageUrl: item.product.imageUrl,
  }));

  const newOrder: Order = {
    id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    orderNumber,
    customerName: params.customerName,
    customerPhone: params.customerPhone,
    address: params.address,
    items: orderItems,
    subtotal,
    deliveryFee,
    tax: 0,
    discount: 0,
    total,
    paymentMethod: params.paymentMethod,
    paymentStatus: 'PENDING',
    status: 'SEARCHING_DEALER',
    placedAt: new Date().toISOString(),
    estimatedDeliveryMinutes: 35,
    dealerName: 'Butwal Central Liquors (Traffic Chowk)',
    riderName: 'Bikash Thapa',
    riderPhone: '+977 9812345678',
    notes: params.notes,
  };

  const updatedOrders = [newOrder, ...orders];
  saveCustomerOrders(updatedOrders);
  clearCustomerCart();

  // Try creating in Supabase as well
  syncOrderToSupabase(newOrder);

  return newOrder;
}

export function updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
  const orders = getCustomerOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;
  order.status = status;
  saveCustomerOrders([...orders]);
  return order;
}

export function cancelCustomerOrder(orderId: string): boolean {
  const orders = getCustomerOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return false;
  if (['DELIVERED', 'CANCELLED', 'OUT_FOR_DELIVERY'].includes(order.status)) {
    return false;
  }
  order.status = 'CANCELLED';
  saveCustomerOrders([...orders]);
  return true;
}

async function syncOrderToSupabase(order: Order) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;
  try {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return;

    await supabase.from('orders').insert({
      order_number: order.orderNumber,
      customer_id: authData.user.id,
      subtotal: order.subtotal,
      delivery_fee: order.deliveryFee,
      total: order.total,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      status: order.status,
      notes: order.notes,
    });
  } catch {
    // Keep local order tracking unbroken
  }
}
