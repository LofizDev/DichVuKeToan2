import React from 'react';
import type { Section, Setting } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface BookkeepingCleanupProps {
  section: Section | null;
  settings: Setting | null;
}

export const BookkeepingCleanup: React.FC<BookkeepingCleanupProps> = ({ section, settings }) => {
  const { lang } = useLanguage();

  if (!section) return null;

  let htmlContent = (lang === 'vi' ? section.content : section.contentZh) || section.content;
  if (settings) {
    const companyName = (lang === 'vi' ? settings.companyName : settings.companyNameZh) || settings.companyName;
    if (companyName) {
      htmlContent = htmlContent.replace(/CÔNG TY TNHH DỊCH VỤ VÀ TƯ VẤN VIỆT HƯNG/g, companyName);
    }
  }

  return (
    <section id="don-dep-so-sach" className="py-12 bg-gray-50 px-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto text-left">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 relative pb-3 border-b-2 border-[#124c8d] inline-block mx-auto left-1/2 -translate-x-1/2">
          {(lang === 'vi' ? section.title : section.titleZh) || section.title}
        </h2>
        <div
          className="prose max-w-none text-gray-600 space-y-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </section>
  );
};
export default BookkeepingCleanup;
