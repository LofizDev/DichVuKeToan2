import React, { useState, useEffect } from 'react';
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header settings={settings} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Banner Carousel */}
        <HeroSlider sliders={sliders} />

        {/* 1. Dịch Vụ Kế Toán Trọn Gói Section (#bang-gia) */}
        <ServicePricing
          section={getSection('bang-gia')}
          priceTable={getPriceTable('bang-gia')}
          settings={settings}
        />

        {/* 2. Giới Thiệu Section (#gioi-thieu) */}
        <About section={getSection('gioi-thieu')} />

        {/* 3. 6 Service Boxes Grid (#dich-vu) */}
        <ServiceGrid services={services} />

        {/* 4. Dịch Vụ Thành Lập Công Ty Section (#thanh-lap-cong-ty) */}
        <CompanySetup section={getSection('thanh-lap-cong-ty')} settings={settings} />

        {/* 5. Dịch Vụ Dọn Dẹp Sổ Sách Section (#don-dep-so-sach) */}
        <BookkeepingCleanup section={getSection('don-dep-so-sach')} settings={settings} />

        {/* 6. Dịch Vụ Báo Cáo Tài Chính Section (#bao-cao-tai-chinh) */}
        <FinancialReport
          section={getSection('bao-cao-tai-chinh')}
          priceTable={getPriceTable('bao-cao-tai-chinh')}
          settings={settings}
        />

        {/* 7. Đăng Ký Tư Vấn Form (#lien-he) */}
        <ContactSection />
      </main>

      {/* Footer and Map Info */}
      <Footer settings={settings} />

      {/* Floating Buttons: Zalo and Phone */}
      <FloatingButtons settings={settings} />
    </div>
  );
};
export default HomePage;
