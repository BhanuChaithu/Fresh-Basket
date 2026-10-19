export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  category_name?: string;
  image_url: string;
  unit: string; // e.g. "₹/kg", "₹/500 g", "₹/bunch", "₹/pack", "₹/box"
  current_price: number;
  previous_price?: number | null;
  is_available: boolean;
  min_quantity: number;
  is_featured: boolean;
  is_sample_data: boolean; // clearly marks sample data per spec
  storage_notes?: string;
  origin?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'Pending confirmation'
  | 'Confirmed'
  | 'Awaiting procurement'
  | 'Preparing'
  | 'Ready for dispatch'
  | 'Out for delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'Cash on Delivery' | 'Manual UPI';

export type PaymentStatus = 'Pending' | 'Verified' | 'Paid on Delivery';

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  unit: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  lookup_token: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  neighbourhood: string;
  pincode: string;
  delivery_slot: string;
  delivery_instructions?: string;
  subtotal: number;
  delivery_charge: number;
  total_amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  upi_reference?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface DeliveryArea {
  id: string;
  pincode: string;
  area_name: string;
  is_active: boolean;
  min_order_value: number;
  delivery_charge: number;
}

export interface BusinessSettings {
  id?: string;
  store_name: string;
  slogan: string;
  whatsapp_number: string; // E.g. "919876543210" without symbols
  display_phone: string;   // E.g. "+91 98765 43210"
  contact_email: string;
  city: string;
  state: string;
  service_notes: string;
  upi_id: string;          // E.g. "freshbasket@upi"
  upi_account_name: string;
  free_delivery_threshold: number;
  standard_delivery_charge: number;
  minimum_order_value: number;
  cod_enabled: boolean;
  manual_upi_enabled: boolean;
  upi_qr_image?: string;
  delivery_slots: string[];
}
