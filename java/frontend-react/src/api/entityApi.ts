import api from './axiosInstance';
import appConfig from '../config/appConfig';

export interface Entity {
  id: number;
  code: string;
  name: string;
  type?: string;
  price: number;
  inDate?: string;
  imageUrl?: string;
  [key: string]: unknown;
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

const path = appConfig.api.entity;

export const getEntities  = (page = 0, size = 9) =>
  api.get<PageResponse<Entity>>(`${path}?page=${page}&size=${size}&sort=id,asc`);

export const getByCode    = (code: string) =>
  api.get<Entity>(`${path}/${code}`);
