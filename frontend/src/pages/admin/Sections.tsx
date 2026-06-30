import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, AlertCircle, Eye, Code } from 'lucide-react';
import api from '../../services/api';
import type { Section } from '../../types';

export const Sections: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editTab, setEditTab] = useState<'editor' | 'preview'>('editor');
  const [editTabZh, setEditTabZh] = useState<'editor' | 'preview'>('editor');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: ''
  });

  const fetchSections = async () => {
    try {
      const response = await api.get('/sections/all');
      setSections(response.data);
      if (response.data.length > 0 && !selectedSection) {
        setSelectedSection(response.data[0]);
      } else if (selectedSection) {
        const updated = response.data.find((s: Section) => s._id === selectedSection._id);
        if (updated) setSelectedSection(updated);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      setStatus({ type: 'error', text: 'Không thể tải danh sách bài viết.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!selectedSection) return;
    setSelectedSection({
      ...selectedSection,
      [e.target.name]: e.target.value
    });
  };

  const handleToggleActive = () => {
    if (!selectedSection) return;
    setSelectedSection({
      ...selectedSection,
      isActive: !selectedSection.isActive
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSection) return;
    setSaving(true);
    setStatus({ type: null, text: '' });

    try {
      await api.put(`/sections/${selectedSection.sectionId}`, selectedSection);
      setStatus({ type: 'success', text: `Cập nhật bài viết "${selectedSection.title}" thành công!` });
      fetchSections();
    } catch (error) {
      console.error('Error saving section:', error);
      setStatus({ type: 'error', text: 'Có lỗi xảy ra khi lưu bài viết.' });
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
        <h1 className="text-2xl font-bold text-gray-800">Quản lý nội dung bài viết</h1>
        <p className="text-gray-500 text-sm mt-0.5">Chỉnh sửa nội dung văn bản giới thiệu, dịch vụ và chính sách của các mục hiển thị trên web</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl">
        {/* Left Side: Sidebar Selection List */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-sm text-gray-700">Danh sách các Section</div>
          <div className="divide-y divide-gray-100">
            {sections.map((section) => (
              <button
                key={section._id}
                onClick={() => setSelectedSection(section)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors flex flex-col gap-1 ${
                  selectedSection?._id === section._id ? 'bg-blue-50/50 border-l-4 border-[#124c8d]' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-sm text-gray-800 line-clamp-1">{section.title}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      section.isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}
                  >
                    {section.isActive ? 'Bật' : 'Tắt'}
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-mono">ID: {section.sectionId}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Active Section Form Editor */}
        {selectedSection && (
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="font-bold text-[#124c8d] text-base">Bài viết: {selectedSection.sectionId}</h3>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleToggleActive}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selectedSection.isActive
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    Trạng thái: {selectedSection.isActive ? 'Đang kích hoạt' : 'Đang tạm tắt'}
                  </button>
                </div>
              </div>

              {/* Title inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tiêu đề Section (Tiếng Việt)</label>
                  <input
                    type="text"
                    name="title"
                    value={selectedSection.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tiêu đề Section (Tiếng Trung)</label>
                  <input
                    type="text"
                    name="titleZh"
                    value={selectedSection.titleZh || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Vietnamese HTML Editor Tab Selector */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-4">
                <h4 className="font-bold text-gray-800 text-sm border-l-4 border-blue-600 pl-2">Nội dung Tiếng Việt</h4>
                <div>
                  <div className="flex border-b border-gray-200 mb-3">
                    <button
                      type="button"
                      onClick={() => setEditTab('editor')}
                      className={`px-4 py-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 -mb-[2px] transition-colors ${
                        editTab === 'editor'
                          ? 'border-[#124c8d] text-[#124c8d]'
                          : 'border-transparent text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <Code size={14} /> Mã nguồn HTML
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditTab('preview')}
                      className={`px-4 py-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 -mb-[2px] transition-colors ${
                        editTab === 'preview'
                          ? 'border-[#124c8d] text-[#124c8d]'
                          : 'border-transparent text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <Eye size={14} /> Xem thử hiển thị
                    </button>
                  </div>

                  {editTab === 'editor' ? (
                    <div>
                      <textarea
                        name="content"
                        value={selectedSection.content}
                        onChange={handleChange}
                        rows={10}
                        className="w-full p-4 border border-gray-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        placeholder="Nhập mã HTML vào đây..."
                      />
                      <p className="text-gray-400 text-xs mt-1">Sử dụng mã HTML chuẩn. Bạn có thể sử dụng các thẻ `&lt;p&gt;`, `&lt;strong&gt;`...</p>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50 min-h-[200px] text-left overflow-y-auto max-h-[300px]">
                      <div
                        className="prose max-w-none text-gray-600 space-y-4"
                        dangerouslySetInnerHTML={{ __html: selectedSection.content }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Chinese HTML Editor Tab Selector */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-4">
                <h4 className="font-bold text-gray-800 text-sm border-l-4 border-red-600 pl-2">Nội dung Tiếng Trung</h4>
                <div>
                  <div className="flex border-b border-gray-200 mb-3">
                    <button
                      type="button"
                      onClick={() => setEditTabZh('editor')}
                      className={`px-4 py-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 -mb-[2px] transition-colors ${
                        editTabZh === 'editor'
                          ? 'border-[#124c8d] text-[#124c8d]'
                          : 'border-transparent text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <Code size={14} /> Mã nguồn HTML
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditTabZh('preview')}
                      className={`px-4 py-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 -mb-[2px] transition-colors ${
                        editTabZh === 'preview'
                          ? 'border-[#124c8d] text-[#124c8d]'
                          : 'border-transparent text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <Eye size={14} /> Xem thử hiển thị
                    </button>
                  </div>

                  {editTabZh === 'editor' ? (
                    <div>
                      <textarea
                        name="contentZh"
                        value={selectedSection.contentZh || ''}
                        onChange={handleChange}
                        rows={10}
                        className="w-full p-4 border border-gray-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        placeholder="Nhập mã HTML Tiếng Trung vào đây..."
                      />
                      <p className="text-gray-400 text-xs mt-1">Sử dụng mã HTML chuẩn. Bạn có thể sử dụng các thẻ `&lt;p&gt;`, `&lt;strong&gt;`...</p>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50 min-h-[200px] text-left overflow-y-auto max-h-[300px]">
                      <div
                        className="prose max-w-none text-gray-600 space-y-4"
                        dangerouslySetInnerHTML={{ __html: selectedSection.contentZh || '' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#124c8d] hover:bg-[#0e3c70] text-white font-bold px-6 py-2.5 rounded-lg text-sm shadow flex items-center gap-2 transition-all disabled:bg-gray-400"
                >
                  <Save size={16} />
                  {saving ? 'Đang lưu...' : 'Lưu bài viết'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default Sections;
