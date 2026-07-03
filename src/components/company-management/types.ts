// ── Form data shape ───────────────────────────────────────────────────────────

export interface CompanyFormData {
  domain: string; name: string; email: string; phone: string;
  address1: string; address2: string; state: string; country: string;
  theme: string; pincode: string; supportEmail: string; supportPhone: string;
}

// ── Options ───────────────────────────────────────────────────────────────────

export const STATE_OPTIONS = [
  { label: "Maharashtra", value: "MH" },
  { label: "Gujarat",     value: "GJ" },
  { label: "Delhi",       value: "DL" },
  { label: "Karnataka",   value: "KA" },
  { label: "Tamil Nadu",  value: "TN" },
];

export const COUNTRY_OPTIONS = [
  { label: "India",          value: "IN" },
  { label: "United States",  value: "US" },
  { label: "United Kingdom", value: "UK" },
  { label: "Australia",      value: "AU" },
];

export const THEME_OPTIONS = [
  { label: "Default Purple", value: "purple" },
  { label: "Ocean Blue",     value: "blue"   },
  { label: "Forest Green",   value: "green"  },
  { label: "Coral Red",      value: "red"    },
];

export const PERMISSION_OPTIONS = [
  { label: "Partner Management",  value: "partner_mgmt"   },
  { label: "API Management",      value: "api_mgmt"       },
  { label: "Employee Management", value: "employee_mgmt"  },
  { label: "Reports Access",      value: "reports_access" },
];

// ── Mock data ─────────────────────────────────────────────────────────────────

export const MOCK_COMPANIES: Record<string, {
  company: Partial<CompanyFormData>;
  logoUrl: string;
  permissions: string[];
}> = {
  "COMP-001": {
    company: { domain: "techcorp.com", name: "TechCorp Solutions", email: "admin@techcorp.com", phone: "+91 98765 43210", address1: "101, Tech Park, Andheri East", address2: "Mumbai Suburban", state: "MH", country: "IN", theme: "purple", pincode: "400093", supportEmail: "support@techcorp.com", supportPhone: "+91 80000 11111" },
    logoUrl: "", permissions: ["partner_mgmt", "api_mgmt", "employee_mgmt", "reports_access"],
  },
  "COMP-002": {
    company: { domain: "innosoft.in", name: "InnoSoft Pvt Ltd", email: "contact@innosoft.in", phone: "+91 91234 56789", address1: "42, IT Hub, Kothrud", address2: "Pune City", state: "MH", country: "IN", theme: "blue", pincode: "411038", supportEmail: "support@innosoft.in", supportPhone: "+91 80000 22222" },
    logoUrl: "", permissions: ["employee_mgmt", "reports_access"],
  },
  "COMP-003": {
    company: { domain: "globaledge.io", name: "GlobalEdge Inc", email: "info@globaledge.io", phone: "+1 555 234 5678", address1: "5th Floor, Commerce House", address2: "C.G. Road, Navrangpura", state: "GJ", country: "US", theme: "green", pincode: "380009", supportEmail: "support@globaledge.io", supportPhone: "+1 800 123 4567" },
    logoUrl: "", permissions: ["api_mgmt"],
  },
  "COMP-004": {
    company: { domain: "apexsys.com", name: "Apex Systems", email: "hello@apexsys.com", phone: "+91 88776 65544", address1: "Plot 22, GIDC Estate", address2: "Sachin, Surat", state: "GJ", country: "IN", theme: "red", pincode: "394230", supportEmail: "support@apexsys.com", supportPhone: "+91 80000 33333" },
    logoUrl: "", permissions: [],
  },
  "COMP-005": {
    company: { domain: "bluestar.net", name: "BlueStar Logistics", email: "ops@bluestar.net", phone: "+91 77665 54433", address1: "Unit 8, Okhla Industrial Area", address2: "Phase II, New Delhi", state: "DL", country: "IN", theme: "blue", pincode: "110020", supportEmail: "support@bluestar.net", supportPhone: "+91 80000 44444" },
    logoUrl: "", permissions: ["partner_mgmt", "reports_access"],
  },
  "COMP-006": {
    company: { domain: "nexusdigital.co", name: "Nexus Digital", email: "nexus@nexusdigital.co", phone: "+91 99001 12233", address1: "12, Koramangala 4th Block", address2: "Bengaluru Urban", state: "KA", country: "IN", theme: "purple", pincode: "560034", supportEmail: "support@nexusdigital.co", supportPhone: "+91 80000 55555" },
    logoUrl: "", permissions: ["partner_mgmt", "api_mgmt", "employee_mgmt"],
  },
};
