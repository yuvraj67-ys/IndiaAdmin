'use client';
import { useState, useEffect } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', value: '', order: 0, isActive: true });

  useEffect(() => { fetchCategories() }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    if (data.success) setCategories(data.data);
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ name: '', value: '', order: 0, isActive: true });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name, value: cat.value, order: cat.order || 0, isActive: cat.isActive });
    setEditing(cat.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.value) return alert('Name and Value are required!');

    if (editing) {
      await fetch(`/api/categories/${editing}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    resetForm();
    fetchCategories();
  };

  const deleteCat = async (id, name) => {
    if (!confirm(`Delete category "${name}"? This will NOT delete vehicles in this category.`)) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  if (loading) return <div className="text-center p-10 font-bold text-orange-500">Loading Categories...</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">📁 Manage Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Create & manage vehicle categories. These appear as tabs in the Android app.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-200">
          ➕ Add Category
        </button>
      </div>

      {/* Category Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{editing ? '✏️ Edit Category' : '➕ New Category'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Display Name</label>
              <input type="text" required placeholder="e.g. Bikes" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 outline-none focus:border-orange-500 font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Firebase Value</label>
              <input type="text" required placeholder="e.g. bike" value={form.value}
                onChange={e => setForm({ ...form, value: e.target.value })}
                className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 outline-none focus:border-orange-500 font-mono" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Order</label>
              <input type="number" value={form.order}
                onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 outline-none focus:border-orange-500" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl cursor-pointer hover:bg-green-100 w-full">
                <input type="checkbox" className="w-5 h-5 accent-green-600" checked={form.isActive}
                  onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                <span className="font-bold text-green-800 text-sm">Active</span>
              </label>
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" className="bg-orange-500 text-white px-5 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors flex-1">
                {editing ? '💾 Save' : '➕ Add'}
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 px-5 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors">
                ✕
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 border-b font-bold">Name</th>
              <th className="p-4 border-b font-bold">Firebase Value</th>
              <th className="p-4 border-b font-bold">Order</th>
              <th className="p-4 border-b font-bold">Status</th>
              <th className="p-4 border-b font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-800">{cat.name}</td>
                <td className="p-4">
                  <span className="font-mono bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg border border-purple-100 font-bold text-sm">
                    {cat.value}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{cat.order || 0}</td>
                <td className="p-4">
                  <span className={`text-xs px-3 py-1.5 rounded-lg font-bold ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {cat.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(cat)}
                      className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg font-bold transition-colors text-sm">
                      ✏️ Edit
                    </button>
                    <button onClick={() => deleteCat(cat.id, cat.name)}
                      className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg font-bold transition-colors text-sm">
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <div className="p-12 text-center text-gray-400 font-medium">No categories yet. Add your first category!</div>}
      </div>
    </div>
  );
}
