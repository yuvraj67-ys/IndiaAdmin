'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, action: 'login' }),
    });
    const data = await res.json();
    if (data.success) router.push('/dashboard');
    else setError('Incorrect Password!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-500">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">🏍️ Admin Login</h1>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Admin Password" 
          className="w-full border-2 border-gray-200 p-3 rounded-lg mb-4 focus:outline-none focus:border-orange-500"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600">
          Login
        </button>
      </form>
    </div>
  );
}
