import React from 'react';
import type { Setting } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface FooterProps {
  settings: Setting | null;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const { lang, t } = useLanguage();

  return (
    <footer id="footer" className="bg-[#2d3a4b] text-gray-300">
      {/* Upper footer hotline */}
      <div className="border-b border-gray-700 py-8 px-4 bg-[#232e3d]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h4 className="text-[#ed1c24] font-bold text-lg uppercase tracking-wider">{t('footer.freeHotline')}</h4>
            <p className="text-sm text-gray-400 mt-1">{t('footer.support247')}</p>
          </div>
          <a
            href={`tel:${settings?.phone}`}
            className="text-3xl md:text-4xl font-extrabold text-white hover:text-[#ed1c24] transition-colors"
          >
            {settings?.hotline || settings?.phone}
          </a>
        </div>
      </div>

      {/* Main Footer Details */}
      <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Info Column */}
        <div className="lg:col-span-6 text-left">
          <h3 className="text-lg font-bold text-white mb-6 uppercase border-l-4 border-[#124c8d] pl-3">
            {(lang === 'vi' ? settings?.companyName : settings?.companyNameZh) || settings?.companyName}
          </h3>
          <ul className="space-y-4 text-sm">
            <li className="flex flex-col">
              <span className="text-gray-400 font-medium">{t('footer.address')}:</span>
              <span className="mt-0.5">{(lang === 'vi' ? settings?.address : settings?.addressZh) || settings?.address}</span>
            </li>
            <li className="flex flex-col">
              <span className="text-gray-400 font-medium">{t('footer.phone')}:</span>
              <span className="mt-0.5">{settings?.phone}</span>
            </li>
            <li className="flex flex-col">
              <span className="text-gray-400 font-medium">{t('footer.email')}:</span>
              <span className="mt-0.5 text-blue-400 hover:underline">
                <a href={`mailto:${settings?.email}`}>{settings?.email}</a>
              </span>
            </li>
          </ul>
        </div>

        {/* Map Column */}
        <div className="lg:col-span-6 text-left">
          <h3 className="text-lg font-bold text-white mb-6 uppercase border-l-4 border-[#124c8d] pl-3">
            {t('footer.mapTitle')}
          </h3>
          <div
            className="w-full h-[220px] rounded-lg overflow-hidden border border-gray-700 shadow-md"
            dangerouslySetInnerHTML={{ __html: settings?.googleMapEmbed || '' }}
          />
        </div>
      </div>

      {/* Copyright row */}
      <div className="bg-[#1f2937] py-6 px-4 text-xs border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400">
          <p>{(lang === 'vi' ? settings?.copyright : settings?.copyrightZh) || settings?.copyright || `© 2016 - ${new Date().getFullYear()} ketoanchuyennghiep.com.vn. All rights reserved`}</p>
          <div className="flex items-center gap-4">
            <a href="/login" className="hover:underline hover:text-white transition-colors">
              {t('footer.adminSystem')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
