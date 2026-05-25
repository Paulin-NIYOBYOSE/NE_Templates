import api from "./api";
import { appConfig } from "../config/appConfig";
import { LoginPayload, SignupPayload, User, AuthTokens } from "../types";
import { saveTokens, saveUser, clearTokens, getUser } from "../utils/storage";

/* ── Mock helpers (used when appConfig.useMockApi is true) ─ */

const mockUsers: { email: string; password: string; name: string; id: string }[] = [
  { id: "1", email: "admin@exam.com", password: "password123", name: "Admin User" },
];

const mockLogin = async (payload: LoginPayload): Promise<{ user: User; tokens: AuthTokens }> => {
  const found = mockUsers.find(
    (u) => u.email === payload.email && u.password === payload.password
  );
  if (!found) throw new Error("Invalid email or password");
  const tokens: AuthTokens = { accessToken: "mock-jwt-token-" + Date.now() };
  const user: User = { id: found.id, email: found.email, name: found.name };
  return { user, tokens };
};

const mockSignup = async (payload: SignupPayload): Promise<{ user: User; tokens: AuthTokens }> => {
  const existing = mockUsers.find((u) => u.email === payload.email);
  if (existing) throw new Error("Email already registered");
  const id = String(mockUsers.length + 1);
  mockUsers.push({ id, email: payload.email, password: payload.password, name: payload.name });
  const tokens: AuthTokens = { accessToken: "mock-jwt-token-" + Date.now() };
  const user: User = { id, email: payload.email, name: payload.name };
  return { user, tokens };
};

/* ── Public API ────────────────────────────────────── */

export const login = async (payload: LoginPayload) => {
  if (appConfig.useMockApi) {
    const { user, tokens } = await mockLogin(payload);
    await saveTokens(tokens.accessToken, tokens.refreshToken);
    await saveUser(user);
    return user;
  }
  const { data } = await api.post(appConfig.endpoints.login, payload);
  await saveTokens(data.accessToken, data.refreshToken);
  await saveUser(data.user);
  return data.user as User;
};

export const signup = async (payload: SignupPayload) => {
  if (appConfig.useMockApi) {
    const { user, tokens } = await mockSignup(payload);
    await saveTokens(tokens.accessToken, tokens.refreshToken);
    await saveUser(user);
    return user;
  }
  const { data } = await api.post(appConfig.endpoints.signup, payload);
  await saveTokens(data.accessToken, data.refreshToken);
  await saveUser(data.user);
  return data.user as User;
};

export const logout = async () => {
  await clearTokens();
};

export const loadStoredUser = async (): Promise<User | null> => {
  return getUser();
};
