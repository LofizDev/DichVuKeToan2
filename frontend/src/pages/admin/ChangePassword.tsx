import React, { useState } from 'react';
import { AlertCircle, CheckCircle, KeyRound } from 'lucide-react';
import api from '../../services/api';

export const ChangePassword: React.FC = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, text: '' });

    if (formData.newPassword.length < 6) {
      setStatus({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({ type: 'error', text: 'Mật khẩu mới và xác nhận mật khẩu không khớp.' });
      return;
    }

    setSaving(true);

    try {
      const response = await api.put('/auth/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });

      setStatus({ type: 'success', text: response.data.message || 'Cập nhật mật khẩu thành công!' });
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Change password error:', error);
      const errMsg = error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu.';
      setStatus({ type: 'error', text: errMsg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Đổi mật khẩu Admin</h1>
        <p className="text-gray-500 text-sm mt-0.5">Thay đổi mật khẩu đăng nhập của tài khoản quản trị</p>
      </div>

      {status.type && (
        <div
          className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 max-w-xl ${
            status.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{status.text}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-xl">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu hiện tại</label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu mới</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
              <p className="text-gray-400 text-xs mt-1">Độ dài tối thiểu là 6 ký tự.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#124c8d] hover:bg-[#0e3c70] text-white font-bold px-6 py-2.5 rounded-lg text-sm shadow flex items-center gap-2 transition-all disabled:bg-gray-400"
            >
              <KeyRound size={16} />
              {saving ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
