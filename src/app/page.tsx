import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col font-sans bg-slate-50 selection:bg-blue-600 selection:text-white">
      {/* ========================================================================= */}
      {/* TOP ATTACHED HEADER: Full-width sticky navigation bar with distinct style  */}
      {/* ========================================================================= */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Uza<span className="text-blue-600">NaNunua</span>
              </span>
            </Link>
            <span className="hidden sm:inline-block text-slate-300 text-lg font-light">|</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Marketplace
            </span>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/products"
              className="hidden xs:inline-flex px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              Browse Catalog
            </Link>
            <Link
              href="/login"
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-xl transition-all shadow-sm hover:shadow"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* PAGE BODY CANVAS: Flows seamlessly directly below the header             */}
      {/* ========================================================================= */}
      <div className="flex-1 bg-gradient-to-b from-slate-100/80 via-slate-50 to-blue-50/20 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <main className="w-full max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto">
          <div className="bg-white p-6 sm:p-10 md:p-12 rounded-3xl sm:rounded-4xl shadow-xl sm:shadow-2xl border border-slate-200/80 text-center space-y-6 sm:space-y-8 transition-all">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs sm:text-sm font-bold border border-blue-100 shadow-2xs">
              <span>🛒</span> Premier Marketplace & Buyer Portal
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Welcome to <span className="text-blue-600">UzaNaNunua</span>
            </h1>
            
            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto font-normal">
              Your all-in-one marketplace for buying and selling. Explore trending products, manage wishlists, track real-time cart orders, and list items with instant buyer connectivity.
            </p>

            {/* Primary Action Button */}
            <div className="flex justify-center pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white px-8 py-4 text-base font-bold shadow-lg hover:shadow-xl transition-all min-w-[220px]"
              >
                <span>Browse Products</span>
                <span className="text-lg">&rarr;</span>
              </Link>
            </div>

            {/* Feature Highlights Grid */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left">
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-lg">🛍️</span> Wide Catalog
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Electronics, clothing, shoes, phones & more</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-lg">⚡</span> Instant Orders
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Track cart items and real-time purchase records</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-lg">💼</span> Easy Selling
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Upload products with images and instant publishing</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* FOOTER: Full-width attached bottom bar                                    */}
      {/* ========================================================================= */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} UzaNaNunua Marketplace. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
