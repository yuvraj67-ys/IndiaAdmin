'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardHome() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/vehicles').then(r => r.json()).then(d => {
      if (d.success) setVehicles(d.data);
      setLoading(false);
    });
  },[]);

  const total = vehicles.length;
  const premium = vehicles.filter(v => v.isPremium).length;
  const bikes = vehicles.filter(v => v.category === 'bike').length;
  const cars = vehicles.filter(v => v.category === 'car').length;
  const secrets = vehicles.filter(v => v.category === 'secret').length;

  if(loading) return <div className="flex justify-center items-center h-full text-orange-500 font-bold">Loading Data...</div>;

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Overview</h1>
      <p className="text-gray-500 mb-8">Welcome back! Here is what's happening with your app today.</p>

      {/* Premium Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-6xl opacity-10">🏍️</div>
          <p className="text-sm font-bold text-gray-400">TOTAL VEHICLES</p>
          <h3 className="text-4xl font-extrabold text-gray-800 mt-2">{total}</h3>
        </div>
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-6 rounded-2xl shadow-lg shadow-orange-200 text-white relative overflow-hidden">
           <div className="absolute -right-4 -top-4 text-6xl opacity-20">⭐</div>
          <p className="text-sm font-bold text-orange-100">PREMIUM / SECRET</p>
          <h3 className="text-4xl font-extrabold mt-2">{premium + secrets}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
           <div className="absolute -right-4 -top-4 text-6xl opacity-10">🚲</div>
          <p className="text-sm font-bold text-gray-400">TOTAL BIKES</p>
          <h3 className="text-4xl font-extrabold text-blue-600 mt-2">{bikes}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
           <div className="absolute -right-4 -top-4 text-6xl opacity-10">🚗</div>
          <p className="text-sm font-bold text-gray-400">TOTAL CARS</p>
          <h3 className="text-4xl font-extrabold text-green-600 mt-2">{cars}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Links */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/vehicles/add" className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl text-orange-700 font-bold text-center transition-colors">
              <span className="block text-2xl mb-1">➕</span> Add Vehicle
            </Link>
            <Link href="/dashboard/notifications" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-700 font-bold text-center transition-colors">
              <span className="block text-2xl mb-1">📢</span> Send Notification
            </Link>
          </div>
        </div>

        {/* Recently Added */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Vehicles</h2>
            <Link href="/dashboard/vehicles" className="text-orange-500 text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {vehicles.slice(0, 4).map(v => (
              <div key={v.id} className="flex items-center p-3 bg-gray-50 rounded-xl">
                <img src={v.imageUrl || 'https://via.placeholder.com/50'} className="w-12 h-12 rounded-lg object-cover" />
                <div className="ml-4 flex-1">
                  <p className="font-bold text-gray-800">{v.name}</p>
                  <p className="text-xs text-gray-500">Code: <span className="font-mono text-orange-600 bg-orange-50 px-1 rounded">{v.cheatCode}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
