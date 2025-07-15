'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Role } from '@/generated/prisma';

interface Innovation {
  id: string;
  title: string;
  description?: string;
  category?: string;
  owner: { id: string; name: string };
}

export default function InnovationDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [innovation, setInnovation] = useState<Innovation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInnovation = async () => {
      if (status === 'loading') return;

      try {
        const response = await fetch(`/api/innovations/${id}`);
        if (response.ok) {
          const data = await response.json();
          setInnovation(data);
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
  }, [id, status]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this innovation?')) {
      return;
    }

    try {
      const response = await fetch(`/api/innovations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/marketplace');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete innovation.');
      }
    } catch (err) {
      console.error('Error deleting innovation:', err);
      setError('An unexpected error occurred during deletion.');
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

  const isOwner = session?.user?.id === innovation.owner.id;

  return (
    <div className="container mx-auto p-4">
      <Link href="/marketplace" className="text-blue-500 hover:text-blue-700 mb-4 inline-block">&larr; Back to Marketplace</Link>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">{innovation.title}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{innovation.description || 'No description provided.'}</p>
        <p className="text-gray-600 dark:text-gray-400"><strong>Category:</strong> {innovation.category || 'N/A'}</p>
        <p className="text-gray-600 dark:text-gray-400"><strong>Owner:</strong> {innovation.owner.name}</p>

        {isOwner && session?.user?.role === Role.INNOVATOR && (
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => router.push(`/innovations/${id}/edit`)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit Innovation
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete Innovation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
