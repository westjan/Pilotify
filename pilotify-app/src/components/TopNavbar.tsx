import React from 'react';

const TopNavbar: React.FC = () => {
  return (
    <header className="bg-white p-4 flex items-center justify-between shadow-md">
      <div className="text-xl font-semibold">Pilotify App</div>
      <div className="flex items-center">
        {/* Search Input Placeholder */}
        <input
          type="text"
          placeholder="Search..."
          className="p-2 rounded-md border border-gray-300 mr-4"
        />
        {/* Bell Icon with Badge */}
        <div className="relative mr-4">
          <span className="text-2xl">🔔</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            7
          </span>
        </div>
        {/* User Avatar Menu Placeholder */}
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          JD
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
