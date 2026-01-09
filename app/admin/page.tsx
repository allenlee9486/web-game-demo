'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, FileText, Gamepad2, LogOut } from 'lucide-react';

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'games' | 'blog'>('games');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // New Item Form State
  const [isCreating, setIsCreating] = useState(false);
  const [newItemFilename, setNewItemFilename] = useState('');
  const [newItemTitle, setNewItemTitle] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchItems(activeTab, storedToken);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchItems(activeTab, token);
    }
  }, [activeTab, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side check isn't secure, but the API is protected.
    // We just store the password as the token for simplicity in this demo.
    const tempToken = `Bearer ${password}`;
    setToken(tempToken);
    setIsAuthenticated(true);
    localStorage.setItem('admin_token', tempToken);
    fetchItems(activeTab, tempToken);
  };

  const handleLogout = () => {
    setToken('');
    setIsAuthenticated(false);
    localStorage.removeItem('admin_token');
    setPassword('');
  };

  const fetchItems = async (type: 'games' | 'blog', authToken: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${type}`, {
        headers: { Authorization: authToken },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      } else {
        if (res.status === 401) handleLogout();
      }
    } catch (error) {
      console.error('Failed to fetch items', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) return;

    try {
      const res = await fetch(`/api/admin/${activeTab}?filename=${filename}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });
      if (res.ok) {
        fetchItems(activeTab, token);
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      alert('Error deleting item');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const content = activeTab === 'games' 
        ? '---\ntitle: ' + newItemTitle + '\ndescription: New game description\ndate: 2024-01-01\nimage: /images/placeholder.jpg\n---\n\nNew game content.'
        : '---\ntitle: ' + newItemTitle + '\nexcerpt: New blog post excerpt\ndate: 2024-01-01\ncoverImage: /images/blog/placeholder.jpg\nauthor: Admin\n---\n\nNew blog post content.';

      const res = await fetch(`/api/admin/${activeTab}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: token 
        },
        body: JSON.stringify({
          filename: newItemFilename,
          title: newItemTitle,
          content: content
        }),
      });

      if (res.ok) {
        setIsCreating(false);
        setNewItemFilename('');
        setNewItemTitle('');
        fetchItems(activeTab, token);
      } else {
        alert('Failed to create item');
      }
    } catch (error) {
      alert('Error creating item');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-4 rounded-xl border bg-white p-8 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter admin password (default: admin123)"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 font-bold text-white hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('games')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
              activeTab === 'games' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200'
            }`}
          >
            <Gamepad2 className="h-4 w-4" />
            Games
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
              activeTab === 'blog' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            Blog
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold capitalize">{activeTab} List</h2>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            Add New
          </button>
        </div>

        {isCreating && (
          <form onSubmit={handleCreate} className="mb-8 rounded-lg border border-green-200 bg-green-50 p-4 dark:bg-green-900/20 dark:border-green-800">
            <h3 className="mb-4 font-bold">Create New {activeTab === 'games' ? 'Game' : 'Post'}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Filename (e.g., new-game.md)</label>
                <input
                  type="text"
                  value={newItemFilename}
                  onChange={(e) => setNewItemFilename(e.target.value)}
                  className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
              >
                Create
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.filename}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.filename}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(item.filename)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500">No items found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
