export interface BranchFormData {
  branchName: string;
  organisation: string;
  groupCompany: string;
  email: string;
  contact: string;
  city: string;
  status: string;
}

export interface BranchDetailsProps {
  formData: BranchFormData;
  onChange: (key: keyof BranchFormData, value: string) => void;
  disabled: boolean;
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

export const MOCK_BRANCHES: Record<string, { form: Partial<BranchFormData> }> = {
  "BRN-001": {
    form: { branchName: "Mumbai HQ",      organisation: "ORG-001", groupCompany: "GRP-001", email: "mumbai@techiebears.com",   contact: "+91 98001 11001", city: "Mumbai",    status: "ACTIVE"   },
  },
  "BRN-002": {
    form: { branchName: "Pune Office",     organisation: "ORG-001", groupCompany: "GRP-001", email: "pune@techiebears.com",     contact: "+91 98002 22002", city: "Pune",      status: "ACTIVE"   },
  },
  "BRN-003": {
    form: { branchName: "New York Office", organisation: "ORG-002", groupCompany: "GRP-003", email: "newyork@globaledge.io",    contact: "+1 555 300 3003", city: "New York",  status: "INACTIVE" },
  },
  "BRN-004": {
    form: { branchName: "Bangalore Hub",   organisation: "ORG-003", groupCompany: "GRP-004", email: "blr@nexusdigital.co",      contact: "+91 98004 44004", city: "Bangalore", status: "ACTIVE"   },
  },
  "BRN-005": {
    form: { branchName: "Surat Branch",    organisation: "ORG-005", groupCompany: "GRP-005", email: "surat@apexsys.com",        contact: "+91 98005 55005", city: "Surat",     status: "ACTIVE"   },
  },
};
