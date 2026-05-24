import api from './axiosInstance';

/**
 * Product/Core entity types.
 * RENAME: Parking, Equipment, Laptop, etc.
 */
export interface Product {
  id: number;
  code: string;
  name: string;
  type: string;
  price: number;
  inDate: string;
  imageUrl?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export const getProducts = (page = 0, size = 10) =>
  api.get<PageResponse<Product>>(`/products?page=${page}&size=${size}&sort=id,asc`);

export const getProductByCode = (code: string) =>
  api.get<Product>(`/products/${code}`);
