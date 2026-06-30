import React from 'react';
import type { ServiceItem } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ServiceGridProps {
  services: ServiceItem[];
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({ services }) => {
  const { lang, t } = useLanguage();

  if (!services || services.length === 0) return null;

  return (
    <section id="dich-vu" className="py-16 bg-[#446084]/5 px-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4 relative pb-3 border-b-2 border-[#124c8d] inline-block mx-auto left-1/2 -translate-x-1/2">
          {t('serviceGrid.title')}
        </h2>
        <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
          {t('serviceGrid.subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const title = (lang === 'vi' ? service.title : service.titleZh) || service.title;
            const description = (lang === 'vi' ? service.description : service.descriptionZh) || service.description;

            return (
              <div
                key={service._id || index}
                className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center p-8 group"
              >
                {/* Icon Container */}
                <div className="w-20 h-20 bg-blue-50 rounded-full flex justify-center items-center mb-6 group-hover:bg-[#124c8d] transition-colors duration-300">
                  <img
                    src={service.iconUrl}
                    alt={title}
                    className="w-12 h-12 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/icon.webp';
                    }}
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-[#124c8d] transition-colors duration-300">
                  {service.link ? (
                    <a href={service.link} className="hover:underline">
                      {title}
                    </a>
                  ) : (
                    title
                  )}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed flex-grow">
                  {description}
                </p>

                {/* Action Link */}
                {service.link && (
                  <a
                    href={service.link}
                    className="mt-6 text-sm font-semibold text-[#124c8d] hover:text-[#ed1c24] flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200"
                  >
                    {t('serviceGrid.viewDetail')} &rarr;
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default ServiceGrid;
