import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-8 font-sans">
      <main className="max-w-2xl text-center space-y-8 bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-100">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
          <span>🛒</span> Premier Marketplace & Buyer Portal
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900">
          Welcome to <span className="text-blue-600">UzaNaNunua</span>
        </h1>
        
        <p className="text-base sm:text-lg leading-relaxed text-slate-600">
          Your premier marketplace for buying and selling. Explore catalog items, manage your wishlist, track cart orders, and view your purchase history with ease.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
          <Link
            href="/buyer-dashboard"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
          >
            Buyer Dashboard &rarr;
          </Link>

          <Link
            href="/products"
            className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-200 transition-all border border-slate-200"
          >
            Browse Products
          </Link>

          <Link
            href="/sell"
            className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all border border-slate-300"
          >
            Sell a Product
          </Link>
        </div>
      </main>
    </div>
  );
}
