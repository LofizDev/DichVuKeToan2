import { Schema, model } from 'mongoose';

const SettingSchema = new Schema({
  siteName: { type: String, default: 'Dịch vụ kế toán chuyên nghiệp' },
  siteNameZh: { type: String, default: '' },
  companyName: { type: String, default: 'CÔNG TY TNHH DỊCH VỤ VÀ TƯ VẤN VIỆT HƯNG' },
  companyNameZh: { type: String, default: '' },
  email: { type: String, default: 'zintaxfinance@gmail.com' },
  adminEmail: { type: String, default: 'zintaxfinance.info@gmail.com' },
  phone: { type: String, default: '0904846088' },
  hotline: { type: String, default: '0904.846.088' },
  address: { type: String, default: 'Tầng 6, tòa nhà MD Complex (Tòa VP), Số 68 Phố Nguyễn Cơ Thạch, Phường Từ Liêm, TP Hà Nội, Việt Nam' },
  addressZh: { type: String, default: '' },
  zaloLink: { type: String, default: 'https://zalo.me/0904846088' },
  googleMapEmbed: { type: String, default: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.9056249339343!2d105.76451641042732!3d21.036461787431267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454b5dfd4b7eb%3A0xe53bc13a699c279c!2zNjggTmd1eeG7hW4gQ8ahIFRo4bqhY2gsIE3hu7kgxJDDrG5oLCBU4burIExpw6ptLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1719658765432!5m2!1svi!2s" style="border: 0;width: 100%;" frameborder="0" allowfullscreen=""></iframe>' },
  copyright: { type: String, default: '© 2016 - 2026 ketoanchuyennghiep.com.vn. All rights reserved' },
  copyrightZh: { type: String, default: '' },
  logoUrl: { type: String, default: '/assets/images/ketoanchuyennghiep-banner.webp' },
  updatedAt: { type: Date, default: Date.now }
});

export const Setting = model('Setting', SettingSchema);
export default Setting;
