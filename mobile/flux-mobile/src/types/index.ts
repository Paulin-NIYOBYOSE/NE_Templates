/* ── Shared type definitions ────────────────────────── */

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

/** Generic entity item – keys depend on appConfig.entityFields */
export interface EntityItem {
  id: string;
  [key: string]: unknown;
  createdAt?: string;
  updatedAt?: string;
}

export interface GeneratedRecord {
  id?: string;
  meterNumber: string;
  amount: number;
  token: string;
  valueDays: number;
  createdAt: string;
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  ItemList: undefined;
  ItemForm: { item?: EntityItem };
  Generate: undefined;
  Validate: undefined;
  History: undefined;
  Profile: undefined;
};
