'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const[search, setSearch] = useState('');
  const [filter, setFilter] = useState('All'); // All, bike, car, secret

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
      body: JSON.stringify({[field]: !currentValue })
    });
    fetchVehicles();
  };

  const downloadBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vehicles, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `indian_bike_backup_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  const filtered = vehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.cheatCode.includes(search);
    const matchesFilter = filter === 'All' || v.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Manage Vehicles</h1>
        <div className="flex gap-3">
          <button onClick={downloadBackup} className="bg-gray-800 text-white px-4 py-2 rounded-xl font-bold hover:bg-gray-900 transition-colors shadow-md">
            📥 Backup JSON
          </button>
          <Link href="/dashboard/vehicles/add" className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-200">
            ➕ Add New
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <input type="text" placeholder="🔍 Search by name or code..." value={search} onChange={e=>setSearch(e.target.value)} 
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" />
        
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none font-bold text-gray-700">
          <option value="All">All Categories</option>
          <option value="bike">🏍️ Bikes</option>
          <option value="car">🚗 Cars</option>
          <option value="secret">🔒 Secrets</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 border-b font-semibold">Vehicle & Image</th>
              <th className="p-4 border-b font-semibold">Cheat Code</th>
              <th className="p-4 border-b font-semibold">Category</th>
              <th className="p-4 border-b font-semibold">Quick Status</th>
              <th className="p-4 border-b font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(v => (
              <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 flex items-center gap-4">
                  <img src={v.imageUrl || 'https://via.placeholder.com/50'} className="w-14 h-14 rounded-xl object-cover shadow-sm" />
                  <span className="font-bold text-gray-800">{v.name}</span>
                </td>
                <td className="p-4">
                  <span className="font-mono bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg border border-orange-100 font-bold">
                    {v.cheatCode}
                  </span>
                </td>
                <td className="p-4 capitalize text-gray-600 font-medium">{v.category}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => quickToggle(v.id, 'isVisible', v.isVisible)} 
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition-colors ${v.isVisible ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {v.isVisible ? '👁 VISIBLE' : '🚫 HIDDEN'}
                  </button>
                  <button onClick={() => quickToggle(v.id, 'isPremium', v.isPremium)} 
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition-colors ${v.isPremium ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                    {v.isPremium ? '⭐ PREMIUM' : 'FREE'}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button onClick={async () => {
                    if(confirm(`Delete ${v.name}?`)) {
                      await fetch(`/api/vehicles/${v.id}`, {method: 'DELETE'});
                      fetchVehicles();
                    }
                  }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg font-bold transition-colors">
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-8 text-center text-gray-500">No vehicles found.</div>}
      </div>
    </div>
  );
}
