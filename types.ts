
export enum RiskLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum AlertType {
  SANCTIONS = 'SANCTIONS',
  HIGH_RISK_NEWS = 'HIGH_RISK_NEWS',
  SCORE_INCREASE = 'SCORE_INCREASE',
  NEW_SUPPLIER = 'NEW_SUPPLIER',
}

export enum AlertStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  RESOLVED = 'RESOLVED',
}

export enum QuestionnaireStatus {
  NOT_SENT = 'NOT_SENT',
  SENT = 'SENT',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
}

export enum QuestionnaireType {
  COMPREHENSIVE = 'COMPREHENSIVE',
  STANDARD = 'STANDARD',
  BASIC = 'BASIC',
}

export interface Questionnaire {
  id: string;
  type: QuestionnaireType;
  status: QuestionnaireStatus;
  language: 'EN' | 'DE' | 'CN' | 'ES' | 'FR';
  sentAt?: string;
  completedAt?: string;
  lastReminderAt?: string;
  aiScore?: number;
  aiFeedback?: string;
  responses?: Record<string, string>;
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  summary?: string;
  isRelevant: boolean;
  severity: number;
  risks: string[];
}

export interface Supplier {
  id: string;
  name: string;
  legalName?: string;
  country: string;
  city?: string;
  industry: string;
  website?: string;
  riskScore: number;
  sanctionsHit: boolean;
  status: 'ACTIVE' | 'WATCHLIST' | 'BLOCKED';
  lastScreenedAt: string;
  news: NewsArticle[];
  questionnaire?: Questionnaire;
}

export interface Alert {
  id: string;
  supplierId: string;
  supplierName: string;
  type: AlertType;
  severity: number;
  title: string;
  message: string;
  status: AlertStatus;
  createdAt: string;
}

export interface ComplianceStats {
  totalSuppliers: number;
  criticalAlerts: number;
  complianceScore: number;
  riskDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}
