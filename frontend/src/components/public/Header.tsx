import React, { useState, useEffect } from 'react';
import { Menu, X, PhoneCall } from 'lucide-react';
import type { Setting } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface HeaderProps {
  settings: Setting | null;
}

export const Header: React.FC<HeaderProps> = ({ settings }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { key: 'about', href: '#gioi-thieu' },
    { key: 'accounting', href: '#bang-gia' },
    { key: 'financialReport', href: '#bao-cao-tai-chinh' },
    { key: 'bookkeeping', href: '#don-dep-so-sach' },
    { key: 'companySetup', href: '#thanh-lap-cong-ty' },
    { key: 'services', href: '#dich-vu' },
    { key: 'contact', href: '#lien-he' },
  ];

  return (
    <header className="w-full z-50">
      {/* Top bar info */}
      <div className="bg-[#446084] text-white py-2 px-4 text-sm hidden lg:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="font-light">{lang === 'vi' ? settings?.address : settings?.addressZh || settings?.address}</p>
          <div className="flex items-center gap-6">
            <a href={`mailto:${settings?.email}`} className="hover:underline font-light">
              {settings?.email}
            </a>
            <a href={`tel:${settings?.phone}`} className="flex items-center gap-1 font-semibold hover:underline">
              <PhoneCall size={14} className="animate-pulse" /> {settings?.hotline || settings?.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header / Logo */}
      <div className="bg-white border-b border-gray-100 transition-all duration-300">
        <div className="relative w-full flex items-center">
          <a href="#" className="w-full block bg-white">
            <img
              src={settings?.logoUrl ? settings.logoUrl : '/assets/images/ketoanchuyennghiep-banner.webp'}
              alt={(lang === 'vi' ? settings?.siteName : settings?.siteNameZh) || settings?.siteName || 'Kế Toán Chuyên Nghiệp'}
              className="w-full max-h-[120px] md:max-h-[150px] object-contain block mx-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/ketoanchuyennghiep-banner.webp';
              }}
            />
          </a>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="absolute right-4 top-1/2 -translate-y-1/2 lg:hidden p-2 text-[#124c8d] bg-white/80 hover:bg-white rounded-lg shadow-md transition-colors z-10"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Navigation Bar (Sticky part) */}
      <nav
        className={`w-full bg-[#124c8d] shadow-md transition-all duration-300 ${
          isSticky ? 'fixed top-0 left-0 right-0 shadow-lg scale-y-100' : 'relative'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-12">
          {/* Main Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-0.5 h-full">
            {navLinks.map((link) => (
              <li key={link.key} className="h-full flex items-center">
                <a
                  href={link.href}
                  className="px-2.5 py-1.5 text-white font-semibold text-[11px] xl:text-xs tracking-wider uppercase hover:bg-white/10 rounded transition-all duration-200 whitespace-nowrap"
                >
                  {t('nav.' + link.key)}
                </a>
              </li>
            ))}
          </ul>

          {/* Action button */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Language switcher button */}
            <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-full border border-white/20">
              <button 
                onClick={() => setLang('vi')}
                className={`focus:outline-none transition-all cursor-pointer ${lang === 'vi' ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-80'}`}
                title="Tiếng Việt"
              >
                <img src="/assets/images/covietnam.png" alt="Tiếng Việt" className="w-6 h-4 object-cover rounded-sm" />
              </button>
              <button 
                onClick={() => setLang('zh')}
                className={`focus:outline-none transition-all cursor-pointer ${lang === 'zh' ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-80'}`}
                title="中文"
              >
                <img src="/assets/images/cotrungquoc.png" alt="中文" className="w-6 h-4 object-cover rounded-sm" />
              </button>
            </div>
            <a
              href="#lien-he"
              className="bg-[#ed1c24] hover:bg-[#c81016] text-white text-[11px] xl:text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
            >
              {t('nav.freeConsult')}
            </a>
          </div>

          {/* Mobile quick contact */}
          <div className="lg:hidden flex items-center justify-between w-full">
            <span className="text-white text-xs sm:text-sm font-semibold flex items-center gap-1">
              <PhoneCall size={14} /> {t('nav.hotline')}: {settings?.phone}
            </span>
            <div className="flex items-center gap-2">
              {/* Language switcher button */}
              <div className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded border border-white/20">
                <button 
                  onClick={() => setLang('vi')}
                  className={`focus:outline-none transition-all ${lang === 'vi' ? 'opacity-100 scale-105' : 'opacity-50'}`}
                >
                  <img src="/assets/images/covietnam.png" alt="Tiếng Việt" className="w-5 h-3.5 object-cover rounded-sm" />
                </button>
                <button 
                  onClick={() => setLang('zh')}
                  className={`focus:outline-none transition-all ${lang === 'zh' ? 'opacity-100 scale-105' : 'opacity-50'}`}
                >
                  <img src="/assets/images/cotrungquoc.png" alt="中文" className="w-5 h-3.5 object-cover rounded-sm" />
                </button>
              </div>
              <a
                href="#lien-he"
                className="bg-[#ed1c24] text-white text-[10px] sm:text-xs font-bold uppercase px-2.5 py-1 rounded"
              >
                {t('nav.consult')}
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="w-3/4 max-w-sm h-full bg-white shadow-2xl p-6 flex flex-col justify-between animate-slide-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex justify-end items-center pb-6 border-b border-gray-100">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>

              <ul className="mt-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.key}>
                    <a
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-[#333] hover:text-[#124c8d] hover:bg-gray-50 rounded-lg text-base font-medium transition-all"
                    >
                      {t('nav.' + link.key)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
              <div className="text-sm text-gray-600">
                <p className="font-semibold text-gray-800">{t('common.contactSupport')}</p>
                <p className="mt-1">{settings?.phone}</p>
                <p>{settings?.email}</p>
              </div>
              <a
                href="#lien-he"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center bg-[#124c8d] text-white py-3 rounded-lg font-semibold uppercase text-sm tracking-wider"
              >
                {t('common.sendRequest')}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;
