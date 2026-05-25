import api from "./api";
import { appConfig } from "../config/appConfig";
import { GeneratedRecord } from "../types";
import { addGeneratedRecord, getGeneratedHistory } from "../utils/storage";

/* ── Mock history store ────────────────────────────── */
let mockHistory: GeneratedRecord[] = [];
let mockHistoryId = 1;

/* ── Generate ──────────────────────────────────────── */

export const generateValue = async (
  meterNumber: string,
  amount: number
): Promise<GeneratedRecord> => {
  // Use local rule from config
  const result = appConfig.generateRule(amount);

  const record: GeneratedRecord = {
    id: String(mockHistoryId++),
    meterNumber,
    amount,
    token: result.token,
    valueDays: result.valueDays,
    createdAt: new Date().toISOString(),
  };

  if (appConfig.useMockApi) {
    mockHistory.unshift(record);
  } else {
    try {
      const { data } = await api.post(appConfig.endpoints.generate, record);
      record.id = data.id ?? record.id;
    } catch {
      // Save locally on failure (offline)
    }
  }

  await addGeneratedRecord(record);
  return record;
};

/* ── Validate token ────────────────────────────────── */

export const validateToken = async (
  tokenCode: string
): Promise<GeneratedRecord | null> => {
  if (appConfig.useMockApi) {
    // Search local history
    const all = [...mockHistory, ...((await getGeneratedHistory()) as GeneratedRecord[])];
    return all.find((r) => r.token === tokenCode) ?? null;
  }
  try {
    const { data } = await api.get(appConfig.endpoints.validate, {
      params: { token: tokenCode },
    });
    return data;
  } catch {
    return null;
  }
};

/* ── History ───────────────────────────────────────── */

export const fetchHistory = async (filters?: {
  meterNumber?: string;
  startDate?: string;
  endDate?: string;
}): Promise<GeneratedRecord[]> => {
  if (appConfig.useMockApi) {
    let history = [
      ...mockHistory,
      ...((await getGeneratedHistory()) as GeneratedRecord[]),
    ];
    // Deduplicate by token
    const seen = new Set<string>();
    history = history.filter((r) => {
      if (seen.has(r.token)) return false;
      seen.add(r.token);
      return true;
    });
    if (filters?.meterNumber) {
      history = history.filter((r) => r.meterNumber === filters.meterNumber);
    }
    if (filters?.startDate) {
      history = history.filter((r) => r.createdAt >= filters.startDate!);
    }
    if (filters?.endDate) {
      history = history.filter((r) => r.createdAt <= filters.endDate!);
    }
    return history;
  }
  const { data } = await api.get(appConfig.endpoints.report, { params: filters });
  return Array.isArray(data) ? data : data.data ?? [];
};
