"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  /** Optional text to display alongside the arrow, e.g. "Back" */
  label?: string;
  /** Fallback URL to navigate to if there is no previous history entry */
  fallbackUrl?: string;
  /** Visual style variant */
  variant?: 'header' | 'button' | 'subtle' | 'outline' | 'pill' | 'dark';
  /** Extra CSS classes */
  className?: string;
  /** Tooltip / title text */
  title?: string;
  /** Show text only on medium/large screens */
  responsiveText?: boolean;
}

export default function BackButton({
  label = 'Back',
  fallbackUrl = '/',
  variant = 'header',
  className = '',
  title = 'Go back to previous page',
  responsiveText = true,
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'header':
        return 'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200/80 rounded-xl transition-all shadow-2xs hover:shadow-xs group';
      case 'outline':
        return 'inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs hover:shadow-xs transition-all group';
      case 'subtle':
        return 'inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors group';
      case 'pill':
        return 'inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border border-blue-200 rounded-full transition-all group';
      case 'dark':
        return 'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white/90 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 rounded-xl backdrop-blur-sm transition-all group';
      case 'button':
      default:
        return 'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-800 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-300 rounded-xl shadow-sm hover:shadow transition-all group';
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      title={title}
      aria-label={title}
      className={`${getVariantStyles()} ${className} cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
    >
      <svg
        className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      {label && (
        <span className={responsiveText ? 'hidden xs:inline sm:inline' : 'inline'}>
          {label}
        </span>
      )}
    </button>
  );
}
