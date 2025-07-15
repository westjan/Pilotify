'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface PilotProject {
  id: string;
  title: string;
  description?: string;
  corporateId: string;
  innovatorId: string;
  status: string;
}

export default function EditPilotProject({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [pilotProject, setPilotProject] = useState<PilotProject | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectStatus, setProjectStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchPilotProject = async () => {
      if (status === 'loading') return;
      if (!session) {
        setError('You must be logged in to edit pilot projects.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/pilot-projects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPilotProject(data);
          setTitle(data.title);
          setDescription(data.description || '');
          setProjectStatus(data.status);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!session?.user?.id) {
      setError('You must be logged in to edit a pilot project.');
      return;
    }

    try {
      const response = await fetch(`/api/pilot-projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, status: projectStatus }),
      });

      if (response.ok) {
        setSuccess('Pilot project updated successfully!');
        router.push(`/pilot-projects/${id}`);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update pilot project.');
      }
    } catch (err) {
      console.error('Error updating pilot project:', err);
      setError('An unexpected error occurred.');
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

  const isParticipant = session?.user?.id === pilotProject.corporateId || session?.user?.id === pilotProject.innovatorId;

  if (!isParticipant) {
    return <div className="text-center py-8 text-red-500">Forbidden: You do not have permission to edit this project.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Edit Pilot Project</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Title:</label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Description:</label>
            <textarea
              id="description"
              rows={4}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="status" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Status:</label>
            <select
              id="status"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              required
            >
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
