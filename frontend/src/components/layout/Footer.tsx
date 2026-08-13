"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Mail } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();

  if (pathname === '/map') {
    return null;
  }

  return (
    <footer className="border-t border-white/10 text-white/90 py-10 shadow-inner" style={{ backgroundColor: '#004229' }}>
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand Logo & Subtitle — Logo VIGIL nổi bật với hiệu ứng Glassmorphism & Ambient Glow */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/" className="flex items-center group mb-3" aria-label="VIGIL - Trang chủ" title="VIGIL">
            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-white/60 group-hover:scale-105 group-hover:shadow-[0_0_22px_rgba(244,214,104,0.5)] group-hover:border-yellow-300/80 transition-all duration-300 flex items-center justify-center">
              <img
                src="/images/logo_cropped.png"
                alt="VIGIL Logo"
                className="h-9 md:h-10 w-auto object-contain drop-shadow-sm"
              />
            </div>
          </Link>
          <p className="text-xs text-white/80 max-w-sm leading-relaxed" style={{ textWrap: 'balance' } as React.CSSProperties}>
            {t('footer.description')}
          </p>
        </div>

        {/* Contact Links & Copyright — Feedback 03 & 04 */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-xs text-white/80">
          <a
            href="mailto:vigil.greenorg@gmail.com"
            className="flex items-center gap-2 hover:text-[#F4D668] transition-colors"
          >
            <Mail size={16} />
            <span>vigil.greenorg@gmail.com</span>
          </a>

          <a
            href="https://www.facebook.com/share/18yn8UxqPE/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[#F4D668] transition-colors"
          >
            <svg className="w-4 h-4 fill-current text-[#F4D668]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="font-semibold">{t('contact.facebook')}</span>
          </a>

          <span className="text-white/50 text-[11px]">
            {t('footer.rights')}
          </span>
        </div>
      </div>
    </footer>
  );
}
