import Link from 'next/link';

const categories = [
  { name: 'Electronics', icon: '⚡', desc: 'Gadgets & devices', color: 'bg-yellow-50 border-yellow-100 text-yellow-600' },
  { name: 'Clothing', icon: '👕', desc: 'Fashion & apparel', color: 'bg-pink-50 border-pink-100 text-pink-600' },
  { name: 'Shoes', icon: '👟', desc: 'Footwear collection', color: 'bg-orange-50 border-orange-100 text-orange-600' },
  { name: 'Phones', icon: '📱', desc: 'Smartphones & accessories', color: 'bg-blue-50 border-blue-100 text-blue-600' },
  { name: 'Wearables', icon: '⌚', desc: 'Smartwatches & audio', color: 'bg-purple-50 border-purple-100 text-purple-600' },
  { name: 'Home & Living', icon: '🏡', desc: 'Essentials & decor', color: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
];

const features = [
  {
    icon: '🛍️',
    iconBg: 'bg-blue-50 border-blue-100',
    title: 'Wide Marketplace',
    desc: 'Browse products across electronics, fashion, footwear, mobile devices, and daily lifestyle essentials.',
    stat: '500+ Products',
    statColor: 'text-blue-600',
  },
  {
    icon: '⚡',
    iconBg: 'bg-emerald-50 border-emerald-100',
    title: 'Instant Cart & Orders',
    desc: 'Add items to your cart, checkout seamlessly, and review your full purchase history in real time.',
    stat: 'Real-Time Tracking',
    statColor: 'text-emerald-600',
  },
  {
    icon: '💼',
    iconBg: 'bg-indigo-50 border-indigo-100',
    title: 'Seller Portal Ready',
    desc: 'List items with photos, stock count, and competitive pricing to connect with active buyers instantly.',
    stat: 'Instant Publishing',
    statColor: 'text-indigo-600',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col font-sans bg-white selection:bg-blue-600 selection:text-white">

      {/* ─────────────────────────────────────────────────────── */}
      {/* HEADER — full-width, sticky, visually distinct          */}
      {/* ─────────────────────────────────────────────────────── */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 sm:h-16 md:h-20">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Uza<span className="text-blue-600">NaNunua</span>
            </span>
            <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Marketplace
            </span>
          </Link>

          {/* Nav links (hide Browse on very small screens to avoid overflow) */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              Browse
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────── */}
      {/* MAIN — flush below header, no gaps                     */}
      {/* ─────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col">

        {/* ── 1. HERO ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white">
          {/* Ambient glow */}
          <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-br from-blue-100/50 via-indigo-50/30 to-transparent blur-3xl pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-28 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold shadow-sm mb-5 sm:mb-7">
              🛒 Premier Marketplace & Buyer Portal
            </div>

            {/* Heading — scales from 320px to 1280px */}
            <h1 className="text-[clamp(2rem,6vw,4.5rem)] font-black tracking-tight text-slate-900 leading-[1.1]">
              Buy, Sell &amp; Discover on{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                UzaNaNunua
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Your trusted all-in-one marketplace. Browse authentic products, manage wishlists, track real-time orders, and list items with ease.
            </p>

            {/* CTA Buttons */}
            <div className="mt-7 sm:mt-9 flex justify-center">
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 px-8 py-4 text-sm sm:text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] min-h-[48px] min-w-[220px]"
              >
                Browse Products &rarr;
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500 font-medium">
              {['Free & Instant Access', 'Real-Time Cart & Orders', 'Verified Product Listings'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span> {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. CATEGORIES ───────────────────────────────────── */}
        <section className="bg-white border-t border-slate-100 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-7 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Explore Popular Categories
              </h2>
              <p className="mt-1 text-sm sm:text-base text-slate-500">
                Find exactly what you need in our marketplace
              </p>
            </div>

            {/* 2 cols on phones → 3 on sm → 6 on lg */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href="/products"
                  className={`group flex flex-col items-center p-4 sm:p-5 rounded-2xl border bg-white hover:shadow-md text-center transition-all duration-200 hover:-translate-y-1 ${cat.color}`}
                >
                  <span className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <span className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-600 transition-colors">{cat.name}</span>
                  <span className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-tight line-clamp-1">{cat.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. FEATURES ─────────────────────────────────────── */}
        <section className="bg-slate-50 border-t border-slate-200/80 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Why Use UzaNaNunua?
              </h2>
              <p className="mt-1 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
                Built for buyers and sellers across all devices
              </p>
            </div>

            {/* 1 col → 3 cols md */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex flex-col bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl mb-5 shrink-0 ${f.iconBg}`}>
                    {f.icon}
                  </div>
                  <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${f.statColor}`}>
                    {f.stat}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ─────────────────────────────────────────────────────── */}
      {/* RICH APP FOOTER                                         */}
      {/* ─────────────────────────────────────────────────────── */}
      <footer className="w-full bg-slate-900 text-slate-300">
        {/* Top footer: 4-column grid on desktop, stacked on mobile */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1 — Brand & About */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
                Uza<span className="text-blue-400">NaNunua</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              UzaNaNunua is a premier East African online marketplace connecting buyers and sellers of electronics, fashion, footwear, phones, and everyday essentials — all in one place.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Platform is Live & Active
            </div>
          </div>

          {/* Col 2 — Quick Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Browse Products',    href: '/products' },
                { label: 'Sell a Product',     href: '/sell' },
                { label: 'Buyer Dashboard',    href: '/buyer-dashboard' },
                { label: 'Sign In',            href: '/login' },
                { label: 'Create an Account',  href: '/signup' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-blue-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Electronics',   icon: '⚡' },
                { label: 'Clothing',      icon: '👕' },
                { label: 'Shoes',         icon: '👟' },
                { label: 'Phones',        icon: '📱' },
                { label: 'Wearables',     icon: '⌚' },
                { label: 'Home & Living', icon: '🏡' },
              ].map((cat) => (
                <li key={cat.label}>
                  <Link
                    href="/products"
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span className="text-sm">{cat.icon}</span>
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — App Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">App Details</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="text-base mt-0.5">📍</span>
                <span>Dar es Salaam, Tanzania</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-base mt-0.5">🌐</span>
                <span>Available on all web devices &amp; browsers</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-base mt-0.5">🔒</span>
                <span>Secure user authentication &amp; data protection</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-base mt-0.5">💳</span>
                <span>Supports instant cart checkout &amp; order tracking</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-base mt-0.5">🛠️</span>
                <span>Built with Next.js, MongoDB &amp; Cloudinary</span>
              </li>
            </ul>

            {/* CTA inside footer */}
            <div className="pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow"
              >
                🚀 Get Started Free
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} UzaNaNunua Marketplace. All rights reserved.</p>
            <p className="text-slate-600">
              Designed for buyers &amp; sellers · East Africa&apos;s digital marketplace
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

