import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import type { Setting, Section, ServiceItem, PriceTable, SliderItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

// Import public components
import Header from '../components/public/Header';
import HeroSlider from '../components/public/HeroSlider';
import ServicePricing from '../components/public/ServicePricing';
import About from '../components/public/About';
import ServiceGrid from '../components/public/ServiceGrid';
import CompanySetup from '../components/public/CompanySetup';
import BookkeepingCleanup from '../components/public/BookkeepingCleanup';
import FinancialReport from '../components/public/FinancialReport';
import ContactSection from '../components/public/ContactSection';
import Footer from '../components/public/Footer';
import FloatingButtons from '../components/public/FloatingButtons';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const activeHash = location.hash;

  const [settings, setSettings] = useState<Setting | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [priceTables, setPriceTables] = useState<PriceTable[]>([]);
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, sectionsRes, servicesRes, priceTablesRes, slidersRes] = await Promise.all([
          api.get('/settings'),
          api.get('/sections'),
          api.get('/services'),
          api.get('/price-tables'),
          api.get('/sliders')
        ]);

        setSettings(settingsRes.data);
        setSections(sectionsRes.data);
        setServices(servicesRes.data);
        setPriceTables(priceTablesRes.data);
        setSliders(slidersRes.data);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Scroll to top immediately when hash changes (no smooth scrolling to match dynamic tab loading)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeHash]);

  const getSection = (sectionId: string) => {
    return sections.find((s) => s.sectionId === sectionId) || null;
  };

  const getPriceTable = (sectionId: string) => {
    return priceTables.find((pt) => pt.sectionId === sectionId) || null;
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

  const knownHashes = [
    '#gioi-thieu',
    '#bang-gia',
    '#bao-cao-tai-chinh',
    '#don-dep-so-sach',
    '#thanh-lap-cong-ty',
    '#dich-vu',
    '#lien-he'
  ];
  const isHome = !activeHash || activeHash === '#' || !knownHashes.includes(activeHash);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header settings={settings} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Banner Carousel - only on main home landing page */}
        {isHome && <HeroSlider sliders={sliders} />}

        {/* 1. Dịch Vụ Kế Toán Trọn Gói Section (#bang-gia) */}
        {(isHome || activeHash === '#bang-gia') && (
          <div className="animate-section-fade">
            <ServicePricing
              section={getSection('bang-gia')}
              priceTable={getPriceTable('bang-gia')}
              settings={settings}
              showTable={false}
            />
          </div>
        )}

        {/* 2. Giới Thiệu Section (#gioi-thieu) */}
        {(isHome || activeHash === '#gioi-thieu') && (
          <div className="animate-section-fade">
            <About section={getSection('gioi-thieu')} />
          </div>
        )}

        {/* 3. 6 Service Boxes Grid (#dich-vu) */}
        {(isHome || activeHash === '#dich-vu') && (
          <div className="animate-section-fade">
            <ServiceGrid services={services} />
          </div>
        )}

        {/* 4. Dịch Vụ Thành Lập Công Ty Section (#thanh-lap-cong-ty) */}
        {(isHome || activeHash === '#thanh-lap-cong-ty') && (
          <div className="animate-section-fade">
            <CompanySetup section={getSection('thanh-lap-cong-ty')} settings={settings} />
          </div>
        )}

        {/* 5. Dịch Vụ Dọn Dẹp Sổ Sách Section (#don-dep-so-sach) */}
        {(isHome || activeHash === '#don-dep-so-sach') && (
          <div className="animate-section-fade">
            <BookkeepingCleanup section={getSection('don-dep-so-sach')} settings={settings} />
          </div>
        )}

        {/* 6. Dịch Vụ Báo Cáo Tài Chính Section (#bao-cao-tai-chinh) */}
        {(isHome || activeHash === '#bao-cao-tai-chinh') && (
          <div className="animate-section-fade">
            <FinancialReport
              section={getSection('bao-cao-tai-chinh')}
              priceTable={getPriceTable('bao-cao-tai-chinh')}
              settings={settings}
            />
          </div>
        )}

        {/* 7. Đăng ký tư vấn / Liên hệ (#lien-he) */}
        {(isHome || activeHash === '#lien-he') && (
          <div className="animate-section-fade">
            <ContactSection />
          </div>
        )}
      </main>

      {/* Footer and Map Info */}
      <Footer settings={settings} />

      {/* Floating Buttons: Zalo and Phone */}
      <FloatingButtons settings={settings} />
    </div>
  );
};

export default HomePage;
