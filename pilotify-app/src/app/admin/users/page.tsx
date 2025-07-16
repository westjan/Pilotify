'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Role } from '@/generated/prisma';
import { User } from '@/generated/prisma'; // Assuming User type is available from Prisma

export default function UserManagementPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: '' as Role, // Initialize with an empty string or a default valid role
    companyName: '',
    contactInfo: '',
    profilePictureUrl: '',
    companyLogoUrl: '',
  });

  const [editUser, setEditUser] = useState({
    id: '',
    email: '',
    name: '',
    role: '' as Role, // Initialize with an empty string or a default valid role
    companyName: '',
    contactInfo: '',
    profilePictureUrl: '',
    companyLogoUrl: '',
  });

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role !== Role.ADMIN) {
      setError('You are not authorized to view this page.');
      setLoading(false);
      return;
    }

    fetchUsers();
  }, [session, status]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to fetch users.');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        setNewUser({
          email: '',
          password: '',
          name: '',
          role: Role.INNOVATOR,
          companyName: '',
          contactInfo: '',
          profilePictureUrl: '',
          companyLogoUrl: '',
        });
        setShowCreateModal(false);
        fetchUsers(); // Refresh list
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create user.');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError('An unexpected error occurred.');
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/users/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUser),
      });
      if (response.ok) {
        setShowEditModal(false);
        setSelectedUser(null);
        fetchUsers(); // Refresh list
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update user.');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError('An unexpected error occurred.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });
      if (response.ok) {
        fetchUsers(); // Refresh list
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete user.');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('An unexpected error occurred.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">User Management</h1>
      <button
        onClick={() => setShowCreateModal(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
      >
        Create New User
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left text-gray-600 dark:text-gray-300 font-semibold">Name</th>
              <th className="py-3 px-4 text-left text-gray-600 dark:text-gray-300 font-semibold">Email</th>
              <th className="py-3 px-4 text-left text-gray-600 dark:text-gray-300 font-semibold">Role</th>
              <th className="py-3 px-4 text-left text-gray-600 dark:text-gray-300 font-semibold">Company</th>
              <th className="py-3 px-4 text-left text-gray-600 dark:text-gray-300 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.role}</td>
                <td className="py-3 px-4">{user.companyName}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setEditUser({ ...user, name: user.name || '', companyName: user.companyName || '', contactInfo: user.contactInfo || '', profilePictureUrl: user.profilePictureUrl || '', companyLogoUrl: user.companyLogoUrl || '' });
                      setShowEditModal(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Create New User</h2>
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email:</label>
                <input
                  type="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Password:</label>
                <input
                  type="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Name:</label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Role:</label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
                  required
                >
                  {Object.values(Role).map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Company Name:</label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={newUser.companyName || ''}
                  onChange={(e) => setNewUser({ ...newUser, companyName: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Contact Info:</label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={newUser.contactInfo || ''}
                  onChange={(e) => setNewUser({ ...newUser, contactInfo: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Profile Picture URL:</label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={newUser.profilePictureUrl || ''}
                  onChange={(e) => setNewUser({ ...newUser, profilePictureUrl: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Company Logo URL:</label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={newUser.companyLogoUrl || ''}
                  onChange={(e) => setNewUser({ ...newUser, companyLogoUrl: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Edit User</h2>
            <form onSubmit={handleEditUser}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email:</label>
                <input
                  type="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Name:</label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={editUser.name || ''}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Role:</label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value as Role })}
                  required
                >
                  {Object.values(Role).map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Company Name:</label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={editUser.companyName || ''}
                  onChange={(e) => setEditUser({ ...editUser, companyName: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Contact Info:</label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={editUser.contactInfo || ''}
                  onChange={(e) => setEditUser({ ...editUser, contactInfo: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Profile Picture URL:</label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={editUser.profilePictureUrl || ''}
                  onChange={(e) => setEditUser({ ...editUser, profilePictureUrl: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Company Logo URL:</label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={editUser.companyLogoUrl || ''}
                  onChange={(e) => setEditUser({ ...editUser, companyLogoUrl: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update User
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
