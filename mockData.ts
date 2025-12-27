
import { Supplier, Alert, AlertType, AlertStatus, ComplianceStats } from './types';

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 's1',
    name: 'Acme Textiles Ltd',
    legalName: 'Acme Textile Manufacturing Bangladesh Ltd',
    country: 'BD',
    industry: 'Textiles',
    riskScore: 78,
    sanctionsHit: false,
    status: 'WATCHLIST',
    lastScreenedAt: '2024-12-26T10:00:00Z',
    news: [
      {
        id: 'n1',
        title: 'Labor violations reported in Dhaka textile hub',
        url: '#',
        source: 'Reuters',
        publishedAt: '2024-12-25T08:30:00Z',
        summary: 'Multiple workers reported unpaid overtime and unsafe working conditions at the Dhaka facility.',
        isRelevant: true,
        severity: 9,
        risks: ['Labor Violations', 'Human Rights'],
      },
    ],
  },
  {
    id: 's2',
    name: 'TechParts Shenzhen',
    country: 'CN',
    industry: 'Electronics',
    riskScore: 55,
    sanctionsHit: false,
    status: 'ACTIVE',
    lastScreenedAt: '2024-12-27T12:00:00Z',
    news: [],
  },
  {
    id: 's3',
    name: 'Global LogiCorp',
    country: 'MM',
    industry: 'Logistics',
    riskScore: 92,
    sanctionsHit: true,
    status: 'BLOCKED',
    lastScreenedAt: '2024-12-27T09:00:00Z',
    news: [
      {
        id: 'n2',
        title: 'New sanctions list includes Myanmar logistics firms',
        url: '#',
        source: 'EU Commission',
        publishedAt: '2024-12-20T14:00:00Z',
        summary: 'Strategic logistics entities linked to the military regime have been added to the consolidated sanctions list.',
        isRelevant: true,
        severity: 10,
        risks: ['Sanctions', 'Political Risk'],
      },
    ],
  },
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    supplierId: 's1',
    supplierName: 'Acme Textiles Ltd',
    type: AlertType.HIGH_RISK_NEWS,
    severity: 9,
    title: 'Critical Risk: Labor Violations',
    message: 'Reported unpaid overtime and safety hazards in Dhaka factory.',
    status: AlertStatus.UNREAD,
    createdAt: '2024-12-25T09:00:00Z',
  },
  {
    id: 'a2',
    supplierId: 's3',
    supplierName: 'Global LogiCorp',
    type: AlertType.SANCTIONS,
    severity: 10,
    title: 'Sanctions Hit Detected',
    message: 'Supplier matched with EU Consolidated Sanctions List update.',
    status: AlertStatus.UNREAD,
    createdAt: '2024-12-27T09:05:00Z',
  },
];

export const MOCK_STATS: ComplianceStats = {
  totalSuppliers: 200,
  criticalAlerts: 15,
  complianceScore: 78,
  riskDistribution: {
    critical: 13,
    high: 35,
    medium: 70,
    low: 82,
  },
};
