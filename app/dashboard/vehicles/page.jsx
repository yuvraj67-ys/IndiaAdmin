'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderValue, setOrderValue] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => { fetchVehicles(); fetchCategories(); }, []);

  const fetchVehicles = async () => {
    const res = await fetch('/api/vehicles');
    const data = await res.json();
    if (data.success) setVehicles(data.data.sort((a, b) => (a.order || 0) - (b.order || 0)));
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    if (data.success) setCategories(data.data);
  };

  const quickToggle = async (id, field, currentValue) => {
    await fetch(`/api/vehicles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !currentValue })
    });
    fetchVehicles();
  };

  const updateOrder = async (id) => {
    await fetch(`/api/vehicles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: orderValue })
    });
    setEditingOrder(null);
    fetchVehicles();
  };

  const deleteVehicle = async (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      setSelected(prev => { const next = new Set(prev); next.delete(id); return next; });
      fetchVehicles();
    }
  };

  const cloneVehicle = async (id) => {
    const res = await fetch(`/api/vehicles/${id}/clone`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      alert('✅ Vehicle cloned successfully!');
      fetchVehicles();
    } else {
      alert('❌ Error: ' + (data.error || 'Clone failed'));
    }
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return alert('Select vehicles first!');
    if (!confirm(`Delete ${selected.size} selected vehicles?`)) return;
    setBulkLoading(true);
    for (const id of selected) {
      await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
    }
    setSelected(new Set());
    setBulkLoading(false);
    fetchVehicles();
  };

  const bulkToggle = async (field, value) => {
    if (selected.size === 0) return alert('Select vehicles first!');
    setBulkLoading(true);
    for (const id of selected) {
      await fetch(`/api/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
    }
    setBulkLoading(false);
    fetchVehicles();
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(v => v.id)));
    }
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const getCategoryInfo = (catValue) => {
    const cat = categories.find(c => c.value === catValue);
    return cat || { name: catValue, icon: '📦' };
  };

  const filtered = vehicles.filter(v => {
    const matchesSearch = v.name?.toLowerCase().includes(search.toLowerCase()) || v.cheatCode?.includes(search);
    const matchesFilter = filter === 'All' || v.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-800">🚗 Manage Vehicles</h1>
        <div className="flex gap-3 w-full md:w-auto">
          <Link href="/dashboard/vehicles/add" className="w-full md:w-auto text-center bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-200">
            ➕ Add New Vehicle
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <input type="text" placeholder="🔍 Search by name or code..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 font-medium text-gray-700" />

        <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none font-bold text-gray-700 outline-none">
          <option value="All">🌍 All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.value}>{cat.icon || '📦'} {cat.name}</option>
          ))}
        </select>
      </div>

      {/* Bulk Actions Bar */}
      {selected.size > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-3 rounded-2xl mb-4 flex items-center justify-between flex-wrap gap-2">
          <span className="font-bold text-orange-700">{selected.size} selected</span>
          <div className="flex gap-2">
            <button onClick={() => bulkToggle('isVisible', true)} disabled={bulkLoading}
              className="bg-green-500 text-white px-3 py-2 rounded-lg font-bold text-sm hover:bg-green-600 disabled:opacity-50">
              👁 Show All
            </button>
            <button onClick={() => bulkToggle('isVisible', false)} disabled={bulkLoading}
              className="bg-red-500 text-white px-3 py-2 rounded-lg font-bold text-sm hover:bg-red-600 disabled:opacity-50">
              🚫 Hide All
            </button>
            <button onClick={() => bulkToggle('isPremium', true)} disabled={bulkLoading}
              className="bg-purple-500 text-white px-3 py-2 rounded-lg font-bold text-sm hover:bg-purple-600 disabled:opacity-50">
              ⭐ Premium All
            </button>
            <button onClick={() => bulkToggle('isPremium', false)} disabled={bulkLoading}
              className="bg-gray-500 text-white px-3 py-2 rounded-lg font-bold text-sm hover:bg-gray-600 disabled:opacity-50">
              🆓 Free All
            </button>
            <button onClick={bulkDelete} disabled={bulkLoading}
              className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-sm hover:bg-red-700 disabled:opacity-50">
              🗑️ Delete {selected.size}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 border-b w-10">
                <input type="checkbox" className="w-4 h-4 accent-orange-500 cursor-pointer"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleSelectAll} />
              </th>
              <th className="p-4 border-b font-bold">Order</th>
              <th className="p-4 border-b font-bold">Vehicle</th>
              <th className="p-4 border-b font-bold">Cheat Code</th>
              <th className="p-4 border-b font-bold">Category</th>
              <th className="p-4 border-b font-bold">Quick Controls</th>
              <th className="p-4 border-b font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(v => {
              const catInfo = getCategoryInfo(v.category);
              return (
                <tr key={v.id} className={`hover:bg-gray-50 transition-colors ${selected.has(v.id) ? 'bg-orange-50/50' : ''}`}>
                  <td className="p-4">
                    <input type="checkbox" className="w-4 h-4 accent-orange-500 cursor-pointer"
                      checked={selected.has(v.id)} onChange={() => toggleSelect(v.id)} />
                  </td>
                  <td className="p-4">
                    {editingOrder === v.id ? (
                      <div className="flex items-center gap-1">
                        <input type="number" value={orderValue} onChange={e => setOrderValue(parseInt(e.target.value) || 0)}
                          className="w-16 border border-gray-300 p-1 rounded text-center text-sm font-bold" />
                        <button onClick={() => updateOrder(v.id)} className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">✓</button>
                        <button onClick={() => setEditingOrder(null)} className="text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingOrder(v.id); setOrderValue(v.order || 0); }}
                        className="text-gray-600 font-mono text-sm bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                        {v.order || 0}
                      </button>
                    )}
                  </td>
                  <td className="p-4 flex items-center gap-4">
                    <img src={v.imageUrl || 'https://via.placeholder.com/150'} className="w-14 h-14 rounded-xl object-cover shadow-sm bg-gray-200" />
                    <span className="font-bold text-gray-800 text-lg">{v.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg border border-orange-100 font-bold text-lg">
                      {v.cheatCode}
                    </span>
                  </td>
                  <td className="p-4 font-medium">
                    <span className="text-gray-600">{catInfo.icon} {catInfo.name}</span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => quickToggle(v.id, 'isVisible', v.isVisible)}
                      className={`text-xs px-3 py-2 rounded-lg font-bold border transition-colors ${v.isVisible ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}>
                      {v.isVisible ? '👁 VISIBLE' : '🚫 HIDDEN'}
                    </button>
                    <button onClick={() => quickToggle(v.id, 'isPremium', v.isPremium)}
                      className={`text-xs px-3 py-2 rounded-lg font-bold border transition-colors ${v.isPremium ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'}`}>
                      {v.isPremium ? '⭐ PREMIUM' : '🆓 FREE'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => cloneVehicle(v.id)}
                        className="text-green-600 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg font-bold transition-colors text-sm">
                        📋 Clone
                      </button>
                      <Link href={`/dashboard/vehicles/edit/${v.id}`} className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg font-bold transition-colors text-sm">
                        ✏️ Edit
                      </Link>
                      <button onClick={() => deleteVehicle(v.id, v.name)} className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg font-bold transition-colors text-sm">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-12 text-center text-gray-400 font-medium">No vehicles found matching your search.</div>}
      </div>
    </div>
  );
}
