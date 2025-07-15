'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Role } from '@/generated/prisma';

interface Innovation {
  id: string;
  title: string;
  description?: string;
  category?: string;
  owner: { name: string };
}

export default function Marketplace() {
  const { data: session, status } = useSession();
  const [innovations, setInnovations] = useState<Innovation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInnovations = async () => {
      if (status === 'loading') return;

      try {
        const response = await fetch('/api/innovations');
        if (response.ok) {
          const data = await response.json();
          setInnovations(data);
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to fetch innovations.');
        }
      } catch (err) {
        console.error('Error fetching innovations:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchInnovations();
  }, [status]);

  if (loading) {
    return <div className="text-center py-8">Loading innovations...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Innovation Marketplace</h1>
      {session?.user?.role === Role.INNOVATOR && (
        <Link href="/innovations/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6 inline-block">
          Add New Innovation
        </Link>
      )}
      {innovations.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No innovations found in the marketplace.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {innovations.map((innovation) => (
            <div key={innovation.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{innovation.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{innovation.description || 'No description provided.'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Category: {innovation.category || 'N/A'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Owner: {innovation.owner.name}</p>
              <Link href={`/innovations/${innovation.id}`} className="mt-4 inline-block text-blue-500 hover:text-blue-700 font-medium">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
