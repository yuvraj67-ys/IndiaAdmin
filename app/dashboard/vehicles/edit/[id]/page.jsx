'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditVehicle({ params }) {
  const router = useRouter();
  const { id } = params; // Extract ID from URL
  
  const [form, setForm] = useState({ name: '', cheatCode: '', category: 'bike', isPremium: false, isVisible: true, imageUrl: '' });
  const [newImage, setNewImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/vehicles').then(r => r.json()).then(d => {
      const vehicle = d.data.find(v => v.id === id);
      if(vehicle) setForm(vehicle);
      setLoading(false);
    });
  }, [id]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalImageUrl = form.imageUrl;
      
      // Upload new image if selected
      if(newImage) {
        const imgRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: newImage })
        });
        const imgData = await imgRes.json();
        if(imgData.success) finalImageUrl = imgData.url;
      }

      // Update Database
      await fetch(`/api/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, imageUrl: finalImageUrl })
      });

      alert("✅ Vehicle Updated Successfully!");
      router.push('/dashboard/vehicles');
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if(loading) return <div className="p-10 font-bold text-orange-500">Loading Vehicle Data...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard/vehicles" className="text-orange-500 font-bold mb-4 inline-block hover:underline">← Back to List</Link>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">✏️ Edit Vehicle</h1>

      <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
        
        {/* Image Preview & Change */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-gray-700">Vehicle Image</label>
          <div className="flex gap-4 items-center">
            <img src={newImage || form.imageUrl} className="w-24 h-24 object-cover rounded-xl border border-gray-200" alt="Preview"/>
            <input type="file" accept="image/*" onChange={handleImage} className="border p-2 rounded bg-gray-50 flex-1" />
          </div>
        </div>

        <label className="font-bold text-gray-700 mt-2">Vehicle Name</label>
        <input type="text" required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="border p-3 rounded-xl bg-gray-50 focus:outline-none focus:border-orange-500 font-bold" />
        
        <label className="font-bold text-gray-700 mt-2">Cheat Code</label>
        <input type="text" required value={form.cheatCode} onChange={e=>setForm({...form, cheatCode: e.target.value})} className="border p-3 rounded-xl bg-gray-50 focus:outline-none focus:border-orange-500 font-mono text-lg text-orange-700" />
        
        <label className="font-bold text-gray-700 mt-2">Category</label>
        <select value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="border p-3 rounded-xl bg-gray-50 focus:outline-none">
          <option value="bike">🏍️ Bike</option>
          <option value="car">🚗 Car</option>
          <option value="secret">🔒 Secret</option>
          <option value="truck">🚛 Truck</option>
        </select>
        
        <div className="flex gap-4 mt-4">
          <label className="flex items-center gap-2 cursor-pointer p-3 bg-purple-50 border border-purple-100 rounded-xl flex-1">
            <input type="checkbox" className="w-5 h-5 accent-purple-600" checked={form.isPremium} onChange={e=>setForm({...form, isPremium: e.target.checked})} />
            <span className="font-bold text-purple-800">Is Premium?</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer p-3 bg-green-50 border border-green-100 rounded-xl flex-1">
            <input type="checkbox" className="w-5 h-5 accent-green-600" checked={form.isVisible} onChange={e=>setForm({...form, isVisible: e.target.checked})} />
            <span className="font-bold text-green-800">Is Visible?</span>
          </label>
        </div>
        
        <button type="submit" disabled={saving} className="bg-orange-500 text-white font-bold py-4 rounded-xl mt-6 shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors">
          {saving ? '⏳ Updating Database...' : '💾 Update Vehicle'}
        </button>
      </form>
    </div>
  );
}
