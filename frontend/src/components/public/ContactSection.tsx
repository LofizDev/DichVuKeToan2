import React, { useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

export const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setStatus({
        type: 'error',
        text: t('contact.validationMsg')
      });
      return;
    }

    setLoading(true);
    setStatus({ type: null, text: '' });

    try {
      await api.post('/contacts', formData);
      setStatus({
        type: 'success',
        text: t('contact.successMsg')
      });
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error('Submit contact error:', error);
      setStatus({
        type: 'error',
        text: t('contact.errorMsg')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="lien-he" className="py-16 bg-gray-50 px-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Why Choose Us */}
        <div className="lg:col-span-5 text-left flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 relative pb-3 border-b-2 border-[#124c8d] inline-block">
            {t('contact.whyChooseUs')}
          </h3>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex justify-center items-center font-bold text-[#124c8d]">
                1
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-base">{t('contact.reason1Title')}</h4>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  {t('contact.reason1Desc')}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex justify-center items-center font-bold text-[#124c8d]">
                2
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-base">{t('contact.reason2Title')}</h4>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  {t('contact.reason2Desc')}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex justify-center items-center font-bold text-[#124c8d]">
                3
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-base">{t('contact.reason3Title')}</h4>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  {t('contact.reason3Desc')}
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-left">
            <h3 className="text-xl font-bold text-[#124c8d] mb-6 text-center">{t('contact.registerTitle')}</h3>
            
            {status.type && (
              <div
                className={`p-4 mb-6 rounded-lg text-sm font-medium ${
                  status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {status.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('contact.namePlaceholder')}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#124c8d]/20 focus:border-[#124c8d] outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.address')}</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={t('contact.addressPlaceholder')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#124c8d]/20 focus:border-[#124c8d] outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.phone')}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('contact.phonePlaceholder')}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#124c8d]/20 focus:border-[#124c8d] outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('contact.emailPlaceholder')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#124c8d]/20 focus:border-[#124c8d] outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.message')}</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('contact.messagePlaceholder')}
                  rows={4}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#124c8d]/20 focus:border-[#124c8d] outline-none text-sm transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#124c8d] hover:bg-[#0e3c70] text-white py-3 rounded-lg font-bold uppercase text-sm tracking-wider shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-gray-400"
              >
                {loading ? t('contact.submitting') : t('contact.submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ContactSection;
