'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Role } from '@/generated/prisma';
import UserSearchSelect from '@/components/UserSearchSelect';

export default function NewPilotProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [corporateId, setCorporateId] = useState('');
  const [corporateName, setCorporateName] = useState('');
  const [innovatorId, setInnovatorId] = useState('');
  const [innovatorName, setInnovatorName] = useState('');
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

    let currentCorporateId = corporateId;
    let currentInnovatorId = innovatorId;

    // Determine final corporateId and innovatorId based on user role and selections
    if (session.user.role === Role.CORPORATE) {
      currentCorporateId = session.user.id;
      if (!currentInnovatorId) {
        setError('Please select an Innovator.');
        return;
      }
    } else if (session.user.role === Role.INNOVATOR) {
      currentInnovatorId = session.user.id;
      if (!currentCorporateId) {
        setError('Please select a Corporate.');
        return;
      }
    } else if (session.user.role === Role.ADMIN) {
      if (!currentCorporateId || !currentInnovatorId) {
        setError('Please select both Corporate and Innovator.');
        return;
      }
    }

    if (!title) {
      setError('Please fill in the project title.');
      return;
    }

    const response = await fetch('/api/pilot-projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        corporateId: currentCorporateId,
        innovatorId: currentInnovatorId,
      }),
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
              <UserSearchSelect
                label="Corporate:"
                roleFilter="CORPORATE"
                onSelect={(id, name) => {
                  setCorporateId(id);
                  setCorporateName(name);
                }}
                selectedUserId={corporateId}
                selectedUserName={corporateName}
              />
              <UserSearchSelect
                label="Innovator:"
                roleFilter="INNOVATOR"
                onSelect={(id, name) => {
                  setInnovatorId(id);
                  setInnovatorName(name);
                }}
                selectedUserId={innovatorId}
                selectedUserName={innovatorName}
              />
            </>
          ) : (
            <>
              {session?.user?.role === Role.CORPORATE && (
                <UserSearchSelect
                  label="Select Innovator:"
                  roleFilter="INNOVATOR"
                  onSelect={(id, name) => {
                    setInnovatorId(id);
                    setInnovatorName(name);
                  }}
                  selectedUserId={innovatorId}
                  selectedUserName={innovatorName}
                />
              )}
              {session?.user?.role === Role.INNOVATOR && (
                <UserSearchSelect
                  label="Select Corporate:"
                  roleFilter="CORPORATE"
                  onSelect={(id, name) => {
                    setCorporateId(id);
                    setCorporateName(name);
                  }}
                  selectedUserId={corporateId}
                  selectedUserName={corporateName}
                />
              )}
            </>
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
