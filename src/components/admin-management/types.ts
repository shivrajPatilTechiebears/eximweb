// ── Form data shapes ──────────────────────────────────────────────────────────

export interface AdminFormData {
  firstName: string; lastName: string; email: string; password: string;
  phone: string; role: string; assignTo: string; city: string;
  state: string; district: string; tahsil: string; pincode: string;
  gstNo: string; aadhaarNo: string; panNo: string;
  bankBeneficiaryName: string; bankName: string; bankAccountNumber: string;
}

export interface CompanyFormData {
  domain: string; name: string; email: string; phone: string;
  address1: string; address2: string; state: string; country: string;
  theme: string; pincode: string; supportEmail: string; supportPhone: string;
}

// ── Shared option arrays ──────────────────────────────────────────────────────

export const ROLE_OPTIONS = [
  { label: "Super Admin", value: "super_admin" },
  { label: "Admin",       value: "admin"       },
  { label: "Manager",     value: "manager"     },
  { label: "Staff",       value: "staff"       },
];

export const ASSIGN_OPTIONS = [
  { label: "Team Alpha", value: "team_alpha" },
  { label: "Team Beta",  value: "team_beta"  },
  { label: "Team Gamma", value: "team_gamma" },
];

export const STATE_OPTIONS = [
  { label: "Maharashtra", value: "MH" },
  { label: "Gujarat",     value: "GJ" },
  { label: "Delhi",       value: "DL" },
  { label: "Karnataka",   value: "KA" },
  { label: "Tamil Nadu",  value: "TN" },
];

