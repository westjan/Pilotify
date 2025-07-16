'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { Role } from "@/generated/prisma";

interface PilotProject {
  id: string;
  title: string;
  status: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [pilotProjects, setPilotProjects] = useState<PilotProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState('');
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [errorActivities, setErrorActivities] = useState('');

  useEffect(() => {
    const fetchPilotProjects = async () => {
      if (status === 'loading' || !session) return;

      try {
        const response = await fetch('/api/pilot-projects');
        if (response.ok) {
          const data = await response.json();
          setPilotProjects(data);
        } else {
          const data = await response.json();
          setErrorProjects(data.message || 'Failed to fetch pilot projects.');
        }
      } catch (err) {
        console.error('Error fetching pilot projects:', err);
        setErrorProjects('An unexpected error occurred while fetching projects.');
      } finally {
        setLoadingProjects(false);
      }
    };

    const fetchActivities = async () => {
      if (status === 'loading' || !session) return;

      try {
        const response = await fetch('/api/activities');
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        } else {
          const data = await response.json();
          setErrorActivities(data.message || 'Failed to fetch activities.');
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
        setErrorActivities('An unexpected error occurred while fetching activities.');
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchPilotProjects();
    fetchActivities();

    const updateLastViewedActivities = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          await fetch('/api/users/update-last-viewed-activities', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Error updating last viewed activities timestamp:', error);
        }
      }
    };
    updateLastViewedActivities();
  }, [session, status]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">Loading...</div>;
  }

  if (!session) {
    return <div className="text-center py-8">Please log in to view your dashboard.</div>;
  }

  const totalProjects = pilotProjects.length;
  const pendingProjects = pilotProjects.filter(p => p.status === 'Pending').length;
  const activeProjects = pilotProjects.filter(p => p.status === 'Active').length;
  const completedProjects = pilotProjects.filter(p => p.status === 'Completed').length;

  return (
    <main className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome, {session.user?.name || session.user?.email}!</h1>
      <p className="text-lg mb-8">Here's an overview of your pilot projects.</p>

      {loadingProjects ? (
        <div className="text-center py-8">Loading project data...</div>
      ) : errorProjects ? (
        <div className="text-center py-8 text-red-500">Error: {errorProjects}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">Total Projects</h2>
            <p className="text-gray-600 dark:text-gray-300 text-4xl font-bold">{totalProjects}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">Pending Projects</h2>
            <p className="text-gray-600 dark:text-gray-300 text-4xl font-bold">{pendingProjects}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">Active Projects</h2>
            <p className="text-gray-600 dark:text-gray-300 text-4xl font-bold">{activeProjects}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">Completed Projects</h2>
            <p className="text-gray-600 dark:text-gray-300 text-4xl font-bold">{completedProjects}</p>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/pilot-projects" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">
          View All My Projects
        </Link>
        <Link href="/pilot-projects/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">
          Create New Project
        </Link>
      </div>

      {session?.user?.role === Role.ADMIN && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Admin Section</h2>
          <p>This content is only visible to administrators.</p>
        </div>
      )}

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        {loadingActivities ? (
          <div className="text-center py-4">Loading activities...</div>
        ) : errorActivities ? (
          <div className="text-center py-4 text-red-500">Error: {errorActivities}</div>
        ) : activities.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No recent activities.</p>
        ) : (
          <ul>
            {activities.map((activity, index) => (
              <li key={index} className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                {activity.description} <span className="text-gray-500 text-sm">{new Date(activity.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
