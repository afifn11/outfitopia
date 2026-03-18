// src/types/index.ts
// Semua tipe utama untuk Outfitopia backend

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  id: number;
  role: 'user' | 'admin';
}

export interface AuthenticatedRequest extends Express.Request {
  user: JwtPayload;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  created_at: Date;
}

export type PublicUser = Omit<User, 'password'>;

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  sizes: string; // raw comma-separated dari DB
  is_featured: boolean;
  average_rating: number;
  num_reviews: number;
}

export interface ProductWithSizes extends Omit<Product, 'sizes'> {
  sizes: string[];
}

export interface Category {
  id: number;
  name: string;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus = 'Pending' | 'Shipped' | 'Completed' | 'Cancelled';

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  shipping_address: string;
  customer_name: string;
  customer_phone: string;
  status: OrderStatus;
  order_date: Date;
}

export interface CartItem {
  id: number;
  quantity: number;
  price: number;
  selectedSize: string;
}

export interface CreateOrderBody {
  userDetails: {
    name: string;
    phone: string;
    address: string;
  };
  cartItems: CartItem[];
  totalPrice: number;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  created_at: Date;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;
