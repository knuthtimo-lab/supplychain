
import React from 'react';

interface RiskBadgeProps {
  score: number;
  showText?: boolean;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ score, showText = true }) => {
  let color = 'bg-emerald-100 text-emerald-700 border-emerald-200';
  let label = 'Low';

  if (score >= 80) {
    color = 'bg-red-100 text-red-700 border-red-200';
    label = 'Critical';
  } else if (score >= 60) {
    color = 'bg-orange-100 text-orange-700 border-orange-200';
    label = 'High';
  } else if (score >= 30) {
    color = 'bg-amber-100 text-amber-700 border-amber-200';
    label = 'Medium';
  }

  return (
    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full border text-xs font-semibold ${color}`}>
      <span className="w-2 h-2 rounded-full bg-current" />
      {score} {showText && `— ${label}`}
    </div>
  );
};

export default RiskBadge;
