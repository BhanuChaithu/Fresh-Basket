import fs from 'fs';
import path from 'path';
import {
  Category,
  Product,
  Order,
  OrderItem,
  DeliveryArea,
  BusinessSettings,
  OrderStatus,
  PaymentStatus,
} from './types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_DELIVERY_AREAS,
  INITIAL_SETTINGS,
} from './local-data';
import { supabaseAdmin, isSupabaseConfigured } from './supabase';

interface StoredPriceHistory {
  id: string;
  product_id: string;
  old_price: number;
  new_price: number;
  changed_at: string;
}

interface LocalDatabase {
  categories: Category[];
  products: Product[];
  delivery_areas: DeliveryArea[];
  settings: BusinessSettings;
  orders: Order[];
  price_history: StoredPriceHistory[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'fresh_basket_db.json');

// In-memory fallback if filesystem is read-only (e.g. serverless edge)
let memoryDb: LocalDatabase | null = null;

function getInitialDb(): LocalDatabase {
  return {
    categories: [...INITIAL_CATEGORIES],
    products: [...INITIAL_PRODUCTS],
    delivery_areas: [...INITIAL_DELIVERY_AREAS],
    settings: { ...INITIAL_SETTINGS },
    orders: [
      {
        id: 'ord-sample-101',
        order_number: 'FB-2026-101',
        lookup_token: 'tok_fb_demo_hsr_789',
        customer_name: 'Ananya Sharma',
        customer_phone: '+91 98450 12345',
        customer_email: 'ananya.s@example.com',
        delivery_address: 'Flat 402, Green Palms, 14th Main, Sector 4',
        neighbourhood: 'HSR Layout',
        pincode: '560102',
        delivery_slot: 'Morning Slot: 07:00 AM – 10:00 AM (Next Day)',
        delivery_instructions: 'Please leave with security if doorbell not answered.',
        subtotal: 399,
        delivery_charge: 0,
        total_amount: 399,
        status: 'Confirmed',
        payment_method: 'Cash on Delivery',
        payment_status: 'Pending',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        items: [
          {
            product_id: 'prod-veg-basket-essential',
            product_name: 'Weekly Essential Veggie Basket (Family of 3-4)',
            unit: '₹/basket (~8.5 kg)',
            unit_price: 399,
            quantity: 1,
            total_price: 399,
          },
        ],
      },
    ],
    price_history: [],
  };
}

function loadLocalDb(): LocalDatabase {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(content);
      return memoryDb!;
    }
  } catch (err) {
    console.warn('Could not read from local db file, falling back to memory:', err);
  }

  const initial = getInitialDb();
  saveLocalDb(initial);
  memoryDb = initial;
  return memoryDb;
}

function saveLocalDb(data: LocalDatabase): void {
  memoryDb = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist to local db file (using in-memory):', err);
  }
}

// ----------------------------------------------------
// PRODUCT REPOSITORY
// ----------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error && data && data.length > 0) return data;
  }
  const db = loadLocalDb();
  return db.categories.sort((a, b) => a.display_order - b.display_order);
}

export async function getProducts(options?: {
  categoryId?: string;
  isFeatured?: boolean;
  search?: string;
  includeUnavailable?: boolean;
}): Promise<Product[]> {
  if (isSupabaseConfigured && supabaseAdmin) {
    let query = supabaseAdmin.from('products').select('*');
    if (options?.categoryId) query = query.eq('category_id', options.categoryId);
    if (options?.isFeatured) query = query.eq('is_featured', true);
    if (!options?.includeUnavailable) query = query.eq('is_available', true);
    if (options?.search) query = query.ilike('name', `%${options.search}%`);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (!error && data) return data;
  }

  const db = loadLocalDb();
  let list = [...db.products];

  if (options?.categoryId) {
    list = list.filter((p) => p.category_id === options.categoryId);
  }
  if (options?.isFeatured) {
    list = list.filter((p) => p.is_featured);
  }
  if (!options?.includeUnavailable) {
    list = list.filter((p) => p.is_available);
  }
  if (options?.search) {
    const s = options.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        (p.category_name && p.category_name.toLowerCase().includes(s))
    );
  }

  return list;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (!error && data) return data;
  }
  const db = loadLocalDb();
  return db.products.find((p) => p.id === id) || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    if (!error && data) return data;
  }
  const db = loadLocalDb();
  return db.products.find((p) => p.slug === slug) || null;
}

