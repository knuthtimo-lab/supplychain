
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Shield, AlertCircle, CheckCircle2, Factory } from 'lucide-react';
import { ComplianceStats, Supplier, Alert } from '../types';
import RiskBadge from './RiskBadge';
import { ALERT_ICONS } from '../constants';

interface DashboardProps {
  stats: ComplianceStats;
  suppliers: Supplier[];
  alerts: Alert[];
  onSupplierClick: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, suppliers, alerts, onSupplierClick }) => {
  const pieData = [
    { name: 'Critical', value: stats.riskDistribution.critical, color: '#DC2626' },
    { name: 'High', value: stats.riskDistribution.high, color: '#F59E0B' },
    { name: 'Medium', value: stats.riskDistribution.medium, color: '#FCD34D' },
    { name: 'Low', value: stats.riskDistribution.low, color: '#10B981' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500">Continuously monitoring {stats.totalSuppliers} global suppliers for ESG compliance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Suppliers" value={stats.totalSuppliers} icon={<Factory className="text-blue-600" />} trend="+4 this month" />
        <StatCard title="Critical Alerts" value={stats.criticalAlerts} icon={<AlertCircle className="text-red-600" />} trend="-2 vs last week" isDanger />
        <StatCard title="Compliance Score" value={`${stats.complianceScore}%`} icon={<Shield className="text-emerald-600" />} trend="+5% improvement" />
        <StatCard title="Verified Audits" value="48" icon={<CheckCircle2 className="text-indigo-600" />} trend="12 scheduled" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Distribution Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-6">Risk Distribution by Category</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts Sidebar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Priority Alerts</h3>
            <span className="text-xs font-semibold bg-red-50 text-red-600 px-2 py-1 rounded-full uppercase tracking-wider">Urgent</span>
          </div>
          <div className="space-y-4 flex-1">
            {alerts.slice(0, 4).map(alert => (
              <div key={alert.id} className="group p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer" onClick={() => onSupplierClick(alert.supplierId)}>
                <div className="flex gap-3">
                  <div className="mt-1">{ALERT_ICONS[alert.type]}</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700">{alert.supplierName}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <RiskBadge score={alert.severity * 10} showText={false} />
                      <span className="text-[10px] text-slate-400 font-medium">{new Date(alert.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 text-sm text-blue-600 font-bold hover:underline">View All Alerts →</button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; trend: string; isDanger?: boolean }> = ({ title, value, icon, trend, isDanger }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${isDanger ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
        {trend}
      </span>
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h4 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h4>
  </div>
);

export default Dashboard;
