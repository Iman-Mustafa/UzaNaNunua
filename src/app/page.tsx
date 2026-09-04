import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-10 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar for quick access */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between py-2 sm:py-3 px-2">
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            Uza<span className="text-blue-600">NaNunua</span>
          </span>
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link
            href="/login"
            className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 bg-white/80 hover:bg-white border border-slate-200/80 rounded-xl transition-all shadow-2xs"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-2xs"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Main Content Hero Card */}
      <main className="w-full max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto my-auto py-4 sm:py-6">
        <div className="bg-white/95 backdrop-blur-md p-6 sm:p-10 md:p-12 rounded-3xl sm:rounded-4xl shadow-xl sm:shadow-2xl border border-slate-100 text-center space-y-6 sm:space-y-8 transition-all">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs sm:text-sm font-bold border border-blue-100/80 shadow-2xs">
            <span>🛒</span> Premier Marketplace & Buyer Portal
          </div>

          {/* Heading */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Welcome to <span className="text-blue-600">UzaNaNunua</span>
          </h1>
          
          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto font-normal">
            Your all-in-one marketplace for buying and selling. Explore trending products, manage wishlists, track real-time cart orders, and list items with instant buyer connectivity.
          </p>

          {/* Action Buttons - Stack on mobile, flex on tablet/desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 pt-2 max-w-2xl mx-auto">
            <Link
              href="/buyer-dashboard"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-98 transition-all"
            >
              <span>Buyer Dashboard</span>
              <span>&rarr;</span>
            </Link>

            <Link
              href="/products"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-200 active:scale-98 transition-all border border-slate-200"
            >
              <span>Browse Products</span>
            </Link>

            <Link
              href="/sell"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50 active:scale-98 transition-all border border-emerald-300 shadow-2xs"
            >
              <span>+ Sell a Product</span>
            </Link>
          </div>

          {/* Feature highlights for visual balance across tablets and desktops */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 xs:grid-cols-3 gap-3 text-left">
            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <span>🛍️</span> Wide Catalog
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Electronics, clothing, phones & more</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <span>⚡</span> Instant Orders
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Track cart and bought order items</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <span>💼</span> Easy Selling
              </div>
              <p className="text-xs text-slate-500 mt-0.5">List products with custom images</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto py-3 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} UzaNaNunua. All rights reserved.
      </footer>
    </div>
  );
}
