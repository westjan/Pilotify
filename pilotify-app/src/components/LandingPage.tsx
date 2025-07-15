import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4">
      <h1 className="text-5xl font-extrabold mb-6 text-center leading-tight">
        Welcome to Pilotify
      </h1>
      <p className="text-xl mb-10 text-center max-w-2xl opacity-90">
        Streamline your pilot projects and foster innovation with seamless collaboration.
      </p>
      <div className="flex space-x-4">
        <Link href="/auth/signup" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition transform hover:scale-105">
          Create Account
        </Link>
        <Link href="/auth/signin" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition transform hover:scale-105">
          Login
        </Link>
      </div>
      <div className="mt-12 text-center opacity-80">
        <p className="text-lg">Discover a new way to manage pilots and innovations.</p>
        <p className="text-md mt-2">Join our growing community today!</p>
      </div>
    </div>
  );
}
