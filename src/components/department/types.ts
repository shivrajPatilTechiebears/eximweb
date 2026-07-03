export interface DepartmentFormData {
  departmentName: string;
  organisation: string;
  groupCompany: string;
  email: string;
  contact: string;
  city: string;
  status: string;
}

export const STATUS_OPTIONS = [
  { label: "Active",    value: "ACTIVE"    },
  { label: "Inactive",  value: "INACTIVE"  },
  { label: "Suspended", value: "SUSPENDED" },
];

export const ORGANISATION_OPTIONS = [
  { label: "Techiebears Pvt Ltd", value: "ORG-001" },
  { label: "GlobalEdge Inc",      value: "ORG-002" },
  { label: "Nexus Digital",       value: "ORG-003" },
  { label: "BlueStar Logistics",  value: "ORG-004" },
  { label: "Apex Systems",        value: "ORG-005" },
];

export const GROUP_COMPANY_OPTIONS = [
  { label: "Group Alpha", value: "GRP-001" },
  { label: "Group Beta",  value: "GRP-002" },
  { label: "Group Gamma", value: "GRP-003" },
  { label: "Group Delta", value: "GRP-004" },
  { label: "Group Sigma", value: "GRP-005" },
];

export const MOCK_DEPARTMENTS: Record<string, { form: Partial<DepartmentFormData> }> = {
  "DEPT-001": {
    form: { departmentName: "Engineering",  organisation: "ORG-001", groupCompany: "GRP-001", email: "engineering@techiebears.com",  contact: "+91 98001 11001", city: "Mumbai",    status: "ACTIVE"   },
  },
  "DEPT-002": {
    form: { departmentName: "Finance",      organisation: "ORG-001", groupCompany: "GRP-001", email: "finance@techiebears.com",      contact: "+91 98002 22002", city: "Pune",      status: "ACTIVE"   },
  },
  "DEPT-003": {
    form: { departmentName: "Human Resources", organisation: "ORG-002", groupCompany: "GRP-003", email: "hr@globaledge.io",          contact: "+1 555 300 3003", city: "New York",  status: "INACTIVE" },
  },
  "DEPT-004": {
    form: { departmentName: "Marketing",    organisation: "ORG-003", groupCompany: "GRP-004", email: "marketing@nexusdigital.co",    contact: "+91 98004 44004", city: "Bangalore", status: "ACTIVE"   },
  },
  "DEPT-005": {
    form: { departmentName: "Operations",   organisation: "ORG-005", groupCompany: "GRP-005", email: "ops@apexsys.com",              contact: "+91 98005 55005", city: "Surat",     status: "ACTIVE"   },
  },
};
