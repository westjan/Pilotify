'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Role } from '@/generated/prisma';

interface Category {
  id: string;
  name: string;
}

export default function CategoryManagementPage() {
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role !== Role.ADMIN) {
      setError('You are not authorized to view this page.');
      setLoading(false);
      return;
    }

    fetchCategories();
  }, [session, status]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to fetch categories.');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (response.ok) {
        setNewCategoryName('');
        fetchCategories();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create category.');
      }
    } catch (err) {
      console.error('Error creating category:', err);
      setError('An unexpected error occurred.');
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!editingCategory) return;

    try {
      const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingCategory.name }),
      });
      if (response.ok) {
        setEditingCategory(null);
        fetchCategories();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update category.');
      }
    } catch (err) {
      console.error('Error updating category:', err);
      setError('An unexpected error occurred.');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also remove the category from any associated offers.')) return;
    setError('');
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchCategories();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete category.');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('An unexpected error occurred.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Category Management</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Create New Category</h2>
        <form onSubmit={handleCreateCategory} className="flex gap-4">
          <input
            type="text"
            placeholder="New Category Name"
            className="flex-1 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Category
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Existing Categories</h2>
        {categories.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No categories found.</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {editingCategory?.id === category.id ? (
                  <form onSubmit={handleUpdateCategory} className="flex-1 flex gap-2">
                    <input
                      type="text"
                      className="flex-1 p-1 border border-gray-300 rounded-md dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      required
                    />
                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm">Save</button>
                    <button type="button" onClick={() => setEditingCategory(null)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-sm">Cancel</button>
                  </form>
                ) : (
                  <span className="text-gray-900 dark:text-gray-100">{category.name}</span>
                )}
                <div className="flex gap-2">
                  {!editingCategory && (
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
