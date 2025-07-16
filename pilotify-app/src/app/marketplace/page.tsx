'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { OfferStatus, Role } from '@/generated/prisma';
import { Bookmark } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description?: string;
  category?: {
    id: string;
    name: string;
  };
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
  createdAt?: string;
}

interface Bookmark {
  id: string;
  offer: Offer;
  offerId: string;
  createdAt: string;
}

export default function MarketplacePage() {
  const { data: session, status } = useSession();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [filterStatus, setFilterStatus] = useState<OfferStatus | ''>(OfferStatus.AVAILABLE);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'createdAt' | 'price' | 'title'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchOffers = async () => {
      if (status === 'loading') return;
      if (!session) {
        setError('You must be logged in to view the marketplace.');
        setLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams();
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        if (filterCategoryId) {
          params.append('categoryId', filterCategoryId);
        }
        if (filterStatus) {
          params.append('status', filterStatus);
        }

        let fetchedOffers: Offer[] = [];

        if (showBookmarkedOnly) {
          const response = await fetch(`/api/bookmarks`);
          if (response.ok) {
            const data: Bookmark[] = await response.json();
            fetchedOffers = data.map(bookmark => ({ ...bookmark.offer, createdAt: bookmark.createdAt }));
          } else {
            const data = await response.json();
            setError(data.message || 'Failed to fetch bookmarked offers.');
          }
        } else {
          const response = await fetch(`/api/offers?${params.toString()}`);
          if (response.ok) {
            fetchedOffers = await response.json();
          } else {
            const data = await response.json();
            setError(data.message || 'Failed to fetch offers.');
          }
        }

        // Apply sorting
        const sortedOffers = [...fetchedOffers].sort((a, b) => {
          let aValue: any;
          let bValue: any;

          if (sortBy === 'price') {
            aValue = a.price || 0;
            bValue = b.price || 0;
          } else if (sortBy === 'title') {
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
          } else { // createdAt
            aValue = new Date(a.createdAt || 0).getTime();
            bValue = new Date(b.createdAt || 0).getTime();
          }

          if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });

        setOffers(sortedOffers);
      } catch (err) {
        console.error('Error fetching offers:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [session, status, searchTerm, filterCategoryId, filterStatus, showBookmarkedOnly, sortBy, sortOrder]);
        return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Marketplace</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search offers by title or description..."
          className="flex-1 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          value={filterCategoryId}
          onChange={(e) => setFilterCategoryId(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as OfferStatus)}
        >
          <option value="">All Statuses</option>
          {Object.values(OfferStatus).map((statusOption) => (
            <option key={statusOption} value={statusOption}>{statusOption}</option>
          ))}
        </select>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showBookmarkedOnly"
            checked={showBookmarkedOnly}
            onChange={(e) => setShowBookmarkedOnly(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <label htmlFor="showBookmarkedOnly" className="text-gray-700 dark:text-gray-300">Show Bookmarked Only</label>
        </div>
        <select
          className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'price' | 'title')}
        >
          <option value="createdAt">Sort by Date</option>
          <option value="price">Sort by Price</option>
          <option value="title">Sort by Title</option>
        </select>
        <select
          className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        {session?.user?.role === Role.INNOVATOR && (
          <Link href="/marketplace/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-block">
            Create New Offer
          </Link>
        )}
      </div>

      {offers.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No offers found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{offer.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{offer.description || 'No description provided.'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Category: {offer.category?.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Price: ${offer.price?.toFixed(2)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Duration: {offer.duration}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status: {offer.status}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Contact: {offer.contactEmail}</p>
              {offer.owner.companyLogoUrl && (
                <img src={offer.owner.companyLogoUrl} alt={`${offer.owner.companyName} Logo`} className="w-8 h-8 object-contain mr-2 inline-block" />
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">Innovator: {offer.owner.companyName || offer.owner.name}</p>
              <Link href={`/marketplace/${offer.id}`} className="mt-4 inline-block text-blue-500 hover:text-blue-700 font-medium">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}