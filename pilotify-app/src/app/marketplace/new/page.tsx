'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { OfferStatus, Role } from '@/generated/prisma';

export default function NewOfferPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);
  const [price, setPrice] = useState<number | ''>('');
  const [duration, setDuration] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!session || session.user?.role !== Role.INNOVATOR) {
      setError('You must be logged in as an Innovator to create an offer.');
      return;
    }

    if (!title || !description || price === '' || !duration || !deliverables || !contactEmail || !categoryId) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          categoryId,
          price: typeof price === 'number' ? price : undefined,
          duration,
          deliverables,
          contactEmail,
        }),
      });
      console.log('API Response:', response);

      if (response.ok) {
        console.log('Offer created successfully, response OK.');
        setSuccess('Offer created successfully!');
        setTitle('');
        setDescription('');
        setCategoryId('');
        setPrice('');
        setDuration('');
        setDeliverables('');
        setContactEmail('');
        router.push('/marketplace'); // Redirect to marketplace list
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create offer.');
      }
    } catch (err) {
      console.error('Error creating offer:', err);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Create New Marketplace Offer</h1>
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
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="categoryId" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Category:</label>
            <select
              id="categoryId"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Price (USD):</label>
            <input
              type="number"
              id="price"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={price === '' ? '' : price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="duration" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Duration (e.g., 3 months):</label>
            <input
              type="text"
              id="duration"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="deliverables" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Deliverables:</label>
            <textarea
              id="deliverables"
              rows={3}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="contactEmail" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Contact Email:</label>
            <input
              type="email"
              id="contactEmail"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
