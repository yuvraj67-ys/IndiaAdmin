'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddVehicle() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', cheatCode: '', category: 'bike', isPremium: false });
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    if(file) reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Upload Image to ImgBB
    const imgRes = await fetch('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ image })
    });
    const imgData = await imgRes.json();

    // 2. Save to Firebase
    await fetch('/api/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, imageUrl: imgData.url || '' })
    });

    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/dashboard" className="text-orange-500 mb-4 inline-block">← Back to Dashboard</Link>
      <h1 className="text-3xl font-bold mb-6">Add New Vehicle</h1>
      
      <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleImage} required className="border p-2 rounded" />
        <input type="text" placeholder="Vehicle Name" required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="border p-2 rounded" />
        <input type="text" placeholder="Cheat Code" required value={form.cheatCode} onChange={e=>setForm({...form, cheatCode: e.target.value})} className="border p-2 rounded" />
        
        <select value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="border p-2 rounded">
          <option value="bike">Bike</option>
          <option value="car">Car</option>
          <option value="secret">Secret</option>
        </select>
        
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.isPremium} onChange={e=>setForm({...form, isPremium: e.target.checked})} />
          Premium Vehicle (Requires Ad to Unlock Secretly)
        </label>
        
        <button type="submit" disabled={loading} className="bg-orange-500 text-white font-bold py-3 rounded mt-4">
          {loading ? 'Uploading & Saving...' : 'Save Vehicle'}
        </button>
      </form>
    </div>
  );
}
