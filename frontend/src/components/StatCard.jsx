import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, description }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    blue: 'bg-blue-50 text-blue-600'
  };

  const iconColor = colorClasses[color] || colorClasses.indigo;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon size={24} />
        </div>
        {value !== undefined && (
          <span className="text-2xl font-bold text-slate-900">{value}</span>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        {description && (
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
