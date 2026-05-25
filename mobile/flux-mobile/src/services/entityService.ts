import api from "./api";
import { appConfig } from "../config/appConfig";
import { EntityItem } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_KEY = "@entity_cache";

/* ── Mock data store ───────────────────────────────── */
let mockItems: EntityItem[] = [
  { id: "1", name: "Groceries", amount: 2500, category: "Food", description: "Weekly shopping", createdAt: new Date().toISOString() },
  { id: "2", name: "Bus Fare", amount: 500, category: "Transport", description: "", createdAt: new Date().toISOString() },
  { id: "3", name: "Electricity", amount: 8000, category: "Utilities", description: "Monthly bill", createdAt: new Date().toISOString() },
];
let mockIdCounter = 4;

/* ── Cache helpers ─────────────────────────────────── */

const cacheItems = async (items: EntityItem[]) => {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(items));
};

const getCachedItems = async (): Promise<EntityItem[] | null> => {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  return raw ? JSON.parse(raw) : null;
};

/* ── CRUD operations ───────────────────────────────── */

export const fetchItems = async (page = 1, limit = 10): Promise<{ data: EntityItem[]; total: number }> => {
  if (appConfig.useMockApi) {
    const start = (page - 1) * limit;
    const data = mockItems.slice(start, start + limit);
    await cacheItems(mockItems);
    return { data, total: mockItems.length };
  }
  try {
    const { data } = await api.get(appConfig.endpoints.items, { params: { page, limit } });
    const items = Array.isArray(data) ? data : data.data ?? [];
    await cacheItems(items);
    return { data: items, total: Array.isArray(data) ? data.length : data.total ?? items.length };
  } catch (err) {
    // Offline fallback
    const cached = await getCachedItems();
    if (cached) return { data: cached, total: cached.length };
    throw err;
  }
};

export const fetchItem = async (id: string): Promise<EntityItem> => {
  if (appConfig.useMockApi) {
    const item = mockItems.find((i) => i.id === id);
    if (!item) throw new Error("Item not found");
    return item;
  }
  const url = appConfig.endpoints.item.replace(":id", id);
  const { data } = await api.get(url);
  return data;
};

export const createItem = async (payload: Omit<EntityItem, "id">): Promise<EntityItem> => {
  if (appConfig.useMockApi) {
    const newItem: EntityItem = {
      ...payload,
      id: String(mockIdCounter++),
      createdAt: new Date().toISOString(),
    };
    mockItems.unshift(newItem);
    await cacheItems(mockItems);
    return newItem;
  }
  const { data } = await api.post(appConfig.endpoints.items, payload);
  return data;
};

export const updateItem = async (id: string, payload: Partial<EntityItem>): Promise<EntityItem> => {
  if (appConfig.useMockApi) {
    const idx = mockItems.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error("Item not found");
    mockItems[idx] = { ...mockItems[idx], ...payload, updatedAt: new Date().toISOString() };
    await cacheItems(mockItems);
    return mockItems[idx];
  }
  const url = appConfig.endpoints.item.replace(":id", id);
  const { data } = await api.put(url, payload);
  return data;
};

export const deleteItem = async (id: string): Promise<void> => {
  if (appConfig.useMockApi) {
    mockItems = mockItems.filter((i) => i.id !== id);
    await cacheItems(mockItems);
    return;
  }
  const url = appConfig.endpoints.item.replace(":id", id);
  await api.delete(url);
};
