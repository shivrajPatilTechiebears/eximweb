// ── Form data shape ───────────────────────────────────────────────────────────

export interface GroupCompanyFormData {
  groupCompanyName: string;
  organisation: string;
  email: string;
  contact: string;
  city: string;
  description: string;
  status: string;
}

// ── Options ───────────────────────────────────────────────────────────────────

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

// ── Mock data ─────────────────────────────────────────────────────────────────

export const MOCK_GROUP_COMPANIES: Record<string, { form: Partial<GroupCompanyFormData> }> = {
  "GRP-001": {
    form: { groupCompanyName: "Group Alpha", organisation: "ORG-001", email: "alpha@techiebears.com", contact: "+91 98001 11001", city: "Mumbai", description: "Primary operations group for Techiebears India division.", status: "ACTIVE" },
  },
  "GRP-002": {
    form: { groupCompanyName: "Group Beta", organisation: "ORG-001", email: "beta@techiebears.com", contact: "+91 98002 22002", city: "Pune", description: "Western region business cluster.", status: "ACTIVE" },
  },
  "GRP-003": {
    form: { groupCompanyName: "Group Gamma", organisation: "ORG-002", email: "gamma@globaledge.io", contact: "+1 555 300 3003", city: "New York", description: "GlobalEdge US and international operations.", status: "INACTIVE" },
  },
};
