import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import type { PriceTable, PriceRow } from '../../types';

export const PriceTables: React.FC = () => {
  const [priceTables, setPriceTables] = useState<PriceTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<PriceTable | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: ''
  });

  const fetchPriceTables = async () => {
    try {
      const response = await api.get('/price-tables');
      setPriceTables(response.data);
      if (response.data.length > 0 && !selectedTable) {
        setSelectedTable(response.data[0]);
      } else if (selectedTable) {
        const updated = response.data.find((pt: PriceTable) => pt.sectionId === selectedTable.sectionId);
        if (updated) setSelectedTable(updated);
      }
    } catch (error) {
      console.error('Error fetching price tables:', error);
      setStatus({ type: 'error', text: 'Không thể tải danh sách bảng giá.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceTables();
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedTable) return;
    setSelectedTable({
      ...selectedTable,
      [e.target.name]: e.target.value
    });
  };

  const handleContactRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedTable) return;
    setSelectedTable({
      ...selectedTable,
      contactRow: {
        ...selectedTable.contactRow,
        [e.target.name]: e.target.value
      }
    });
  };

  const handlePriceChange = (rowIdx: number, fieldIdx: number, fieldName: 'sector' | 'sectorZh' | 'price', value: string) => {
    if (!selectedTable) return;
    const newRows = [...selectedTable.rows];
    newRows[rowIdx].fields[fieldIdx] = {
      ...newRows[rowIdx].fields[fieldIdx],
      [fieldName]: value
    };
    setSelectedTable({ ...selectedTable, rows: newRows });
  };

  const handleInvoiceRangeChange = (rowIdx: number, value: string, isZh = false) => {
    if (!selectedTable) return;
    const newRows = [...selectedTable.rows];
    if (isZh) {
      newRows[rowIdx].invoiceRangeZh = value;
    } else {
      newRows[rowIdx].invoiceRange = value;
    }
    setSelectedTable({ ...selectedTable, rows: newRows });
  };

  const handleAddRow = () => {
    if (!selectedTable) return;
    const newRow: PriceRow = {
      invoiceRange: 'Mới...',
      invoiceRangeZh: 'New...',
      fields: [
        { sector: 'Thương mại, dịch vụ, tư vấn', sectorZh: '贸易、服务、咨询', price: '0 VND' },
        { sector: 'Xây dựng, sản xuất, gia công, lắp đặt, nhà hàng', sectorZh: '建筑、生产、加工、安装、餐饮', price: '0 VND' }
      ]
    };
    setSelectedTable({
      ...selectedTable,
      rows: [...selectedTable.rows, newRow]
    });
  };

  const handleRemoveRow = (rowIdx: number) => {
    if (!selectedTable) return;
    const newRows = selectedTable.rows.filter((_, idx) => idx !== rowIdx);
    setSelectedTable({
      ...selectedTable,
      rows: newRows
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) return;
    setSaving(true);
    setStatus({ type: null, text: '' });

    try {
      await api.put(`/price-tables/${selectedTable.sectionId}`, selectedTable);
      setStatus({ type: 'success', text: `Cập nhật bảng giá "${selectedTable.tableName}" thành công!` });
      fetchPriceTables();
    } catch (error) {
      console.error('Error saving price table:', error);
      setStatus({ type: 'error', text: 'Có lỗi xảy ra khi lưu bảng giá.' });
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
        <h1 className="text-2xl font-bold text-gray-800">Quản lý bảng giá dịch vụ</h1>
        <p className="text-gray-500 text-sm mt-0.5">Sửa cấu trúc cột, số hóa đơn và mức phí chi tiết cho các gói dịch vụ</p>
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
        {/* Left selector */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-sm text-gray-700">Lựa chọn Bảng giá</div>
          <div className="divide-y divide-gray-100">
            {priceTables.map((table) => (
              <button
                key={table._id}
                onClick={() => setSelectedTable(table)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors flex flex-col gap-1 ${
                  selectedTable?.sectionId === table.sectionId ? 'bg-blue-50/50 border-l-4 border-[#124c8d]' : ''
                }`}
              >
                <span className="font-bold text-sm text-gray-800 line-clamp-1">{table.tableName}</span>
                <span className="text-xs text-gray-400 font-mono">Section ID: {table.sectionId}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Editor */}
        {selectedTable && (
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="pb-4 border-b border-gray-100">
                <h3 className="font-bold text-[#124c8d] text-base">Thiết lập: {selectedTable.tableName}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tên bảng giá (Tiếng Việt)</label>
                  <input
                    type="text"
                    name="tableName"
                    value={selectedTable.tableName}
                    onChange={handleTextChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tên bảng giá (Tiếng Trung)</label>
                  <input
                    type="text"
                    name="tableNameZh"
                    value={selectedTable.tableNameZh || ''}
                    onChange={handleTextChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Dòng chú thích phụ (Tiếng Việt)</label>
                  <input
                    type="text"
                    name="subHeader"
                    value={selectedTable.subHeader || ''}
                    onChange={handleTextChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Dòng chú thích phụ (Tiếng Trung)</label>
                  <input
                    type="text"
                    name="subHeaderZh"
                    value={selectedTable.subHeaderZh || ''}
                    onChange={handleTextChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Rows List */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-700 text-sm">Các dòng định mức giá</h4>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="bg-blue-50 hover:bg-blue-100 text-[#124c8d] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                  >
                    <Plus size={14} /> Thêm dòng mới
                  </button>
                </div>

                <div className="space-y-4 border border-gray-200 rounded-xl p-4 bg-gray-50/30">
                  {selectedTable.rows.map((row, rowIdx) => (
                    <div key={row._id || rowIdx} className="bg-white p-4 border border-gray-100 rounded-lg shadow-sm space-y-3 relative group">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(rowIdx)}
                        className="absolute right-4 top-4 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100"
                        title="Xóa dòng này"
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* Invoice range */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-0.5">Số lượng hóa đơn (Tiếng Việt)</label>
                          <input
                            type="text"
                            value={row.invoiceRange}
                            onChange={(e) => handleInvoiceRangeChange(rowIdx, e.target.value, false)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-0.5">Số lượng hóa đơn (Tiếng Trung)</label>
                          <input
                            type="text"
                            value={row.invoiceRangeZh || ''}
                            onChange={(e) => handleInvoiceRangeChange(rowIdx, e.target.value, true)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {row.fields.map((field, fieldIdx) => (
                          <div key={field._id || fieldIdx} className="border border-gray-100 rounded-lg p-2.5 bg-gray-50/50 space-y-2">
                            <span className="text-[10px] font-bold text-gray-400 block tracking-wider uppercase">Lĩnh vực {fieldIdx + 1}</span>
                            <div>
                              <label className="block text-[10px] text-gray-500">Tên lĩnh vực (Tiếng Việt)</label>
                              <input
                                type="text"
                                value={field.sector}
                                onChange={(e) => handlePriceChange(rowIdx, fieldIdx, 'sector', e.target.value)}
                                className="w-full px-2.5 py-1 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-100 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-gray-500">Tên lĩnh vực (Tiếng Trung)</label>
                              <input
                                type="text"
                                value={field.sectorZh || ''}
                                onChange={(e) => handlePriceChange(rowIdx, fieldIdx, 'sectorZh', e.target.value)}
                                className="w-full px-2.5 py-1 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-100 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-gray-500">Mức giá</label>
                              <input
                                type="text"
                                value={field.price}
                                onChange={(e) => handlePriceChange(rowIdx, fieldIdx, 'price', e.target.value)}
                                className="w-full px-2.5 py-1 border border-gray-200 rounded-lg text-xs font-semibold text-[#ed1c24] focus:ring-1 focus:ring-blue-100 outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlight Contact row */}
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <h4 className="font-bold text-gray-700 text-sm">Dòng chân trang (Dành cho dòng liên hệ trực tiếp)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nhãn hóa đơn (Tiếng Việt)</label>
                    <input
                      type="text"
                      name="label"
                      value={selectedTable.contactRow.label}
                      onChange={handleContactRowChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nhãn hóa đơn (Tiếng Trung)</label>
                    <input
                      type="text"
                      name="labelZh"
                      value={selectedTable.contactRow.labelZh || ''}
                      onChange={handleContactRowChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung liên hệ (Tiếng Việt)</label>
                    <input
                      type="text"
                      name="contactInfo"
                      value={selectedTable.contactRow.contactInfo}
                      onChange={handleContactRowChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung liên hệ (Tiếng Trung)</label>
                    <input
                      type="text"
                      name="contactInfoZh"
                      value={selectedTable.contactRow.contactInfoZh || ''}
                      onChange={handleContactRowChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#124c8d] hover:bg-[#0e3c70] text-white font-bold px-6 py-2.5 rounded-lg text-sm shadow flex items-center gap-2 transition-all disabled:bg-gray-400"
                >
                  <Save size={16} />
                  {saving ? 'Đang lưu...' : 'Lưu bảng giá'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default PriceTables;
