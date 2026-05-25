/**
 * ============================================================
 * APP CONFIGURATION — Change this file to adapt to any exam.
 * ============================================================
 * 1. Update appName, apiBaseUrl, and endpoints for your backend.
 * 2. Change entityName to match the domain (Expense, Token, Booking…).
 * 3. Modify entityFields to control the Add/Edit form.
 * 4. Adjust generateRule for the business‑logic screen.
 * 5. Tweak validation for input constraints.
 * ============================================================
 */

export interface EntityField {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  placeholder?: string;
  required?: boolean;
  options?: string[]; // for select type
}

export interface GenerateResult {
  token: string;
  valueDays: number;
  [key: string]: unknown;
}

export const appConfig = {
  /* ── General ─────────────────────────────────────────── */
  appName: "FluxMobile",
  currency: "RWF",

  /* ── API ─────────────────────────────────────────────── */
  apiBaseUrl: "https://67469fae512d.mockapi.io/api/v1", // change per exam
  useMockApi: true, // set false when using a real backend

  endpoints: {
    login: "/auth/login",
    signup: "/auth/signup",
    items: "/expenses",
    item: "/expenses/:id",
    generate: "/generate",
    validate: "/validate",
    report: "/purchased_tokens",
  },

  /* ── Entity ──────────────────────────────────────────── */
  entityName: {
    singular: "Expense",
    plural: "Expenses",
  },

  entityFields: [
    { name: "name", label: "Name", type: "text", placeholder: "e.g. Groceries", required: true },
    { name: "amount", label: "Amount", type: "number", placeholder: "e.g. 5000", required: true },
    { name: "category", label: "Category", type: "select", required: true, options: ["Food", "Transport", "Utilities", "Entertainment", "Other"] },
    { name: "description", label: "Description", type: "text", placeholder: "Optional note", required: false },
  ] as EntityField[],

  /* ── Generate Rule ───────────────────────────────────── */
  generateRule: (amount: number): GenerateResult => {
    // Default rule: 100 currency → 1 day, max 5 years = 1825 days
    const days = Math.floor(amount / 100);
    if (days < 1) throw new Error("Minimum amount is 100");
    if (days > 1825) throw new Error("Cannot exceed 5 years (182,500)");
    const token = Math.floor(10000000 + Math.random() * 90000000).toString();
    return { token, valueDays: days };
  },

  /* ── Validation constraints ──────────────────────────── */
  validation: {
    amount: { min: 100, step: 100, max: 182500 },
    meterNumber: { length: 6, regex: /^\d{6}$/ },
  },

  /* ── Generate screen field labels (configurable) ────── */
  generateFields: {
    primaryInput: { label: "Meter Number", placeholder: "e.g. 123456", keyboardType: "numeric" as const },
    amountInput: { label: "Amount", placeholder: "e.g. 5000", keyboardType: "numeric" as const },
  },

  generateResultLabels: {
    token: "Token",
    valueDays: "Days",
  },

  /* ── Database tables (reference) ─────────────────────── */
  databaseTables: ["purchased_tokens"],
};

export type AppConfig = typeof appConfig;
