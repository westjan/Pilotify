
'use client';

import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

const TableBoardToggle: React.FC = () => {
  const [view, setView] = React.useState('list');

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setView('list')}
        className={`p-2 rounded-md ${
          view === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
      >
        <List className="h-5 w-5" />
      </button>
      <button
        onClick={() => setView('board')}
        className={`p-2 rounded-md ${
          view === 'board' ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
      >
        <LayoutGrid className="h-5 w-5" />
      </button>
    </div>
  );
};

export default TableBoardToggle;
