"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [boughtIds, setBoughtIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [authPrompt, setAuthPrompt] = useState<{
    isOpen: boolean;
    type: 'seller' | 'buyer';
    action?: 'dashboard' | 'buy' | 'like';
    productName?: string;
  }>({ isOpen: false, type: 'buyer', action: 'dashboard' });

  const handleSellerClick = (e: React.MouseEvent) => {
    if (!currentUser) {
      e.preventDefault();
      setAuthPrompt({ isOpen: true, type: 'seller', action: 'dashboard' });
    }
  };

  const handleBuyerClick = (e: React.MouseEvent) => {
    if (!currentUser) {
      e.preventDefault();
      setAuthPrompt({ isOpen: true, type: 'buyer', action: 'dashboard' });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('uzananunua_user');
      setCurrentUser(null);
      setLikedIds([]);
      setCartCount(0);
      setBoughtIds([]);
      router.push('/');
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
          const ids: string[] = [];
          parsedLiked.forEach((item: any) => {
            if (item.id) ids.push(String(item.id));
            if (item._id) ids.push(String(item._id));
            if (item.name) ids.push(item.name.toLowerCase().trim());
          });
          setLikedIds(ids);
        }

        const savedCart = localStorage.getItem('uzananunua_cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          const count = parsedCart.reduce((sum: number, c: any) => sum + (c.quantity || 1), 0);
          setCartCount(count);
        }
      } else {
        setCurrentUser(null);
        setLikedIds([]);
        setCartCount(0);
        setBoughtIds([]);
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
    const prodId = String(product._id || (product as any).id || '');
    const prodName = product.name ? product.name.toLowerCase().trim() : '';
    return likedIds.some(
      (id) => id === prodId || (prodName && id === prodName)
    );
  };

  const handleToggleLike = (product: Product) => {
    if (!currentUser) {
      setAuthPrompt({
        isOpen: true,
        type: 'buyer',
        action: 'like',
        productName: product.name,
      });
      return;
    }

    try {
      const savedLiked = localStorage.getItem('uzananunua_liked');
      let currentLiked = savedLiked ? JSON.parse(savedLiked) : [];
      const prodId = String(product._id || (product as any).id || '');
      const prodName = product.name ? product.name.toLowerCase().trim() : '';

      const itemObj = {
        id: prodId,
        _id: prodId,
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        countInStock: product.countInStock,
      };

      if (isLiked(product)) {
        currentLiked = currentLiked.filter((item: any) => {
          const itemId = String(item.id || item._id || '');
          const itemName = item.name ? item.name.toLowerCase().trim() : '';
          return itemId !== prodId && itemName !== prodName;
        });
        setLikedIds((prev) =>
          prev.filter((id) => id !== prodId && id !== prodName)
        );
        showToast(`Removed "${product.name}" from Liked Products`);
      } else {
        currentLiked.push(itemObj);
        setLikedIds((prev) => [...prev, prodId, ...(prodName ? [prodName] : [])]);
        showToast(`Added "${product.name}" to Liked Products! ❤️`);
      }
      localStorage.setItem('uzananunua_liked', JSON.stringify(currentLiked));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!currentUser) {
      setAuthPrompt({
        isOpen: true,
        type: 'buyer',
        action: 'buy',
        productName: product.name,
      });
      return;
    }

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
              {/* PRIMARY SELLER ACTION: Only visible for sellers / non-buyers */}
              {String(currentUser?.role || '').toLowerCase() !== 'buyer' && (
                <Link
                  href="/sell"
                  onClick={handleSellerClick}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all hover:scale-102"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="hidden sm:inline">Seller Dashboard</span>
                  <span className="sm:hidden">Seller</span>
                </Link>
              )}

              {/* Direct Link to Buyer Dashboard */}
              <Link
                href="/buyer-dashboard"
                onClick={handleBuyerClick}
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

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Available Products
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Browse items listed by sellers in our marketplace. Items you already bought are marked with a green sign.
          </p>
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
                onClick={handleBuyerClick}
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
                      id={`like-btn-${product._id}`}
                      onClick={() => handleToggleLike(product)}
                      className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-md ${
                        liked
                          ? 'bg-rose-600 text-white shadow-rose-500/40 ring-2 ring-rose-400 scale-105'
                          : 'bg-white/90 text-slate-400 hover:text-rose-600 hover:bg-white border border-slate-200/80 shadow-sm'
                      }`}
                      title={liked ? 'Liked! Click to unlike' : 'Like product'}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          liked ? 'fill-white stroke-white scale-110' : 'fill-none stroke-current stroke-2'
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
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
                          TZS {typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
                        </p>
                      </div>
                      <p className="mt-2 text-xs sm:text-sm text-gray-500 line-clamp-2 flex-1">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium text-xs bg-blue-50 text-blue-700 truncate">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {/* Interactive Like button on the product card */}
                        <button
                          id={`like-btn-action-${product._id}`}
                          onClick={() => handleToggleLike(product)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1 border shadow-xs ${
                            liked
                              ? 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-rose-500/20 ring-1 ring-rose-300'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                          }`}
                          title={liked ? 'Liked! Click to remove' : 'Like this product'}
                        >
                          <svg
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              liked ? 'fill-white stroke-white scale-110' : 'fill-none stroke-current stroke-2'
                            }`}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span>{liked ? 'Liked' : 'Like'}</span>
                        </button>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1 shrink-0"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                          </svg>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Auth Prompt Modal for unauthenticated users */}
      {authPrompt.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 text-center relative">
            {/* Close Button */}
            <button
              onClick={() => setAuthPrompt({ ...authPrompt, isOpen: false })}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-inner ${
                authPrompt.action === 'like'
                  ? 'bg-rose-50 text-rose-500 border border-rose-200'
                  : authPrompt.type === 'seller'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-blue-50 text-blue-600 border border-blue-200'
              }`}
            >
              {authPrompt.action === 'like'
                ? '❤️'
                : authPrompt.action === 'buy'
                ? '🛒'
                : authPrompt.type === 'seller'
                ? '💼'
                : '🛍️'}
            </div>

            {/* Title & Badge */}
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                  authPrompt.action === 'like'
                    ? 'bg-rose-50 text-rose-700 border border-rose-100'
                    : authPrompt.action === 'buy'
                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                    : authPrompt.type === 'seller'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-blue-50 text-blue-700 border border-blue-100'
                }`}
              >
                {authPrompt.action === 'like'
                  ? 'Sign In to Like / Save'
                  : authPrompt.action === 'buy'
                  ? 'Sign In to Buy'
                  : authPrompt.type === 'seller'
                  ? 'Seller Portal Access'
                  : 'Buyer Dashboard Access'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {authPrompt.action === 'like'
                  ? 'Please Log In to Like Products'
                  : authPrompt.action === 'buy'
                  ? 'Please Log In to Buy Products'
                  : 'Please Log In First'}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {authPrompt.action === 'like'
                  ? `You must log in or register before you can like "${
                      authPrompt.productName || 'products'
                    }" or save items to your wishlist.`
                  : authPrompt.action === 'buy'
                  ? `You must log in or register before you can add "${
                      authPrompt.productName || 'products'
                    }" to your cart or purchase products.`
                  : authPrompt.type === 'seller'
                  ? 'To access the Seller Dashboard and list your products for sale, please log in or register with a Seller account.'
                  : 'To access the Buyer Dashboard and view your wishlist, orders, and cart, please log in or register with a Buyer account.'}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <Link
                href={
                  authPrompt.action === 'like'
                    ? '/login?redirect=/products&message=Please log in to like products and save items to your wishlist'
                    : authPrompt.action === 'buy'
                    ? '/login?redirect=/products&message=Please log in to add items to your cart and buy products'
                    : authPrompt.type === 'seller'
                    ? '/login?redirect=/sell&message=Please log in to access the Seller Dashboard'
                    : '/login?redirect=/buyer-dashboard&message=Please log in to access your Buyer Dashboard'
                }
                className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  authPrompt.action === 'like'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : authPrompt.type === 'seller'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <span>Log In to Continue</span>
                <span>&rarr;</span>
              </Link>
              <Link
                href={`/signup?role=${authPrompt.type === 'seller' ? 'Seller' : 'Buyer'}`}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all flex items-center justify-center"
              >
                Register as {authPrompt.type === 'seller' ? 'Seller' : 'Buyer'}
              </Link>
              <button
                type="button"
                onClick={() => setAuthPrompt({ ...authPrompt, isOpen: false })}
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cancel / Keep Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
