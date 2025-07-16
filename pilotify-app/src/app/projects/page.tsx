'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Role } from '@/generated/prisma';

interface PilotProject {
  id: string;
  title: string;
  description?: string;
  corporate: { id: string; name: string, companyLogoUrl?: string };
  innovator: { id: string; name: string, companyLogoUrl?: string };
  status: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const [pilotProjects, setPilotProjects] = useState<PilotProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPilotProjects = async () => {
      if (status === 'loading') return;
      if (!session) {
        setError('You must be logged in to view projects.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/pilot-projects');
        if (response.ok) {
          const data = await response.json();
          // Filter projects to show only those the current user is involved in
          const userProjects = data.filter((project: PilotProject) =>
            project.corporate.id === session.user?.id || project.innovator.id === session.user?.id
          );
          setPilotProjects(userProjects);
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
    return <div className="text-center py-8">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">My Projects</h1>
      <Link href="/pilot-projects/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6 inline-block">
        Create New Pilot Project
      </Link>
      {pilotProjects.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">You are not involved in any pilot projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pilotProjects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{project.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{project.description || 'No description provided.'}</p>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {project.corporate.companyLogoUrl && (
                    <img src={project.corporate.companyLogoUrl} alt={`${project.corporate.name} Logo`} className="w-6 h-6 object-contain mr-2" />
                  )}
                  Corporate: {project.corporate.name}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {project.innovator.companyLogoUrl && (
                    <img src={project.innovator.companyLogoUrl} alt={`${project.innovator.name} Logo`} className="w-6 h-6 object-contain mr-2" />
                  )}
                  Innovator: {project.innovator.name}
                </div>
              </div>
              <div className="mt-auto">
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === 'Active' ? 'bg-green-200 text-green-800' : project.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}>
                    {project.status}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <Link href={`/pilot-projects/${project.id}`} className="block text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
