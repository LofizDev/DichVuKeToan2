import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Setting, PriceTable } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

// Import public components
import Header from '../components/public/Header';
import ContactSection from '../components/public/ContactSection';
import Footer from '../components/public/Footer';
import FloatingButtons from '../components/public/FloatingButtons';

export const ContactPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [settings, setSettings] = useState<Setting | null>(null);
  const [priceTable, setPriceTable] = useState<PriceTable | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, priceTablesRes] = await Promise.all([
          api.get('/settings'),
          api.get('/price-tables')
        ]);
        setSettings(settingsRes.data);
        const pt = priceTablesRes.data.find((table: PriceTable) => table.sectionId === 'bao-cao-tai-chinh');
        setPriceTable(pt || null);
      } catch (error) {
        console.error('Error fetching contact page data:', error);
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

  // Fallback static data matching exactly the user request in case DB is not loaded
  const fallbackRows = [
    {
      invoiceRange: 'Dưới 16',
      invoiceRangeZh: '16张以下',
      fields: [
        { sector: 'Thương mại, dịch vụ, tư vấn', sectorZh: '贸易、服务、咨询', price: '500.000 – 1.000.000 VND' },
        { sector: 'Xây dựng, sản xuất, gia công, lắp đặt, nhà hàng', sectorZh: '建筑、生产、加工、安装、餐饮', price: '1.000.000 – 1.300.000 VND' }
      ]
    },
    {
      invoiceRange: 'Dưới 31',
      invoiceRangeZh: '31张以下',
      fields: [
        { sector: 'Thương mại, dịch vụ, tư vấn', sectorZh: '贸易、服务、咨询', price: '1.100.000 VND' },
        { sector: 'Xây dựng, sản xuất, gia công, lắp đặt, nhà hàng', sectorZh: '建筑、生产、加工、安装、餐饮', price: '1.500.000 VND' }
      ]
    },
    {
      invoiceRange: 'Dưới 50',
      invoiceRangeZh: '50张以下',
      fields: [
        { sector: 'Thương mại, dịch vụ, tư vấn', sectorZh: '贸易、服务、咨询', price: '1.500.000 VND' },
        { sector: 'Xây dựng, sản xuất, gia công, lắp đặt, nhà hàng', sectorZh: '建筑、生产、加工、安装、餐饮', price: '1.800.000 VND' }
      ]
    },
    {
      invoiceRange: 'Dưới 90',
      invoiceRangeZh: '90张以下',
      fields: [
        { sector: 'Thương mại, dịch vụ, tư vấn', sectorZh: '贸易、服务、咨询', price: '1.800.000 VND' },
        { sector: 'Xây dựng, sản xuất, gia công, lắp đặt, nhà hàng', sectorZh: '建筑、生产、加工、安装、餐饮', price: '2.300.000 VND' }
      ]
    }
  ];

  const rowsToRender = priceTable?.rows || fallbackRows;
  const tableName = (lang === 'vi' ? priceTable?.tableName : priceTable?.tableNameZh) || priceTable?.tableName || 'BẢNG GIÁ DỊCH VỤ LÀM BÁO CÁO TÀI CHÍNH';
  const subHeader = (lang === 'vi' ? priceTable?.subHeader : priceTable?.subHeaderZh) || priceTable?.subHeader || '';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header settings={settings} />

      {/* Main Content */}
      <main className="flex-grow">


        {/* Pricing Table Section */}
        <section className="py-12 bg-white px-4">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header inside container */}
              <div className="bg-gradient-to-r from-[#124c8d] to-[#1e5aa0] text-white py-6 px-8 text-center">
                <h2 className="text-2xl font-bold tracking-wide uppercase">
                  {tableName}
                </h2>
                {subHeader && (
                  <p className="text-sm font-light mt-2 opacity-90">
                    {subHeader}
                  </p>
                )}
              </div>

              {/* Table wrapper */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100/80 text-gray-700 font-bold border-b border-gray-200 text-sm">
                      <th className="py-4 px-6 text-center border-r border-gray-200 w-1/4">
                        {t('priceTable.invoiceCountShort') || (lang === 'vi' ? 'Số lượng hóa đơn' : '发票数量')}
                      </th>
                      <th className="py-4 px-6 border-r border-gray-200 w-2/5">
                        {t('priceTable.sector') || (lang === 'vi' ? 'Lĩnh vực hoạt động' : '业务领域')}
                      </th>
                      <th className="py-4 px-6 text-center w-1/3">
                        {t('priceTable.yearlyFee') || (lang === 'vi' ? 'Mức phí dịch vụ / năm' : '服务费 / 年')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsToRender.map((row, idx) => (
                      <React.Fragment key={idx}>
                        {row.fields.map((field, fieldIdx) => (
                          <tr
                            key={fieldIdx}
                            className={`border-b border-gray-100 hover:bg-gray-50/80 transition-colors text-sm ${
                              idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                            }`}
                          >
                            {fieldIdx === 0 && (
                              <td
                                rowSpan={row.fields.length}
                                className="py-4 px-6 text-center font-bold text-gray-800 border-r border-gray-200 align-middle bg-gray-50/20"
                              >
                                {(lang === 'vi' ? row.invoiceRange : row.invoiceRangeZh) || row.invoiceRange}
                              </td>
                            )}
                            <td className="py-4 px-6 text-gray-600 border-r border-gray-200 font-medium">
                              {(lang === 'vi' ? field.sector : field.sectorZh) || field.sector}
                            </td>
                            <td className="py-4 px-6 text-center font-bold text-[#ed1c24] text-base">
                              {field.price}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}

                    {/* Highlight Row */}
                    <tr className="bg-gradient-to-r from-[#ed1c24]/5 to-transparent border-t-2 border-gray-200">
                      <td className="py-5 px-6 font-bold text-center border-r border-gray-200 text-gray-800 bg-gray-50/50 text-sm">
                        {lang === 'vi' ? 'Từ 91 trở lên' : '91张以上'}
                      </td>
                      <td colSpan={2} className="py-5 px-6 text-center font-extrabold text-[#ed1c24] text-lg sm:text-xl">
                        {lang === 'vi' ? 'Liên hệ trực tiếp: ' : '直接联系: '}
                        <a href={`tel:${settings?.phone || '0904846088'}`} className="hover:underline">
                          {settings?.phone || '0904846088'}
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer settings={settings} />

      {/* Floating Action Buttons */}
      <FloatingButtons settings={settings} />
    </div>
  );
};

export default ContactPage;
