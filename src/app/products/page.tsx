"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  countInStock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use environment variable if set, otherwise use relative path to Next.js API route
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header with Products Title/Brand, Login, and SignUp Buttons */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Uza<span className="text-blue-600">NaNunua</span>
              </Link>
              <span className="text-gray-300">|</span>
              <span className="text-base font-semibold text-gray-800">
                Products
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                SignUp
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content: Products listed below the header */}
      <main className="flex-1 max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Available Products
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Browse items listed by sellers in our marketplace.
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
            <p className="text-sm text-gray-500 mt-1">Uploaded products will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
              >
                <div className="w-full h-56 bg-gray-100 overflow-hidden flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
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
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700">
                      {product.category}
                    </span>
                    <span>
                      Stock: <strong className="text-gray-700">{product.countInStock}</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
