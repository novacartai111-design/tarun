export type CategoryType = 'dresses' | 'handbags' | 'jewellery' | 'accessories';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: CategoryType;
  price: number; // In INR (₹)
  originalPrice: number; // MRP in INR
  discount: number; // Percentage
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  description: string;
  specifications: Record<string, string>;
  tags: string[];
  featured?: boolean;
  isNewArrival?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'UPI' | 'Card' | 'NetBanking' | 'CashOnDelivery';

export interface ShippingAddress {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  houseNo: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  image: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid' | 'COD';
  orderStatus: OrderStatus;
  shippingAddress: ShippingAddress;
  createdAt: string;
  estimatedDeliveryDate: string;
  trackingNumber: string;
  courierPartner: string;
  trackingUpdates: {
    status: OrderStatus;
    timestamp: string;
    description: string;
  }[];
}

export interface PromoCoupon {
  code: string;
  discountPercentage?: number;
  discountAmount?: number;
  minOrderValue: number;
  description: string;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
  type: 'order' | 'promo' | 'system';
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  recommendedProductIds?: string[];
  followUpQuestions?: string[];
  timestamp: string;
}
