'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddVehicle() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    name: '', 
    cheatCode: '', 
    category: 'bike', 
    isPremium: false, 
    isVisible: true 
  });
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Image Selection and Convert to Base64
  const handleImage = (e) => {
    const file = e.target.files[0];
    if(file){
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result);
        reader.readAsDataURL(file);
    }
  };

  // Submit Form Data
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
        let imageUrl = '';
        
        // 1. Upload Image to ImgBB (Agar image select ki hai toh)
        if(image) {
            const imgRes = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image })
            });
            const imgData = await imgRes.json();
            
            if(!imgData.success) {
              throw new Error("Image Upload Failed: " + (imgData.error || 'Unknown Error'));
            }
            imageUrl = imgData.url;
        }

        // 2. Save Vehicle to Firebase Database
        const dbRes = await fetch('/api/vehicles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, imageUrl: imageUrl })
        });
        const dbData = await dbRes.json();
        
        if(!dbData.success) {
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
        
        {/* Image Upload Section */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-gray-700 text-lg">Vehicle Image (Required)</label>
          <input type="file" accept="image/*" onChange={handleImage} required className="border-2 border-gray-200 p-3 rounded-xl bg-gray-50 focus:border-orange-500 outline-none transition-colors" />
          {image && <img src={image} className="w-32 h-32 object-cover rounded-xl mt-3 border-2 border-gray-200 shadow-sm" alt="Preview" />}
        </div>

        {/* Vehicle Name */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-gray-700 text-lg">Vehicle Name</label>
          <input type="text" placeholder="e.g. Ninja H2R" required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="border-2 border-gray-200 p-4 rounded-xl bg-gray-50 focus:border-orange-500 outline-none transition-colors font-medium text-gray-800" />
        </div>
        
        {/* Cheat Code */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-gray-700 text-lg">Cheat Code</label>
          <input type="text" placeholder="e.g. 3000" required value={form.cheatCode} onChange={e=>setForm({...form, cheatCode: e.target.value})} className="border-2 border-gray-200 p-4 rounded-xl bg-gray-50 focus:border-orange-500 outline-none transition-colors font-mono text-xl text-orange-600 font-bold tracking-wider" />
        </div>
        
        {/* Category */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-gray-700 text-lg">Category</label>
          <select value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="border-2 border-gray-200 p-4 rounded-xl bg-gray-50 focus:border-orange-500 outline-none transition-colors font-bold text-gray-700">
            <option value="bike">🏍️ Bike</option>
            <option value="car">🚗 Car</option>
            <option value="secret">🔒 Secret</option>
            <option value="truck">🚛 Truck</option>
          </select>
        </div>
        
        {/* Visibility & Premium Toggles */}
        <div className="flex flex-col md:flex-row gap-4 mt-2">
          <label className="flex items-center justify-between p-4 bg-purple-50 border border-purple-100 rounded-xl cursor-pointer hover:bg-purple-100 transition-colors flex-1">
            <span className="font-bold text-purple-800">⭐ Is Premium?</span>
            <input type="checkbox" className="w-6 h-6 accent-purple-600" checked={form.isPremium} onChange={e=>setForm({...form, isPremium: e.target.checked})} />
          </label>
          
          <label className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl cursor-pointer hover:bg-green-100 transition-colors flex-1">
            <span className="font-bold text-green-800">👁 Is Visible?</span>
            <input type="checkbox" className="w-6 h-6 accent-green-600" checked={form.isVisible} onChange={e=>setForm({...form, isVisible: e.target.checked})} />
          </label>
        </div>
        
        {/* Submit Button */}
        <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg py-4 rounded-xl mt-6 shadow-lg shadow-orange-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? '⏳ Uploading & Saving...' : '🚀 SAVE VEHICLE'}
        </button>
      </form>
    </div>
  );
}
