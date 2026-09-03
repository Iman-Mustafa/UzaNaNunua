"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'Seller', // default role or Buyer
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please check again.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          role: formData.role,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }

      // If registered as Seller, open the Sell / Product Listing page!
      if (formData.role === 'Seller') {
        setSuccess('Seller registered successfully! Opening product listing page...');
        setTimeout(() => {
          router.push('/sell');
        }, 1200);
      } else {
        setSuccess('Buyer account created successfully! Opening Buyer Dashboard...');
        setTimeout(() => {
          router.push('/buyer-dashboard');
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          href="/products"
          className="text-sm font-semibold text-blue-600 hover:text-blue-500 mb-6 inline-block"
        >
          &larr; Back to Products
        </Link>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Create an Account
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Join UzaNaNunua as a <span className="font-semibold text-blue-600">Seller</span> or <span className="font-semibold text-blue-600">Buyer</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200 rounded-3xl sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3.5 rounded-xl text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-emerald-50 border-l-4 border-emerald-500 p-3.5 rounded-xl text-sm text-emerald-800 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              {success}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* 1. Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="appearance-none block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl shadow-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                />
              </div>
            </div>

            {/* 2. Phone Number Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +255 712 345 678"
                  className="appearance-none block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl shadow-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                />
              </div>
            </div>

            {/* 3. Role Field (Seller or Buyer) */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-800">Account Type / Role</span>
                <span className="text-xs text-blue-600 font-medium">
                  {formData.role === 'Seller' ? '🛍️ List & Sell Products' : '🛒 Shop & Buy Products'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <label className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.role === 'Seller' ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-xs' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="Seller"
                    checked={formData.role === 'Seller'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-base">💼</span>
                    <span className="text-sm">Seller</span>
                  </div>
                </label>

                <label className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.role === 'Buyer' ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-xs' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="Buyer"
                    checked={formData.role === 'Buyer'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-base">🛍️</span>
                    <span className="text-sm">Buyer</span>
                  </div>
                </label>
              </div>
              {formData.role === 'Seller' && (
                <p className="text-[11px] text-slate-500 mt-2">
                  * As a seller, you will be redirected immediately to list your product after registration.
                </p>
              )}
            </div>

            {/* 4. Password Field with Visibility Toggle Icon */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="mt-1 relative rounded-xl shadow-xs">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="appearance-none block w-full pl-3.5 pr-10 py-2.5 border border-slate-300 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* 5. Confirm Password Field with Visibility Toggle Icon */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-xl shadow-xs">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="appearance-none block w-full pl-3.5 pr-10 py-2.5 border border-slate-300 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* 6. Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-60"
              >
                {loading
                  ? 'Creating Account...'
                  : formData.role === 'Seller'
                  ? 'Register as Seller & List Products'
                  : 'Register as Buyer'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-blue-600 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
