import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, User, Lock, AlertCircle } from 'lucide-react';
import api from '../services/api';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Vui lòng điền đầy đủ tên đăng nhập và mật khẩu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, admin } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(admin));
      navigate('/admin');
    } catch (err: any) {
      console.error('Login failure:', err);
      setError(err.response?.data?.message || 'Sai tên đăng nhập hoặc mật khẩu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#1f2937] to-[#124c8d] px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-100 text-left">
        {/* Header Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-[#124c8d] rounded-full flex justify-center items-center mb-4">
            <KeyRound size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center">ĐĂNG NHẬP HỆ THỐNG</h2>
          <p className="text-gray-400 text-sm mt-1 text-center">Quản lý nội dung website Zintax Finance</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-2 mb-6 text-sm">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên đăng nhập</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={18} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên tài khoản"
                required
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#124c8d]/20 focus:border-[#124c8d] outline-none text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#124c8d]/20 focus:border-[#124c8d] outline-none text-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#124c8d] hover:bg-[#0e3c70] text-white py-3 rounded-lg font-bold uppercase text-sm tracking-wider shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-gray-400 mt-2"
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <a href="/" className="text-sm font-medium text-gray-500 hover:text-[#124c8d] transition-colors">
            &larr; Quay lại trang chủ
          </a>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
