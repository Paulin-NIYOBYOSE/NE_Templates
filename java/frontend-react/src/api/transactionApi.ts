import api from './axiosInstance';
import { PageResponse } from './productApi';

export interface CheckoutItem {
  productCode: string;
  quantity: number;
}

export interface TransactionReport {
  transactionId: number;
  customerName: string;
  date: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: string;
}

export const checkout = (items: CheckoutItem[]) =>
  api.post('/transactions/checkout', { items });

export const getReport = (
  page = 0,
  size = 10,
  startDate?: string,
  endDate?: string
) => {
  let url = `/transactions/report?page=${page}&size=${size}&sort=id,desc`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;
  return api.get<PageResponse<TransactionReport>>(url);
};
