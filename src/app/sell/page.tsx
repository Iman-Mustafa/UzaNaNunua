"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserSession {
  id: string;
  name: string;
  phone?: string;
  role: 'Seller' | 'Buyer';
}

export default function SellPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [publishedProduct, setPublishedProduct] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    category: '', // Type of product (Electronics, Clothes, Shoes, Wearables, Phones, etc.)
    name: '',     // Name of product
    price: '',    // Price
    countInStock: '', // Quantity available
    description: '',  // Description
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem('uzananunua_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('uzananunua_user');
      setCurrentUser(null);
      router.push('/login');
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      name: '',
      price: '',
      countInStock: '',
      description: '',
    });
    setImage(null);
    setImagePreview('');
    setSuccess('');
    setPublishedProduct(null);
    setError('');
  };

  const categories = [
    { value: 'Electronics', label: 'Electronics', icon: '⚡' },
    { value: 'Clothes', label: 'Clothes', icon: '👕' },
    { value: 'Shoes', label: 'Shoes', icon: '👟' },
    { value: 'Wearables', label: 'Wearables', icon: '⌚' },
    { value: 'Phones', label: 'Phones', icon: '📱' },
    { value: 'Home & Living', label: 'Home & Living', icon: '🏡' },
    { value: 'Sports & Fitness', label: 'Sports & Fitness', icon: '⚽' },
    { value: 'Other', label: 'Other', icon: '📦' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.category) {
      setError('Please select the type of product (category).');
      setLoading(false);
      return;
    }

    if (!formData.name.trim()) {
      setError('Please enter the name of the product.');
      setLoading(false);
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid product price.');
      setLoading(false);
      return;
    }

    if (!formData.countInStock || parseInt(formData.countInStock, 10) < 1) {
      setError('Please enter a valid quantity available.');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Please provide a description for the product.');
      setLoading(false);
      return;
    }

    if (!image) {
      setError('Please upload an image for your product.');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('category', formData.category);
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('countInStock', formData.countInStock);
      data.append('description', formData.description);
      data.append('image', image);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        body: data,
      });

      const contentType = response.headers.get('content-type');
      let responseData: any = null;
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      }

      if (!response.ok) {
        const errorMsg = responseData?.message || `Server error (${response.status}): Failed to save product.`;
        throw new Error(errorMsg);
      }

      setPublishedProduct(responseData || { name: formData.name });
      setSuccess(`🎉 Product "${formData.name}" submitted successfully! It is now live on the marketplace.`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while listing the product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 group">
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  Uza<span className="text-blue-600">NaNunua</span>
                </span>
              </Link>
              <span className="hidden sm:inline-block text-slate-300 text-lg">|</span>
              <div className="hidden sm:flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Seller Portal
                </span>
                <span className="text-xs text-slate-500 font-medium">Add New Product</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                href="/products"
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>Browse Marketplace</span>
                <span>&rarr;</span>
              </Link>
              <Link
                href="/buyer-dashboard"
                className="hidden md:inline-flex px-3.5 py-2 text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
              >
                Buyer Dashboard
              </Link>

              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                    <span>💼</span>
                    <span className="max-w-[120px] truncate">{currentUser.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-xs sm:text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Link
                    href="/login"
                    className="px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-xs"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Header Section */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-emerald-300 mb-3 border border-white/15">
            <span>💼</span> SELLER PRODUCT LISTING FORM
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {currentUser ? `Welcome, ${currentUser.name}! List a Product` : 'List a Product for Sale'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Provide the product details below. Once submitted, your item will be immediately published and visible to buyers on the marketplace.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full py-10 px-4 sm:px-6 lg:px-8">
        {/* Notifications & Post-Publish Actions */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-2xl shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-red-500 text-xl font-bold">⚠️</span>
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-8 bg-emerald-50 border-2 border-emerald-300 p-6 rounded-3xl shadow-sm text-emerald-900 space-y-4 animate-fadeIn">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎉</span>
              <div>
                <h3 className="font-black text-lg text-emerald-950">Product Successfully Listed!</h3>
                <p className="text-sm font-medium text-emerald-800">{success}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>+ List Another Product</span>
              </button>
              <Link
                href="/products"
                className="px-5 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>View in Marketplace &rarr;</span>
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ================================================================= */}
            {/* LEFT COLUMN: PRODUCT INFORMATION FORM FIELDS */}
            {/* ================================================================= */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  Product Details
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete all fields accurately to attract interested buyers.
                </p>
              </div>

              {/* 1. TYPE OF PRODUCT (CATEGORY DROPDOWN WITH ARROW) */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center justify-between"
                >
                  <span>Type of Product (Category) <span className="text-rose-500">*</span></span>
                  <span className="text-xs text-blue-600 font-normal">Select category</span>
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-4 pr-10 py-3 text-sm font-medium text-slate-800 bg-slate-50/80 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="" disabled>
                      -- Select Type of Product --
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>

                  {/* Dropdown Arrow Icon */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                    <svg
                      className="w-5 h-5 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Categories: Electronics, Clothes, Shoes, Wearables, Phones, etc.
                </p>
              </div>

              {/* 2. NAME OF PRODUCT */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-slate-800 mb-1.5"
                >
                  Name of Product <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. iPhone 15 Pro Max 256GB / Nike Air Zoom"
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* 3. PRICE & QUANTITY AVAILABLE (SIDE BY SIDE) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-bold text-slate-800 mb-1.5"
                  >
                    Price ($ USD) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 font-bold text-sm">
                      $
                    </div>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      required
                      min="0.01"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="appearance-none block w-full pl-8 pr-4 py-3 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Quantity Available */}
                <div>
                  <label
                    htmlFor="countInStock"
                    className="block text-sm font-bold text-slate-800 mb-1.5"
                  >
                    Quantity Available <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="countInStock"
                    id="countInStock"
                    required
                    min="1"
                    step="1"
                    value={formData.countInStock}
                    onChange={handleChange}
                    placeholder="e.g. 10"
                    className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* 4. DESCRIPTION */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-bold text-slate-800 mb-1.5"
                >
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product specifications, condition, features, warranty, and package contents..."
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* ================================================================= */}
            {/* RIGHT COLUMN: IMAGE UPLOAD & LIVE MARKETPLACE PREVIEW */}
            {/* ================================================================= */}
            <div className="lg:col-span-5 space-y-6">
              {/* IMAGE UPLOAD CARD */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-base">
                    Image of Product <span className="text-rose-500">*</span>
                  </h3>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-700"
                    >
                      Remove Image
                    </button>
                  )}
                </div>

                <div className="mt-1">
                  {imagePreview ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
                      <img
                        src={imagePreview}
                        alt="Product Preview"
                        className="w-full h-56 object-contain p-2"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label
                          htmlFor="image-upload-change"
                          className="cursor-pointer px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-lg hover:bg-slate-100 transition"
                        >
                          Change Image
                          <input
                            id="image-upload-change"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-52 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-400 transition-all p-4 text-center group"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        Click or drag to upload product image
                      </span>
                      <span className="text-xs text-slate-400 mt-1">
                        PNG, JPG, JPEG, WEBP up to 10MB
                      </span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* LIVE MARKETPLACE CARD PREVIEW */}
              <div className="bg-slate-100/80 p-5 rounded-3xl border border-slate-200">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider">
                    Live Marketplace Card Preview
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    Products Page View
                  </span>
                </div>

                {/* Simulated product card as it will appear on /products */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="w-full h-44 bg-slate-100 flex items-center justify-center overflow-hidden relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-slate-400 p-4">
                        <svg className="w-8 h-8 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs">Image will show here</span>
                      </div>
                    )}
                    {formData.category && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-semibold">
                        {formData.category}
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                        {formData.name || 'Product Title Placeholder'}
                      </h4>
                      <span className="text-sm font-extrabold text-blue-600 whitespace-nowrap">
                        ${formData.price ? parseFloat(formData.price).toFixed(2) : '0.00'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {formData.description || 'Your product description will be displayed here for buyers to read.'}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="text-emerald-700 font-medium">
                        Stock: <strong>{formData.countInStock || '0'}</strong> units
                      </span>
                      <span className="text-[11px] text-blue-600 font-semibold">
                        Ready to Sell
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold text-base shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Publishing to Marketplace...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Product to Marketplace &rarr;</span>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-2">
                  Once published, buyers can immediately view, like, and purchase this product.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
