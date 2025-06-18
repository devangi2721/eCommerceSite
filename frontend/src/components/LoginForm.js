"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  setCredentials,
  setLoading,
  setError,
  selectCurrentUser,
} from "@/redux/slices/authSlice";
import { BASE_URL } from "../app/constants/constant";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "user";
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const user = useSelector(selectCurrentUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user && user.role === "admin") {
      router.push("/admin/dashboard");
    }
    // You can add other role-based redirects here
  }, [user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(setError(null));
    dispatch(setLoading(true));

    try {
      // Login API call
      const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        throw new Error(loginData.msg || "Login failed");
      }

      // Store token in localStorage
      localStorage.setItem("token", loginData.token);

      // Fetch user details
      const userRes = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${loginData.token}`,
        },
      });
      const userData = await userRes.json();

      if (!userRes.ok) {
        throw new Error("Failed to fetch user details");
      }

      // Store token and user details in Redux
      dispatch(
        setCredentials({
          token: loginData.token,
          user: userData,
        })
      );

      // Redirect based on role
      console.log(userData.role, "userData.role");

      if (userData.role == "admin") {
        console.log("hiiiiii");
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Login
      </h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-purple-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      {mode === "user" && (
        <p className="mt-4 text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Register
          </a>
        </p>
      )}
    </div>
  );
}
