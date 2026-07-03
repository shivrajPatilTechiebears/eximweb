// ── Form data shape ───────────────────────────────────────────────────────────

export interface OrganisationFormData {
  // Basic info
  organisationName: string;
  email: string;
  contact: string;
  // Address
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  // Tax & Legal
  gstNumber: string;
  panNumber: string;
  // Plan & Currency
  subscriptionPlan: string;
  baseCurrency: string;
  // Status
  status: string;
}

// ── Options ───────────────────────────────────────────────────────────────────

export const STATUS_OPTIONS = [
  { label: "Active",    value: "ACTIVE"    },
  { label: "Inactive",  value: "INACTIVE"  },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Expired",   value: "EXPIRED"   },
];

export const SUBSCRIPTION_PLAN_OPTIONS = [
  { label: "Free",       value: "free"       },
  { label: "Starter",    value: "starter"    },
  { label: "Pro",        value: "pro"        },
  { label: "Enterprise", value: "enterprise" },
];

export const CURRENCY_OPTIONS = [
  { label: "INR — Indian Rupee",   value: "INR" },
  { label: "USD — US Dollar",      value: "USD" },
  { label: "EUR — Euro",           value: "EUR" },
  { label: "GBP — British Pound",  value: "GBP" },
  { label: "AED — UAE Dirham",     value: "AED" },
];

export const STATE_OPTIONS = [
  { label: "Maharashtra", value: "MH" },
  { label: "Gujarat",     value: "GJ" },
  { label: "Delhi",       value: "DL" },
  { label: "Karnataka",   value: "KA" },
  { label: "Tamil Nadu",  value: "TN" },
  { label: "Rajasthan",   value: "RJ" },
];

export const COUNTRY_OPTIONS = [
  { label: "India",          value: "IN" },
  { label: "United States",  value: "US" },
  { label: "United Kingdom", value: "UK" },
  { label: "UAE",            value: "AE" },
  { label: "Australia",      value: "AU" },
];

// ── Mock data ─────────────────────────────────────────────────────────────────

export const MOCK_ORGANISATIONS: Record<string, { form: Partial<OrganisationFormData> }> = {
  "ORG-001": {
    form: {
      organisationName: "Techiebears Pvt Ltd",
      email: "admin@techiebears.com", contact: "+91 98765 43210",
      addressLine1: "101, Tech Park, Andheri East", addressLine2: "Mumbai Suburban",
      city: "Mumbai", state: "MH", country: "IN", pincode: "400093",
      gstNumber: "27AAPFU0939F1ZV", panNumber: "AAPFU0939F",
      subscriptionPlan: "enterprise", baseCurrency: "INR", status: "ACTIVE",
    },
  },
};
