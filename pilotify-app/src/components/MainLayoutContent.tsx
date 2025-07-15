'use client';

import TopNavbar from "@/components/TopNavbar";
import LeftSidebar from "@/components/LeftSidebar";
import { useSession } from "next-auth/react";

export default function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {session && <LeftSidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        {children}
      </div>
    </div>
  );
}
