'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
          <Link
            href="/profile/edit"
            className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}