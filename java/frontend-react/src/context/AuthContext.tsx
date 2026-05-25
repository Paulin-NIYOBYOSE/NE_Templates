import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, signup as apiSignup, LoginData, SignupData, AuthResponse } from '../api/authApi';

export interface UserInfo { email: string; fullName: string; role: string }

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (d: LoginData) => Promise<void>;
  signup: (d: SignupData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]   = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t && u) { setToken(t); setUser(JSON.parse(u)); }
  }, []);

  const persist = (res: AuthResponse) => {
    const u: UserInfo = { email: res.email, fullName: res.fullName, role: res.role };
    setToken(res.token); setUser(u);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const login  = async (d: LoginData)  => { const r = await apiLogin(d);  persist(r.data); };
  const signup = async (d: SignupData) => { const r = await apiSignup(d); persist(r.data); };

  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user, token,
      isAuthenticated: !!token,
      isAdmin: user?.role === 'ROLE_ADMIN',
      login, signup, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
