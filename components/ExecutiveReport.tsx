
import React from 'react';
import { ComplianceStats, Supplier } from '../types';
import { FileDown, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import RiskBadge from './RiskBadge';

interface ExecutiveReportProps {
  stats: ComplianceStats;
  suppliers: Supplier[];
}

const ExecutiveReport: React.FC<ExecutiveReportProps> = ({ stats, suppliers }) => {
  const topRisks = suppliers
    .filter(s => s.riskScore > 60)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-in fade-in duration-500">
      {/* Report Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Compliance Executive Report</h1>
          <p className="text-slate-500 mt-2">Report generated on {new Date().toLocaleDateString()} • Reporting Period: Dec 2024</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl">
          <FileDown className="w-5 h-5" />
          Export PDF
        </button>
      </div>

      {/* Summary Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          Executive Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-emerald-600">
              <CheckCircle className="w-6 h-6" />
              <span className="font-bold text-lg">Positive Outlook</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              <strong>{Math.round((stats.totalSuppliers - stats.riskDistribution.critical) / stats.totalSuppliers * 100)}%</strong> of suppliers ({(stats.totalSuppliers - stats.riskDistribution.critical)}/{stats.totalSuppliers}) are currently operating without critical risk flags. The overall compliance score improved by 5% compared to the previous month.
            </p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-bold text-lg">Action Required</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              <strong>{stats.riskDistribution.critical} suppliers</strong> require immediate management intervention due to high severity news alerts or sanctions list matches. Recommendation: Initiate secondary audits for all Critical tier entities.
            </p>
          </div>
        </div>
      </section>

      {/* Metrics Visualization (Simplified for Report Style) */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold">Key Performance Indicators</h2>
        <div className="bg-slate-900 rounded-[2rem] p-10 text-white grid grid-cols-1 md:grid-cols-3 gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
          <div className="text-center space-y-2 relative">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Compliance Score</p>
            <h4 className="text-6xl font-black">{stats.complianceScore}%</h4>
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-bold">
              <span>↑ 5.2% vs Nov</span>
            </div>
          </div>
          <div className="text-center space-y-2 relative">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Active Risks</p>
            <h4 className="text-6xl font-black">{stats.riskDistribution.critical + stats.riskDistribution.high}</h4>
            <p className="text-slate-500 text-xs">Priority: Urgent</p>
          </div>
          <div className="text-center space-y-2 relative">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Avg. Resolution</p>
            <h4 className="text-6xl font-black">36h</h4>
            <p className="text-slate-500 text-xs">Target: &lt;48h</p>
          </div>
        </div>
      </section>

      {/* Top Risks List */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold">Priority High-Risk Suppliers</h2>
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {topRisks.map((risk, idx) => (
            <div key={risk.id} className={`p-6 flex items-center justify-between ${idx !== topRisks.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 font-bold">
                  {idx + 1}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">{risk.name}</h5>
                  <p className="text-xs text-slate-500">{risk.country} • {risk.industry}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Current Score</p>
                  <RiskBadge score={risk.riskScore} />
                </div>
                <button className="text-sm font-bold text-blue-600 hover:underline">Full Profile</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Info */}
      <div className="pt-8 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Strictly Confidential • SupplyGuard Compliance Intelligence</p>
      </div>
    </div>
  );
};

export default ExecutiveReport;
