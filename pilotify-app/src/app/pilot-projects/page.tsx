'use client';

import ProjectTabs from '@/components/ProjectTabs';
import TableBoardToggle from '@/components/TableBoardToggle';

export default function PilotProjectsPage() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pilot Projects</h1>
        <TableBoardToggle />
      </div>
      <ProjectTabs />
      <div className="mt-4">
        <p>Content for the selected tab will go here.</p>
      </div>
    </div>
  );
}