import React, { useState } from 'react';
import type { Setting } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { X, Copy, Check } from 'lucide-react';

interface FloatingButtonsProps {
  settings: Setting | null;
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({ settings }) => {
  const { lang, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  
  const phoneNum = settings?.phone || '0904846088';
  const zaloUrl = settings?.zaloLink || `https://zalo.me/${phoneNum}`;
  const wechatId = 'bichngoc1088';

  const handleCopyIdOnly = () => {
    navigator.clipboard.writeText(wechatId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <>
      {/* WeChat QR Code Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in" 
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 relative border border-gray-100 flex flex-col items-center text-center scale-100 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* WeChat Header */}
            <div className="flex items-center gap-2 mb-4 mt-2">
              <img src="/assets/images/wechat.png" alt="WeChat" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg text-gray-800">WeChat Connect</span>
            </div>

            {/* QR Code Image */}
            <div className="w-56 h-56 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden p-2 mb-4 flex justify-center items-center shadow-inner">
              <img 
                src="/assets/images/wechat-qr.jpg" 
                alt="WeChat QR Code" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            {/* Instructions */}
            <p className="text-gray-600 text-sm font-semibold mb-1">
              {lang === 'vi' ? 'Quét mã QR bằng WeChat để kết bạn' : '使用微信扫一扫加好友'}
            </p>
            <p className="text-gray-400 text-xs mb-4">
              {lang === 'vi' ? 'Hoặc kết bạn qua WeChat ID dưới đây:' : '或通过下方微信号加好友:'}
            </p>

            {/* Copy ID container */}
            <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 flex justify-between items-center gap-2">
              <div className="flex flex-col text-left">
                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">WeChat ID</span>
                <span className="text-gray-800 font-bold text-base font-mono">{wechatId}</span>
              </div>
              <button
                onClick={handleCopyIdOnly}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                  copiedId 
                    ? 'bg-green-500 text-white' 
                    : 'bg-[#124c8d] text-white hover:bg-[#0e3c70]'
                }`}
              >
                {copiedId ? (
                  <>
                    <Check size={14} /> {lang === 'vi' ? 'Đã copy' : '已复制'}
                  </>
                ) : (
                  <>
                    <Copy size={14} /> {lang === 'vi' ? 'Sao chép' : '复制'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4">
        {/* WeChat Button */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="relative w-[55px] h-[55px] group cursor-pointer"
        >
          <div className="phone-vr-circle-fill wechat-circle"></div>
          <div className="phone-vr-img-circle wechat">
            <div className="block w-full h-full p-2.5">
              <img
                src="/assets/images/wechat.png"
                alt="WeChat ID"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          {/* Tooltip banner on hover */}
          <div className="phone-bar hidden lg:block select-none pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#07c160]" style={{ backgroundColor: '#07c160' }}>
            <span className="text-white font-bold text-sm">
              WeChat: {wechatId} ({lang === 'vi' ? 'Mở mã QR' : '打开二维码'})
            </span>
          </div>
        </div>

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
    </>
  );
};
export default FloatingButtons;
