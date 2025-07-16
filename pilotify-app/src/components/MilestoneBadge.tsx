
import React from 'react';

interface MilestoneBadgeProps {
  title: string;
  level: 'Bronze' | 'Silver' | 'Gold';
}

const MilestoneBadge: React.FC<MilestoneBadgeProps> = ({ title, level }) => {
  const levelColors = {
    Bronze: 'bg-yellow-600',
    Silver: 'bg-gray-400',
    Gold: 'bg-yellow-400',
  };

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${levelColors[level]}`}>
      {title}
    </div>
  );
};

export default MilestoneBadge;
