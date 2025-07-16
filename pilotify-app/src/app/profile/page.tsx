'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  companyName?: string;
  contactInfo?: string;
  profilePictureUrl?: string;
  companyLogoUrl?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (status === 'loading') return;
      if (!session?.user?.id) {
        setError('You must be logged in to view your profile.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users/${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
          setFormData(data);
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to fetch user profile.');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [session, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`/api/users/${session?.user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserProfile(updatedUser);
        setIsEditing(false);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('An unexpected error occurred.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!userProfile) {
    return <div className="text-center py-8 text-gray-500">Profile not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Your Profile</h1>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={formData.name || ''}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={formData.email || ''}
                disabled // Email usually not editable directly
              />
            </div>
            <div className="mb-4">
              <label htmlFor="companyName" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Company Name:</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={formData.companyName || ''}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="contactInfo" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Contact Info:</label>
              <textarea
                id="contactInfo"
                name="contactInfo"
                rows={3}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={formData.contactInfo || ''}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="profilePictureUrl" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Profile Picture URL:</label>
              <input
                type="text"
                id="profilePictureUrl"
                name="profilePictureUrl"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={formData.profilePictureUrl || ''}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="companyLogoUrl" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Company Logo URL:</label>
              <input
                type="text"
                id="companyLogoUrl"
                name="companyLogoUrl"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={formData.companyLogoUrl || ''}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(userProfile); // Reset form data if cancelled
                }}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex items-center mb-4">
              {userProfile.profilePictureUrl && (
                <img src={userProfile.profilePictureUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover mr-4" />
              )}
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userProfile.name}</p>
                <p className="text-gray-600 dark:text-gray-400">{userProfile.email}</p>
                {userProfile.companyName && <p className="text-gray-600 dark:text-gray-400">{userProfile.companyName}</p>}
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Role:</strong> {session?.user?.role}</p>
            {userProfile.contactInfo && <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Contact Info:</strong> {userProfile.contactInfo}</p>}
            {userProfile.companyLogoUrl && (
              <div className="mb-2">
                <strong>Company Logo:</strong>
                <img src={userProfile.companyLogoUrl} alt="Company Logo" className="w-24 h-auto object-contain mt-2" />
              </div>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}