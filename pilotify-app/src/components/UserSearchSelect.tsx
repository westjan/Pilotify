'use client';

import { useState, useEffect, useRef } from 'react';
import { UserCircle } from 'lucide-react';

interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  role: string;
  companyName?: string;
  profilePictureUrl?: string;
  companyLogoUrl?: string;
}

interface UserSearchSelectProps {
  label: string;
  roleFilter?: 'CORPORATE' | 'INNOVATOR';
  onSelect: (userId: string, userName: string) => void;
  selectedUserId: string | null;
  selectedUserName: string | null;
}

export default function UserSearchSelect({
  label,
  roleFilter,
  onSelect,
  selectedUserId,
  selectedUserName,
}: UserSearchSelectProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 0) {
        searchUsers();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('query', query);
      if (roleFilter) {
        params.append('role', roleFilter);
      }
      const url = `/api/users/search?${params.toString()}`;
      console.log('Searching users with URL:', url);
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log('Search results:', data);
        setResults(data);
        setShowDropdown(true);
      } else {
        console.error('Failed to fetch search results');
        setResults([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user: UserSearchResult) => {
    onSelect(user.id, user.name || user.email);
    setQuery(user.name || user.email);
    setShowDropdown(false);
  };

  return (
    <div className="relative mb-4" ref={dropdownRef}>
      <label htmlFor="user-search" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        type="text"
        id="user-search"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
        value={selectedUserName || query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSelect('', ''); // Clear selected user when typing
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder="Search by name or email..."
      />
      {loading && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">Loading...</div>}
      {showDropdown && query.length > 2 && results.length > 0 && (
        <div className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
          {results.map((user) => (
            <div
              key={user.id}
              className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              onClick={() => handleSelectUser(user)}
            >
              {user.profilePictureUrl ? (
                <img src={user.profilePictureUrl} alt={user.name || user.email} className="w-8 h-8 rounded-full object-cover mr-2" />
              ) : (
                <UserCircle className="w-8 h-8 text-gray-400 mr-2" />
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{user.name || user.email}</p>
                {user.companyName && <p className="text-sm text-gray-600 dark:text-gray-400">{user.companyName}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {showDropdown && query.length > 2 && results.length === 0 && !loading && (
        <div className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-md shadow-lg mt-1 p-2 text-gray-600 dark:text-gray-400">
          No users found.
        </div>
      )}
      {selectedUserId && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Selected: {selectedUserName}</p>
      )}
    </div>
  );
}