export const DISTRICT_OPTIONS = [
  { label: "Mumbai", value: "mumbai" },
  { label: "Pune",   value: "pune"   },
  { label: "Nagpur", value: "nagpur" },
  { label: "Thane",  value: "thane"  },
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

// ── Mock data for view / edit prefill ─────────────────────────────────────────

export const MOCK_ADMINS: Record<string, {
  form: Partial<AdminFormData>;
  company: Partial<CompanyFormData>;
  logoUrl: string;
  permissions: string[];
}> = {
  "ADM-001": {
    form: { firstName: "Ramesh", lastName: "Kumar", email: "ramesh.kumar@techiebears.com", password: "secret123", phone: "+91 98765 43210", role: "super_admin", assignTo: "team_alpha", city: "Mumbai", state: "MH", district: "mumbai", tahsil: "Borivali", pincode: "400092", gstNo: "27AAPFU0939F1ZV", aadhaarNo: "2345 6789 0123", panNo: "ABCDE1234F", bankBeneficiaryName: "Ramesh Kumar", bankName: "HDFC Bank", bankAccountNumber: "50100123456789" },
    company: { domain: "techcorp.com", name: "TechCorp Solutions", email: "admin@techcorp.com", phone: "+91 98765 43210", address1: "101, Tech Park, Andheri East", address2: "Mumbai Suburban", state: "MH", country: "IN", theme: "purple", pincode: "400093", supportEmail: "support@techcorp.com", supportPhone: "+91 80000 11111" },
    logoUrl: "", permissions: ["partner_mgmt", "api_mgmt", "employee_mgmt", "reports_access"],
  },
  "ADM-002": {
    form: { firstName: "Priya", lastName: "Sharma", email: "priya.sharma@techiebears.com", password: "secret456", phone: "+91 91234 56789", role: "admin", assignTo: "team_beta", city: "Pune", state: "MH", district: "pune", tahsil: "Haveli", pincode: "411001", gstNo: "27AAAPS1234B1ZQ", aadhaarNo: "3456 7890 1234", panNo: "BCDEF2345G", bankBeneficiaryName: "Priya Sharma", bankName: "ICICI Bank", bankAccountNumber: "001201234567" },
    company: { domain: "innosoft.in", name: "InnoSoft Pvt Ltd", email: "contact@innosoft.in", phone: "+91 91234 56789", address1: "42, IT Hub, Kothrud", address2: "Pune City", state: "MH", country: "IN", theme: "blue", pincode: "411038", supportEmail: "support@innosoft.in", supportPhone: "+91 80000 22222" },
    logoUrl: "", permissions: ["employee_mgmt", "reports_access"],
  },
  "ADM-003": {
    form: { firstName: "Ankit", lastName: "Mehta", email: "ankit.mehta@techiebears.com", password: "secret789", phone: "+91 87654 32109", role: "manager", assignTo: "team_gamma", city: "Ahmedabad", state: "GJ", district: "nagpur", tahsil: "Navsari", pincode: "380001", gstNo: "24AACPM5678C1ZP", aadhaarNo: "4567 8901 2345", panNo: "CDEFG3456H", bankBeneficiaryName: "Ankit Mehta", bankName: "Axis Bank", bankAccountNumber: "9170123456789" },
    company: { domain: "globaledge.io", name: "GlobalEdge Inc", email: "info@globaledge.io", phone: "+1 555 234 5678", address1: "5th Floor, Commerce House", address2: "C.G. Road, Navrangpura", state: "GJ", country: "US", theme: "green", pincode: "380009", supportEmail: "support@globaledge.io", supportPhone: "+1 800 123 4567" },
    logoUrl: "", permissions: ["api_mgmt"],
  },
  "ADM-004": {
    form: { firstName: "Sunita", lastName: "Patel", email: "sunita.patel@techiebears.com", password: "secret000", phone: "+91 99887 76655", role: "staff", assignTo: "team_alpha", city: "Surat", state: "GJ", district: "thane", tahsil: "Surat City", pincode: "395003", gstNo: "24AABPS9876D1ZR", aadhaarNo: "5678 9012 3456", panNo: "DEFGH4567I", bankBeneficiaryName: "Sunita Patel", bankName: "SBI", bankAccountNumber: "20123456789012" },
    company: { domain: "apexsys.com", name: "Apex Systems", email: "hello@apexsys.com", phone: "+91 88776 65544", address1: "Plot 22, GIDC Estate", address2: "Sachin, Surat", state: "GJ", country: "IN", theme: "red", pincode: "394230", supportEmail: "support@apexsys.com", supportPhone: "+91 80000 33333" },
    logoUrl: "", permissions: [],
  },
  "ADM-005": {
    form: { firstName: "Vikram", lastName: "Singh", email: "vikram.singh@techiebears.com", password: "secret111", phone: "+91 77665 54433", role: "admin", assignTo: "team_beta", city: "Delhi", state: "DL", district: "mumbai", tahsil: "Central", pincode: "110001", gstNo: "07AACPV3456E1ZS", aadhaarNo: "6789 0123 4567", panNo: "EFGHI5678J", bankBeneficiaryName: "Vikram Singh", bankName: "PNB", bankAccountNumber: "3600123456789" },
    company: { domain: "bluestar.net", name: "BlueStar Logistics", email: "ops@bluestar.net", phone: "+91 77665 54433", address1: "Unit 8, Okhla Industrial Area", address2: "Phase II, New Delhi", state: "DL", country: "IN", theme: "blue", pincode: "110020", supportEmail: "support@bluestar.net", supportPhone: "+91 80000 44444" },
    logoUrl: "", permissions: ["partner_mgmt", "reports_access"],
  },
  "ADM-006": {
    form: { firstName: "Meena", lastName: "Iyer", email: "meena.iyer@techiebears.com", password: "secret222", phone: "+91 88776 65544", role: "manager", assignTo: "team_gamma", city: "Bangalore", state: "KA", district: "pune", tahsil: "Bengaluru South", pincode: "560001", gstNo: "29AACPM7890F1ZT", aadhaarNo: "7890 1234 5678", panNo: "FGHIJ6789K", bankBeneficiaryName: "Meena Iyer", bankName: "Canara Bank", bankAccountNumber: "0987654321012" },
    company: { domain: "nexusdigital.co", name: "Nexus Digital", email: "nexus@nexusdigital.co", phone: "+91 99001 12233", address1: "12, Koramangala 4th Block", address2: "Bengaluru Urban", state: "KA", country: "IN", theme: "purple", pincode: "560034", supportEmail: "support@nexusdigital.co", supportPhone: "+91 80000 55555" },
    logoUrl: "", permissions: ["partner_mgmt", "api_mgmt", "employee_mgmt"],
  },
};
