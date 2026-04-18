'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems =[
    { name: '📊 Dashboard', path: '/dashboard' },
    { name: '🏍️ Vehicles', path: '/dashboard/vehicles' },
    { name: '📢 Notifications', path: '/dashboard/notifications' },
    { name: '⚙️ App Config', path: '/dashboard/config' },
  ];

  const logout = async () => {
    if(confirm("Are you sure you want to logout?")) {
      await fetch('/api/auth', { method: 'POST', body: JSON.stringify({ action: 'logout' }) });
      router.push('/');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex flex-col hidden md:flex">
        <div className="p-6 text-center border-b border-gray-100">
          <div className="text-4xl mb-2">🎮</div>
          <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
          <p className="text-xs text-orange-500 font-bold tracking-widest mt-1">PRO VERSION</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}
              className={`block px-4 py-3 rounded-xl transition-all font-medium ${
                pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/dashboard')
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
              }`}>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={logout} className="w-full px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-bold transition-colors">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="font-bold text-orange-600">Admin PRO</h2>
          <button onClick={logout} className="text-red-500 text-sm font-bold">Logout</button>
        </header>

        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
