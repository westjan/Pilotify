'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Role } from '@/generated/prisma';

interface Innovation {
  id: string;
  title: string;
  description?: string;
  category?: string;
  ownerId: string;
}

export default function EditInnovation({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [innovation, setInnovation] = useState<Innovation | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchInnovation = async () => {
      if (status === 'loading') return;
      if (!session || session.user?.role !== Role.INNOVATOR) {
        setError('You must be logged in as an Innovator to edit innovations.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/innovations/${id}`);
        if (response.ok) {
          const data = await response.json();
          setInnovation(data);
          setTitle(data.title);
          setDescription(data.description || '');
          setCategory(data.category || '');
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to fetch innovation.');
        }
      } catch (err) {
        console.error('Error fetching innovation:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchInnovation();
  }, [id, session, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!session || session.user?.role !== Role.INNOVATOR) {
      setError('You must be logged in as an Innovator to edit an innovation.');
      return;
    }

    try {
      const response = await fetch(`/api/innovations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, category }),
      });

      if (response.ok) {
        setSuccess('Innovation updated successfully!');
        router.push(`/innovations/${id}`);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update innovation.');
      }
    } catch (err) {
      console.error('Error updating innovation:', err);
      setError('An unexpected error occurred.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading innovation...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!innovation) {
    return <div className="text-center py-8 text-gray-500">Innovation not found.</div>;
  }

  const isOwner = session?.user?.id === innovation.ownerId;

  if (!isOwner) {
    return <div className="text-center py-8 text-red-500">Forbidden: You do not have permission to edit this innovation.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Edit Innovation</h1>
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
            <label htmlFor="category" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Category:</label>
            <input
              type="text"
              id="category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Innovation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
