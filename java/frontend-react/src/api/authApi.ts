import api from './axiosInstance';

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}
export interface LoginData { email: string; password: string }
export interface AuthResponse {
  token: string;
  type: string;
  email: string;
  fullName: string;
  role: string;
}
export interface ChangePasswordData { currentPassword: string; newPassword: string }

export const signup        = (d: SignupData)        => api.post<AuthResponse>('/auth/signup', d);
export const login         = (d: LoginData)         => api.post<AuthResponse>('/auth/login', d);
export const changePassword = (d: ChangePasswordData) => api.put('/auth/change-password', d);
