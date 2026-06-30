import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import type { SliderItem } from '../../types';

export const Sliders: React.FC = () => {
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: ''
  });

  // Modal / Form state
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlider, setCurrentSlider] = useState<Partial<SliderItem>>({
    imageUrl: '',
    altText: '',
    altTextZh: '',
    link: '#lien-he',
    order: 0,
    isActive: true
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchSliders = async () => {
    try {
      const response = await api.get('/sliders/all');
      setSliders(response.data);
    } catch (error) {
      console.error('Error fetching sliders:', error);
      setStatus({ type: 'error', text: 'Không thể tải danh sách sliders.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleOpenAdd = () => {
    setCurrentSlider({
      imageUrl: '',
      altText: '',
      altTextZh: '',
      link: '#lien-he',
      order: sliders.length + 1,
      isActive: true
    });
    setIsEditing(false);
    setIsOpen(true);
  };

  const handleOpenEdit = (slider: SliderItem) => {
    setCurrentSlider(slider);
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.name === 'isActive'
      ? e.target.value === 'true'
      : e.target.name === 'order'
        ? parseInt(e.target.value) || 0
        : e.target.value;

    setCurrentSlider({
      ...currentSlider,
      [e.target.name]: val
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, text: '' });

    try {
      if (isEditing && currentSlider._id) {
        await api.put(`/sliders/${currentSlider._id}`, currentSlider);
        setStatus({ type: 'success', text: 'Cập nhật slider thành công!' });
      } else {
        await api.post('/sliders', currentSlider);
        setStatus({ type: 'success', text: 'Thêm slider banner mới thành công!' });
      }
      setIsOpen(false);
      fetchSliders();
    } catch (error) {
      console.error('Error saving slider:', error);
      setStatus({ type: 'error', text: 'Có lỗi xảy ra khi lưu slider banner.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa slider banner này không?')) return;
    setStatus({ type: null, text: '' });

    try {
      await api.delete(`/sliders/${id}`);
      setStatus({ type: 'success', text: 'Đã xóa slider banner.' });
      fetchSliders();
    } catch (error) {
      console.error('Error deleting slider:', error);
      setStatus({ type: 'error', text: 'Không thể xóa slider này.' });
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
      <div className="flex justify-between items-center max-w-6xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Banner Sliders</h1>
          <p className="text-gray-500 text-sm mt-0.5">Cấu hình các ảnh chạy slide lớn ở đầu trang chủ</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#124c8d] hover:bg-[#0e3c70] text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow flex items-center gap-1.5 transition-all"
        >
          <Plus size={18} /> Thêm Banner
        </button>
      </div>

      {status.type && (
        <div
          className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 max-w-6xl ${
            status.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{status.text}</span>
        </div>
      )}

      {/* Sliders Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
        {sliders.length === 0 ? (
          <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
            Chưa có banner slider nào được tạo.
          </div>
        ) : (
          sliders.map((slider) => (
            <div key={slider._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
              {/* Image Preview */}
              <div className="h-48 bg-gray-100 relative">
                <img
                  src={slider.imageUrl}
                  alt={slider.altText}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/slider3.webp';
                  }}
                />
                <div className="absolute top-3 left-3 bg-[#1f2937]/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Thứ tự: {slider.order}
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      slider.isActive
                        ? 'bg-green-500 text-white shadow-sm'
                        : 'bg-gray-500 text-white shadow-sm'
                    }`}
                  >
                    {slider.isActive ? 'Kích hoạt' : 'Ẩn'}
                  </span>
                </div>
              </div>

              {/* Slider Info details */}
              <div className="p-4 space-y-2 flex-grow flex flex-col justify-between text-sm">
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-800 line-clamp-1">
                    <div>{slider.altText || 'Không có mô tả'}</div>
                    <div className="text-xs text-gray-400 font-normal">{slider.altTextZh || '(Chưa có tiếng Trung)'}</div>
                  </h4>
                  <p className="text-xs text-gray-400 font-mono line-clamp-1">Ảnh: {slider.imageUrl}</p>
                  <p className="text-xs text-gray-500">Liên kết: <span className="font-mono text-[11px] bg-gray-50 px-1.5 py-0.5 rounded">{slider.link || 'Trống'}</span></p>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 mt-4">
                  <button
                    onClick={() => handleOpenEdit(slider)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#124c8d] hover:bg-blue-50 px-3 py-1.5 rounded transition-all"
                  >
                    <Edit2 size={12} /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(slider._id!)}
                    className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition-all"
                  >
                    <Trash2 size={12} /> Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Dialog Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden animate-zoom-in text-left">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-base">
                {isEditing ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
              </h3>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả altText (Tiếng Việt) *</label>
                  <input
                    type="text"
                    name="altText"
                    value={currentSlider.altText}
                    onChange={handleChange}
                    required
                    placeholder="Ví dụ: Kế toán thuế trọn gói"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả altText (Tiếng Trung)</label>
                  <input
                    type="text"
                    name="altTextZh"
                    value={currentSlider.altTextZh || ''}
                    onChange={handleChange}
                    placeholder="Ví dụ: 全套代理记账"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Đường dẫn ảnh URL *</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={currentSlider.imageUrl}
                  onChange={handleChange}
                  required
                  placeholder="Ví dụ: /assets/images/slider3.webp"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
                />
                <p className="text-gray-400 text-xs mt-1">Ảnh gốc: `/assets/images/slider3.webp` hoặc `/assets/images/slider1_THUEYEN.png`</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Link liên kết click</label>
                <input
                  type="text"
                  name="link"
                  value={currentSlider.link}
                  onChange={handleChange}
                  placeholder="#bang-gia"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    name="order"
                    value={currentSlider.order}
                    onChange={handleChange}
                    min={0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Kích hoạt hiển thị</label>
                  <select
                    name="isActive"
                    value={currentSlider.isActive ? 'true' : 'false'}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                  >
                    <option value="true">Hiển thị (Bật)</option>
                    <option value="false">Ẩn (Tắt)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-semibold text-gray-600 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-[#124c8d] hover:bg-[#0e3c70] text-white px-5 py-2 rounded-lg text-sm font-bold shadow flex items-center gap-1.5 transition-all"
                >
                  <Save size={16} /> Lưu Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Sliders;
