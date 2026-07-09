import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Setting, Section } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

// Import public components
import Header from '../components/public/Header';
import Footer from '../components/public/Footer';
import FloatingButtons from '../components/public/FloatingButtons';
import ContactSection from '../components/public/ContactSection';
import CompanySetup from '../components/public/CompanySetup';

export const CompanySetupPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [settings, setSettings] = useState<Setting | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, sectionsRes] = await Promise.all([
          api.get('/settings'),
          api.get('/sections')
        ]);
        setSettings(settingsRes.data);
        
        const setupSec = sectionsRes.data.find((s: Section) => s.sectionId === 'thanh-lap-cong-ty');
        setSection(setupSec || null);
      } catch (error) {
        console.error('Error fetching company setup page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, []);

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
              {t('nav.companySetup') || 'Thành Lập Công Ty'}
            </h1>
            <p className="text-sm font-light mt-3 max-w-xl mx-auto opacity-90">
              {lang === 'vi' 
                ? 'Dịch vụ đăng ký doanh nghiệp trọn gói, hỗ trợ nhanh chóng, tư vấn miễn phí bước đầu.' 
                : '全套公司注册服务，快速办理，提供初期免费咨询。'}
            </p>
          </div>
        </section>

        {/* Company Setup Details Section */}
        {section && (
          <CompanySetup
            section={section}
            settings={settings}
          />
        )}

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

export default CompanySetupPage;
