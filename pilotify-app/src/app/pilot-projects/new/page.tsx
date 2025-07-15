'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Role } from '@/generated/prisma';

export default function NewPilotProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [corporateId, setCorporateId] = useState('');
  const [innovatorId, setInnovatorId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!session?.user?.id) {
      setError('You must be logged in to create a pilot project.');
      return;
    }

    // Automatically set corporateId or innovatorId based on user role
    let finalCorporateId = corporateId;
    let finalInnovatorId = innovatorId;

    if (session.user.role === Role.CORPORATE) {
      finalCorporateId = session.user.id;
    } else if (session.user.role === Role.INNOVATOR) {
      finalInnovatorId = session.user.id;
    }

    // If the user is an admin, they can set both, so we use the state values.
    // Otherwise, ensure the user is part of the project they are creating.
    if (session.user.role !== Role.ADMIN) {
      if (session.user.id !== finalCorporateId && session.user.id !== finalInnovatorId) {
        setError('You can only create projects where you are either the corporate or the innovator.');
        return;
      }
    }

    const response = await fetch('/api/pilot-projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, corporateId: finalCorporateId, innovatorId: finalInnovatorId }),
    });

    if (response.ok) {
      setSuccess('Pilot project created successfully!');
      setTitle('');
      setDescription('');
      setCorporateId('');
      setInnovatorId('');
      router.push('/pilot-projects'); // Redirect to pilot projects list
    } else {
      const data = await response.json();
      setError(data.message || 'Failed to create pilot project.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Create New Pilot Project</h1>
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
          {session?.user?.role === Role.ADMIN ? (
            <>
              <div className="mb-4">
                <label htmlFor="corporateId" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Corporate User ID:</label>
                <input
                  type="text"
                  id="corporateId"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={corporateId}
                  onChange={(e) => setCorporateId(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="innovatorId" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Innovator User ID:</label>
                <input
                  type="text"
                  id="innovatorId"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={innovatorId}
                  onChange={(e) => setInnovatorId(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Your user ID ({session?.user?.id}) will be automatically assigned as the {session?.user?.role === Role.CORPORATE ? 'corporate' : 'innovator'} for this project.
            </p>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
