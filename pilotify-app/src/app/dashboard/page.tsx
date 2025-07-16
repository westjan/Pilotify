'use client';

import DashboardCard from '@/components/DashboardCard';
import CircularProgress from '@/components/CircularProgress';
import MilestoneBadge from '@/components/MilestoneBadge';

export default function DashboardPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard title="Project Progress">
          <div className="flex justify-center">
            <CircularProgress percentage={75} />
          </div>
        </DashboardCard>
        <DashboardCard title="Recent Achievements">
          <div className="space-y-2">
            <MilestoneBadge title="Phase 1 Complete" level="Gold" />
            <MilestoneBadge title="Early Task Completion" level="Silver" />
          </div>
        </DashboardCard>
        <DashboardCard title="Team Success Spotlight">
          <p>Your team has been doing great!</p>
        </DashboardCard>
      </div>
    </div>
  );
}