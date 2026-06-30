import React from 'react';
import type { Section } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface AboutProps {
  section: Section | null;
}

export const About: React.FC<AboutProps> = ({ section }) => {
  const { lang, t } = useLanguage();

  if (!section) return null;

  return (
    <section id="gioi-thieu" className="py-20 bg-gray-50 text-left">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left text content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-sm font-bold text-[#124c8d] tracking-widest uppercase block border-l-4 border-[#124c8d] pl-3">
              {t('nav.about')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              {(lang === 'vi' ? section.title : section.titleZh) || section.title}
            </h2>
          </div>
          <div
            className="text-gray-600 leading-relaxed text-base space-y-4 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: (lang === 'vi' ? section.content : section.contentZh) || section.content }}
          />
        </div>

        {/* Right Badge Block / Decorative */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-3xl bg-gradient-to-tr from-[#124c8d] to-[#446084] shadow-2xl flex flex-col items-center justify-center p-8 text-center text-white transform hover:rotate-1 transition-all duration-300">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#ed1c24] rounded-2xl -z-10 animate-pulse" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-100 rounded-full -z-10" />

            <span className="text-5xl md:text-6xl font-extrabold tracking-tight mb-2 drop-shadow-md">
              {t('about.yearsExp')}
            </span>
            <p className="text-sm md:text-base font-semibold uppercase tracking-wider text-blue-100 max-w-[200px] leading-snug">
              {t('about.expLabel')}
            </p>

            <div className="mt-6 w-12 h-1 bg-[#ed1c24] rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;
