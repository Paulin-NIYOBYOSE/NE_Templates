import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, signup as apiSignup, LoginData, SignupData, AuthResponse } from '../api/authApi';

interface UserInfo {
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuthResponse = (res: AuthResponse) => {
    const userInfo: UserInfo = { email: res.email, fullName: res.fullName, role: res.role };
    setToken(res.token);
    setUser(userInfo);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(userInfo));
  };

  const login = async (data: LoginData) => {
    const response = await apiLogin(data);
    handleAuthResponse(response.data);
  };

  const signup = async (data: SignupData) => {
    const response = await apiSignup(data);
    handleAuthResponse(response.data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
