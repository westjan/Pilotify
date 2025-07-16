
import { useEffect, useState } from 'react';
import { Search, Bell, Settings, UserCircle, LogOut, LogIn } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const TopNavbar = () => {
  const { data: session } = useSession();
  const [newActivitiesCount, setNewActivitiesCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [allActivities, setAllActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchNewActivitiesCount = async () => {
      if (!session) return;
      try {
        const response = await fetch('/api/activities'); // Fetches only new activities
        if (response.ok) {
          const data = await response.json();
          setNewActivitiesCount(data.length);
        } else {
          console.error('Failed to fetch new activities count');
        }
      } catch (error) {
        console.error('Error fetching new activities count:', error);
      }
    };
    fetchNewActivitiesCount();
  }, [session]);

  const handleBellClick = async () => {
    setShowNotifications(prev => !prev);
    if (!showNotifications) { // If opening the dropdown
      if (!session) return;
      try {
        const response = await fetch('/api/activities?all=true'); // Fetch all activities
        if (response.ok) {
          const data = await response.json();
          setAllActivities(data);
          setNewActivitiesCount(0); // Reset count after viewing

          // Mark activities as viewed
          await fetch('/api/users/update-last-viewed-activities', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
          console.error('Failed to fetch all activities');
        }
      } catch (error) {
        console.error('Error fetching all activities:', error);
      }
    }
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/marketplace" className="text-gray-600 hover:text-gray-900 font-medium">Marketplace</Link>
      </div>
      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {session && (
          <>
            <div className="relative">
              <Bell className="text-gray-600 cursor-pointer" size={24} onClick={handleBellClick} />
              {newActivitiesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {newActivitiesCount}
                </span>
              )}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20">
                  <h3 className="text-lg font-semibold px-4 py-2 border-b dark:border-gray-700">Notifications</h3>
                  {allActivities.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400 px-4 py-2">No new activities.</p>
                  ) : (
                    <ul>
                      {allActivities.map((activity, index) => {
                        const isNew = session.user?.lastViewedActivitiesAt ? new Date(activity.createdAt) > new Date(session.user.lastViewedActivitiesAt) : false;
                        return (
                          <li key={index} className={`px-4 py-2 border-b dark:border-gray-700 last:border-b-0 ${isNew ? 'bg-blue-50 dark:bg-blue-900 font-semibold' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                            <Link
                              href={(() => {
                                if (activity.type === 'Pilot Project') return `/pilot-projects/${activity.id}`;
                                if (activity.type === 'Offer') return `/marketplace/${activity.id}`;
                                if (activity.type === 'Review') return `/pilot-projects/${activity.pilotProject?.id}`;
                                if (activity.type === 'Reaction') return `/pilot-projects/${activity.comment?.pilotProject?.id}`;
                                return '#'; // Fallback
                              })()}
                              className="block"
                              onClick={() => setShowNotifications(false)} // Close dropdown on click
                            >
                              <p className="text-sm text-gray-800 dark:text-gray-200">{activity.description}</p>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(activity.createdAt).toLocaleString()}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <Settings className="text-gray-600 cursor-pointer" size={24} />
          </>
        )}
        {session ? (
          <div className="flex items-center space-x-2">
            <Link href="/profile" className="flex items-center">
              {session.user?.profilePictureUrl ? (
                <img src={session.user.profilePictureUrl} alt="User Profile" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <UserCircle className="text-gray-600" size={24} />
              )}
              <span className="text-gray-700 font-medium ml-2">{session.user?.name || session.user?.email}</span>
            </Link>
            <button onClick={() => signOut()} className="flex items-center text-gray-600 hover:text-gray-900">
              <LogOut size={20} className="mr-1" />
              Logout
            </button>
          </div>
        ) : (
          <Link href="/auth/signin" className="flex items-center text-gray-600 hover:text-gray-900">
            <LogIn size={20} className="mr-1" />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default TopNavbar;
