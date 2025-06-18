"use client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectCartTotalQuantity } from "@/redux/slices/cartSlice";
import { selectToken, logout } from "@/redux/slices/authSlice";

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const totalQuantity = useSelector(selectCartTotalQuantity);
  const token = useSelector(selectToken);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    router.push("/login");
  };

  return token ? (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="mx-auto px-4 py-4 flex items-center">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-xl font-bold text-purple-600">Store</span>
        </div>
        {/* Navigation Icons - Moved to right */}
        <div className="flex items-center space-x-8 ml-auto">
          <button
            onClick={() => router.push("/profile")}
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            Logout
          </button>
          <button
            onClick={() => router.push("/cart")}
            className="text-gray-600 hover:text-purple-600 transition-colors relative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  ) : (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="mx-auto px-4 py-4 flex items-center">
        <div className="flex items-center">
          <span className="text-xl font-bold text-purple-600">Store</span>
        </div>
        <div className="flex items-center space-x-8 ml-auto">
          <button
            onClick={() => router.push("/login")}
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
