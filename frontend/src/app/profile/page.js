"use client";
import { selectToken } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../constants/constant";


export default function ProfilePage() {
  const router = useRouter();
  const token = useSelector(selectToken);
  const [userDetails, setUserDetails] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'orders'

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserDetails(data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchOrderHistory = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/users/orders/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method: "GET",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setOrderHistory(data);
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUserDetails(), fetchOrderHistory()]);
      setLoading(false);
    };

    fetchData();
  }, [token, router]);

  const handleCancelOrder = async (orderId) => {
    if (!token) return;
    try {
      const response = await fetch(
        `${BASE_URL}/api/users/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setOrderHistory((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: "cancelled" } : order
          )
        );
      } else {
        const data = await response.json();
        alert(data.error || data.msg || "Failed to cancel order");
      }
    } catch (error) {
      alert("Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Home
            </button>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                activeTab === "profile"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                activeTab === "orders"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Order History
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === "profile" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Personal Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="w-20 text-sm font-medium text-gray-600">
                          Name:
                        </span>
                        <span className="text-gray-900">
                          {userDetails?.name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-sm font-medium text-gray-600">
                          Email:
                        </span>
                        <span className="text-gray-900">
                          {userDetails?.email}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-sm font-medium text-gray-600">
                          Role:
                        </span>
                        <span className="text-gray-900 capitalize">
                          {userDetails?.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Account Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {orderHistory.length}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {new Date(userDetails?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Order History
              </h3>
              {orderHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg font-medium">No orders found</p>
                  <p className="text-gray-400 text-sm mt-2">Start shopping to see your order history here</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orderHistory.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                Order #{order._id.slice(-8).toUpperCase()}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                  : "bg-red-100 text-red-700 border border-red-200"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            {order.status !== "cancelled" &&
                              order.status !== "completed" && (
                                <button
                                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium shadow-sm"
                                  onClick={() => handleCancelOrder(order._id)}
                                >
                                  Cancel Order
                                </button>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-6">
                        <div className="space-y-4">
                          {order.products.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                              {/* Product Image */}
                              <div className="flex-shrink-0">
                                {item.product?.image || item.image ? (
                                  <img
                                    src={(item.product?.image || item.image).startsWith('http') 
                                      ? (item.product?.image || item.image) 
                                      : `${BASE_URL}${item.product?.image || item.image}`
                                    }
                                    alt={item.product?.name || item.name}
                                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                {(!item.product?.image && !item.image) && (
                                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>

                              {/* Product Details */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-800 truncate">
                                  {item.product?.name || item.name}
                                </h4>
                                <p className="text-xs text-gray-500 capitalize">
                                  {item.product?.category || item.category}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-sm text-gray-600">
                                    Qty: {item.quantity}
                                  </span>
                                  <span className="text-sm font-semibold text-purple-600">
                                    ${item.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Total */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                            <span className="text-2xl font-bold text-purple-600">${order.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
