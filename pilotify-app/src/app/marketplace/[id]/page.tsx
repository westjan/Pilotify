'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { OfferStatus, Role } from '@/generated/prisma';
import { Bookmark } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  duration?: string;
  deliverables?: string;
  status: OfferStatus;
  contactEmail?: string;
  owner: {
    id: string;
    name?: string;
    email: string;
    companyName?: string;
    companyLogoUrl?: string;
  };
}

export default function OfferDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Offer>>({});
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfferAndBookmarkStatus = async () => {
      if (status === 'loading') return;
      if (!session) {
        setError('You must be logged in to view offer details.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/offers/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOffer(data);
          setEditData(data);

          // Check bookmark status
          const bookmarkResponse = await fetch(`/api/bookmarks?offerId=${id}`);
          if (bookmarkResponse.ok) {
            const bookmarks = await bookmarkResponse.json();
            if (bookmarks.length > 0) {
              setIsBookmarked(true);
              setBookmarkId(bookmarks[0].id);
            }
          }
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to fetch offer details.');
        }
      } catch (err) {
        console.error('Error fetching offer or bookmark status:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOfferAndBookmarkStatus();
    }
  }, [id, session, status]);

  const handleBookmarkToggle = async () => {
    if (!session) {
      setError('You must be logged in to bookmark.');
      return;
    }

    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setIsBookmarked(false);
          setBookmarkId(null);
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to remove bookmark.');
        }
      } else {
        // Add bookmark
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ offerId: id }),
        });
        if (response.ok) {
          const newBookmark = await response.json();
          setIsBookmarked(true);
          setBookmarkId(newBookmark.id);
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to add bookmark.');
        }
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      setError('An unexpected error occurred.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`/api/offers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const updatedOffer = await response.json();
        setOffer(updatedOffer);
        setIsEditing(false);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update offer.');
      }
    } catch (err) {
      console.error('Error updating offer:', err);
      setError('An unexpected error occurred.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    setError('');
    try {
      const response = await fetch(`/api/offers/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        router.push('/marketplace'); // Redirect to marketplace after deletion
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete offer.');
      }
    } catch (err) {
      console.error('Error deleting offer:', err);
      setError('An unexpected error occurred.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading offer details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!offer) {
    return <div className="text-center py-8">Offer not found.</div>;
  }

  const isOwner = session?.user?.id === offer.owner.id;
  const isAdmin = session?.user?.role === Role.ADMIN;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Offer Details</h1>
      {isEditing ? (
        <form onSubmit={handleUpdate} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Title:</label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={editData.title || ''}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Description:</label>
            <textarea
              id="description"
              rows={4}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={editData.description || ''}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Category:</label>
            <input
              type="text"
              id="category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={editData.category || ''}
              onChange={(e) => setEditData({ ...editData, category: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Price (USD):</label>
            <input
              type="number"
              id="price"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={editData.price || ''}
              onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="duration" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Duration (e.g., 3 months):</label>
            <input
              type="text"
              id="duration"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={editData.duration || ''}
              onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="deliverables" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Deliverables:</label>
            <textarea
              id="deliverables"
              rows={3}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={editData.deliverables || ''}
              onChange={(e) => setEditData({ ...editData, deliverables: e.target.value })}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="contactEmail" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Contact Email:</label>
            <input
              type="email"
              id="contactEmail"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={editData.contactEmail || ''}
              onChange={(e) => setEditData({ ...editData, contactEmail: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Status:</label>
            <select
              id="status"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={editData.status || OfferStatus.AVAILABLE}
              onChange={(e) => setEditData({ ...editData, status: e.target.value as OfferStatus })}
              required
            >
              {Object.values(OfferStatus).map((statusOption) => (
                <option key={statusOption} value={statusOption}>{statusOption}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Offer
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <p className="text-gray-600 dark:text-gray-300 mb-4">{offer.description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Category:</strong> {offer.category}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Price:</strong> ${offer.price?.toFixed(2)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Duration:</strong> {offer.duration}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Deliverables:</strong> {offer.deliverables}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Status:</strong> {offer.status}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Contact:</strong> {offer.contactEmail}</p>
          <div className="flex items-center mt-4">
            {offer.owner.companyLogoUrl && (
              <img src={offer.owner.companyLogoUrl} alt={`${offer.owner.companyName} Logo`} className="w-10 h-10 object-contain mr-3" />
            )}
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Innovator: {offer.owner.companyName || offer.owner.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{offer.owner.email}</p>
            </div>
          </div>
          {(isOwner || isAdmin) && (
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Edit Offer
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Delete Offer
              </button>
            </div>
          )}
          {session && (
            <button
              onClick={handleBookmarkToggle}
              className={`mt-4 flex items-center px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out ${isBookmarked ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              <Bookmark size={20} className="mr-2" />
              {isBookmarked ? 'Bookmarked' : 'Bookmark Offer'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
