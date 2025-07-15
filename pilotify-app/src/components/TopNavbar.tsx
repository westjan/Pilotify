
import { Search, Bell, Settings, UserCircle } from 'lucide-react';

const TopNavbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center w-1/3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="text-gray-600 cursor-pointer" size={24} />
        <Settings className="text-gray-600 cursor-pointer" size={24} />
        <UserCircle className="text-gray-600 cursor-pointer" size={24} />
      </div>
    </nav>
  );
};

export default TopNavbar;
