import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  ACCESS_TOKEN: "@auth_access_token",
  REFRESH_TOKEN: "@auth_refresh_token",
  USER: "@auth_user",
  THEME: "@app_theme",
  OFFLINE_QUEUE: "@offline_queue",
  GENERATED_HISTORY: "@generated_history",
};

/* ── Token helpers ─────────────────────────────────── */

export const saveTokens = async (access: string, refresh?: string) => {
  await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, access);
  if (refresh) await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, refresh);
};

export const getAccessToken = () => AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
export const getRefreshToken = () => AsyncStorage.getItem(KEYS.REFRESH_TOKEN);

export const clearTokens = async () => {
  await AsyncStorage.multiRemove([KEYS.ACCESS_TOKEN, KEYS.REFRESH_TOKEN, KEYS.USER]);
};

/* ── User helpers ──────────────────────────────────── */

export const saveUser = async (user: object) => {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const getUser = async () => {
  const raw = await AsyncStorage.getItem(KEYS.USER);
  return raw ? JSON.parse(raw) : null;
};

/* ── Theme helpers ─────────────────────────────────── */

export const saveThemePreference = (mode: "light" | "dark") =>
  AsyncStorage.setItem(KEYS.THEME, mode);

export const getThemePreference = () =>
  AsyncStorage.getItem(KEYS.THEME) as Promise<"light" | "dark" | null>;

/* ── Offline queue ─────────────────────────────────── */

export const getOfflineQueue = async (): Promise<unknown[]> => {
  const raw = await AsyncStorage.getItem(KEYS.OFFLINE_QUEUE);
  return raw ? JSON.parse(raw) : [];
};

export const addToOfflineQueue = async (action: unknown) => {
  const queue = await getOfflineQueue();
  queue.push(action);
  await AsyncStorage.setItem(KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
};

export const clearOfflineQueue = () => AsyncStorage.removeItem(KEYS.OFFLINE_QUEUE);

/* ── Generated history (local cache) ──────────────── */

export const getGeneratedHistory = async (): Promise<unknown[]> => {
  const raw = await AsyncStorage.getItem(KEYS.GENERATED_HISTORY);
  return raw ? JSON.parse(raw) : [];
};

export const addGeneratedRecord = async (record: unknown) => {
  const history = await getGeneratedHistory();
  history.unshift(record);
  await AsyncStorage.setItem(KEYS.GENERATED_HISTORY, JSON.stringify(history));
};

export const clearGeneratedHistory = () =>
  AsyncStorage.removeItem(KEYS.GENERATED_HISTORY);

export { KEYS };
