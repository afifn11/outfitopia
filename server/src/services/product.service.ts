// src/services/product.service.ts
// Business logic produk + caching untuk endpoint yang sering diakses

import NodeCache from 'node-cache';
import pool from '../config/db.js';
import type { ProductWithSizes } from '../types/index.js';

// Cache 5 menit untuk data yang jarang berubah
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const parseProduct = (row: any): ProductWithSizes => ({
  ...row,
  sizes: typeof row.sizes === 'string' && row.sizes ? row.sizes.split(',') : [],
});

export interface GetAllProductsParams {
  search?: string;
  sortBy?: string;
  order?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const getAllProducts = async (params: GetAllProductsParams) => {
  const {
    search, sortBy, order,
    category, page = 1, limit = 12,
  } = params;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const offset = (pageNum - 1) * limitNum;

  let countSql = `
    SELECT COUNT(DISTINCT p.id) as total
    FROM products p
    LEFT JOIN product_categories pc ON p.id = pc.product_id
    LEFT JOIN categories c ON pc.category_id = c.id
  `;
  let dataSql = `
    SELECT DISTINCT p.* FROM products p
    LEFT JOIN product_categories pc ON p.id = pc.product_id
    LEFT JOIN categories c ON pc.category_id = c.id
  `;

  const queryParams: (string | number)[] = [];
  const whereClauses: string[] = [];

  if (search) {
    whereClauses.push('p.name LIKE ?');
    queryParams.push(`%${search}%`);
  }
  if (category) {
    whereClauses.push('c.name = ?');
    queryParams.push(category);
  }
  if (whereClauses.length > 0) {
    const whereStr = ' WHERE ' + whereClauses.join(' AND ');
    countSql += whereStr;
    dataSql += whereStr;
  }

  const [countRows] = await pool.query<any[]>(countSql, queryParams);
  const totalProducts: number = (countRows as any[])[0].total;
  const totalPages = Math.ceil(totalProducts / limitNum);

  // Whitelist sort columns untuk cegah SQL injection
  const allowedSortBy = ['name', 'price', 'average_rating', 'created_at'];
  const sortKey = allowedSortBy.includes(sortBy ?? '') ? `p.${sortBy}` : 'p.name';
  const sortOrder = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  dataSql += ` ORDER BY ${sortKey} ${sortOrder} LIMIT ? OFFSET ?`;
  const dataParams = [...queryParams, limitNum, offset];

  const [rows] = await pool.query<any[]>(dataSql, dataParams);
  const products = (rows as any[]).map(parseProduct);

  return { products, currentPage: pageNum, totalPages, totalProducts };
};

export const getProductById = async (id: number): Promise<ProductWithSizes & { categories: { id: number; name: string }[] }> => {
  // REFACTOR: 1 query dengan JOIN, bukan 2 query terpisah
  const [rows] = await pool.query<any[]>(
    `SELECT p.*,
       JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'name', c.name)) as categories_raw
     FROM products p
     LEFT JOIN product_categories pc ON p.id = pc.product_id
     LEFT JOIN categories c ON pc.category_id = c.id
     WHERE p.id = ?
     GROUP BY p.id`,
    [id],
  );

  const row = (rows as any[])[0];
  if (!row) return Promise.reject(null); // caller handle sebagai 404

  const categories = row.categories_raw
    ? (JSON.parse(row.categories_raw) as any[]).filter((c: any) => c.id !== null)
    : [];

  return { ...parseProduct(row), categories };
};

// Featured products — di-cache karena jarang berubah
export const getFeaturedProducts = async (): Promise<ProductWithSizes[]> => {
  const CACHE_KEY = 'featured_products';
  const cached = cache.get<ProductWithSizes[]>(CACHE_KEY);
  if (cached) return cached;

  const [rows] = await pool.query<any[]>(
    'SELECT * FROM products WHERE is_featured = 1 ORDER BY average_rating DESC LIMIT 8',
  );
  const products = (rows as any[]).map(parseProduct);
  cache.set(CACHE_KEY, products);
  return products;
};

// Invalidate cache saat admin update produk
export const invalidateProductCache = (): void => {
  cache.del('featured_products');
  cache.del('bestselling_products');
};

export const getBestsellingProducts = async (): Promise<ProductWithSizes[]> => {
  const CACHE_KEY = 'bestselling_products';
  const cached = cache.get<ProductWithSizes[]>(CACHE_KEY);
  if (cached) return cached;

  const [rows] = await pool.query<any[]>(`
    SELECT p.*, SUM(oi.quantity) as total_sold
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    GROUP BY p.id
    ORDER BY total_sold DESC
    LIMIT 8
  `);
  const products = (rows as any[]).map(parseProduct);
  cache.set(CACHE_KEY, products);
  return products;
};
