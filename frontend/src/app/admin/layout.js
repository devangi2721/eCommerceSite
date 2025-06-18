'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout } from '@/redux/slices/authSlice';
import '../globals.css';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-600 to-pink-500 text-white flex flex-col py-8 px-4 shadow-lg">
        <div className="mb-10 text-2xl font-bold text-center tracking-wide">Admin Panel</div>
        <nav className="flex-1 space-y-4">
        <button
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            onClick={() => router.push('/admin/dashboard')}
          >
            Dashboard
          </button>
          <button
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            onClick={() => router.push('/admin/users')}
          >
            User Management
          </button>
          <button
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            onClick={() => router.push('/admin/categories')}
          >
            Category Management
          </button>
          <button
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            onClick={() => router.push('/admin/products')}
          >
            Product Management
          </button>
          <button
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            onClick={() => router.push('/admin/orders')}
          >
            Order Management
          </button>
          
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full bg-white shadow flex items-center justify-between px-8 py-4">
          <div className="text-xl font-bold text-purple-600">Dashboard</div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push('/admin/profile')}
              className="text-gray-700 hover:text-purple-600 font-semibold transition-colors"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-purple-600 font-semibold transition-colors"
            >
              Logout
            </button>
          </div>
        </header>
        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 