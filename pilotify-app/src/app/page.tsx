
import LeftSidebar from "@/components/LeftSidebar";
import TopNavbar from "@/components/TopNavbar";

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <LeftSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example Card 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">Total Pilots</h2>
              <p className="text-gray-600 dark:text-gray-300 text-4xl font-bold">1,234</p>
            </div>
            {/* Example Card 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">Active Missions</h2>
              <p className="text-gray-600 dark:text-gray-300 text-4xl font-bold">56</p>
            </div>
            {/* Example Card 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">Revenue (YTD)</h2>
              <p className="text-gray-600 dark:text-gray-300 text-4xl font-bold">$1.2M</p>
            </div>
          </div>

          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <ul>
              <li className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">Pilot John Doe completed mission #123. <span className="text-gray-500 text-sm">2 hours ago</span></li>
              <li className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">New pilot Jane Smith added. <span className="text-gray-500 text-sm">1 day ago</span></li>
              <li className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">Marketplace listing updated. <span className="text-gray-500 text-sm">3 days ago</span></li>
              <li>System maintenance completed. <span className="text-gray-500 text-sm">5 days ago</span></li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
