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
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Products
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Browse the latest items listed by our community.
            </p>
          </div>

        </div>

        <Link href="/" className="text-sm font-semibold text-blue-600 hover:text-blue-500 mb-6 inline-block">
          &larr; Back to Home
        </Link>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">Loading products...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-center text-red-700">
            <p>{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white shadow-sm rounded-lg border border-gray-100">
            <p className="text-xl text-gray-600">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {products.map((product) => (
              <div key={product._id} className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="w-full h-64 bg-gray-200 aspect-w-1 aspect-h-1 rounded-t-lg overflow-hidden flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <div className="p-4 flex flex-col h-full">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900 ml-4">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {product.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      Stock: {product.countInStock}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
