import Link from 'next/link';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <main className="max-w-2xl text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Products
        </h1>
        <p className="text-xl leading-8 text-gray-600">
          This page is under construction. Product listings will appear here soon.
        </p>
        <div className="mt-10">
          <Link
            href="/"
            className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500"
          >
            &larr; Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
