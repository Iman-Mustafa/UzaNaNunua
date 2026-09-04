import Link from 'next/link';

export default function Home() {
  const categories = [
    { name: 'Electronics', icon: '⚡', desc: 'Gadgets & devices' },
    { name: 'Clothing', icon: '👕', desc: 'Fashion & apparel' },
    { name: 'Shoes', icon: '👟', desc: 'Footwear collection' },
    { name: 'Phones', icon: '📱', desc: 'Smartphones & accessories' },
    { name: 'Wearables', icon: '⌚', desc: 'Smartwatches & audio' },
    { name: 'Home & Living', icon: '🏡', desc: 'Essentials & decor' },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col font-sans bg-white selection:bg-blue-600 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. ATTACHED HEADER: Full-width sticky top navbar                         */}
      {/* ========================================================================= */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Uza<span className="text-blue-600">NaNunua</span>
              </span>
            </Link>
            <span className="hidden md:inline-block text-slate-300 text-lg font-light">|</span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              Marketplace
            </span>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/products"
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              Browse Catalog
            </Link>
            <Link
              href="/login"
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
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
      {/* 2. HERO SECTION: Seamlessly attached directly beneath the header         */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col">
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50/40 to-white pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
          {/* Subtle Ambient Background Lighting */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-blue-100/40 via-indigo-50/30 to-transparent blur-3xl pointer-events-none -z-10" />

          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs sm:text-sm font-bold border border-blue-200/60 shadow-2xs">
              <span>🛒</span> Premier Marketplace & Buyer Portal
            </div>

            {/* Main Title */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.12]">
              Buy, Sell & Discover on <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                UzaNaNunua
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Your trusted marketplace platform. Browse authentic catalog items, manage your wishlist, track real-time orders, or list products with ease.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 max-w-md mx-auto">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-2xl shadow-lg hover:shadow-xl transition-all min-h-[48px]"
              >
                <span>Browse Products</span>
                <span className="text-lg">&rarr;</span>
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-xs transition-all min-h-[48px]"
              >
                <span>Account Login</span>
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span> Free & Instant Access
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span> Real-Time Cart & Orders
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span> Verified Product Listings
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CATEGORIES SECTION: Responsive Grid on all devices                    */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore Popular Categories
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Find exactly what you are looking for in our marketplace
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href="/products"
                className="group p-4 sm:p-5 rounded-2xl bg-slate-50/80 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-800 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {cat.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. VALUE PROPOSITION: 3 Feature Cards                                   */}
        {/* ========================================================================= */}
        <section className="bg-slate-50/80 border-t border-slate-200/80 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl mb-4">
                  🛍️
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  Wide Marketplace
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Browse products across electronics, fashion, footwear, mobile devices, and daily lifestyle essentials.
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl mb-4">
                  ⚡
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  Instant Cart & Orders
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Add items to your cart, place orders effortlessly, and review your complete purchase history at any time.
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl mb-4">
                  💼
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  Seller Portal Ready
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  List items with photos, stock count, and competitive pricing to connect with active buyers right away.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* 5. FOOTER: Full-width attached bottom bar                                 */}
      {/* ========================================================================= */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>&copy; {new Date().getFullYear()} UzaNaNunua Marketplace. All rights reserved.</p>
          <div className="flex items-center space-x-4 text-slate-600 font-medium">
            <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <Link href="/login" className="hover:text-blue-600 transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-blue-600 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

