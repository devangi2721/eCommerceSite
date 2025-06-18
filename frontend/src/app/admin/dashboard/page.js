'use client';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminLayout from '../layout';

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser);
  const router = useRouter();

  // Example stats (replace with real API calls)
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    revenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchStats = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      try {
        const response = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      try {
        const response = await fetch('http://localhost:5000/api/admin/dashboard/recent-orders', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        if (response.ok) {
          const data = await response.json();
          setRecentOrders(data);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchRecentOrders();
  }, []);

  if (user === undefined) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user.name}! Here&apos;s an overview of your store&apos;s performance.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-2xl font-bold text-purple-600">{stats.users}</span>
            <span className="text-gray-600 mt-2">Users</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-2xl font-bold text-blue-600">{stats.orders}</span>
            <span className="text-gray-600 mt-2">Orders</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-2xl font-bold text-green-600">{stats.products}</span>
            <span className="text-gray-600 mt-2">Products</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-2xl font-bold text-pink-600">${stats.revenue.toLocaleString()}</span>
            <span className="text-gray-600 mt-2">Revenue</span>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Order ID</th>
                  <th className="py-2 px-4 text-left">User</th>
                  <th className="py-2 px-4 text-left">Total</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id} className="border-b last:border-b-0">
                    <td className="py-2 px-4">{order._id}</td>
                    <td className="py-2 px-4">{order.user?.name || '-'}</td>
                    <td className="py-2 px-4">${order.total}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
} 