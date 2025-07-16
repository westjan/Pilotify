'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function LandingPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold mb-6 text-center">Welcome to Pilotify!</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Streamlining collaboration between corporate entities and innovative startups during the pilot phase of new projects.
      </p>
      <div className="flex space-x-4">
        {!session ? (
          <>
            <Link href="/auth/signin" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out">
              Login
            </Link>
            <Link href="/auth/signup" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out">
              Sign Up
            </Link>
          </>
        ) : (
          <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out">
            Go to Dashboard
          </Link>
        )}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-3xl font-semibold mb-4">Key Features:</h2>
        <ul className="list-disc list-inside text-lg space-y-2">
          <li>🧭 Pilot Structuring – Define and communicate pilot goals and expectations early.</li>
          <li>🔄 Ongoing Support – Enable smooth follow-ups and collaboration during the pilot.</li>
          <li>🛍️ Marketplace – Allow startups to publish and corporates to browse offers in a harmonized format.</li>
          <li>📊 Review & Outcome Evaluation – Capture, assess, and standardize learnings at the end of pilots.</li>
        </ul>
      </div>

      <div className="mt-12 text-center text-gray-500 dark:text-gray-400">
        <p>&copy; 2025 Pilotify. All rights reserved.</p>
      </div>
    </div>
  );
}
