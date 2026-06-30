import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import type { Setting } from '../../types';

export const Settings: React.FC = () => {
  const [formData, setFormData] = useState<Setting>({
    siteName: '',
    siteNameZh: '',
    companyName: '',
    companyNameZh: '',
    email: '',
    adminEmail: '',
    phone: '',
    hotline: '',
    address: '',
    addressZh: '',
    zaloLink: '',
    googleMapEmbed: '',
    copyright: '',
    copyrightZh: '',
    logoUrl: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setStatus({ type: 'error', text: 'Không thể tải cấu hình cài đặt.' });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, text: '' });

    try {
      const response = await api.put('/settings', formData);
      setFormData(response.data);
      setStatus({ type: 'success', text: 'Cập nhật cấu hình cài đặt thành công!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setStatus({ type: 'error', text: 'Có lỗi xảy ra khi lưu cấu hình.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#124c8d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Cấu hình hệ thống</h1>
        <p className="text-gray-500 text-sm mt-0.5">Sửa thông tin liên hệ, logo, bản đồ hiển thị trên trang chủ</p>
      </div>

      {status.type && (
        <div
          className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 max-w-4xl ${
            status.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{status.text}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-4xl">
        <form onSubmit={handleSubmit} className="p-6 space-y-6 divide-y divide-gray-100">
          
          {/* Section 1: Brand Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#124c8d] text-base">Thông tin thương hiệu</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Website (Tiếng Việt)</label>
                <input
                  type="text"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Website (Tiếng Trung)</label>
                <input
                  type="text"
                  name="siteNameZh"
                  value={formData.siteNameZh || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên doanh nghiệp hiển thị (Tiếng Việt)</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên doanh nghiệp hiển thị (Tiếng Trung)</label>
                <input
                  type="text"
                  name="companyNameZh"
                  value={formData.companyNameZh || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Đường dẫn Logo (Ảnh logoUrl)</label>
              <input
                type="text"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="/assets/images/logo.png"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
              <p className="text-gray-400 text-xs mt-1">Sử dụng logo gốc: `/assets/images/ketoanchuyennghiep-banner.webp`</p>
            </div>
          </div>

          {/* Section 2: Contact Info */}
          <div className="space-y-4 pt-6">
            <h3 className="font-bold text-[#124c8d] text-base">Thông tin liên hệ trang chủ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email nhận thông tin (Liên hệ)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Quản trị Admin</label>
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Hotline (định dạng hiển thị)</label>
                <input
                  type="text"
                  name="hotline"
                  value={formData.hotline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Zalo Link</label>
                <input
                  type="text"
                  name="zaloLink"
                  value={formData.zaloLink}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ văn phòng (Tiếng Việt)</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ văn phòng (Tiếng Trung)</label>
                <textarea
                  name="addressZh"
                  value={formData.addressZh || ''}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Embed Map & Copyright */}
          <div className="space-y-4 pt-6">
            <h3 className="font-bold text-[#124c8d] text-base">Bản đồ & Copyright</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Google Map Embed Code (HTML iframe)</label>
              <textarea
                name="googleMapEmbed"
                value={formData.googleMapEmbed}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Copyright Footer Text (Tiếng Việt)</label>
                <input
                  type="text"
                  name="copyright"
                  value={formData.copyright}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Copyright Footer Text (Tiếng Trung)</label>
                <input
                  type="text"
                  name="copyrightZh"
                  value={formData.copyrightZh || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#124c8d] hover:bg-[#0e3c70] text-white font-bold px-6 py-2.5 rounded-lg text-sm shadow flex items-center gap-2 transition-all disabled:bg-gray-400"
            >
              <Save size={16} />
              {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
export default Settings;
