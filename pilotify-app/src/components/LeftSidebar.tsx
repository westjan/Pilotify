import React from 'react';
import Link from 'next/link';

interface NavItemProps {
  href: string;
  icon: string; // Placeholder for actual icon component
  label: string;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, badge }) => {
  return (
    <Link href={href} className="flex items-center p-2 my-1 rounded-md hover:bg-gray-200">
      <span className="mr-3 text-xl">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="ml-auto bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
};

const LeftSidebar: React.FC = () => {
  const navItems = [
    { href: '/dashboard', icon: '📊', label: 'Dashboard', badge: 3 },
    { href: '/marketplace', icon: '🛍️', label: 'Marketplace' },
    { href: '/pilot-projects', icon: '✈️', label: 'Pilot Projects', badge: 5 },
    { href: '/innovations', icon: '💡', label: 'Innovations' },
    { href: '/reports', icon: '📈', label: 'Reports' },
    { href: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div className="w-[240px] bg-gray-100 p-4 flex flex-col">
      <div className="text-2xl font-bold mb-6">Pilotify</div>
      <nav className="flex-1">
        {
          navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))
        }
      </nav>
    </div>
  );
};

export default LeftSidebar;
