'use client';
import { useState, useEffect } from 'react';

export default function NotificationsPage() {
  const[notif, setNotif] = useState({ title: '', body: '', imageUrl: '' });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchHistory() },[]);

  const fetchHistory = async () => {
    const res = await fetch('/api/notifications');
    const data = await res.json();
    if(data.success) setHistory(data.data);
  };

  const sendNotif = async (e) => {
    e.preventDefault();
    if(!confirm("Push notification will go to all users. Send?")) return;
    
    setLoading(true);
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notif)
    });
    const data = await res.json();
    setLoading(false);

    if(data.success) {
      alert("✅ Notification Sent to all users!");
      setNotif({ title: '', body: '', imageUrl: '' });
      fetchHistory(); // Refresh history
    } else {
      alert("❌ Error: " + data.error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Sender Form */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Push Notifications</h1>
        <form onSubmit={sendNotif} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <label className="font-bold text-gray-700">Notification Title</label>
          <input type="text" required placeholder="e.g. New Secret Cheat Codes!" value={notif.title} onChange={e=>setNotif({...notif, title: e.target.value})} className="border p-3 rounded-xl bg-gray-50 focus:outline-none focus:border-blue-500" />
          
          <label className="font-bold text-gray-700 mt-2">Message Body</label>
          <textarea required placeholder="e.g. Open the app to see the new Ninja H2R code." value={notif.body} onChange={e=>setNotif({...notif, body: e.target.value})} rows={3} className="border p-3 rounded-xl bg-gray-50 focus:outline-none focus:border-blue-500" />

          <label className="font-bold text-gray-700 mt-2">Image URL (Optional)</label>
          <input type="url" placeholder="https://..." value={notif.imageUrl} onChange={e=>setNotif({...notif, imageUrl: e.target.value})} className="border p-3 rounded-xl bg-gray-50 focus:outline-none focus:border-blue-500" />
          
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mt-4 shadow-lg shadow-blue-200 transition-colors">
            {loading ? '📤 Sending...' : '🚀 Blast Notification to All Users'}
          </button>
        </form>
      </div>

      {/* History Panel */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📜 Sent History</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 max-h-[600px] overflow-y-auto">
          {history.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No notifications sent yet.</p>
          ) : (
            <div className="space-y-2">
              {history.map(h => (
                <div key={h.id} className="p-4 border border-gray-50 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800">{h.title}</h3>
                    <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-1 rounded">{h.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{h.body}</p>
                  <p className="text-xs text-gray-400">📅 {new Date(h.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
