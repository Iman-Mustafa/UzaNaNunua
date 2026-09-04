"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  countInStock: number;
}

interface UserSession {
  id: string;
  name: string;
  phone?: string;
  role: 'Seller' | 'Buyer';
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [boughtIds, setBoughtIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('uzananunua_user');
      setCurrentUser(null);
      showToast('Logged out successfully');
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // Read local user & buyer storage
    try {
      const savedUser = localStorage.getItem('uzananunua_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }

      const savedOrders = localStorage.getItem('uzananunua_orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        const ids: string[] = [];
        parsed.forEach((order: any) => {
          order.items?.forEach((item: any) => {
            if (item.id) ids.push(item.id);
            if (item.name) ids.push(item.name.toLowerCase());
          });
        });
        setBoughtIds(ids);
      }

      const savedLiked = localStorage.getItem('uzananunua_liked');
      if (savedLiked) {
        const parsedLiked = JSON.parse(savedLiked);
        setLikedIds(parsedLiked.map((item: any) => item.id));
      }

      const savedCart = localStorage.getItem('uzananunua_cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        const count = parsedCart.reduce((sum: number, c: any) => sum + (c.quantity || 1), 0);
        setCartCount(count);
      }
    } catch (e) {
      console.error('Error reading localStorage in products page:', e);
    }

    const fetchProducts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(`${API_URL}/api/products`);
        
        const contentType = response.headers.get('content-type');
        let data: any = null;
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        }

        if (!response.ok) {
          const errorMsg = data?.message || `Failed to fetch products (Status: ${response.status})`;
          throw new Error(errorMsg);
        }

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const isBought = (product: Product) => {
    return boughtIds.includes(product._id) || boughtIds.includes(product.name.toLowerCase());
  };

  const isLiked = (product: Product) => {
    return likedIds.includes(product._id);
  };

  const handleToggleLike = (product: Product) => {
    try {
      const savedLiked = localStorage.getItem('uzananunua_liked');
      let currentLiked = savedLiked ? JSON.parse(savedLiked) : [];
      const itemObj = {
        id: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        countInStock: product.countInStock,
      };

      if (isLiked(product)) {
        currentLiked = currentLiked.filter((item: any) => item.id !== product._id);
        setLikedIds(likedIds.filter((id) => id !== product._id));
        showToast(`Removed "${product.name}" from Liked Products`);
      } else {
        currentLiked.push(itemObj);
        setLikedIds([...likedIds, product._id]);
        showToast(`Added "${product.name}" to Liked Products! ❤️`);
      }
      localStorage.setItem('uzananunua_liked', JSON.stringify(currentLiked));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToCart = (product: Product) => {
    try {
      const savedCart = localStorage.getItem('uzananunua_cart');
      let currentCart = savedCart ? JSON.parse(savedCart) : [];
      const itemObj = {
        id: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        countInStock: product.countInStock,
      };

      const existingIndex = currentCart.findIndex((ci: any) => ci.product?.id === product._id);
      if (existingIndex > -1) {
        currentCart[existingIndex].quantity += 1;
      } else {
        currentCart.push({ product: itemObj, quantity: 1 });
      }

      localStorage.setItem('uzananunua_cart', JSON.stringify(currentCart));
      const totalCount = currentCart.reduce((sum: number, c: any) => sum + (c.quantity || 1), 0);
      setCartCount(totalCount);
      showToast(`Added "${product.name}" to MyCart! 🛒`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center space-x-3 text-sm font-medium border border-slate-700 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header with Products Title/Brand, Seller Action, Buyer Dashboard, Login/User Profile */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <BackButton fallbackUrl="/" label="Back" title="Back to previous page" />
              <Link href="/" className="text-xl font-bold text-gray-900">
                Uza<span className="text-blue-600">NaNunua</span>
              </Link>
              <span className="text-gray-300">|</span>
              <span className="text-base font-semibold text-gray-800">
                Products
              </span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* PRIMARY SELLER ACTION: Always accessible link to Product Form */}
              <Link
                href="/sell"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all hover:scale-102"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>+ Sell Product</span>
              </Link>

              {/* Direct Link to Buyer Dashboard */}
              <Link
                href="/buyer-dashboard"
                className="inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-xl border border-slate-200 transition-all shadow-xs"
              >
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Buyer Dashboard</span>
                <span className="sm:hidden">Buyer</span>
                {cartCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px]">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Authentication Status or Login/Signup */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                    <span>{currentUser.role === 'Seller' ? '💼' : '🛍️'}</span>
                    <span className="max-w-[120px] truncate">{currentUser.name}</span>
                    <span className="text-[10px] text-blue-600 font-bold px-1 rounded bg-blue-50">
                      {currentUser.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-xs sm:text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <Link
                    href="/login"
                    className="px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-xs"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-3 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    SignUp
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
        {/* SELLER MODE BANNER: Displays prominently if logged in as a seller */}
        {currentUser?.role === 'Seller' && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl">
                💼
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-100">Seller Mode Active</div>
                <div className="text-sm sm:text-base font-bold">
                  Welcome back, {currentUser.name}! You are signed in as a Seller.
                </div>
              </div>
            </div>
            <Link
              href="/sell"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-extrabold text-sm shadow-sm hover:bg-emerald-50 transition-all hover:scale-102"
            >
              <span>+ Open Product Information Form</span>
              <span>&rarr;</span>
            </Link>
          </div>
        )}

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Available Products
            </h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600">
              Browse items listed by sellers in our marketplace. Items you already bought are marked with a green sign.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/sell"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all"
            >
              <span>+ List New Product</span>
            </Link>

            <Link
              href="/buyer-dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all"
            >
              <span>Open Buyer Portal &rarr;</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-lg text-gray-500">Loading products...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center text-red-700 max-w-lg mx-auto">
            <p className="font-semibold">Unable to load products</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white shadow-sm rounded-xl border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <p className="text-xl font-medium text-gray-700">No products uploaded yet.</p>
            <p className="text-sm text-gray-500 mt-1">Visit Buyer Dashboard to explore your orders and saved items.</p>
            <div className="mt-4">
              <Link
                href="/buyer-dashboard"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Go to Buyer Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const bought = isBought(product);
              const liked = isLiked(product);
              return (
                <div
                  key={product._id}
                  className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col relative"
                >
                  {/* Product Image */}
                  <div className="w-full h-56 bg-gray-100 overflow-hidden relative flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}

                    {/* Like Button */}
                    <button
                      onClick={() => handleToggleLike(product)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                        liked
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/90 text-slate-600 hover:text-rose-500'
                      }`}
                      title={liked ? 'Unlike product' : 'Like product'}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    {/* SIGN: PROMINENT "ALREADY BOUGHT" INDICATOR */}
                    {bought && (
                      <div className="absolute bottom-2 left-2 right-2 bg-emerald-600/95 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center justify-center gap-1 border border-emerald-400">
                        <span>✓ ALREADY BOUGHT</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-base font-bold text-blue-600 whitespace-nowrap">
                          ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                        </p>
                      </div>
                      <p className="mt-2 text-xs sm:text-sm text-gray-500 line-clamp-2 flex-1">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium text-xs bg-blue-50 text-blue-700">
                        {product.category}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
