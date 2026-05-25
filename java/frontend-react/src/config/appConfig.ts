/**
 * ─────────────────────────────────────────────────────────────
 *  APP CONFIG  –  the ONLY file you need to change per exam
 * ─────────────────────────────────────────────────────────────
 *
 *  Examples of what to rename to:
 *    Shopping    → Product / Products / $
 *    Parking     → Parking Lot / Parking Lots / RWF
 *    Equipment   → Equipment / Equipment / €
 *    Laptops     → Laptop / Laptops / $
 */

export interface ColumnDef {
  key: string;
  label: string;
  type: 'string' | 'currency' | 'date' | 'badge';
}

const appConfig = {
  // ── Branding ────────────────────────────────────────────────
  appName: 'Exam Template',
  appSubtitle: 'Generic TVET Exam System',

  // ── Entity (RENAME this per exam) ───────────────────────────
  entity: {
    singular: 'Product',
    plural: 'Products',
    icon: '📦',
  },

  // ── Columns shown in dashboard cards ────────────────────────
  // type 'badge' renders a colored pill, 'currency' formats with symbol
  columns: [
    { key: 'code',   label: 'Code',       type: 'string'   },
    { key: 'name',   label: 'Name',       type: 'string'   },
    { key: 'type',   label: 'Type',       type: 'badge'    },
    { key: 'price',  label: 'Price',      type: 'currency' },
    { key: 'inDate', label: 'Added',      type: 'date'     },
  ] as ColumnDef[],

  // ── API paths ────────────────────────────────────────────────
  api: {
    baseUrl:    'http://localhost:8080/api',
    entity:     '/products',
    checkout:   '/transactions/checkout',
    report:     '/transactions/report',
    myReport:   '/transactions/my-report',
    profile:    '/auth/profile',
    emailSend:  '/email/send',
  },

  // ── Labels (rename to match exam context) ───────────────────
  labels: {
    cartAction:   'Add to Cart',
    cartTitle:    'Cart',
    checkoutBtn:  'Checkout',
    reportTitle:  'Transaction Report',
    adminLink:    'Admin Panel',
  },

  // ── Formatting ───────────────────────────────────────────────
  currency: '$',
  locale:   'en-US',

  // ── Feature flags ────────────────────────────────────────────
  features: {
    emailAfterCheckout: false,   // POST to api.emailSend after checkout
    darkMode:           true,    // show dark/light toggle in navbar
    adminPanel:         true,    // show Admin Panel link for ROLE_ADMIN
    csvExport:          true,    // CSV export button on report page
    profilePage:        true,    // enable /profile route
  },
};

export default appConfig;
