
import { LayoutDashboard, ShoppingCart, ListTodo, FileText, Settings, UserCircle } from 'lucide-react';

const LeftSidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md flex flex-col justify-between">
      <div>
        <div className="p-4 font-bold text-xl border-b">Pilotify</div>
        <nav className="mt-4">
          <ul>
            <li className="flex items-center p-4 hover:bg-gray-100 cursor-pointer">
              <LayoutDashboard className="mr-3" size={20} />
              Dashboard
            </li>
            
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
          </ul>
        </nav>
      </div>
      
    </div>
  );
};

export default LeftSidebar;
