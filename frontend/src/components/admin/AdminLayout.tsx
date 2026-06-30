import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  FolderEdit,
  Grid,
  TableProperties,
  Images,
  Inbox,
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import api from '../../services/api';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Verify session
    api.get('/auth/me')
      .then((res) => {
        setAdminName(res.data.username);
      })
      .catch((err) => {
        console.error('Session expired:', err);
        localStorage.clear();
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Tổng quan', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Cài đặt chung', path: '/admin/settings', icon: <Settings size={20} /> },
    { label: 'Nội dung trang', path: '/admin/sections', icon: <FolderEdit size={20} /> },
    { label: 'Dịch vụ grid', path: '/admin/services', icon: <Grid size={20} /> },
    { label: 'Bảng giá', path: '/admin/price-tables', icon: <TableProperties size={20} /> },
    { label: 'Banner Sliders', path: '/admin/sliders', icon: <Images size={20} /> },
    { label: 'Tin nhắn liên hệ', path: '/admin/contacts', icon: <Inbox size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1f2937] text-white flex flex-col justify-between shadow-xl">
        <div className="flex flex-col">
          {/* Logo Brand */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-800 bg-[#111827]">
            <div className="text-blue-400">
              <ShieldCheck size={26} />
            </div>
            <span className="font-bold text-base tracking-wide">ZINTAX ADMIN</span>
          </div>

          {/* User profile brief */}
          <div className="p-4 bg-gray-800/40 border-b border-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex justify-center items-center font-bold text-white text-lg">
              {adminName[0].toUpperCase()}
            </div>
            <div className="text-left">
              <p className="font-medium text-sm text-gray-200">{adminName}</p>
              <p className="text-xs text-blue-400">Quản trị viên</p>
            </div>
          </div>

          {/* Menu links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#124c8d] text-white shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={16} />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-800 bg-[#111827]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-white hover:bg-red-600/20 rounded-lg text-sm font-medium transition-all"
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-grow flex flex-col min-h-screen overflow-hidden">
        {/* Top navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex justify-between items-center px-8 shadow-sm">
          <div className="text-gray-500 font-medium text-sm">
            {location.pathname === '/admin' ? 'Bảng điều khiển tổng quan' : 'Quản trị trang / ' + menuItems.find(m => m.path === location.pathname)?.label}
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#124c8d] border border-[#124c8d] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
            >
              Xem trang ngoài &rarr;
            </a>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-grow p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
