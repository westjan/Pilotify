'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Role } from '@/generated/prisma';

export default function EditProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Populate form with existing data
    if (session.user) {
      setName(session.user.name || '');
      setCompanyName(session.user.companyName || '');
      setContactInfo(session.user.contactInfo || '');
      setProfilePictureUrl(session.user.profilePictureUrl || '');
      setCompanyLogoUrl(session.user.companyLogoUrl || '');
    }
    setLoading(false);
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!session?.user?.id) {
      setError('You must be logged in to update your profile.');
      return;
    }

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          companyName,
          contactInfo,
          profilePictureUrl,
          companyLogoUrl,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update the session with the new data
        await update({
          name: updatedUser.name,
          companyName: updatedUser.companyName,
          contactInfo: updatedUser.contactInfo,
          profilePictureUrl: updatedUser.profilePictureUrl,
          companyLogoUrl: updatedUser.companyLogoUrl,
        });
        setSuccess('Profile updated successfully!');
        router.push('/profile'); // Redirect back to profile view
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md overflow-y-auto max-h-[calc(100vh-4rem)]">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Edit Profile</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Name:</label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Company Name:</label>
            <input
              type="text"
              id="companyName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contactInfo" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Contact Info:</label>
            <input
              type="text"
              id="contactInfo"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="profilePictureUrl" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Profile Picture URL:</label>
            <input
              type="text"
              id="profilePictureUrl"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={profilePictureUrl}
              onChange={(e) => setProfilePictureUrl(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="companyLogoUrl" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Company Logo URL:</label>
            <input
              type="text"
              id="companyLogoUrl"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={companyLogoUrl}
              onChange={(e) => setCompanyLogoUrl(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
