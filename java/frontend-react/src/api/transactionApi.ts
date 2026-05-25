import api from './axiosInstance';
import appConfig from '../config/appConfig';
import { PageResponse } from './entityApi';

export interface CheckoutItem { productCode: string; quantity: number }

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
  api.post(appConfig.api.checkout, { items });

export const getReport = (page = 0, size = 10, startDate?: string, endDate?: string) => {
  let url = `${appConfig.api.report}?page=${page}&size=${size}&sort=id,desc`;
  if (startDate) url += `&startDate=${startDate}T00:00:00`;
  if (endDate)   url += `&endDate=${endDate}T23:59:59`;
  return api.get<PageResponse<TransactionReport>>(url);
};

export const sendConfirmationEmail = (payload: object) =>
  api.post(appConfig.api.emailSend, payload);
