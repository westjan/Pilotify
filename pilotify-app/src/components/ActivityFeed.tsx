
import React from 'react';

const ActivityFeed: React.FC = () => {
  const activities = [
    {
      id: 1,
      user: 'Alice',
      action: 'commented on',
      target: 'Project Alpha',
      comment: 'Great progress this week!',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      user: 'Bob',
      action: 'updated the status of',
      target: 'Task 3',
      comment: 'to In Progress',
      timestamp: '1 day ago',
    },
  ];

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {activity.user} {activity.action} <a href="#" className="font-medium text-gray-900">{activity.target}</a>
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500">{activity.comment}</p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime={activity.timestamp}>{activity.timestamp}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;
