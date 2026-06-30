import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Trash2, ShieldAlert, FileText } from 'lucide-react';
import api from '../../services/api';
import type { ContactMessage } from '../../types';

export const Contacts: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: ''
  });

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contacts');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      setStatus({ type: 'error', text: 'Không thể tải tin nhắn liên hệ.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead && msg._id) {
      try {
        await api.put(`/contacts/${msg._id}/read`);
        // update local list
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, isRead: true } : m))
        );
        setSelectedMessage({ ...msg, isRead: true });
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tin nhắn của "${name}"?`)) return;
    setStatus({ type: null, text: '' });

    try {
      await api.delete(`/contacts/${id}`);
      setStatus({ type: 'success', text: `Đã xóa tin nhắn của "${name}".` });
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      setStatus({ type: 'error', text: 'Có lỗi xảy ra khi xóa tin nhắn.' });
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === 'unread') return !m.isRead;
    if (filter === 'read') return m.isRead;
    return true;
  });

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
        <h1 className="text-2xl font-bold text-gray-800">Quản lý tin nhắn đăng ký</h1>
        <p className="text-gray-500 text-sm mt-0.5">Tiếp nhận thông tin khách hàng điền form tư vấn trên trang chủ</p>
      </div>

      {status.type && (
        <div
          className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 max-w-6xl ${
            status.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {status.type === 'success' ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
          <span>{status.text}</span>
        </div>
      )}

      {/* Tabs Selector */}
      <div className="flex gap-2 border-b border-gray-200 pb-px max-w-6xl">
        {(['all', 'unread', 'read'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2.5 text-xs font-bold uppercase border-b-2 transition-all ${
              filter === tab
                ? 'border-[#124c8d] text-[#124c8d]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab === 'all' && `Tất cả (${messages.length})`}
            {tab === 'unread' && `Chưa đọc (${messages.filter((m) => !m.isRead).length})`}
            {tab === 'read' && `Đã đọc (${messages.filter((m) => m.isRead).length})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl">
        {/* Left Side: Messages Inbox List */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">Không tìm thấy tin nhắn liên hệ nào.</div>
            ) : (
              filteredMessages.map((msg) => (
                <button
                  key={msg._id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`w-full p-4 hover:bg-gray-50 transition-colors flex flex-col gap-1 text-left ${
                    selectedMessage?._id === msg._id ? 'bg-blue-50/40 border-r-4 border-[#124c8d]' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${!msg.isRead ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('vi-VN') : ''}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-semibold">{msg.phone}</div>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{msg.message}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Message Details View */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    <Mail className="text-gray-400" size={20} />
                    {selectedMessage.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Thời gian gửi: {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString('vi-VN') : ''}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage._id!, selectedMessage.name)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors"
                  title="Xóa tin nhắn"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Customer Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wide">Số điện thoại</span>
                  <a href={`tel:${selectedMessage.phone}`} className="font-bold text-[#124c8d] hover:underline mt-0.5 block">
                    {selectedMessage.phone}
                  </a>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wide">Địa chỉ email</span>
                  <span className="font-medium text-gray-700 mt-0.5 block">
                    {selectedMessage.email || 'Không cung cấp'}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wide">Địa chỉ doanh nghiệp</span>
                  <span className="font-medium text-gray-700 mt-0.5 block">
                    {selectedMessage.address || 'Không cung cấp'}
                  </span>
                </div>
              </div>

              {/* Message text content */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Ý kiến / Yêu cầu tư vấn</span>
                <div className="bg-blue-50/10 border border-blue-100/50 p-6 rounded-lg text-gray-700 leading-relaxed text-sm whitespace-pre-line min-h-[150px]">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-12 text-center text-gray-400 flex flex-col items-center gap-3">
              <FileText size={48} className="text-gray-300" />
              <p className="text-sm font-medium">Chọn một tin nhắn từ hộp thư để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Contacts;
