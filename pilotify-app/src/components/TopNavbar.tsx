import React from 'react';
import Link from 'next/link';

const TopNavbar: React.FC = () => {
  return (
    <header className="bg-white p-4 flex items-center justify-between shadow-md">
      <div className="text-xl font-semibold">
        <Link href="/marketplace" className="hover:text-blue-600">Marketplace</Link>
      </div>
      <div className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 w-full rounded-md border border-gray-300"
          />
        </div>
      </div>
      <div className="flex items-center">
        {/* Bell Icon with Badge */}
        <div className="relative mr-4">
          <span className="text-2xl">🔔</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            7
          </span>
        </div>
        {/* User Avatar Menu Placeholder */}
        <Link href="/profile" className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
          JD
        </Link>
      </div>
    </header>
  );
};

export default TopNavbar;
