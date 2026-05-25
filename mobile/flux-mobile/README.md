# FluxMobile

A production-ready React Native + Expo template for National Examinations practical exams. Generic and configurable — adapt to any scenario (expense tracker, token generator, booking system) by editing one config file.

## Quick Start

```bash
cd flux-mobile
npm install
npx expo start
```

Scan QR with **Expo Go** (iOS/Android) or press `i` for iOS simulator / `a` for Android emulator.

## Adapt to Your Exam (5 minutes)

Edit `src/config/appConfig.ts`:

| Field          | What to Change                                   |
| -------------- | ------------------------------------------------ |
| `appName`      | Your app name                                    |
| `apiBaseUrl`   | Your backend URL or MockAPI                      |
| `entityName`   | Change "Expense" to "Token", "Booking", etc.     |
| `entityFields` | Define form fields for your entity               |
| `generateRule` | Business logic (e.g., amount → days calculation) |
| `validation`   | Input constraints                                |

### Example: Prepaid Token System

```ts
entityName: { singular: "Token", plural: "Tokens" },
entityFields: [
  { name: "meterNumber", label: "Meter", type: "text", required: true },
  { name: "amount", label: "Amount", type: "number", required: true },
],
generateRule: (amount) => {
  const days = Math.floor(amount / 100);
  const token = Math.random().toString().slice(2, 10);
  return { token, valueDays: days };
},
```

## Project Structure

```
src/
├── config/appConfig.ts   # ← EDIT THIS for your exam
├── screens/              # All screens (auth, items, generate, history, profile)
├── services/             # API calls (axios + mock support)
├── contexts/             # Auth & Theme providers
├── components/           # Reusable UI components
└── navigation/           # Stack, Tab, Drawer navigators
```

## Features

- **Auth**: Login/Signup with JWT storage
- **CRUD**: List, Add, Edit, Delete entities
- **Generate**: Business logic screen with validation
- **Validate**: Check token/code status
- **History**: Filter by date, export CSV
- **Profile**: User info, dark mode toggle
- **Offline**: AsyncStorage caching

## Mock vs Real API

```ts
// In appConfig.ts
useMockApi: true,  // Uses built-in mock data
useMockApi: false, // Calls your real backend
```

## Demo Credentials

```
Email: admin@exam.com
Password: password123
```

## Tech Stack

- Expo SDK 56 + TypeScript
- React Navigation 7 (Stack, Tabs, Drawer)
- React Native Paper (Material Design 3)
- React Hook Form + Zod validation
- Axios + AsyncStorage
