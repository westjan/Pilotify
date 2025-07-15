'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Role } from '@/generated/prisma';

interface PilotProject {
  id: string;
  title: string;
  description?: string;
  corporate: { name: string };
  innovator: { name: string };
  status: string;
}

export default function PilotProjectDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [pilotProject, setPilotProject] = useState<PilotProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPilotProject = async () => {
      if (status === 'loading') return;
      if (!session) {
        setError('You must be logged in to view pilot projects.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/pilot-projects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPilotProject(data);
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to fetch pilot project.');
        }
      } catch (err) {
        console.error('Error fetching pilot project:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchPilotProject();
  }, [id, session, status]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this pilot project?')) {
      return;
    }

    try {
      const response = await fetch(`/api/pilot-projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/pilot-projects');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete pilot project.');
      }
    } catch (err) {
      console.error('Error deleting pilot project:', err);
      setError('An unexpected error occurred during deletion.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading pilot project...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!pilotProject) {
    return <div className="text-center py-8 text-gray-500">Pilot project not found.</div>;
  }

  const isParticipant = session?.user?.id === pilotProject.corporate.id || session?.user?.id === pilotProject.innovator.id;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">{pilotProject.title}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{pilotProject.description || 'No description provided.'}</p>
        <p className="text-gray-600 dark:text-gray-400"><strong>Corporate:</strong> {pilotProject.corporate.name}</p>
        <p className="text-gray-600 dark:text-gray-400"><strong>Innovator:</strong> {pilotProject.innovator.name}</p>
        <p className="text-gray-600 dark:text-gray-400"><strong>Status:</strong> {pilotProject.status}</p>

        {isParticipant && (
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => router.push(`/pilot-projects/${id}/edit`)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit Project
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
