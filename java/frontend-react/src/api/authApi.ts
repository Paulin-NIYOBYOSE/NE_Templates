import api from './axiosInstance';

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  email: string;
  fullName: string;
  role: string;
}

export const signup = (data: SignupData) =>
  api.post<AuthResponse>('/auth/signup', data);

export const login = (data: LoginData) =>
  api.post<AuthResponse>('/auth/login', data);
