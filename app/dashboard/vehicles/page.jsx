'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VehiclesPage() {
  const[vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const[filter, setFilter] = useState('All');

  useEffect(() => { fetchVehicles() },[]);

  const fetchVehicles = async () => {
    const res = await fetch('/api/vehicles');
    const data = await res.json();
    if (data.success) setVehicles(data.data);
  };

  const quickToggle = async (id, field, currentValue) => {
    await fetch(`/api/vehicles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !currentValue })
    });
    fetchVehicles();
  };

  const deleteVehicle = async (id, name) => {
    if(confirm(`Are you sure you want to delete ${name}?`)) {
      await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      fetchVehicles();
    }
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

      {/* Advanced Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <input type="text" placeholder="🔍 Search by name or code..." value={search} onChange={e=>setSearch(e.target.value)} 
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 font-medium text-gray-700" />
        
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none font-bold text-gray-700 outline-none">
          <option value="All">🌍 All Categories</option>
          <option value="bike">🏍️ Bikes</option>
          <option value="car">🚗 Cars</option>
          <option value="secret">🔒 Secrets</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 border-b font-bold">Vehicle</th>
              <th className="p-4 border-b font-bold">Cheat Code</th>
              <th className="p-4 border-b font-bold">Category</th>
              <th className="p-4 border-b font-bold">Quick Controls</th>
              <th className="p-4 border-b font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(v => (
              <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 flex items-center gap-4">
                  <img src={v.imageUrl || 'https://via.placeholder.com/150'} className="w-14 h-14 rounded-xl object-cover shadow-sm bg-gray-200" />
                  <span className="font-bold text-gray-800 text-lg">{v.name}</span>
                </td>
                <td className="p-4">
                  <span className="font-mono bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg border border-orange-100 font-bold text-lg">
                    {v.cheatCode}
                  </span>
                </td>
                <td className="p-4 capitalize text-gray-600 font-medium">
                  {v.category === 'bike' ? '🏍️ Bike' : v.category === 'car' ? '🚗 Car' : '🔒 Secret'}
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
                    {/* EDIT BUTTON */}
                    <Link href={`/dashboard/vehicles/edit/${v.id}`} className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg font-bold transition-colors">
                      ✏️ Edit
                    </Link>
                    <button onClick={() => deleteVehicle(v.id, v.name)} className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg font-bold transition-colors">
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-12 text-center text-gray-400 font-medium">No vehicles found matching your search.</div>}
      </div>
    </div>
  );
}
