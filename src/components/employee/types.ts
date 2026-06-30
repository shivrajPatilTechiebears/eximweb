// ── Form data shapes ──────────────────────────────────────────────────────────

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  designation: string;
  userType: string;
  accessScope: string;
  role: string;
  department: string;
  organisation: string;
  groupCompany: string;
  company: string;
  location: string;
}

// ── Component prop interfaces ─────────────────────────────────────────────────

export interface EmployeeDetailsProps {
  formData: EmployeeFormData;
  onChange: (key: keyof EmployeeFormData, value: string) => void;
  disabled: boolean;
  isView: boolean;
}

// ── Options ───────────────────────────────────────────────────────────────────

export const USER_TYPE_OPTIONS = [
  { label: "Super Admin",         value: "SUPER_ADMIN"        },
  { label: "Organisation Admin",  value: "ORGANISATION_ADMIN" },
  { label: "Group Admin",         value: "GROUP_ADMIN"        },
  { label: "Company Admin",       value: "COMPANY_ADMIN"      },
  { label: "Location Admin",      value: "LOCATION_ADMIN"     },
  { label: "Employee",            value: "EMPLOYEE"           },
];

export const ACCESS_SCOPE_OPTIONS = [
  { label: "Global",         value: "GLOBAL"         },
  { label: "Organisation",   value: "ORGANISATION"   },
  { label: "Group Company",  value: "GROUP_COMPANY"  },
  { label: "Company",        value: "COMPANY"        },
  { label: "Location",       value: "LOCATION"       },
  { label: "Department",     value: "DEPARTMENT"     },
  { label: "Self",           value: "SELF"           },
];

export const EMPLOYEE_ROLE_OPTIONS = [
  { label: "Super Admin", value: "super_admin" },
  { label: "Admin",       value: "admin"       },
  { label: "Manager",     value: "manager"     },
  { label: "Staff",       value: "staff"       },
  { label: "Employee",    value: "employee"    },
];

export const DEPARTMENT_OPTIONS = [
  { label: "Engineering",  value: "engineering"  },
  { label: "Design",       value: "design"       },
  { label: "Finance",      value: "finance"      },
  { label: "HR",           value: "hr"           },
  { label: "Operations",   value: "operations"   },
  { label: "Sales",        value: "sales"        },
];

export const ORGANISATION_OPTIONS = [
  { label: "Techiebears Pvt Ltd",  value: "techiebears"  },
  { label: "GlobalEdge Inc",       value: "globaledge"   },
  { label: "Nexus Digital",        value: "nexus"        },
];

export const GROUP_COMPANY_OPTIONS = [
  { label: "Group Alpha",  value: "group_alpha"  },
  { label: "Group Beta",   value: "group_beta"   },
  { label: "Group Gamma",  value: "group_gamma"  },
];

export const COMPANY_OPTIONS = [
  { label: "TechCorp Solutions",   value: "techcorp"   },
  { label: "InnoSoft Pvt Ltd",     value: "innosoft"   },
  { label: "BlueStar Logistics",   value: "bluestar"   },
  { label: "Apex Systems",         value: "apexsys"    },
];

export const LOCATION_OPTIONS = [
  { label: "Mumbai HQ",       value: "mumbai_hq"   },
  { label: "Pune Branch",     value: "pune_branch"  },
  { label: "Delhi Office",    value: "delhi_office" },
  { label: "Bangalore Hub",   value: "blr_hub"      },
];

// ── Mock data for view / edit prefill ─────────────────────────────────────────

export const MOCK_EMPLOYEES: Record<string, { form: Partial<EmployeeFormData> }> = {
  "EMP-001": {
    form: { firstName: "Arjun", lastName: "Nair", email: "arjun.nair@techiebears.com", mobile: "+91 98101 11223", password: "secret123", designation: "Software Engineer", userType: "EMPLOYEE", accessScope: "DEPARTMENT", role: "employee", department: "engineering", organisation: "techiebears", groupCompany: "group_alpha", company: "techcorp", location: "blr_hub" },
  },
  "EMP-002": {
    form: { firstName: "Divya", lastName: "Menon", email: "divya.menon@techiebears.com", mobile: "+91 91223 44556", password: "secret456", designation: "UI/UX Designer", userType: "EMPLOYEE", accessScope: "DEPARTMENT", role: "employee", department: "design", organisation: "techiebears", groupCompany: "group_alpha", company: "techcorp", location: "mumbai_hq" },
  },
};
