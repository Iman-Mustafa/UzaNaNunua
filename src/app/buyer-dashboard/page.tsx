"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  countInStock?: number;
  boughtAt?: string;
  orderId?: string;
  quantity?: number;
}

interface OrderRecord {
  id: string;
  date: string;
  totalPrice: number;
  status: 'Delivered' | 'In Transit' | 'Processing';
  items: ProductItem[];
  paymentMethod: string;
  shippingAddress: string;
}

interface UserSession {
  id: string;
  name: string;
  phone?: string;
  role: 'Seller' | 'Buyer';
}

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState<'liked' | 'cart' | 'orders'>('orders');
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [productsCatalog, setProductsCatalog] = useState<ProductItem[]>([]);
  const [likedProducts, setLikedProducts] = useState<ProductItem[]>([]);
  const [cartItems, setCartItems] = useState<{ product: ProductItem; quantity: number }[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [alreadyBoughtProducts, setAlreadyBoughtProducts] = useState<ProductItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Show notification toast
  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
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

  // Initial load & seed
  useEffect(() => {
    // 1. Fetch available products from API if available
    const loadProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((item: any) => ({
              id: item._id || item.id,
              name: item.name,
              price: item.price,
              description: item.description,
              category: item.category,
              image: item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60',
              countInStock: item.countInStock || 10,
            }));
            setProductsCatalog(mapped);
          }
        }
      } catch (e) {
        console.log('Error fetching catalog products:', e);
      }
    };

    loadProducts();

    // 2. Load from localStorage or initialize with rich realistic sample data
    try {
      const savedUser = localStorage.getItem('uzananunua_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }

      const savedLiked = localStorage.getItem('uzananunua_liked');
      const savedCart = localStorage.getItem('uzananunua_cart');
      const savedOrders = localStorage.getItem('uzananunua_orders');

      if (savedLiked) {
        setLikedProducts(JSON.parse(savedLiked));
      } else {
        // Initial liked sample items
        const initialLiked: ProductItem[] = [
          {
            id: 'demo-1',
            name: 'Sony WH-1000XM5 Wireless Headphones',
            price: 349.99,
            description: 'Industry-leading noise canceling wireless over-ear headphones with auto NC optimizer.',
            category: 'Electronics',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
            countInStock: 8,
          },
          {
            id: 'demo-2',
            name: 'Minimalist Titanium Quartz Watch',
            price: 189.5,
            description: 'Ultra-slim sapphire crystal water-resistant analog timepiece.',
            category: 'Accessories',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
            countInStock: 15,
          },
        ];
        setLikedProducts(initialLiked);
        localStorage.setItem('uzananunua_liked', JSON.stringify(initialLiked));
      }

      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        // Initial cart sample item
        const initialCart = [
          {
            product: {
              id: 'demo-3',
              name: 'Eco-Leather Ergonomic Office Chair',
              price: 229.0,
              description: 'Breathable high-back lumbar support workstation executive chair.',
              category: 'Home & Office',
              image: 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?w=600&auto=format&fit=crop&q=80',
              countInStock: 5,
            },
            quantity: 1,
          },
        ];
        setCartItems(initialCart);
        localStorage.setItem('uzananunua_cart', JSON.stringify(initialCart));
      }

      if (savedOrders) {
        const parsedOrders: OrderRecord[] = JSON.parse(savedOrders);
        setOrders(parsedOrders);
      } else {
        // Initial sample orders with already bought products
        const initialOrders: OrderRecord[] = [
          {
            id: 'ORD-89421',
            date: 'March 1, 2026',
            totalPrice: 419.98,
            status: 'Delivered',
            paymentMethod: 'Credit Card (**** 4242)',
            shippingAddress: '45 Uhuru Street, Dar es Salaam, Tanzania',
            items: [
              {
                id: 'demo-4',
                name: 'Apple MacBook Air M2 13-inch',
                price: 320.0,
                description: 'Supercharged by M2 chip, 8-core CPU, all-day battery life.',
                category: 'Electronics',
                image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
                boughtAt: 'March 1, 2026',
                orderId: 'ORD-89421',
                quantity: 1,
              },
              {
                id: 'demo-5',
                name: 'Organic Roast Arabica Coffee Beans (1kg)',
                price: 99.98,
                description: 'Single-origin premium roasted coffee beans from Mount Kilimanjaro slopes.',
                category: 'Groceries',
                image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
                boughtAt: 'March 1, 2026',
                orderId: 'ORD-89421',
                quantity: 2,
              },
            ],
          },
          {
            id: 'ORD-76110',
            date: 'February 18, 2026',
            totalPrice: 159.0,
            status: 'Delivered',
            paymentMethod: 'Mobile Money (M-Pesa)',
            shippingAddress: '12 Bagamoyo Rd, Dar es Salaam, Tanzania',
            items: [
              {
                id: 'demo-6',
                name: 'Handcrafted African Wax Print Tote Bag',
                price: 159.0,
                description: '100% genuine leather trim with vibrant authentic Kitenge fabric patterns.',
                category: 'Clothing',
                image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
                boughtAt: 'February 18, 2026',
                orderId: 'ORD-76110',
                quantity: 1,
              },
            ],
          },
        ];
        setOrders(initialOrders);
        localStorage.setItem('uzananunua_orders', JSON.stringify(initialOrders));
      }
    } catch (e) {
      console.error('Error loading localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Compute already bought products flat list from all orders
  useEffect(() => {
    const allBought: ProductItem[] = [];
    orders.forEach((order) => {
      order.items.forEach((item) => {
        allBought.push({
          ...item,
          boughtAt: item.boughtAt || order.date,
          orderId: item.orderId || order.id,
        });
      });
    });
    setAlreadyBoughtProducts(allBought);
  }, [orders]);

  // Sync states to LocalStorage
  const saveLiked = (newLiked: ProductItem[]) => {
    setLikedProducts(newLiked);
    localStorage.setItem('uzananunua_liked', JSON.stringify(newLiked));
  };

  const saveCart = (newCart: { product: ProductItem; quantity: number }[]) => {
    setCartItems(newCart);
    localStorage.setItem('uzananunua_cart', JSON.stringify(newCart));
  };

  const saveOrders = (newOrders: OrderRecord[]) => {
    setOrders(newOrders);
    localStorage.setItem('uzananunua_orders', JSON.stringify(newOrders));
  };

  // Helper: check if product was bought
  const isProductAlreadyBought = (productId: string, productName?: string) => {
    return alreadyBoughtProducts.some(
      (item) => item.id === productId || (productName && item.name.toLowerCase() === productName.toLowerCase())
    );
  };

  // Helper: check if product is in liked
  const isProductLiked = (productId: string) => {
    return likedProducts.some((p) => p.id === productId);
  };

  // Actions
  const toggleLike = (product: ProductItem) => {
    if (isProductLiked(product.id)) {
      const updated = likedProducts.filter((p) => p.id !== product.id);
      saveLiked(updated);
      showToast(`Removed "${product.name}" from Liked Products`);
    } else {
      const updated = [...likedProducts, product];
      saveLiked(updated);
      showToast(`Added "${product.name}" to Liked Products! ❤️`);
    }
  };

  const addToCart = (product: ProductItem) => {
    const existingIndex = cartItems.findIndex((ci) => ci.product.id === product.id);
    let updated;
    if (existingIndex > -1) {
      updated = [...cartItems];
      updated[existingIndex].quantity += 1;
    } else {
      updated = [...cartItems, { product, quantity: 1 }];
    }
    saveCart(updated);
    showToast(`Added "${product.name}" to MyCart! 🛒`);
  };

  const updateCartQty = (productId: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as { product: ProductItem; quantity: number }[];

    saveCart(updated);
  };

  const removeFromCart = (productId: string) => {
    const updated = cartItems.filter((item) => item.product.id !== productId);
    saveCart(updated);
    showToast('Item removed from cart');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    setIsCheckingOut(true);
    setTimeout(() => {
      const newOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      const purchasedItems: ProductItem[] = cartItems.map((ci) => ({
        ...ci.product,
        boughtAt: currentDate,
        orderId: newOrderId,
        quantity: ci.quantity,
      }));

      const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const newOrder: OrderRecord = {
        id: newOrderId,
        date: currentDate,
        totalPrice: total,
        status: 'Delivered',
        paymentMethod: 'Instant Online Pay',
        shippingAddress: 'Buyer Registered Address',
        items: purchasedItems,
      };

      const updatedOrders = [newOrder, ...orders];
      saveOrders(updatedOrders);
      saveCart([]);
      setIsCheckingOut(false);
      setActiveTab('orders');
      showToast('🎉 Order placed successfully! Check your bought items below.');
    }, 1200);
  };

  // Cart calculations
  const cartSubtotal = cartItems.reduce(
    (acc, curr) => acc + curr.product.price * curr.quantity,
    0
  );
  const cartItemCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  // Filtered lists for search
  const filteredLiked = likedProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBought = alreadyBoughtProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.orderId && p.orderId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-3"></div>
          <p className="text-slate-600 font-medium">Loading Buyer Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-blue-500 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-bounce transition-all">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400"></div>
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOP HEADER: Buyer Dashboard Brand + Navigation tabs (Liked, Cart, My Order) */}
      {/* ========================================================================= */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 group">
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  Uza<span className="text-blue-600">NaNunua</span>
                </span>
              </Link>
              <span className="hidden sm:inline-block text-slate-300 text-xl font-light">|</span>
              <div className="hidden sm:flex flex-col">
                <span className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  Buyer Dashboard
                </span>
                <span className="text-xs text-slate-500">Welcome back, Buyer</span>
              </div>
            </div>

            {/* HEADER TABS: Liked Products, MyCart, My Order */}
            <nav className="flex items-center space-x-1 sm:space-x-3 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
              {/* Liked Products Header Button */}
              <button
                id="header-tab-liked"
                onClick={() => setActiveTab('liked')}
                className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'liked'
                    ? 'bg-white text-rose-600 shadow-sm'
                    : 'text-slate-600 hover:text-rose-600 hover:bg-white/60'
                }`}
              >
                <svg
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'liked' ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`}
                  fill={activeTab === 'liked' ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="hidden md:inline">Liked Products</span>
                <span className="md:hidden">Liked</span>
                {likedProducts.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-full bg-rose-100 text-rose-700">
                    {likedProducts.length}
                  </span>
                )}
              </button>

              {/* MyCart Header Button */}
              <button
                id="header-tab-cart"
                onClick={() => setActiveTab('cart')}
                className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'cart'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-white/60'
                }`}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>MyCart</span>
                {cartItemCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-full bg-blue-600 text-white animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* My Order Header Button */}
              <button
                id="header-tab-orders"
                onClick={() => setActiveTab('orders')}
                className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'orders'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-white/60'
                }`}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <span>My Order</span>
                {orders.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                    {orders.length}
                  </span>
                )}
              </button>
            </nav>

            {/* Quick Actions / Link to All Products & Sell */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                href="/sell"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs"
              >
                <span>+ Sell Product</span>
              </Link>
              <Link
                href="/products"
                className="hidden lg:inline-flex items-center px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all shadow-xs"
              >
                Browse Catalog &rarr;
              </Link>

              {currentUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-xs sm:text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-xs"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* DASHBOARD HERO BANNER */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white py-8 sm:py-10 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-blue-200 mb-3 border border-white/15">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Official Buyer Portal
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Buyer Dashboard
              </h1>
              <p className="mt-2 text-sm sm:text-base text-blue-100 max-w-xl">
                Manage your wishlist, active cart items, order history, and track all your already bought products in one place.
              </p>
            </div>

            {/* Overview Quick Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/15">
              <div
                onClick={() => setActiveTab('liked')}
                className="cursor-pointer hover:bg-white/10 p-2.5 rounded-xl transition-colors text-center"
              >
                <div className="text-xl sm:text-2xl font-bold text-rose-300">{likedProducts.length}</div>
                <div className="text-[11px] sm:text-xs text-blue-100 font-medium">Liked Items</div>
              </div>
              <div
                onClick={() => setActiveTab('cart')}
                className="cursor-pointer hover:bg-white/10 p-2.5 rounded-xl transition-colors text-center border-x border-white/15"
              >
                <div className="text-xl sm:text-2xl font-bold text-blue-300">{cartItemCount}</div>
                <div className="text-[11px] sm:text-xs text-blue-100 font-medium">In Cart</div>
              </div>
              <div
                onClick={() => setActiveTab('orders')}
                className="cursor-pointer hover:bg-white/10 p-2.5 rounded-xl transition-colors text-center"
              >
                <div className="text-xl sm:text-2xl font-bold text-emerald-300">{alreadyBoughtProducts.length}</div>
                <div className="text-[11px] sm:text-xs text-blue-100 font-medium">Bought</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* SELLER MODE CALLOUT */}
        {String(currentUser?.role || '').toLowerCase() === 'seller' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
                💼
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-200">Seller Account Active</div>
                <div className="text-base font-bold text-white">
                  Welcome, {currentUser?.name}! Ready to list more products for sale?
                </div>
                <div className="text-xs text-slate-200">
                  Buyers are browsing the marketplace right now.
                </div>
              </div>
            </div>
            <Link
              href="/sell"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-800 font-black text-sm shadow-md hover:bg-emerald-50 transition-all hover:scale-102 flex-shrink-0"
            >
              <span>+ Open Product Listing Form</span>
              <span>&rarr;</span>
            </Link>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 1: LIKED PRODUCTS VIEW */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'liked' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
                    <svg className="w-6 h-6 fill-rose-500" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </span>
                  Liked Products
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Products you saved for later. You can quickly add them to your cart or review their details.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
                  {filteredLiked.length} Saved {filteredLiked.length === 1 ? 'Product' : 'Products'}
                </span>
                <Link
                  href="/products"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  + Explore More Products
                </Link>
              </div>
            </div>

            {filteredLiked.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800">No Liked Products Yet</h3>
                <p className="text-sm text-slate-500 mt-1.5 mb-6">
                  Browse products and click the heart button to save items to your wishlist.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md transition-all"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredLiked.map((product) => {
                  const bought = isProductAlreadyBought(product.id, product.name);
                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative"
                    >
                      {/* Image Preview */}
                      <div className="w-full h-52 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Top Right: Unlike button */}
                        <button
                          onClick={() => toggleLike(product)}
                          title="Remove from Liked"
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-md"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>

                        {/* Top Left: Category Badge */}
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide">
                          {product.category}
                        </span>

                        {/* SIGN: Already Bought Indicator Badge */}
                        {bought && (
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600/95 backdrop-blur-md text-white text-xs font-bold rounded-xl shadow-lg border border-emerald-400">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>✓ ALREADY BOUGHT</span>
                          </div>
                        )}
                      </div>

                      {/* Info & Actions */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-lg font-extrabold text-slate-900">
                            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                          </span>
                          <button
                            onClick={() => addToCart(product)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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
          </section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 2: MYCART VIEW */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'cart' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </span>
                  MyCart
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Review items in your shopping cart and complete your checkout.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
                  {cartItemCount} {cartItemCount === 1 ? 'Item' : 'Items'} in Cart
                </span>
                <Link
                  href="/products"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  + Add More Items
                </Link>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 mx-auto flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800">Your Cart is Empty</h3>
                <p className="text-sm text-slate-500 mt-1.5 mb-6">
                  You have not added any products to your cart yet.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md transition-all"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map(({ product, quantity }) => {
                    const bought = isProductAlreadyBought(product.id, product.name);
                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        {/* Image & Title */}
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 relative border border-slate-200/80">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                            {bought && (
                              <div className="absolute inset-x-0 bottom-0 bg-emerald-600 text-[10px] text-white text-center font-bold py-0.5">
                                ✓ Bought Before
                              </div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                                {product.category}
                              </span>
                              {bought && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                  <span>✓</span> In Purchase History
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">
                              {product.name}
                            </h3>
                            <p className="text-sm font-extrabold text-blue-600">
                              ${product.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>

                        {/* Quantity controls and item total */}
                        <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                          {/* Qty +/- */}
                          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                            <button
                              onClick={() => updateCartQty(product.id, -1)}
                              className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 transition font-bold shadow-xs"
                            >
                              -
                            </button>
                            <span className="w-9 text-center font-bold text-sm text-slate-800">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateCartQty(product.id, 1)}
                              className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 transition font-bold shadow-xs"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="text-base font-black text-slate-900">
                              ${(product.price * quantity).toFixed(2)}
                            </div>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="text-xs text-rose-500 hover:text-rose-700 hover:underline mt-0.5"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Summary & Checkout Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-6 sticky top-28">
                  <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({cartItemCount} items)</span>
                      <span className="font-semibold text-slate-800">${cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Standard Shipping</span>
                      <span className="font-semibold text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Estimated Taxes</span>
                      <span className="font-semibold text-slate-800">$0.00</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-extrabold text-slate-900">
                      <span>Total Amount</span>
                      <span className="text-xl text-blue-600">${cartSubtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-800 space-y-1">
                    <p className="font-semibold flex items-center gap-1.5">
                      <span>🛡️</span> Secure Instant Checkout
                    </p>
                    <p className="text-blue-600">
                      Once placed, products will be instantly delivered and added to your "Already Bought Products" history.
                    </p>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-75"
                  >
                    {isCheckingOut ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Purchase &rarr;</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 3: MY ORDER VIEW (WITH ALREADY BOUGHT PRODUCTS AT THE BOTTOM) */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'orders' && (
          <section className="space-y-10 animate-fadeIn">
            {/* My Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </span>
                  My Order
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Track your placed orders, invoices, delivery status, and view all your already bought products below.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {orders.length} Completed Orders
                </span>
                <a
                  href="#already-bought-section"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  ↓ Jump to Already Bought
                </a>
              </div>
            </div>

            {/* Orders Summary Cards */}
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800">No Orders Placed Yet</h3>
                <p className="text-sm text-slate-500 mt-1.5 mb-6">
                  When you purchase items from UzaNaNunua, they will appear here with delivery details.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md transition-all"
                >
                  Browse Store
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">
                    Recent Order History ({orders.length})
                  </h3>
                  <span className="text-xs text-slate-500">All orders are verified</span>
                </div>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      {/* Order Header bar */}
                      <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                        <div className="flex items-center space-x-4">
                          <div>
                            <span className="text-slate-500 font-medium">Order ID: </span>
                            <span className="font-bold text-slate-900">{order.id}</span>
                          </div>
                          <span className="text-slate-300">|</span>
                          <div>
                            <span className="text-slate-500 font-medium">Date: </span>
                            <span className="font-semibold text-slate-700">{order.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            {order.status}
                          </span>
                          <span className="text-base font-extrabold text-slate-900">
                            ${order.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Items inside this order */}
                      <div className="p-6 divide-y divide-slate-100">
                        {order.items.map((item, idx) => (
                          <div
                            key={`${order.id}-${item.id}-${idx}`}
                            className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 relative">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                    {item.category}
                                  </span>
                                  {/* Prominent Already Bought Badge */}
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span>✓</span> Already Bought
                                  </span>
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                                  {item.name}
                                </h4>
                                <p className="text-xs text-slate-500">
                                  Qty: {item.quantity || 1} &bull; ${item.price.toFixed(2)} each
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                              <button
                                onClick={() => addToCart(item)}
                                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition"
                              >
                                Buy Again
                              </button>
                              <button
                                onClick={() => toggleLike(item)}
                                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
                                title="Add to Liked"
                              >
                                <svg
                                  className={`w-4 h-4 ${isProductLiked(item.id) ? 'fill-rose-500 text-rose-500' : 'text-current'}`}
                                  fill={isProductLiked(item.id) ? 'currentColor' : 'none'}
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* BOTTOM OF MY ORDER: DEDICATED ALREADY BOUGHT PRODUCTS LIST */}
            {/* With prominent "✓ ALREADY BOUGHT" SIGN / BADGE INDICATOR */}
            {/* =================================================================== */}
            <div
              id="already-bought-section"
              className="mt-14 pt-10 border-t-2 border-slate-200 space-y-6"
            >
              <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-emerald-500/10 blur-2xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-xs font-bold text-emerald-300 mb-2 border border-emerald-500/30">
                      <span>✓</span> PURCHASE HISTORY CATALOG
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                      Already Bought Products
                    </h3>
                    <p className="mt-1 text-sm text-emerald-100 max-w-2xl">
                      Here is the complete aggregated list of all items you have already purchased on UzaNaNunua. Each item shows a verified sign that confirms you have already bought it.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-emerald-950/60 p-3 rounded-2xl border border-emerald-500/30">
                    <div className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xl">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs text-emerald-300 font-medium">Total Products Bought</div>
                      <div className="text-xl font-bold text-white">
                        {alreadyBoughtProducts.length} Items Purchased
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Already Bought Products Grid */}
              {filteredBought.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
                  No purchased products found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredBought.map((product, index) => (
                    <div
                      key={`bought-${product.id}-${index}`}
                      className="bg-white rounded-2xl border-2 border-emerald-400/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative group"
                    >
                      {/* PROMINENT "ALREADY BOUGHT" SIGN / BADGE ON TOP OF CARD */}
                      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3.5 py-1.5 text-xs font-black tracking-wide flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 fill-white" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>ALREADY BOUGHT</span>
                        </div>
                        <span className="text-[10px] bg-emerald-950/40 px-2 py-0.5 rounded-full font-medium text-emerald-100">
                          {product.boughtAt || 'Purchased'}
                        </span>
                      </div>

                      {/* Product Image */}
                      <div className="w-full h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Order ID sticker */}
                        {product.orderId && (
                          <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-mono">
                            Ref: {product.orderId}
                          </span>
                        )}

                        {/* Verified Purchase Watermark Sign Icon */}
                        <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white rounded-full p-1 shadow-md">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              {product.category}
                            </span>
                            <span>Qty: {product.quantity || 1}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-emerald-700 transition-colors">
                            {product.name}
                          </h4>
                          <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        {/* Price & Reorder Actions */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Paid</span>
                            <span className="text-base font-black text-slate-900">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => addToCart(product)}
                              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Buy Again
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

      </main>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-white border-t border-slate-200 mt-20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">UzaNaNunua</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-6">
            <button onClick={() => setActiveTab('liked')} className="hover:text-blue-600">Liked Products</button>
            <button onClick={() => setActiveTab('cart')} className="hover:text-blue-600">MyCart</button>
            <button onClick={() => setActiveTab('orders')} className="hover:text-blue-600">My Order</button>
            <Link href="/products" className="hover:text-blue-600">Product Catalog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
