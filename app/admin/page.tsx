'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trash2, Plus, FileText, Gamepad2, LogOut, Edit, Upload, X, Home, Tag, ChevronUp, ChevronDown, Video, Settings, ArrowUp, ArrowDown } from 'lucide-react';
import { GameModule } from '@/types';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

interface ContentItem {
  filename: string;
  title: string;
  [key: string]: unknown;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

const GAME_TEMPLATE = `[Enter game description here]`;

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'games' | 'blog' | 'categories' | 'settings'>('games');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Settings
  const [featuredGameSlug, setFeaturedGameSlug] = useState('');
  const [logo, setLogo] = useState('');
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [settingsLoading, setSettingsLoading] = useState(false);
  
  // Pages Tab State
  const [pages] = useState<string[]>(['privacy.md', 'terms.md', 'about.md', 'contact.md', 'copyright.md']);
  const [selectedPage, setSelectedPage] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [pageLoading, setPageLoading] = useState(false);

  // Category Form State
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');

  // New Item Form State
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newItemFilename, setNewItemFilename] = useState('');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemContent, setNewItemContent] = useState('');
  
  // Additional Fields
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemGameUrl, setNewItemGameUrl] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Action');
  const [newItemFeatured, setNewItemFeatured] = useState(false);
  const [newItemImage, setNewItemImage] = useState('/images/placeholder.jpg');
  
  // New Game Fields
  const [newItemModules, setNewItemModules] = useState<GameModule[]>([]);
  // Legacy fields state (kept for temporary holding but not used for new saves)
  const [newItemHowToPlay, setNewItemHowToPlay] = useState('');
  const [newItemTips, setNewItemTips] = useState('');
  const [newItemWhyPlay, setNewItemWhyPlay] = useState('');
  const [newItemFaq, setNewItemFaq] = useState<{question: string, answer: string}[]>([]);

  const [newItemExcerpt, setNewItemExcerpt] = useState('');
  const [newItemCoverImage, setNewItemCoverImage] = useState('/images/blog/placeholder.jpg');
  const [newItemAuthor, setNewItemAuthor] = useState('Admin');
  
  const [newItemDate, setNewItemDate] = useState('');

  const handleLogout = useCallback(() => {
    setToken('');
    setIsAuthenticated(false);
    localStorage.removeItem('admin_token');
    setPassword('');
  }, []);

  const fetchSettings = useCallback(async (authToken: string) => {
    try {
      const res = await fetch('/api/admin/settings', {
        headers: { Authorization: authToken },
      });
      if (res.ok) {
        const data = await res.json();
        setFeaturedGameSlug(data.featuredGameSlug || '');
        setLogo(data.logo || '');
        setNavItems(data.navItems || []);
      }
    } catch {
      console.error('Failed to fetch settings');
    }
  }, []);

  const fetchItems = useCallback(async (type: 'games' | 'blog' | 'categories' | 'settings', authToken: string) => {
    if (type === 'settings') return; // Settings fetched separately
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${type}`, {
        headers: { Authorization: authToken },
      });
      if (res.ok) {
        const data = await res.json();
        if (type === 'categories') {
            setCategories(data);
        } else {
            setItems(data);
        }
      } else {
        if (res.status === 401) handleLogout();
      }
    } catch {
      console.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && token) {
      if (activeTab === 'categories') {
          fetchItems('categories', token);
      } else if (activeTab === 'settings') {
          fetchSettings(token);
      } else {
          fetchItems(activeTab, token);
          // Also fetch categories for the dropdown if not already fetched or just to be safe
          fetchItems('categories', token); 
      }
      fetchSettings(token); // Always fetch settings for featured game slug etc
    }
  }, [activeTab, isAuthenticated, token, fetchItems, fetchSettings]);

  const handleSaveSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: token 
        },
        body: JSON.stringify({ 
            featuredGameSlug,
            logo,
            navItems
        }),
      });

      if (res.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch {
      alert('Error saving settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleFetchPage = async (filename: string) => {
      setPageLoading(true);
      setSelectedPage(filename);
      try {
          const res = await fetch(`/api/admin/pages?filename=${filename}`, {
              headers: { Authorization: token },
          });
          if (res.ok) {
              const data = await res.json();
              setPageContent(data.content || '');
          }
      } catch {
          console.error('Failed to fetch page');
      } finally {
          setPageLoading(false);
      }
  };

  const handleSavePage = async () => {
      setPageLoading(true);
      try {
          const res = await fetch('/api/admin/pages', {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  Authorization: token 
              },
              body: JSON.stringify({ filename: selectedPage, content: pageContent }),
          });
          if (res.ok) {
              alert('Page saved successfully!');
          } else {
              alert('Failed to save page');
          }
      } catch {
          alert('Error saving page');
      } finally {
          setPageLoading(false);
      }
  };

  const handleAddNavItem = () => {
      setNavItems([...navItems, { id: Date.now().toString(), label: 'New Link', href: '/' }]);
  };

  const handleRemoveNavItem = (index: number) => {
      const newItems = [...navItems];
      newItems.splice(index, 1);
      setNavItems(newItems);
  };

  const handleUpdateNavItem = (index: number, field: 'label' | 'href', value: string) => {
      const newItems = [...navItems];
      newItems[index] = { ...newItems[index], [field]: value };
      setNavItems(newItems);
  };
  
  const handleMoveNavItem = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === navItems.length - 1)) return;
    const newItems = [...navItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setNavItems(newItems);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const method = isEditingCategory ? 'PUT' : 'POST';
        const body = isEditingCategory 
            ? { id: editingCategoryId, name: newCategoryName, slug: newCategorySlug }
            : { name: newCategoryName, slug: newCategorySlug };

        const res = await fetch('/api/admin/categories', {
            method,
            headers: { 
                'Content-Type': 'application/json',
                Authorization: token 
            },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            alert(isEditingCategory ? 'Category updated successfully!' : 'Category created successfully!');
            resetCategoryForm();
            fetchItems('categories', token);
        } else {
            const errorData = await res.json();
            alert(`Failed to save category: ${errorData.error || 'Unknown error'}`);
        }
    } catch {
        alert('Error saving category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
      if (!confirm('Are you sure you want to delete this category?')) return;
      try {
          const res = await fetch(`/api/admin/categories?id=${id}`, {
              method: 'DELETE',
              headers: { Authorization: token },
          });
          if (res.ok) {
              fetchItems('categories', token);
          } else {
              alert('Failed to delete category');
          }
      } catch {
          alert('Error deleting category');
      }
  };

  const resetCategoryForm = () => {
      setNewCategoryName('');
      setNewCategorySlug('');
      setEditingCategoryId('');
      setIsCreatingCategory(false);
      setIsEditingCategory(false);
  };
  
  const startEditCategory = (category: CategoryItem) => {
      setNewCategoryName(category.name);
      setNewCategorySlug(category.slug);
      setEditingCategoryId(category.id);
      setIsEditingCategory(true);
      setIsCreatingCategory(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const tempToken = `Bearer ${password}`;
    setToken(tempToken);
    setIsAuthenticated(true);
    localStorage.setItem('admin_token', tempToken);
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
    } catch {
      alert('Error deleting item');
    }
  };

  const handleSetHomeGame = async (slug: string) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: token 
        },
        body: JSON.stringify({ featuredGameSlug: slug }),
      });

      if (res.ok) {
        setFeaturedGameSlug(slug);
        alert('Home page game updated successfully!');
      } else {
        alert('Failed to update home page game');
      }
    } catch {
      alert('Error updating home page game');
    }
  };

  const handlePaste = async (e: React.ClipboardEvent, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (!file) continue;

        const formData = new FormData();
        formData.append('file', file);

        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            const imageUrl = data.url;
            
            if (!imageUrl) {
              alert('Upload successful but no URL returned');
              return;
            }
            
            setter(prev => prev + `\n![Image](${imageUrl})\n`);
          } else {
            alert('Failed to upload pasted image');
          }
        } catch (err) {
          console.error(err);
          alert('Error uploading pasted image');
        }
      }
    }
  };

  const handleEdit = async (filename: string) => {
    try {
      const res = await fetch(`/api/admin/${activeTab}?filename=${filename}`, {
        headers: { Authorization: token },
      });
      if (res.ok) {
        const item = await res.json();
        setNewItemFilename(item.filename);
        setNewItemTitle(item.title);
        setNewItemContent(item.content || '');
        
        // Handle Date
        if (item.date) {
            const dateObj = new Date(item.date);
            if (!isNaN(dateObj.getTime())) {
                setNewItemDate(dateObj.toISOString().split('T')[0]);
            } else {
                setNewItemDate('');
            }
        } else {
            setNewItemDate('');
        }

        if (activeTab === 'games') {
          setNewItemDescription(item.description || '');
          setNewItemGameUrl(item.gameUrl || '');
          setNewItemFeatured(item.featured === true);
          setNewItemCategory(item.category || 'Action');
          setNewItemImage(item.image || '/images/placeholder.jpg');
          
          // Migrate legacy fields to modules if modules don't exist
          const existingModules = (item.modules as GameModule[]) || [];
          if (existingModules.length > 0) {
            setNewItemModules(existingModules);
          } else {
             const constructedModules: GameModule[] = [];
             if (item.howToPlay) constructedModules.push({ id: 'how-to-play', type: 'markdown', title: 'How to Play', content: item.howToPlay as string });
             if (item.tips) constructedModules.push({ id: 'tips', type: 'markdown', title: 'Tips & Tricks', content: item.tips as string });
             if (item.whyPlay) constructedModules.push({ id: 'why-play', type: 'markdown', title: 'Why Play Here?', content: item.whyPlay as string });
             if (item.faq && Array.isArray(item.faq)) constructedModules.push({ id: 'faq', type: 'faq', title: 'FAQ', items: item.faq as any[] });
             setNewItemModules(constructedModules);
          }

          setNewItemHowToPlay(item.howToPlay || '');
          setNewItemTips(item.tips || '');
          setNewItemWhyPlay(item.whyPlay || '');
          setNewItemFaq(item.faq || []);
        } else {
          setNewItemExcerpt(item.excerpt || '');
          setNewItemCoverImage(item.coverImage || '/images/blog/placeholder.jpg');
          setNewItemAuthor(item.author || 'Admin');
        }
        
        setIsEditing(true);
        setIsCreating(true);
      } else {
        alert('Failed to fetch item details');
      }
    } catch {
      alert('Error fetching item details');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'content' | 'cover' | 'game' | 'howToPlay' | 'tips' | 'whyPlay') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const imageUrl = data.url;
        
        if (!imageUrl) {
          alert('Upload successful but no URL returned');
          return;
        }

        if (target === 'content') {
            setNewItemContent(prev => prev + `\n![Image](${imageUrl})\n`);
        } else if (target === 'cover') {
            setNewItemCoverImage(imageUrl);
        } else if (target === 'game') {
            setNewItemImage(imageUrl);
        } else if (target === 'howToPlay') {
            setNewItemHowToPlay(prev => prev + `\n![Image](${imageUrl})\n`);
        } else if (target === 'tips') {
            setNewItemTips(prev => prev + `\n![Image](${imageUrl})\n`);
        } else if (target === 'whyPlay') {
            setNewItemWhyPlay(prev => prev + `\n![Image](${imageUrl})\n`);
        }
      } else {
        alert('Failed to upload image');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    }
  };

  const handleAddFaq = () => {
    setNewItemFaq([...newItemFaq, { question: '', answer: '' }]);
  };

  // Module Management Helpers
  const handleAddModule = (type: 'markdown' | 'faq' | 'video') => {
    const id = `${type}-${Date.now()}`;
    let newModule: GameModule;
    
    if (type === 'markdown') {
      newModule = { id, type, title: 'New Section', content: '' };
    } else if (type === 'faq') {
      newModule = { id, type, title: 'FAQ', items: [] };
    } else {
      newModule = { id, type, title: 'Game Video', videoUrl: '' };
    }
    
    setNewItemModules([...newItemModules, newModule]);
  };

  const handleRemoveModule = (index: number) => {
    if (!confirm('Remove this module?')) return;
    const newModules = [...newItemModules];
    newModules.splice(index, 1);
    setNewItemModules(newModules);
  };

  const handleMoveModule = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === newItemModules.length - 1)) return;
    const newModules = [...newItemModules];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
    setNewItemModules(newModules);
  };

  const handleUpdateModule = (index: number, updates: Partial<GameModule>) => {
    const newModules = [...newItemModules];
    newModules[index] = { ...newModules[index], ...updates };
    setNewItemModules(newModules);
  };

  const handleModuleFaqChange = (moduleIndex: number, itemIndex: number, field: 'question' | 'answer', value: string) => {
    const newModules = [...newItemModules];
    const module = newModules[moduleIndex];
    if (module.type === 'faq' && module.items) {
       const newItems = [...module.items];
       newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
       module.items = newItems;
       setNewItemModules(newModules);
    }
  };

  const handleAddModuleFaqItem = (moduleIndex: number) => {
    const newModules = [...newItemModules];
    const module = newModules[moduleIndex];
    if (module.type === 'faq') {
        module.items = [...(module.items || []), { question: '', answer: '' }];
        setNewItemModules(newModules);
    }
  };

  const handleRemoveModuleFaqItem = (moduleIndex: number, itemIndex: number) => {
    const newModules = [...newItemModules];
    const module = newModules[moduleIndex];
    if (module.type === 'faq' && module.items) {
        const newItems = [...module.items];
        newItems.splice(itemIndex, 1);
        module.items = newItems;
        setNewItemModules(newModules);
    }
  };

  const handleRemoveFaq = (index: number) => {
    const newFaq = [...newItemFaq];
    newFaq.splice(index, 1);
    setNewItemFaq(newFaq);
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaq = [...newItemFaq];
    newFaq[index][field] = value;
    setNewItemFaq(newFaq);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const today = new Date().toISOString().split('T')[0];
      const dateToUse = newItemDate || today;
      
      const payload: any = {
          filename: newItemFilename,
          title: newItemTitle,
          date: dateToUse,
          content: newItemContent,
      };

      if (activeTab === 'games') {
          payload.description = newItemDescription;
          payload.image = newItemImage;
          payload.gameUrl = newItemGameUrl;
          payload.category = newItemCategory;
          payload.featured = newItemFeatured;
          
          if (newItemModules.length > 0) {
              // Ensure we strip internal UI state if any, though GameModule is clean enough
              // But we might want to ensure empty content is handled nicely?
              // Standard JSON stringify is fine.
              payload.modules = newItemModules;
          }
      } else {
          payload.excerpt = newItemExcerpt;
          payload.coverImage = newItemCoverImage;
          payload.author = newItemAuthor;
      }

      const res = await fetch(`/api/admin/${activeTab}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: token 
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(isEditing ? 'Item updated successfully!' : 'Item created successfully!');
        setIsCreating(false);
        setIsEditing(false);
        resetForm();
        fetchItems(activeTab, token);
      } else {
        const errorData = await res.json();
        alert(`Failed to save item: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving item');
    }
  };

  const resetForm = () => {
    setNewItemFilename('');
    setNewItemTitle('');
    setNewItemContent('');
    setNewItemDescription('');
    setNewItemGameUrl('');
    setNewItemCategory('Action');
    setNewItemFeatured(false);
    setNewItemImage('/images/placeholder.jpg');
    setNewItemExcerpt('');
    setNewItemCoverImage('/images/blog/placeholder.jpg');
    setNewItemAuthor('Admin');
    setNewItemDate('');
    setNewItemModules([]);
    setNewItemHowToPlay('');
    setNewItemTips('');
    setNewItemWhyPlay('');
    setNewItemFaq([]);
  };

  const renderItem = (item: ContentItem) => (
    <div key={item.filename} className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        {activeTab === 'games' && item.image ? (
           <img src={item.image as string} alt="" className="w-16 h-12 object-cover rounded" />
        ) : activeTab === 'blog' && item.coverImage ? (
           <img src={item.coverImage as string} alt="" className="w-16 h-12 object-cover rounded" />
        ) : (
           <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">No Img</span>
           </div>
        )}
        
        <div>
          <h3 className="font-bold text-gray-900">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.filename}</p>
          <div className="flex gap-2 text-xs text-gray-400 mt-1">
              {activeTab === 'games' && <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{item.category as string}</span>}
              <span>{item.date as string}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {activeTab === 'games' && (
          <button
            onClick={() => handleSetHomeGame(item.filename.replace('.md', ''))}
            className={`p-2 rounded transition-colors ${
              (featuredGameSlug === item.filename.replace('.md', '') || featuredGameSlug === item.filename) 
                ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' 
                : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100'
            }`}
            title="Set as Home Page Game"
          >
            <Home className={`h-5 w-5 ${(featuredGameSlug === item.filename.replace('.md', '') || featuredGameSlug === item.filename) ? 'fill-current' : ''}`} />
          </button>
        )}
        <button onClick={() => handleEdit(item.filename)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
          <Edit className="h-5 w-5" />
        </button>
        <button onClick={() => handleDelete(item.filename)} className="p-2 text-red-600 hover:bg-red-50 rounded">
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="mb-4 w-full rounded border p-2 text-gray-900 bg-white"
          />
          <button type="submit" className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setActiveTab('games')}
            className={`flex items-center gap-2 rounded px-4 py-2 ${activeTab === 'games' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            <Gamepad2 className="h-4 w-4" /> Games
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 rounded px-4 py-2 ${activeTab === 'blog' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            <FileText className="h-4 w-4" /> Blog
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 rounded px-4 py-2 ${activeTab === 'categories' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            <Tag className="h-4 w-4" /> Categories
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 rounded px-4 py-2 ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            <Settings className="h-4 w-4" /> Settings
          </button>
        </div>

        {activeTab === 'settings' ? (
            <div className="space-y-8">
                {/* General Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings className="w-5 h-5"/> General Settings</h2>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website Logo URL</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={logo} 
                                onChange={(e) => setLogo(e.target.value)}
                                className="flex-1 rounded border p-2 text-black bg-white border-gray-300"
                                placeholder="/images/logo.png"
                            />
                             <label className="cursor-pointer rounded bg-blue-100 p-2 text-blue-600 hover:bg-blue-200">
                                <Upload className="h-5 w-5" />
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if(!file) return;
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    fetch('/api/upload', { method: 'POST', body: formData })
                                        .then(res => res.json())
                                        .then(data => { if(data.url) setLogo(data.url); });
                                }} />
                            </label>
                        </div>
                        {logo && <div className="mt-2 p-2 bg-gray-100 rounded inline-block"><img src={logo} alt="Logo Preview" className="h-8 object-contain" /></div>}
                    </div>

                    <button 
                        onClick={handleSaveSettings} 
                        disabled={settingsLoading}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {settingsLoading ? 'Saving...' : 'Save General Settings'}
                    </button>
                </div>

                {/* Navigation Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Tag className="w-5 h-5"/> Navigation Bar</h2>
                    
                    <div className="space-y-2 mb-4">
                        {navItems.map((item, index) => (
                            <div key={item.id || index} className="flex items-center gap-2 bg-gray-50 p-3 rounded border border-gray-200">
                                <button onClick={() => handleMoveNavItem(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowUp size={16}/></button>
                                <button onClick={() => handleMoveNavItem(index, 'down')} disabled={index === navItems.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowDown size={16}/></button>
                                
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                    <input 
                                        type="text" 
                                        value={item.label} 
                                        onChange={(e) => handleUpdateNavItem(index, 'label', e.target.value)}
                                        className="rounded border p-1 px-2 text-sm text-black bg-white border-gray-300"
                                        placeholder="Label"
                                    />
                                    <input 
                                        type="text" 
                                        value={item.href} 
                                        onChange={(e) => handleUpdateNavItem(index, 'href', e.target.value)}
                                        className="rounded border p-1 px-2 text-sm text-black bg-white border-gray-300"
                                        placeholder="URL (e.g. /games)"
                                    />
                                </div>
                                
                                <button onClick={() => handleRemoveNavItem(index)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button onClick={handleAddNavItem} className="flex items-center gap-1 rounded bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200">
                            <Plus size={16} /> Add Item
                        </button>
                        <button 
                            onClick={handleSaveSettings} 
                            disabled={settingsLoading}
                            className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {settingsLoading ? 'Saving...' : 'Save Navigation'}
                        </button>
                    </div>
                </div>

                {/* Legal Pages Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5"/> Legal Pages</h2>
                    
                    <div className="flex gap-4 mb-4">
                        <div className="w-1/4 space-y-1">
                            {pages.map(page => (
                                <button
                                    key={page}
                                    onClick={() => handleFetchPage(page)}
                                    className={`w-full text-left px-3 py-2 rounded text-sm ${selectedPage === page ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {page.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1">
                            {selectedPage ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-gray-800">{selectedPage}</h3>
                                        <button 
                                            onClick={handleSavePage} 
                                            disabled={pageLoading}
                                            className="rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {pageLoading ? 'Saving...' : 'Save Content'}
                                        </button>
                                    </div>
                                    <textarea
                                        value={pageContent}
                                        onChange={(e) => setPageContent(e.target.value)}
                                        className="w-full h-96 rounded border p-4 font-mono text-sm text-black bg-white border-gray-300"
                                        placeholder="Markdown content..."
                                    />
                                </div>
                            ) : (
                                <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                    Select a page to edit
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ) : activeTab === 'categories' ? (
            <div className="space-y-6">
                {/* Category Form */}
                <div className="rounded-lg bg-white p-6 shadow-md">
                    <h2 className="text-xl font-bold mb-4">{isEditingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                    <form onSubmit={handleSaveCategory} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Category Name</label>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => {
                                    setNewCategoryName(e.target.value);
                                    if (!isEditingCategory) {
                                        setNewCategorySlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                                    }
                                }}
                                placeholder="e.g. Tower Defense"
                                className="mt-1 w-full rounded border p-2 text-black bg-white border-gray-300"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Slug (ID)</label>
                            <input
                                type="text"
                                value={newCategorySlug}
                                onChange={(e) => setNewCategorySlug(e.target.value)}
                                placeholder="e.g. tower-defense"
                                className="mt-1 w-full rounded border p-2 text-black bg-white border-gray-300"
                                required
                                disabled={isEditingCategory} 
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                {isEditingCategory ? 'Update' : 'Add'}
                            </button>
                            {isEditingCategory && (
                                <button type="button" onClick={resetCategoryForm} className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Category List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No categories found.</div>
                    ) : (
                        categories.map((category) => (
                            <div key={category.id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
                                <div>
                                    <h3 className="font-bold text-gray-900">{category.name}</h3>
                                    <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => startEditCategory(category)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => handleDeleteCategory(category.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        ) : isCreating ? (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">{isEditing ? 'Edit Item' : 'Create New Item'}</h2>
              <button onClick={() => { setIsCreating(false); setIsEditing(false); resetForm(); }} className="text-gray-500 hover:text-gray-700">Cancel</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black">Filename (English slug)</label>
                  <input
                    type="text"
                    value={newItemFilename}
                    onChange={(e) => setNewItemFilename(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-\.]/g, ''))}
                    placeholder="e.g. new-game-guide"
                    className="mt-1 w-full rounded border border-gray-300 p-2 text-black bg-white"
                    disabled={isEditing}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    className="mt-1 w-full rounded border p-2 text-black bg-white border-gray-300"
                    required
                  />
                </div>
              </div>
              
              <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={newItemDate}
                    onChange={(e) => setNewItemDate(e.target.value)}
                    className="mt-1 w-full rounded border p-2 text-black bg-white border-gray-300"
                  />
              </div>

              {activeTab === 'games' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={newItemDescription}
                        onChange={(e) => setNewItemDescription(e.target.value)}
                        className="mt-1 w-full rounded border p-2 text-black bg-white border-gray-300"
                        rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Game URL (iframe source)</label>
                        <input
                            type="text"
                            value={newItemGameUrl}
                            onChange={(e) => setNewItemGameUrl(e.target.value)}
                            className="mt-1 w-full rounded border p-2 text-black bg-white border-gray-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            value={newItemCategory}
                            onChange={(e) => setNewItemCategory(e.target.value)}
                            className="mt-1 w-full rounded border p-2 text-black bg-white border-gray-300"
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Game Image URL</label>
                      <div className="flex gap-2">
                        <input
                            type="text"
                            value={newItemImage}
                            onChange={(e) => setNewItemImage(e.target.value)}
                            className="mt-1 w-full rounded border p-2 text-black bg-white border-gray-300"
                        />
                        <label className="cursor-pointer rounded bg-blue-100 p-2 text-blue-600 hover:bg-blue-200">
                            <Upload className="h-5 w-5" />
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'game')} />
                        </label>
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newItemFeatured}
                        onChange={(e) => setNewItemFeatured(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <label className="text-sm font-bold text-black">Featured Game</label>
                  </div>
                </>
              )}

              {activeTab === 'blog' && (
                <>
                   <div>
                    <label className="block text-sm font-medium text-gray-700">Excerpt</label>
                    <textarea
                        value={newItemExcerpt}
                        onChange={(e) => setNewItemExcerpt(e.target.value)}
                        className="mt-1 w-full rounded border p-2 text-black bg-white border-gray-300"
                        rows={2}
                    />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
                      <div className="flex gap-2">
                        <input
                            type="text"
                            value={newItemCoverImage}
                            onChange={(e) => setNewItemCoverImage(e.target.value)}
                            className="mt-1 w-full rounded border p-2 text-black bg-white border-gray-300"
                        />
                        <label className="cursor-pointer rounded bg-blue-100 p-2 text-blue-600 hover:bg-blue-200">
                            <Upload className="h-5 w-5" />
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
                        </label>
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Author</label>
                      <input
                        type="text"
                        value={newItemAuthor}
                        onChange={(e) => setNewItemAuthor(e.target.value)}
                        className="mt-1 w-full rounded border p-2 text-black bg-white border-gray-300"
                      />
                  </div>
                </>
              )}

              {activeTab === 'games' && (
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-800">Game Modules</h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddModule('markdown')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        <Plus size={16} /> Section
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddModule('faq')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-md text-sm font-medium hover:bg-purple-100 transition-colors"
                      >
                        <Plus size={16} /> FAQ
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddModule('video')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        <Plus size={16} /> Video
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {newItemModules.map((module, index) => (
                      <div key={module.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 relative group">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                           <div className="flex gap-3 items-center flex-1 mr-4">
                              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${module.type === 'faq' ? 'bg-purple-100 text-purple-700' : module.type === 'video' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                {module.type}
                              </span>
                              <input 
                                 type="text" 
                                 value={module.title}
                                 onChange={(e) => handleUpdateModule(index, { title: e.target.value })}
                                 className="font-bold text-lg bg-transparent border-none focus:ring-0 p-0 text-gray-800 placeholder-gray-400 w-full"
                                 placeholder="Section Title"
                              />
                           </div>
                           <div className="flex items-center gap-1 opacity-100 transition-opacity">
                              <button type="button" onClick={() => handleMoveModule(index, 'up')} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-400 hover:text-gray-600 transition-all" disabled={index === 0}><ChevronUp size={16}/></button>
                              <button type="button" onClick={() => handleMoveModule(index, 'down')} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-400 hover:text-gray-600 transition-all" disabled={index === newItemModules.length - 1}><ChevronDown size={16}/></button>
                              <div className="w-px h-4 bg-gray-300 mx-1"></div>
                              <button type="button" onClick={() => handleRemoveModule(index)} className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-md text-gray-400 transition-colors"><Trash2 size={16}/></button>
                           </div>
                        </div>

                        {module.type === 'markdown' && (
                          <div className="space-y-2">
                            <div className="flex justify-end">
                               <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium transition-colors shadow-sm">
                                    <Upload className="w-3.5 h-3.5" /> Insert Image
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if(!file) return;
                                        const formData = new FormData();
                                        formData.append('file', file);
                                        fetch('/api/upload', { method: 'POST', body: formData })
                                           .then(res => res.json())
                                           .then(data => {
                                               if(data.url) handleUpdateModule(index, { content: (module.content || '') + `\n![Image](${data.url})\n` });
                                           });
                                    }} />
                                </label>
                            </div>
                            <textarea
                                value={module.content || ''}
                                onChange={(e) => handleUpdateModule(index, { content: e.target.value })}
                                className="w-full rounded-lg border border-gray-200 p-3 text-gray-800 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm leading-relaxed"
                                rows={6}
                                placeholder="Write your content in Markdown..."
                            />
                          </div>
                        )}

                        {module.type === 'video' && (
                          <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">Video URL (Embed/Iframe Source)</label>
                             <input
                                type="text"
                                value={module.videoUrl || ''}
                                onChange={(e) => handleUpdateModule(index, { videoUrl: e.target.value })}
                                placeholder="https://www.youtube.com/embed/..."
                                className="w-full rounded-lg border border-gray-200 p-3 text-gray-800 bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm"
                             />
                             <p className="text-xs text-gray-500">
                                Paste the embed URL (src attribute from iframe code). Example: https://www.youtube.com/embed/VIDEO_ID
                             </p>
                          </div>
                        )}

                        {module.type === 'faq' && (
                          <div className="space-y-3">
                             <div className="space-y-3">
                                 {module.items?.map((item, qIndex) => (
                                    <div key={qIndex} className="group/item relative flex gap-3 items-start bg-white p-3 rounded-lg border border-gray-200 hover:border-purple-200 transition-colors shadow-sm">
                                       <div className="flex-1 space-y-2">
                                          <input 
                                             placeholder="Question"
                                             className="w-full bg-transparent border-b border-gray-100 focus:border-purple-300 focus:ring-0 p-1 text-sm font-semibold text-gray-800 placeholder-gray-400"
                                             value={item.question}
                                             onChange={(e) => handleModuleFaqChange(index, qIndex, 'question', e.target.value)}
                                          />
                                          <textarea 
                                             placeholder="Answer"
                                             className="w-full bg-gray-50 rounded-md border-none focus:ring-1 focus:ring-purple-200 p-2 text-sm text-gray-600 resize-none"
                                             rows={2}
                                             value={item.answer}
                                             onChange={(e) => handleModuleFaqChange(index, qIndex, 'answer', e.target.value)}
                                          />
                                       </div>
                                       <button type="button" onClick={() => handleRemoveModuleFaqItem(index, qIndex)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                                          <X size={14} />
                                       </button>
                                    </div>
                                 ))}
                             </div>
                             <button type="button" onClick={() => handleAddModuleFaqItem(index)} className="w-full py-2 border border-dashed border-purple-200 rounded-lg text-sm text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all flex items-center justify-center gap-1.5 font-medium">
                                <Plus size={14} /> Add Question
                             </button>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {newItemModules.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-center">
                         <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                            <Gamepad2 className="w-6 h-6 text-gray-400" />
                         </div>
                         <p className="text-gray-900 font-medium mb-1">No modules added yet</p>
                         <p className="text-sm text-gray-500 max-w-xs mx-auto">Enhance your game page by adding "How to Play", "Tips & Tricks", or "FAQ" sections.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-black mb-1">Main Content (Markdown)</label>
                <div className="flex gap-2 mb-2">
                   <label className="cursor-pointer rounded bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 text-sm">
                        <Upload className="h-4 w-4 inline mr-1" /> Insert Image
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'content')} />
                    </label>
                </div>
                <textarea
                  value={newItemContent}
                  onChange={(e) => setNewItemContent(e.target.value)}
                  onPaste={(e) => handlePaste(e, setNewItemContent)}
                  className="h-64 w-full rounded border p-2 font-mono text-black bg-white border-gray-300"
                  placeholder="Enter markdown content..."
                  required
                />
              </div>
              <button type="submit" className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700">
                {isEditing ? 'Update Item' : 'Create Item'}
              </button>
            </form>
          </div>
        ) : (
          <>
            <button
              onClick={() => { setIsCreating(true); setIsEditing(false); resetForm(); }}
              className="mb-6 flex w-full items-center justify-center gap-2 rounded border-2 border-dashed border-gray-300 p-8 text-gray-500 hover:border-blue-500 hover:text-blue-500"
            >
              <Plus className="h-6 w-6" />
              <span className="text-lg font-medium">Add New {activeTab === 'games' ? 'Game' : 'Post'}</span>
            </button>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No items found.</div>
              ) : activeTab === 'games' ? (
                <>
                  {categories.map(cat => {
                      const categoryGames = items.filter(item => item.category === cat.name);
                      if (categoryGames.length === 0) return null;
                      return (
                        <div key={cat.id} className="mb-8">
                            <h3 className="text-lg font-bold text-gray-700 mb-3 ml-1 flex items-center gap-2">
                              <Tag className="h-4 w-4" />
                              {cat.name}
                            </h3>
                            <div className="space-y-4">
                              {categoryGames.map(item => renderItem(item))}
                            </div>
                        </div>
                      );
                  })}
                  {(() => {
                      const uncategorized = items.filter(item => !categories.some(c => c.name === item.category));
                      if (uncategorized.length === 0) return null;
                      return (
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-700 mb-3 ml-1 flex items-center gap-2">
                              <span className="text-gray-400">#</span> Uncategorized
                            </h3>
                            <div className="space-y-4">
                              {uncategorized.map(item => renderItem(item))}
                            </div>
                        </div>
                      );
                  })()}
                </>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => renderItem(item))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
