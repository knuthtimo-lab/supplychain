
import React from 'react';
import { Alert, AlertStatus } from '../types';
import { ALERT_ICONS } from '../constants';
import { CheckCircle, MoreVertical } from 'lucide-react';

interface AlertInboxProps {
  alerts: Alert[];
  onSupplierClick: (id: string) => void;
}

const AlertInbox: React.FC<AlertInboxProps> = ({ alerts, onSupplierClick }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Alert Inbox</h2>
          <p className="text-slate-500 text-sm">Review and resolve critical compliance notifications.</p>
        </div>
        <button className="text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {alerts.map(alert => (
            <div 
              key={alert.id} 
              className={`p-6 hover:bg-slate-50 transition-colors group cursor-pointer flex gap-6 ${alert.status === AlertStatus.UNREAD ? 'bg-blue-50/20' : ''}`}
              onClick={() => onSupplierClick(alert.supplierId)}
            >
              <div className="flex-shrink-0 mt-1">
                <div className={`p-3 rounded-xl bg-white border border-slate-100 shadow-sm`}>
                  {ALERT_ICONS[alert.type]}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-base ${alert.status === AlertStatus.UNREAD ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                    {alert.title} — {alert.supplierName}
                  </h4>
                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(alert.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{alert.message}</p>
                <div className="flex items-center gap-4 mt-4">
                  <button className="text-xs font-bold text-blue-600 hover:underline">View Details</button>
                  <button className="text-xs font-bold text-slate-400 hover:text-slate-600">Mark as Resolved</button>
                </div>
              </div>

              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200">
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="p-20 text-center space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-100 mx-auto" />
              <p className="text-slate-900 font-bold">All clear!</p>
              <p className="text-slate-500 text-sm">No new alerts to review at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertInbox;
