'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardHome() {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/vehicles').then(r => r.json()),
      fetch('/api/categories').then(r => r.json())
    ]).then(([vehData, catData]) => {
      if (vehData.success) setVehicles(vehData.data);
      if (catData.success) setCategories(catData.data);
      setLoading(false);
    });
  }, []);

  const total = vehicles.length;
  const premium = vehicles.filter(v => v.isPremium).length;
  const visible = vehicles.filter(v => v.isVisible).length;
  const hidden = vehicles.filter(v => !v.isVisible).length;
  const maxCount = Math.max(1, ...categories.map(c => vehicles.filter(v => v.category === c.value).length));

  if (loading) return <div className="flex justify-center items-center h-full text-orange-500 font-bold">Loading Data...</div>;

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Overview</h1>
      <p className="text-gray-500 mb-8">Welcome back! Here is what's happening with your app today.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-6xl opacity-10">🌍</div>
          <p className="text-xs font-bold text-gray-400">TOTAL VEHICLES</p>
          <h3 className="text-4xl font-extrabold text-gray-800 mt-2">{total}</h3>
        </div>
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-6 rounded-2xl shadow-lg shadow-orange-200 text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-6xl opacity-20">⭐</div>
          <p className="text-xs font-bold text-orange-100">PREMIUM</p>
          <h3 className="text-4xl font-extrabold mt-2">{premium}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-6xl opacity-10">👁️</div>
          <p className="text-xs font-bold text-gray-400">VISIBLE</p>
          <h3 className="text-4xl font-extrabold text-green-600 mt-2">{visible}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-6xl opacity-10">🚫</div>
          <p className="text-xs font-bold text-gray-400">HIDDEN</p>
          <h3 className="text-4xl font-extrabold text-red-600 mt-2">{hidden}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-6xl opacity-10">📁</div>
          <p className="text-xs font-bold text-gray-400">CATEGORIES</p>
          <h3 className="text-4xl font-extrabold text-purple-600 mt-2">{categories.length}</h3>
        </div>
      </div>

      {/* Category Distribution Bar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Category Distribution</h2>
        <div className="space-y-3">
          {categories.filter(c => c.isActive).map(cat => {
            const count = vehicles.filter(v => v.category === cat.value).length;
            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div key={cat.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-gray-700">{cat.icon || '📦'} {cat.name}</span>
                  <span className="font-bold text-gray-500">{count} vehicles</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/vehicles/add" className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl text-orange-700 font-bold text-center transition-colors">
              <span className="block text-2xl mb-1">➕</span> Add Vehicle
            </Link>
            <Link href="/dashboard/categories" className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-purple-700 font-bold text-center transition-colors">
              <span className="block text-2xl mb-1">📁</span> Manage Categories
            </Link>
            <Link href="/dashboard/notifications" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-700 font-bold text-center transition-colors">
              <span className="block text-2xl mb-1">📢</span> Send Notification
            </Link>
            <Link href="/dashboard/config" className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 font-bold text-center transition-colors">
              <span className="block text-2xl mb-1">⚙️</span> App Config
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Vehicles</h2>
            <Link href="/dashboard/vehicles" className="text-orange-500 text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {vehicles.slice(0, 4).map(v => {
              const catInfo = categories.find(c => c.value === v.category);
              return (
                <div key={v.id} className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <img src={v.imageUrl || 'https://via.placeholder.com/50'} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="ml-4 flex-1">
                    <p className="font-bold text-gray-800">{v.name}</p>
                    <p className="text-xs text-gray-500">
                      <span className="mr-2">{catInfo?.icon || '📦'} {catInfo?.name || v.category}</span>
                      Code: <span className="font-mono text-orange-600 bg-orange-50 px-1 rounded">{v.cheatCode}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
