import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import type { ServiceItem } from '../../types';

export const Services: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: ''
  });

  // Modal / Form state
  const [isOpen, setIsOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<ServiceItem>>({
    title: '',
    titleZh: '',
    description: '',
    descriptionZh: '',
    iconUrl: '/assets/images/icon.webp',
    link: '#lien-he',
    order: 0,
    isActive: true
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services/all');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      setStatus({ type: 'error', text: 'Không thể tải danh sách dịch vụ.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setCurrentService({
      title: '',
      titleZh: '',
      description: '',
      descriptionZh: '',
      iconUrl: '/assets/images/icon.webp',
      link: '#lien-he',
      order: services.length + 1,
      isActive: true
    });
    setIsEditing(false);
    setIsOpen(true);
  };

  const handleOpenEdit = (service: ServiceItem) => {
    setCurrentService(service);
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.name === 'isActive'
      ? e.target.value === 'true'
      : e.target.name === 'order'
        ? parseInt(e.target.value) || 0
        : e.target.value;

    setCurrentService({
      ...currentService,
      [e.target.name]: val
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, text: '' });

    try {
      if (isEditing && currentService._id) {
        await api.put(`/services/${currentService._id}`, currentService);
        setStatus({ type: 'success', text: `Cập nhật dịch vụ "${currentService.title}" thành công!` });
      } else {
        await api.post('/services', currentService);
        setStatus({ type: 'success', text: `Thêm dịch vụ "${currentService.title}" thành công!` });
      }
      setIsOpen(false);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      setStatus({ type: 'error', text: 'Có lỗi xảy ra khi lưu thông tin dịch vụ.' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa dịch vụ "${name}" không?`)) return;
    setStatus({ type: null, text: '' });

    try {
      await api.delete(`/services/${id}`);
      setStatus({ type: 'success', text: `Đã xóa dịch vụ "${name}".` });
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      setStatus({ type: 'error', text: 'Không thể xóa dịch vụ này.' });
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
          <h1 className="text-2xl font-bold text-gray-800">Quản lý dịch vụ Grid</h1>
          <p className="text-gray-500 text-sm mt-0.5">Quản lý 6 ô dịch vụ hiển thị ở mục giữa trang chủ</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#124c8d] hover:bg-[#0e3c70] text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow flex items-center gap-1.5 transition-all"
        >
          <Plus size={18} /> Thêm dịch vụ
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

      {/* Services Grid Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden max-w-6xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 font-bold border-b border-gray-100 text-sm">
                <th className="py-4 px-6 w-16 text-center">Thứ tự</th>
                <th className="py-4 px-6 w-20 text-center">Icon</th>
                <th className="py-4 px-6">Tên dịch vụ</th>
                <th className="py-4 px-6">Mô tả tóm tắt</th>
                <th className="py-4 px-6">Link liên kết</th>
                <th className="py-4 px-6 w-24 text-center">Trạng thái</th>
                <th className="py-4 px-6 w-28 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">Chưa có dịch vụ nào được định nghĩa.</td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-center font-semibold">{service.order}</td>
                    <td className="py-4 px-6 flex justify-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex justify-center items-center p-1 border border-gray-200">
                        <img
                          src={service.iconUrl}
                          alt="Icon"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/images/icon.webp';
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-800">
                      <div>{service.title}</div>
                      <div className="text-xs text-gray-400 font-normal">{service.titleZh || '(Chưa có tiếng Trung)'}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-500 line-clamp-2 max-w-xs">{service.description}</td>
                    <td className="py-4 px-6 font-mono text-xs">{service.link}</td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                          service.isActive
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {service.isActive ? 'Bật' : 'Tắt'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleOpenEdit(service)}
                          className="p-1.5 text-gray-500 hover:text-[#124c8d] hover:bg-blue-50 rounded transition-all"
                          title="Sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id!, service.title)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dialog Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden animate-zoom-in text-left">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-base">
                {isEditing ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
              </h3>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tên dịch vụ (Tiếng Việt) *</label>
                  <input
                    type="text"
                    name="title"
                    value={currentService.title}
                    onChange={handleChange}
                    required
                    placeholder="Ví dụ: Dịch vụ làm báo cáo tài chính"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tên dịch vụ (Tiếng Trung)</label>
                  <input
                    type="text"
                    name="titleZh"
                    value={currentService.titleZh || ''}
                    onChange={handleChange}
                    placeholder="Ví dụ: 财务报表服务"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả tóm tắt (Tiếng Việt)</label>
                <textarea
                  name="description"
                  value={currentService.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Nhập mô tả ngắn gọn bằng Tiếng Việt..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả tóm tắt (Tiếng Trung)</label>
                <textarea
                  name="descriptionZh"
                  value={currentService.descriptionZh || ''}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Nhập mô tả ngắn gọn bằng Tiếng Trung..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Đường dẫn Icon URL *</label>
                  <input
                    type="text"
                    name="iconUrl"
                    value={currentService.iconUrl}
                    onChange={handleChange}
                    required
                    placeholder="/assets/images/icon.webp"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Link liên kết nội bộ</label>
                  <input
                    type="text"
                    name="link"
                    value={currentService.link}
                    onChange={handleChange}
                    placeholder="#bao-cao-tai-chinh"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    name="order"
                    value={currentService.order}
                    onChange={handleChange}
                    min={0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Kích hoạt hiển thị</label>
                  <select
                    name="isActive"
                    value={currentService.isActive ? 'true' : 'false'}
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
                  <Save size={16} /> Lưu dịch vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Services;
