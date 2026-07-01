import React from 'react';
import type { Section, PriceTable, Setting } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface FinancialReportProps {
  section: Section | null;
  priceTable: PriceTable | null;
  settings: Setting | null;
}

export const FinancialReport: React.FC<FinancialReportProps> = ({ section, priceTable, settings }) => {
  const { lang, t } = useLanguage();

  if (!section) return null;

  let htmlContent = (lang === 'vi' ? section.content : section.contentZh) || section.content;
  if (settings) {
    const companyName = (lang === 'vi' ? settings.companyName : settings.companyNameZh) || settings.companyName;
    if (companyName) {
      htmlContent = htmlContent
        .replace(/CÔNG TY TNHH DỊCH VỤ VÀ TƯ VẤN VIỆT HƯNG/g, companyName)
        .replace(/越兴服务与咨询有限公司/g, companyName);
    }
  }

  return (
    <section id="bao-cao-tai-chinh" className="py-12 bg-white px-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 relative pb-3 border-b-2 border-[#124c8d] inline-block mx-auto left-1/2 -translate-x-1/2">
          {(lang === 'vi' ? section.title : section.titleZh) || section.title}
        </h2>

        {/* Intro Text */}
        <div className="prose max-w-none text-gray-600 text-left mb-8">
          <p className="mb-6 font-medium text-lg text-gray-700">
            {t('financialReport.intro')}
          </p>
          <div className="flex justify-center mb-8">
            <img
              src="/assets/images/bao-cao-tai-chinh-1.webp"
              alt="Báo cáo tài chính"
              className="rounded-lg shadow-md max-w-full h-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&q=80&w=600';
              }}
            />
          </div>
        </div>

        {/* Dynamic Price Table */}
        {priceTable && (
          <div className="my-10 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-[#124c8d] text-white py-4 px-6 text-center">
              <h3 className="text-xl font-bold">{(lang === 'vi' ? priceTable.tableName : priceTable.tableNameZh) || priceTable.tableName}</h3>
              {((lang === 'vi' ? priceTable.subHeader : priceTable.subHeaderZh) || priceTable.subHeader) && (
                <p className="text-sm font-light mt-1">{(lang === 'vi' ? priceTable.subHeader : priceTable.subHeaderZh) || priceTable.subHeader}</p>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                    <th className="py-4 px-6 text-center border-r border-gray-200">{t('priceTable.invoiceCountShort')}</th>
                    <th className="py-4 px-6 border-r border-gray-200">{t('priceTable.sector')}</th>
                    <th className="py-4 px-6 text-center">{t('priceTable.yearlyFee')}</th>
                  </tr>
                </thead>
                <tbody>
                  {priceTable.rows.map((row, idx) => (
                    <React.Fragment key={row._id || idx}>
                      {row.fields.map((field, fieldIdx) => (
                        <tr
                           key={field._id || fieldIdx}
                           className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                             idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                           }`}
                        >
                          {fieldIdx === 0 && (
                            <td
                              rowSpan={row.fields.length}
                              className="py-4 px-6 text-center font-bold text-gray-800 border-r border-gray-200 align-middle bg-gray-50/30"
                            >
                              {(lang === 'vi' ? row.invoiceRange : row.invoiceRangeZh) || row.invoiceRange}
                            </td>
                          )}
                          <td className="py-4 px-6 text-gray-600 border-r border-gray-200">{(lang === 'vi' ? field.sector : field.sectorZh) || field.sector}</td>
                          <td className="py-4 px-6 text-center font-semibold text-[#ed1c24]">{field.price}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}

                  {/* Highlight Row */}
                  <tr className="bg-[#ed1c24]/5 border-t-2 border-gray-200">
                    <td className="py-5 px-6 font-bold text-center border-r border-gray-200 text-gray-800 bg-gray-50/50">
                      {(lang === 'vi' ? priceTable.contactRow?.label : priceTable.contactRow?.labelZh) || priceTable.contactRow?.label || 'Từ 91 trở lên'}
                    </td>
                    <td colSpan={2} className="py-5 px-6 text-center font-bold text-[#ed1c24] text-lg">
                      {t('priceTable.contactDirect')}: {settings?.phone || priceTable.contactRow?.contactInfo}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-center my-8">
          <img
            src="/assets/images/bao-cao-tai-chinh-2.png"
            alt="Nội dung dịch vụ Báo cáo tài chính"
            className="rounded-lg shadow-md max-w-full h-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600';
            }}
          />
        </div>

        {/* Detailed Service Content */}
        <div
          className="prose max-w-none text-gray-600 text-left leading-relaxed mt-6 space-y-4"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </section>
  );
};
export default FinancialReport;
