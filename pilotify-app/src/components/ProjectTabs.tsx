'use client';

import React from 'react';

const ProjectTabs: React.FC = () => {
  const tabs = ['Overview', 'Tasks', 'Activity', 'Outcomes'];
  const [activeTab, setActiveTab] = React.useState('Overview');

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <a
            key={tab}
            href="#"
            onClick={() => setActiveTab(tab)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {tab}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default ProjectTabs;