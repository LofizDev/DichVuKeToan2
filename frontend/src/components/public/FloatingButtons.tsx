import React from 'react';
import type { Setting } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface FloatingButtonsProps {
  settings: Setting | null;
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({ settings }) => {
  const { t } = useLanguage();
  const phoneNum = settings?.phone || '0904846088';
  const zaloUrl = settings?.zaloLink || `https://zalo.me/${phoneNum}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4">
      {/* Zalo Button */}
      <div className="relative w-[55px] h-[55px]">
        <div className="phone-vr-circle-fill"></div>
        <div className="phone-vr-img-circle zalo">
          <a target="_blank" rel="noopener noreferrer" href={zaloUrl} className="block w-full h-full p-2.5">
            <img
              src="/assets/images/zalo.png"
              alt="Zalo Chat"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg';
              }}
            />
          </a>
        </div>
      </div>

      {/* Hotline / Phone Button */}
      <div className="relative w-[55px] h-[55px] flex items-center">
        <div className="phone-vr-circle-fill"></div>
        <div className="phone-vr-img-circle">
          <a href={`tel:${phoneNum}`} className="block w-full h-full p-2.5">
            <img
              src="/assets/images/phone.png"
              alt="Hotline"
              className="w-full h-full object-contain brightness-0 invert"
              onError={(e) => {
                // fallback
                (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/724/724664.png';
              }}
            />
          </a>
        </div>
        {/* Phone number banner on hover */}
        <div className="phone-bar hidden lg:block select-none pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          <a href={`tel:${phoneNum}`}>{t('nav.hotline')}: {settings?.hotline || phoneNum}</a>
        </div>
      </div>
    </div>
  );
};
export default FloatingButtons;
