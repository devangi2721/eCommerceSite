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
                <p className="text-gray-500 text-center py-8">
                  No orders found
                </p>
              ) : (
                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <div
                      key={order._id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">
                            Order #{order._id}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                          {order.status !== "cancelled" &&
                            order.status !== "completed" && (
                              <button
                                className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                                onClick={() => handleCancelOrder(order._id)}
                              >
                                Cancel Order
                              </button>
                            )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-gray-600">Total: ${order.total}</p>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Items:</p>
                          <ul className="mt-1 space-y-1">
                            {order.products.map((item, index) => (
                              <li key={index} className="text-sm text-gray-700">
                                {item.product?.name || item.name} x{" "}
                                {item.quantity}
                              </li>
                            ))}
                          </ul>
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
