
import React from 'react';
import { AlertTriangle, ShieldAlert, TrendingUp, UserPlus, ShieldCheck, ShieldClose, Globe, Building2 } from 'lucide-react';
import { RiskLevel, AlertType } from './types';

export const RISK_COLORS: Record<RiskLevel, string> = {
  [RiskLevel.CRITICAL]: 'text-red-600 bg-red-50 border-red-200',
  [RiskLevel.HIGH]: 'text-orange-600 bg-orange-50 border-orange-200',
  [RiskLevel.MEDIUM]: 'text-amber-600 bg-amber-50 border-amber-200',
  [RiskLevel.LOW]: 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

export const ALERT_ICONS: Record<AlertType, React.ReactNode> = {
  [AlertType.SANCTIONS]: <ShieldAlert className="w-5 h-5 text-red-600" />,
  [AlertType.HIGH_RISK_NEWS]: <AlertTriangle className="w-5 h-5 text-orange-500" />,
  [AlertType.SCORE_INCREASE]: <TrendingUp className="w-5 h-5 text-amber-500" />,
  [AlertType.NEW_SUPPLIER]: <UserPlus className="w-5 h-5 text-blue-500" />,
};

export const INDUSTRY_RISK: Record<string, number> = {
  'Textiles': 70,
  'Electronics': 45,
  'Automotive': 40,
  'Chemicals': 60,
  'Logistics': 30,
  'Software': 15,
};

export const COUNTRY_RISK: Record<string, number> = {
  'DE': 5, 'CH': 5, 'NO': 5,
  'US': 10, 'FR': 10, 'JP': 10,
  'CN': 55, 'IN': 50, 'VN': 45,
  'BD': 75, 'MM': 85, 'KP': 95,
};
