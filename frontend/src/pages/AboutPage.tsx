import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Setting, Section } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import public components
import Header from '../components/public/Header';
import Footer from '../components/public/Footer';
import FloatingButtons from '../components/public/FloatingButtons';
import ContactSection from '../components/public/ContactSection';

const aboutImages = [
  '/assets/images/about_1.jpg',
  '/assets/images/about_2.jpg',
  '/assets/images/about_3.jpg',
  '/assets/images/about_4.jpg',
  '/assets/images/about_5.jpg'
];

export const AboutPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [settings, setSettings] = useState<Setting | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, sectionsRes] = await Promise.all([
          api.get('/settings'),
          api.get('/sections')
        ]);
        setSettings(settingsRes.data);
        const aboutSec = sectionsRes.data.find((s: Section) => s.sectionId === 'gioi-thieu');
        setSection(aboutSec || null);
      } catch (error) {
        console.error('Error fetching about page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (loading) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % aboutImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [loading]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + aboutImages.length) % aboutImages.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % aboutImages.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#124c8d] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse text-sm">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const title = (lang === 'vi' ? section?.title : section?.titleZh) || section?.title || 'Giới Thiệu Về Chúng Tôi';
  let htmlContent = (lang === 'vi' ? section?.content : section?.contentZh) || section?.content || '';
  
  if (settings && htmlContent) {
    const companyName = (lang === 'vi' ? settings.companyName : settings.companyNameZh) || settings.companyName;
    if (companyName) {
      htmlContent = htmlContent
        .replace(/CÔNG TY TNHH DỊCH VỤ VÀ TƯ VẤN VIỆT HƯNG/g, companyName)
        .replace(/越兴服务 XML 与咨询有限公司/g, companyName);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header settings={settings} />

      {/* Main Content */}
      <main className="flex-grow bg-white">
        {/* Banner header with soft gradient */}
        <section className="bg-gradient-to-r from-[#124c8d] to-[#1e5aa0] text-white py-12 px-4 text-center">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide uppercase">
              {t('nav.about') || 'Giới Thiệu'}
            </h1>
            <p className="text-sm font-light mt-3 max-w-xl mx-auto opacity-90">
              {lang === 'vi' 
                ? 'Tìm hiểu về ZINTAX FINANCE - Đối tác tài chính & kế toán tin cậy của doanh nghiệp.' 
                : '了解 ZINTAX FINANCE —— 值得信赖的企业财务与会计合作伙伴。'}
            </p>
          </div>
        </section>

        {/* Content detail */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto space-y-12 text-left">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight border-b pb-4">
                {title}
              </h2>
              {htmlContent ? (
                <div
                  className="text-gray-600 leading-relaxed text-base space-y-4 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              ) : (
                <p className="text-gray-500 italic text-center">Đang cập nhật nội dung...</p>
              )}
            </div>

            {/* Slider */}
            <div className="relative w-full flex justify-center">
              <div className="relative w-full max-w-4xl aspect-[16/10] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-xl group bg-white border border-gray-100">
                {/* Images */}
                <div className="w-full h-full relative">
                  {aboutImages.map((src, idx) => (
                    <div
                      key={src}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      <img
                        src={src}
                        alt={`Hoạt động ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                      />
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105 cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105 cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {aboutImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact form for registration */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer settings={settings} />

      {/* Floating Buttons */}
      <FloatingButtons settings={settings} />
    </div>
  );
};

export default AboutPage;
