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

export const INITIAL_PRODUCTS: Product[] = [];

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
