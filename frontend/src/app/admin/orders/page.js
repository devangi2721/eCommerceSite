"use client";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../constants/constant";

const API_URL = `${BASE_URL}/api/admin/orders`;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  useEffect(() => {
    const fetchOrders = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      try {
        const response = await fetch(API_URL, { 
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancel = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/cancel`, {
        method: "PUT",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }
      setOrders((orders) =>
        orders.map((order) =>
          order._id === id ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel order");
    }
  };

  return (
    <div className="mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-purple-600 mb-6">Order Management</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
          <p className="text-sm text-gray-500 mt-2">Please try refreshing the page</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <th className="py-3 px-6 text-left rounded-tl-lg">User Name</th>
                {/* <th className="py-3 px-6 text-left">Product Name</th> */}
                {/* <th className="py-3 px-6 text-left">Price</th> */}
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Image</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left rounded-tr-lg">Total Price</th>
                <th className="py-3 px-6 text-left rounded-tr-lg">Actions</th>
                <th className="py-3 px-6 text-left rounded-tr-lg">View</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500 border-b">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id} className="border-b last:border-b-0 hover:bg-purple-50 transition-colors">
                    <td className="py-3 px-6">{order.user?.name || '-'}</td>
                    <td className="py-3 px-6">{order.products[0].product?.category || order.category}</td>
                    <td className="py-3 px-6">
                      {order.products[0].product?.image && (
                        <img 
                          src={order.products[0].product.image} 
                          alt={order.products[0].product.name} 
                          className="w-16 h-16 object-cover rounded shadow-sm"
                        />
                      )}
                    </td>
                    <td className="py-3 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'cancelled' 
                          ? 'bg-red-100 text-red-700'
                          : order.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-6">${order.total}</td>
                    <td className="py-3 px-6">
                      {order.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancel(order._id)}
                          className="bg-pink-100 text-pink-700 px-3 py-1 rounded-lg font-semibold hover:bg-pink-200 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>User:</strong> {selectedOrder.user?.name || '-'}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Total:</strong> ${selectedOrder.total}</p>
            <p className="mt-4 font-semibold">Products:</p>
            <ul className="list-disc ml-6">
              {selectedOrder.products?.map((item, idx) => (
                <li key={idx}>
                  {item.product?.name || item.name} x {item.quantity} (${item.price})
                </li>
              ))}
            </ul>
            <button
              className="mt-6 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 