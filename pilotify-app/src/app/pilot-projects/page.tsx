'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface PilotProject {
  id: string;
  title: string;
  description?: string;
  corporate: { name: string };
  innovator: { name: string };
  status: string;
}

export default function PilotProjectsList() {
  const { data: session, status } = useSession();
  const [pilotProjects, setPilotProjects] = useState<PilotProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPilotProjects = async () => {
      if (status === 'loading') return;
      if (!session) {
        setError('You must be logged in to view pilot projects.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/pilot-projects');
        if (response.ok) {
          const data = await response.json();
          setPilotProjects(data);
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to fetch pilot projects.');
        }
      } catch (err) {
        console.error('Error fetching pilot projects:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchPilotProjects();
  }, [session, status]);

  if (loading) {
    return <div className="text-center py-8">Loading pilot projects...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Pilot Projects</h1>
      <Link href="/pilot-projects/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6 inline-block">
        Create New Pilot Project
      </Link>
      {pilotProjects.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No pilot projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pilotProjects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{project.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description || 'No description provided.'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Corporate: {project.corporate.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Innovator: {project.innovator.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status: {project.status}</p>
              <Link href={`/pilot-projects/${project.id}`} className="mt-4 inline-block text-blue-500 hover:text-blue-700 font-medium">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
