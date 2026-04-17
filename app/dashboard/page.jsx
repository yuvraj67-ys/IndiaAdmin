'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [notif, setNotif] = useState({ title: '', body: '' });
  const router = useRouter();

  useEffect(() => {
    fetch('/api/vehicles').then(r => r.json()).then(d => {
      if (d.success) setVehicles(d.data);
    });
  }, []);

  const sendNotif = async () => {
    alert("Sending...");
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notif)
    });
    alert("Notification Sent!");
    setNotif({ title: '', body: '' });
  };

  const logout = async () => {
    await fetch('/api/auth', { method: 'POST', body: JSON.stringify({ action: 'logout' }) });
    router.push('/');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-500">
          <h2 className="text-gray-500">Total Vehicles</h2>
          <p className="text-3xl font-bold">{vehicles.length}</p>
        </div>
        <Link href="/dashboard/vehicles/add" className="bg-orange-500 text-white p-6 rounded-xl shadow hover:bg-orange-600 flex items-center justify-center font-bold text-xl cursor-pointer">
          + Add New Vehicle
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-bold mb-4">📢 Send Push Notification</h2>
        <input type="text" placeholder="Title" value={notif.title} onChange={e => setNotif({...notif, title: e.target.value})} className="w-full border p-2 mb-2 rounded" />
        <textarea placeholder="Message Body" value={notif.body} onChange={e => setNotif({...notif, body: e.target.value})} className="w-full border p-2 mb-2 rounded"></textarea>
        <button onClick={sendNotif} className="bg-blue-500 text-white px-4 py-2 rounded">Send to All Users</button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">🚗 Manage Vehicles</h2>
        {vehicles.map(v => (
          <div key={v.id} className="flex justify-between items-center border-b py-2">
            <div>
              <p className="font-bold">{v.name}</p>
              <p className="text-sm text-gray-500">Code: {v.cheatCode}</p>
            </div>
            <button onClick={async () => {
              if(confirm('Delete?')) {
                await fetch(`/api/vehicles/${v.id}`, {method: 'DELETE'});
                window.location.reload();
              }
            }} className="text-red-500 font-bold">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
