'use client';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../../redux/cartSlice';
import { useState } from 'react';

export default function Cart() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  console.log(cartItems,"cartItems");
  
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const token = useSelector((state) => state.auth.token) || (typeof window !== 'undefined' && localStorage.getItem('token'));
  const [showThankYou, setShowThankYou] = useState(false);

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id, quantity) => {
    console.log(id,quantity,"id,quantity");
    
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity: parseInt(quantity) }));
    } else {
      dispatch(removeFromCart(id));
    }
  };

  const handleProceedToCheckout = async () => {
    if (!token) {
      router.push('/login');
      return;
    }
    const products = cartItems.map(item => ({
      product: item._id || item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      category: item.category,
    }));
    try {
      const res = await fetch('http://localhost:5000/api/users/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ products, total: totalAmount }),
      });
      if (res.ok) {
        setShowThankYou(true);
        dispatch(clearCart());
      } else {
        const data = await res.json();
        alert(data.msg || 'Order failed');
      }
    } catch (err) {
      alert('Order failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold text-purple-600">Store</span>
          </div>
          <div className="flex items-center space-x-8 ml-auto">
            <button
              onClick={() => router.push('/login')}
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/cart')}
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-4xl font-bold text-gray-800">Shopping Cart</h1>
            </div>
          </div>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Your cart is empty</p>
              <button
                onClick={() => router.push('/products')}
                className="mt-4 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-2">
                {cartItems.map((item, idx) => (
                  <div key={item._id || idx} className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-20 w-20 bg-gray-200 rounded"></div>
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-gray-600">{item.category}</p>
                          <p className="text-purple-600 font-bold">${item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            className="px-2 py-1 border rounded hover:bg-gray-100"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            className="w-16 text-center border rounded"
                          />
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            className="px-2 py-1 border rounded hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-colors" onClick={handleProceedToCheckout}>
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showThankYou && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">Thank You!</h2>
            <p className="mb-4">Your order has been placed successfully.</p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700" onClick={() => { setShowThankYou(false); router.push('/'); }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 