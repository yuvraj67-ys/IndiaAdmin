'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddVehicle() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    cheatCode: '',
    category: '',
    isPremium: false,
    isVisible: true
  });
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => {
      if (d.success && d.data.length > 0) {
        setCategories(d.data);
        setForm(prev => ({ ...prev, category: d.data[0].value }));
      }
    });
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
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

      if (image) {
        const imgRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image })
        });
        const imgData = await imgRes.json();
        if (!imgData.success) {
          throw new Error("Image Upload Failed: " + (imgData.error || 'Unknown Error'));
        }
        imageUrl = imgData.url;
      }

      const dbRes = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, imageUrl: imageUrl })
      });
      const dbData = await dbRes.json();
      if (!dbData.success) {
        throw new Error("Database Save Failed: " + (dbData.error || 'Unknown Error'));
      }

      alert("✅ Vehicle Successfully Added!");
      router.push('/dashboard/vehicles');

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto animate-fade-in">
      <Link href="/dashboard/vehicles" className="text-orange-500 font-bold mb-6 inline-block hover:underline flex items-center gap-2">
        <span>←</span> Back to Vehicles List
      </Link>

      <h1 className="text-3xl font-extrabold mb-8 text-gray-800">➕ Add New Vehicle</h1>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 font-bold">
          ❌ {errorMsg}
        </div>
      )}

      <form onSubmit={submit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-5">

        <div className="flex flex-col gap-2">
          <label className="font-bold text-gray-700 text-lg">Vehicle Image (Required)</label>
          <input type="file" accept="image/*" onChange={handleImage} required className="border-2 border-gray-200 p-3 rounded-xl bg-gray-50 focus:border-orange-500 outline-none transition-colors" />
          {image && <img src={image} className="w-32 h-32 object-cover rounded-xl mt-3 border-2 border-gray-200 shadow-sm" alt="Preview" />}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-gray-700 text-lg">Vehicle Name</label>
          <input type="text" placeholder="e.g. Ninja H2R" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="border-2 border-gray-200 p-4 rounded-xl bg-gray-50 focus:border-orange-500 outline-none transition-colors font-medium text-gray-800" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-gray-700 text-lg">Cheat Code</label>
          <input type="text" placeholder="e.g. 3000" required value={form.cheatCode} onChange={e => setForm({ ...form, cheatCode: e.target.value })}
            className="border-2 border-gray-200 p-4 rounded-xl bg-gray-50 focus:border-orange-500 outline-none transition-colors font-mono text-xl text-orange-600 font-bold tracking-wider" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-gray-700 text-lg">Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="border-2 border-gray-200 p-4 rounded-xl bg-gray-50 focus:border-orange-500 outline-none transition-colors font-bold text-gray-700">
            {categories.length === 0 && <option value="">No categories found</option>}
            {categories.filter(c => c.isActive).map(cat => (
              <option key={cat.id} value={cat.value}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-2">
          <label className="flex items-center justify-between p-4 bg-purple-50 border border-purple-100 rounded-xl cursor-pointer hover:bg-purple-100 transition-colors flex-1">
            <span className="font-bold text-purple-800">⭐ Is Premium?</span>
            <input type="checkbox" className="w-6 h-6 accent-purple-600" checked={form.isPremium} onChange={e => setForm({ ...form, isPremium: e.target.checked })} />
          </label>

          <label className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl cursor-pointer hover:bg-green-100 transition-colors flex-1">
            <span className="font-bold text-green-800">👁 Is Visible?</span>
            <input type="checkbox" className="w-6 h-6 accent-green-600" checked={form.isVisible} onChange={e => setForm({ ...form, isVisible: e.target.checked })} />
          </label>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg py-4 rounded-xl mt-6 shadow-lg shadow-orange-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? '⏳ Uploading & Saving...' : '🚀 SAVE VEHICLE'}
        </button>
      </form>
    </div>
  );
}
