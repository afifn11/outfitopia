// client/src/types/index.ts
// Tipe bersama yang dipakai di seluruh frontend

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  sizes: string[];
  is_featured: boolean;
  average_rating: number;
  num_reviews: number;
  categories?: Category[];
}

export interface Category {
  id: number;
  name: string;
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Completed' | 'Cancelled';

export interface Order {
  id: number;
  total_amount: number;
  shipping_address: string;
  customer_name: string;
  customer_phone: string;
  status: OrderStatus;
  order_date: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  size: string;
  productName: string;
  productImage: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  userName: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize: string;
}

// ─── API Response wrapper ─────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
}

export interface PaginatedProducts {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}
