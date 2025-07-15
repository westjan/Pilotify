
'use client';

import { Search, Bell, Settings, UserCircle, LogOut, LogIn } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

const TopNavbar = () => {
  const { data: session } = useSession();

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
        <a href="/marketplace" className="ml-4 text-gray-600 hover:text-gray-900">Marketplace</a>
      </div>
      <div className="flex items-center space-x-4">
        {session && (
          <>
            <Bell className="text-gray-600 cursor-pointer" size={24} />
            <Settings className="text-gray-600 cursor-pointer" size={24} />
          </>
        )}
        {session ? (
          <div className="flex items-center space-x-2">
            <UserCircle className="text-gray-600" size={24} />
            <span className="text-gray-700 font-medium">{session.user?.name || session.user?.email}</span>
            <button onClick={() => signOut()} className="flex items-center text-gray-600 hover:text-gray-900">
              <LogOut size={20} className="mr-1" />
              Logout
            </button>
          </div>
        ) : (
          <a href="/auth/signin" className="flex items-center text-gray-600 hover:text-gray-900">
            <LogIn size={20} className="mr-1" />
            Login
          </a>
        )}
      </div>
    </nav>
  );
};

export default TopNavbar;
