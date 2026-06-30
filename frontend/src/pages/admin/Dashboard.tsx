import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Grid, Images, CheckCircle, FolderOpen, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import type { ContactMessage } from '../../types';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    contactsCount: 0,
    unreadContacts: 0,
    servicesCount: 0,
    slidersCount: 0
  });
  const [recentContacts, setRecentContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [contactsRes, servicesRes, slidersRes] = await Promise.all([
        api.get('/contacts'),
        api.get('/services/all'),
        api.get('/sliders/all')
      ]);

      const contacts = contactsRes.data as ContactMessage[];
      const unread = contacts.filter((c) => !c.isRead).length;

      setStats({
        contactsCount: contacts.length,
        unreadContacts: unread,
        servicesCount: servicesRes.data.length,
        slidersCount: slidersRes.data.length
      });

      setRecentContacts(contacts.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.put(`/contacts/${id}/read`);
      fetchDashboardData();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#124c8d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Tổng tin nhắn',
      value: stats.contactsCount,
      icon: <Mail size={24} />,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100'
    },
    {
      label: 'Chưa đọc',
      value: stats.unreadContacts,
      icon: <Mail size={24} className="animate-pulse" />,
      color: stats.unreadContacts > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600',
      borderColor: stats.unreadContacts > 0 ? 'border-red-100' : 'border-green-100'
    },
    {
      label: 'Dịch vụ Grid',
      value: stats.servicesCount,
      icon: <Grid size={24} />,
      color: 'bg-indigo-50 text-indigo-600',
      borderColor: 'border-indigo-100'
    },
    {
      label: 'Sliders Banner',
      value: stats.slidersCount,
      icon: <Images size={24} />,
      color: 'bg-amber-50 text-amber-600',
      borderColor: 'border-amber-100'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="text-left">
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan quản trị</h1>
        <p className="text-gray-500 text-sm mt-0.5">Theo dõi hoạt động website và thông tin đăng ký tư vấn khách hàng</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-white border ${card.borderColor} rounded-xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow`}
          >
            <div className="text-left">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{card.label}</p>
              <p className="text-3xl font-extrabold text-gray-800 mt-2">{card.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${card.color} flex justify-center items-center`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Contacts & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Left Side: Recent Messages */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Mail size={18} className="text-gray-400" />
              Đăng ký liên hệ mới nhất
            </h3>
            <Link
              to="/admin/contacts"
              className="text-xs font-semibold text-[#124c8d] hover:text-[#ed1c24] flex items-center gap-1 transition-colors"
            >
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentContacts.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">Chưa có tin nhắn liên hệ nào.</div>
            ) : (
              recentContacts.map((contact) => (
                <div
                  key={contact._id}
                  className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-gray-50/30 ${
                    !contact.isRead ? 'bg-blue-50/10' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-800">{contact.name}</span>
                      {!contact.isRead && (
                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Mới
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      SĐT: <span className="font-medium text-gray-600">{contact.phone}</span> | Email:{' '}
                      <span className="font-medium text-gray-600">{contact.email || 'Không cung cấp'}</span>
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-1">{contact.message}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('vi-VN') : ''}
                    </span>
                    {!contact.isRead && (
                      <button
                        onClick={() => handleMarkRead(contact._id!)}
                        className="bg-blue-50 hover:bg-blue-100 text-[#124c8d] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle size={14} /> Đánh dấu đọc
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Quick Links */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FolderOpen size={18} className="text-gray-400" />
              Lối tắt quản lý nhanh
            </h3>
            <div className="space-y-2">
              <Link
                to="/admin/settings"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-blue-50/20 hover:border-blue-200 transition-all group"
              >
                <span className="text-sm text-gray-600 group-hover:text-[#124c8d] font-medium">Cấu hình thông tin liên hệ</span>
                <ArrowRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/admin/sections"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-blue-50/20 hover:border-blue-200 transition-all group"
              >
                <span className="text-sm text-gray-600 group-hover:text-[#124c8d] font-medium">Sửa nội dung các bài viết</span>
                <ArrowRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/admin/price-tables"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-blue-50/20 hover:border-blue-200 transition-all group"
              >
                <span className="text-sm text-gray-600 group-hover:text-[#124c8d] font-medium">Cập nhật bảng giá chi tiết</span>
                <ArrowRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
