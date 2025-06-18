'use client';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { selectCartTotalQuantity } from '@/redux/slices/cartSlice';
import { selectToken, logout } from '@/redux/slices/authSlice';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const totalQuantity = useSelector(selectCartTotalQuantity);
  const token = useSelector(selectToken);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState(null);

  useEffect(() => {
    // if (!token) return;
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/categoriesForUser', {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoadingFeatured(true);
      setErrorFeatured(null);
      try {
        const response = await fetch('http://localhost:5000/api/users/feature-products', {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch featured products');
        }
        const data = await response.json();
        setFeaturedProducts(data);
      } catch (err) {
        setErrorFeatured(err.message);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleCategoryClick = (category) => {
    router.push(`/products?category=${category.toLowerCase()}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="mx-auto px-4 py-4 flex items-center">
          {/* Logo */}
          <div className="flex items-center">
            {/* <Image
              src="/logo.png"
              alt="Store Logo"
              width={40}
              height={40}
              className="cursor-pointer"
              onClick={() => router.push('/')}
            /> */}
            <span className="text-xl font-bold text-purple-600">Store</span>
          </div>

          {/* Navigation Icons - Moved to right */}
          <div className="flex items-center space-x-8 ml-auto">
            {token ? (
              <>
                <button
                  onClick={() => router.push('/profile')}
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
              </>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Login
              </button>
            )}
            <button
              onClick={() => router.push('/cart')}
              className="text-gray-600 hover:text-purple-600 transition-colors relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
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

      {/* Add padding-top to account for fixed header */}
      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-4">Welcome to Our Store</h1>
            <p className="text-xl mb-8">Discover amazing products at great prices</p>
            <button 
              onClick={() => router.push('/products')}
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-100 transition-colors"
            >
              Shop Now
            </button>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          {loading ? (
            <div className="text-center">Loading categories...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category) => (
                <div 
                  key={category._id}
                  onClick={() => handleCategoryClick(category.name)}
                  className="relative h-64 rounded-lg overflow-hidden group cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={category.name}
                      layout="fill"
                      objectFit="cover"
                      className="absolute inset-0"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h3 className="text-2xl font-semibold mb-2">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-center px-4">{category.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Featured Products Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
            {loadingFeatured ? (
              <div className="text-center">Loading featured products...</div>
            ) : errorFeatured ? (
              <div className="text-center text-red-500">{errorFeatured}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {featuredProducts.map((product) => (
                  <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 relative">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                          className="absolute inset-0"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          Product Image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-2">{product.category}</p>
                      <p className="text-purple-600 font-bold mb-4">${product.price}</p>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        {/* <section className="py-16 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Join Our Community</h2>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => router.push('/login')}
                className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => router.push('/register')}
                className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-colors"
              >
                Register
              </button>
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
}
