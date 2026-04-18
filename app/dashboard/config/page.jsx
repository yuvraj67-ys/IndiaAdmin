'use client';
import { useState, useEffect } from 'react';

export default function ConfigPage() {
  const [config, setConfig] = useState({
    versionCode: 1,
    versionName: '1.0',
    forceUpdate: false,
    maintenanceMode: false,
    showAds: true, // Advanced Control
    privacyPolicyUrl: 'https://',
    contactEmail: ''
  });
  const[loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(data => {
      if(data.success && data.data) setConfig({...config, ...data.data});
      setLoading(false);
    });
  },[]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    alert("✅ Settings Saved Successfully!");
    setSaving(false);
  };

  if (loading) return <div className="text-center p-10 font-bold text-orange-500">Loading Config...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">⚙️ Remote App Configuration</h1>
      
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Core App Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">🚨 Core Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl cursor-pointer hover:bg-red-100 transition-colors">
              <span className="font-bold text-red-700">Force App Update</span>
              <input type="checkbox" className="w-6 h-6 accent-red-600" checked={config.forceUpdate} onChange={e=>setConfig({...config, forceUpdate: e.target.checked})} />
            </label>
            <label className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-xl cursor-pointer hover:bg-yellow-100 transition-colors">
              <span className="font-bold text-yellow-700">Maintenance Mode</span>
              <input type="checkbox" className="w-6 h-6 accent-yellow-600" checked={config.maintenanceMode} onChange={e=>setConfig({...config, maintenanceMode: e.target.checked})} />
            </label>
            <label className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl cursor-pointer hover:bg-green-100 transition-colors">
              <span className="font-bold text-green-700">Show Ads in App</span>
              <input type="checkbox" className="w-6 h-6 accent-green-600" checked={config.showAds} onChange={e=>setConfig({...config, showAds: e.target.checked})} />
            </label>
          </div>
        </div>

        {/* Version Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">📱 Version Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-2">Version Code (Play Store)</label>
              <input type="number" value={config.versionCode} onChange={e=>setConfig({...config, versionCode: parseInt(e.target.value)})} className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-2">Version Name (e.g. 1.0.5)</label>
              <input type="text" value={config.versionName} onChange={e=>setConfig({...config, versionName: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:border-orange-500" />
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">🔗 URLs & Contacts</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-gray-700 mb-2">Privacy Policy URL</label>
              <input type="url" required value={config.privacyPolicyUrl} onChange={e=>setConfig({...config, privacyPolicyUrl: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-2">Contact Support Email</label>
              <input type="email" required value={config.contactEmail} onChange={e=>setConfig({...config, contactEmail: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:border-orange-500" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg py-4 rounded-xl shadow-lg shadow-orange-200 transition-colors">
          {saving ? '⏳ Saving Configuration...' : '💾 SAVE ALL CHANGES'}
        </button>
      </form>
    </div>
  );
}
