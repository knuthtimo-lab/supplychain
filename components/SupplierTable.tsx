
import React, { useState } from 'react';
import { ExternalLink, MapPin, Factory, AlertCircle } from 'lucide-react';
import { Supplier } from '../types';
import RiskBadge from './RiskBadge';

interface SupplierTableProps {
  suppliers: Supplier[];
  onSupplierClick: (id: string) => void;
}

const SupplierTable: React.FC<SupplierTableProps> = ({ suppliers, onSupplierClick }) => {
  const [filter, setFilter] = useState('');

  const filtered = suppliers.filter(s => 
    s.name.toLowerCase().includes(filter.toLowerCase()) || 
    s.industry.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Suppliers</h2>
          <p className="text-slate-500 text-sm">Manage and monitor your supply chain database.</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="Search suppliers..." 
            className="px-4 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Region</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Industry</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk Score</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(supplier => (
              <tr key={supplier.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => onSupplierClick(supplier.id)}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                      {supplier.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 group-hover:text-blue-700">{supplier.name}</span>
                        {supplier.sanctionsHit && (
                          <span className="px-1.5 py-0.5 rounded bg-red-100 text-[10px] text-red-700 font-black uppercase flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Sanctioned
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">Last screened: {new Date(supplier.lastScreenedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {supplier.country}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Factory className="w-4 h-4 text-slate-400" />
                    {supplier.industry}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <RiskBadge score={supplier.riskScore} />
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-500">No suppliers found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierTable;
