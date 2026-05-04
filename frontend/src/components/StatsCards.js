import React from 'react';
import { Activity, TrendingUp, Calendar, Award } from 'lucide-react';

const StatsCards = ({ stats }) => {
  // This line ensures that if 'stats' is not a list, we use our default list instead
  const displayStats = Array.isArray(stats) ? stats : [
    { label: 'Total Volume', value: '0 kg', icon: Activity, color: 'text-blue-500' },
    { label: 'Avg Intensity', value: '0 kg', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Workouts', value: '0', icon: Calendar, color: 'text-purple-500' },
    { label: 'PRs Hit', value: '0', icon: Award, color: 'text-orange-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {displayStats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className={`p-3 rounded-lg bg-gray-50 ${stat.color || 'text-blue-500'}`}>
            {stat.icon ? <stat.icon size={24} /> : <Activity size={24} />}
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;