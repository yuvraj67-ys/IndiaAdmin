'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddVehicle() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', cheatCode: '', category: 'bike', isPremium: false });
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleImage = (e) => {
    const file = e.target.files[0];
    if(file){
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result);
        reader.readAsDataURL(file);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
        let imageUrl = '';
        
        // 1. Upload Image to ImgBB (Only if image is selected)
        if(image) {
            const imgRes = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image })
            });
            const imgData = await imgRes.json();
            if(!imgData.success) throw new Error("Image Upload Failed: " + (imgData.error || 'Unknown Error'));
            imageUrl = imgData.url;
        }

        // 2. Save to Firebase DB
        const dbRes = await fetch('/api/vehicles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, imageUrl: imageUrl })
        });
        const dbData = await dbRes.json();
        
        if(!dbData.success) throw new Error("Database Save Failed: " + (dbData.error || 'Unknown Error'));

        alert("Successfully Added!");
        router.push('/dashboard');
        
    } catch (err) {
        console.error(err);
        setErrorMsg(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/dashboard" className="text-orange-500 mb-4 inline-block">← Back to Dashboard</Link>
      <h1 className="text-3xl font-bold mb-6">Add New Vehicle</h1>
      
      {errorMsg && <div className="bg-red-100 text-red-700 p-4 rounded mb-4 font-bold">{errorMsg}</div>}

      <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow flex flex-col gap-4">
        <label className="font-bold text-gray-700">Vehicle Image (Required)</label>
        <input type="file" accept="image/*" onChange={handleImage} required className="border p-2 rounded bg-gray-50" />
        {image && <img src={image} className="w-32 h-32 object-cover rounded mt-2 border" />}

        <label className="font-bold text-gray-700 mt-2">Vehicle Name</label>
        <input type="text" placeholder="e.g. Ninja H2R" required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="border p-3 rounded bg-gray-50" />
        
        <label className="font-bold text-gray-700 mt-2">Cheat Code</label>
        <input type="text" placeholder="e.g. 3000" required value={form.cheatCode} onChange={e=>setForm({...form, cheatCode: e.target.value})} className="border p-3 rounded bg-gray-50" />
        
        <label className="font-bold text-gray-700 mt-2">Category</label>
        <select value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="border p-3 rounded bg-gray-50">
          <option value="bike">Bike</option>
          <option value="car">Car</option>
          <option value="secret">Secret</option>
        </select>
        
        <label className="flex items-center gap-2 mt-4 cursor-pointer p-3 bg-orange-50 border rounded font-bold text-orange-800">
          <input type="checkbox" className="w-5 h-5" checked={form.isPremium} onChange={e=>setForm({...form, isPremium: e.target.checked})} />
          Is Premium Vehicle? (User must watch ad to unlock)
        </label>
        
        <button type="submit" disabled={loading} className="bg-orange-500 text-white font-bold py-4 rounded-xl mt-6 shadow-lg hover:bg-orange-600">
          {loading ? '⏳ Uploading & Saving...' : '🚀 Save Vehicle'}
        </button>
      </form>
    </div>
  );
}
