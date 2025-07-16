'use client';

import TableBoardToggle from '@/components/TableBoardToggle';

export default function TasksPage() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <TableBoardToggle />
      </div>
      <div>
        <p>Task list or board will be displayed here.</p>
      </div>
    </div>
  );
}
