
import { LayoutDashboard, ShoppingCart, ListTodo, FileText, Settings, UserCircle, FolderKanban, Users, Tag, Bookmark as BookmarkIcon } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Role } from '@/generated/prisma';

const LeftSidebar = () => {
  const { data: session } = useSession();

  return (
    <div className="w-64 bg-white shadow-md flex flex-col justify-between">
      <div>
        <Link href="/" className="p-4 font-bold text-xl border-b block">Pilotify</Link>
        <nav className="mt-4">
          <ul>
            <Link href="/dashboard" className="flex items-center p-4 hover:bg-gray-100 cursor-pointer">
              <LayoutDashboard className="mr-3" size={20} />
              Dashboard
            </Link>
            <Link href="/pilot-projects" className="flex items-center p-4 hover:bg-gray-100 cursor-pointer">
              <FolderKanban className="mr-3" size={20} />
              Projects
            </Link>
            
            <li className="flex items-center p-4 hover:bg-gray-100 cursor-pointer">
              <ListTodo className="mr-3" size={20} />
              Tasks
            </li>
            <li className="flex items-center p-4 hover:bg-gray-100 cursor-pointer">
              <FileText className="mr-3" size={20} />
              Documents
            </li>
            <li className="flex items-center p-4 hover:bg-gray-100 cursor-pointer">
              <Settings className="mr-3" size={20} />
              Settings
            </li>
            {session?.user?.role === Role.ADMIN && (
              <>
                <Link href="/admin/users" className="flex items-center p-4 hover:bg-gray-100 cursor-pointer">
                  <Users className="mr-3" size={20} />
                  User Management
                </Link>
                <Link href="/admin/categories" className="flex items-center p-4 hover:bg-gray-100 cursor-pointer">
                  <Tag className="mr-3" size={20} />
                  Category Management
                </Link>
              </>
            )}
          </ul>
        </nav>
      </div>
      
    </div>
  );
};

export default LeftSidebar;