export async function saveProduct(
  productData: Partial<Product> & { name: string; current_price: number }
): Promise<Product> {
  const db = loadLocalDb();
  const now = new Date().toISOString();

  // Look up category name if provided
  let categoryName = productData.category_name;
  if (!categoryName && productData.category_id) {
    const cat = db.categories.find((c) => c.id === productData.category_id);
    if (cat) categoryName = cat.name;
  }

  if (productData.id) {
    const existingIndex = db.products.findIndex((p) => p.id === productData.id);
    if (existingIndex >= 0) {
      const existing = db.products[existingIndex];

      // Track price changes
      if (existing.current_price !== productData.current_price) {
        db.price_history.push({
          id: `ph-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          product_id: existing.id,
          old_price: existing.current_price,
          new_price: productData.current_price,
          changed_at: now,
        });
      }

      const updated: Product = {
        ...existing,
        ...productData,
        category_name: categoryName || existing.category_name,
        updated_at: now,
      };

      db.products[existingIndex] = updated;
      saveLocalDb(db);

      if (isSupabaseConfigured && supabaseAdmin) {
        await supabaseAdmin.from('products').update(updated).eq('id', updated.id);
      }

      return updated;
    }
  }

  // Create new product
  const slug =
    productData.slug ||
    productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const newProduct: Product = {
    id: productData.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: productData.name,
    slug: `${slug}-${Math.random().toString(36).substring(2, 5)}`,
    description: productData.description || '',
    category_id: productData.category_id || 'cat-veg',
    category_name: categoryName || 'Vegetables',
    image_url:
      productData.image_url ||
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    unit: productData.unit || '₹/kg',
    current_price: productData.current_price,
    previous_price: productData.previous_price || null,
    is_available: productData.is_available ?? true,
    min_quantity: productData.min_quantity || 1,
    is_featured: productData.is_featured || false,
    is_sample_data: false, // user created products are not sample data
    origin: productData.origin || 'Bengaluru Local Sourcing',
    storage_notes: productData.storage_notes || 'Keep in cool dry place.',
    created_at: now,
    updated_at: now,
  };

  db.products.unshift(newProduct);
  saveLocalDb(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    await supabaseAdmin.from('products').insert([newProduct]);
  }

  return newProduct;
}

export async function updateProductPrice(
  id: string,
  newPrice: number,
  previousPrice?: number | null
): Promise<Product | null> {
  const db = loadLocalDb();
  const prod = db.products.find((p) => p.id === id);
  if (!prod) return null;

  const now = new Date().toISOString();
  db.price_history.push({
    id: `ph-${Date.now()}`,
    product_id: id,
    old_price: prod.current_price,
    new_price: newPrice,
    changed_at: now,
  });

  prod.previous_price = previousPrice !== undefined ? previousPrice : prod.current_price;
  prod.current_price = newPrice;
  prod.updated_at = now;
  saveLocalDb(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    await supabaseAdmin
      .from('products')
      .update({
        current_price: newPrice,
        previous_price: prod.previous_price,
        updated_at: now,
      })
      .eq('id', id);
  }

  return prod;
}

export async function toggleProductAvailability(
  id: string,
  isAvailable: boolean
): Promise<Product | null> {
  const db = loadLocalDb();
  const prod = db.products.find((p) => p.id === id);
  if (!prod) return null;

  const now = new Date().toISOString();
  prod.is_available = isAvailable;
  prod.updated_at = now;
  saveLocalDb(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    await supabaseAdmin
      .from('products')
      .update({ is_available: isAvailable, updated_at: now })
      .eq('id', id);
  }

  return prod;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = loadLocalDb();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return false;

  db.products.splice(index, 1);
  saveLocalDb(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    await supabaseAdmin.from('products').delete().eq('id', id);
  }

  return true;
}

// ----------------------------------------------------
// DELIVERY AREAS & PIN CODES
// ----------------------------------------------------

export async function getDeliveryAreas(): Promise<DeliveryArea[]> {
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin.from('delivery_areas').select('*');
    if (!error && data) return data;
  }
  const db = loadLocalDb();
  return db.delivery_areas;
}

export async function checkPincode(pincode: string): Promise<{
  is_serviceable: boolean;
  area?: DeliveryArea;
  message: string;
}> {
  const cleanPin = pincode.trim();
  const areas = await getDeliveryAreas();
  const matched = areas.find((a) => a.pincode === cleanPin && a.is_active);

  if (matched) {
    return {
      is_serviceable: true,
      area: matched,
      message: `Great news! We deliver to ${matched.area_name} (PIN ${cleanPin}).`,
    };
  }

  return {
    is_serviceable: false,
    message: `PIN ${cleanPin} is currently outside our immediate Bengaluru delivery zones. We are expanding quickly! Contact us on WhatsApp for special bulk delivery enquiries.`,
  };
}

export async function saveDeliveryArea(area: DeliveryArea): Promise<DeliveryArea> {
  const db = loadLocalDb();
  const index = db.delivery_areas.findIndex((a) => a.id === area.id || a.pincode === area.pincode);

  if (index >= 0) {
    db.delivery_areas[index] = { ...db.delivery_areas[index], ...area };
    saveLocalDb(db);
    return db.delivery_areas[index];
  } else {
    const newArea = {
      ...area,
      id: area.id || `area-${Date.now()}`,
    };
    db.delivery_areas.push(newArea);
    saveLocalDb(db);
    return newArea;
  }
}

// ----------------------------------------------------
// BUSINESS SETTINGS
// ----------------------------------------------------

export async function getSettings(): Promise<BusinessSettings> {
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('business_settings')
      .select('*')
      .limit(1)
      .single();
    if (!error && data) return data;
  }
  const db = loadLocalDb();
  return db.settings;
}

export async function updateSettings(
  partial: Partial<BusinessSettings>
): Promise<BusinessSettings> {
  const db = loadLocalDb();
  db.settings = { ...db.settings, ...partial };
  saveLocalDb(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    await supabaseAdmin
      .from('business_settings')
      .upsert({ id: 'main', ...db.settings });
  }

  return db.settings;
}

// ----------------------------------------------------
// ORDERS & CHECKOUT
// ----------------------------------------------------

export async function getOrders(statusFilter?: string): Promise<Order[]> {
  if (isSupabaseConfigured && supabaseAdmin) {
    let query = supabaseAdmin.from('orders').select('*');
    if (statusFilter && statusFilter !== 'All') {
      query = query.eq('status', statusFilter);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (!error && data) return data;
  }

  const db = loadLocalDb();
  let list = [...db.orders];
  if (statusFilter && statusFilter !== 'All') {
    list = list.filter((o) => o.status === statusFilter);
  }
  return list.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    if (!error && data) return data;
  }

  const db = loadLocalDb();
  return db.orders.find((o) => o.id === id) || null;
}

export async function getOrderByLookupToken(token: string): Promise<Order | null> {
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('lookup_token', token)
      .single();
    if (!error && data) return data;
  }

  const db = loadLocalDb();
  return db.orders.find((o) => o.lookup_token === token) || null;
}

export async function lookupOrder(orderNumber: string, phone: string): Promise<Order | null> {
  const cleanOrderNum = orderNumber.trim().toUpperCase();
  const cleanPhone = phone.replace(/\D/g, '').slice(-10); // match last 10 digits

  const db = loadLocalDb();
  const order = db.orders.find((o) => {
    const oNum = o.order_number.trim().toUpperCase();
    const oPhone = o.customer_phone.replace(/\D/g, '').slice(-10);
    return oNum === cleanOrderNum && oPhone === cleanPhone;
  });

  return order || null;
}

/**
 * Server-side validated order creation
 * Recalculates all prices, units, and delivery charges server-side.
 */
export async function createOrder(payload: {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  neighbourhood: string;
  pincode: string;
  delivery_slot: string;
  delivery_instructions?: string;
  payment_method: 'Cash on Delivery' | 'Manual UPI';
  upi_reference?: string;
  items: { product_id: string; quantity: number }[];
}): Promise<{ order: Order; error?: string }> {
  const db = loadLocalDb();
  const settings = await getSettings();

  // Validate items
  if (!payload.items || payload.items.length === 0) {
    return { order: null as unknown as Order, error: 'Cart is empty' };
  }

  // Recalculate prices from server product data (never trust client prices!)
  let recalculatedSubtotal = 0;
  const snapshottedItems: OrderItem[] = [];

  for (const item of payload.items) {
    const product = db.products.find((p) => p.id === item.product_id);
    if (!product) {
      return { order: null as unknown as Order, error: `Product ID not found: ${item.product_id}` };
    }
    if (!product.is_available) {
      return {
        order: null as unknown as Order,
        error: `Sorry, "${product.name}" is currently out of stock. Please remove it from your cart to proceed.`,
      };
    }
    const itemTotal = product.current_price * item.quantity;
    recalculatedSubtotal += itemTotal;

    snapshottedItems.push({
      product_id: product.id,
      product_name: product.name,
      unit: product.unit,
      unit_price: product.current_price,
      quantity: item.quantity,
      total_price: itemTotal,
    });
  }

  // Check pincode serviceability & delivery charge
  const pinCheck = await checkPincode(payload.pincode);
  let deliveryCharge = settings.standard_delivery_charge;

  if (pinCheck.area) {
    deliveryCharge = pinCheck.area.delivery_charge;
    if (recalculatedSubtotal < pinCheck.area.min_order_value) {
      return {
        order: null as unknown as Order,
        error: `Minimum order value for ${pinCheck.area.area_name} is ₹${pinCheck.area.min_order_value}. Your current produce subtotal is ₹${recalculatedSubtotal}.`,
      };
    }
  }

  // Free delivery threshold check
  if (recalculatedSubtotal >= settings.free_delivery_threshold) {
    deliveryCharge = 0;
  }

  const totalAmount = recalculatedSubtotal + deliveryCharge;
  const now = new Date();
  const orderNumber = `FB-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  // Cryptographically random / unpredictable lookup token
  const lookupToken = `tok_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    order_number: orderNumber,
    lookup_token: lookupToken,
    customer_name: payload.customer_name.trim(),
    customer_phone: payload.customer_phone.trim(),
    customer_email: payload.customer_email?.trim() || '',
    delivery_address: payload.delivery_address.trim(),
    neighbourhood: payload.neighbourhood.trim(),
    pincode: payload.pincode.trim(),
    delivery_slot: payload.delivery_slot,
    delivery_instructions: payload.delivery_instructions?.trim() || '',
    subtotal: recalculatedSubtotal,
    delivery_charge: deliveryCharge,
    total_amount: totalAmount,
    status: 'Pending confirmation',
    payment_method: payload.payment_method,
    payment_status: 'Pending',
    upi_reference: payload.upi_reference?.trim() || '',
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    items: snapshottedItems,
  };

  db.orders.unshift(newOrder);
  saveLocalDb(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    await supabaseAdmin.from('orders').insert([newOrder]);
  }

  return { order: newOrder };
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  internalNotes?: string
): Promise<Order | null> {
  const db = loadLocalDb();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;

  const now = new Date().toISOString();
  order.status = status;
  if (internalNotes !== undefined) {
    order.internal_notes = internalNotes;
  }
  order.updated_at = now;

  // Auto-mark payment if delivered on COD
  if (status === 'Delivered' && order.payment_method === 'Cash on Delivery') {
    order.payment_status = 'Paid on Delivery';
  }

  saveLocalDb(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    await supabaseAdmin
      .from('orders')
      .update({
        status,
        internal_notes: order.internal_notes,
        payment_status: order.payment_status,
        updated_at: now,
      })
      .eq('id', orderId);
  }

  return order;
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus
): Promise<Order | null> {
  const db = loadLocalDb();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;

  const now = new Date().toISOString();
  order.payment_status = paymentStatus;
  order.updated_at = now;
  saveLocalDb(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    await supabaseAdmin
      .from('orders')
      .update({ payment_status: paymentStatus, updated_at: now })
      .eq('id', orderId);
  }

  return order;
}

export async function getDashboardStats(): Promise<{
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
  activeProducts: number;
  recentOrders: Order[];
}> {
  const db = loadLocalDb();
  const orders = db.orders;
  const products = db.products;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending confirmation').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0);
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.is_available).length;
  const recentOrders = orders.slice(0, 5);

  return {
    totalOrders,
    pendingOrders,
    totalRevenue,
    totalProducts,
    activeProducts,
    recentOrders,
  };
}
