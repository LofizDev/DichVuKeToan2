import { Schema, model } from 'mongoose';

const PriceFieldSchema = new Schema({
  sector: { type: String, required: true },
  sectorZh: { type: String, default: '' },
  price: { type: String, required: true }
});

const PriceRowSchema = new Schema({
  invoiceRange: { type: String, required: true },
  invoiceRangeZh: { type: String, default: '' },
  fields: [PriceFieldSchema]
});

const PriceTableSchema = new Schema({
  sectionId: { type: String, required: true, unique: true }, // e.g. 'bang-gia', 'bao-cao-tai-chinh'
  tableName: { type: String, required: true },
  tableNameZh: { type: String, default: '' },
  subHeader: { type: String, default: '' }, // e.g. 'Không phát sinh hóa đơn giá từ 300-500k/1 tháng'
  subHeaderZh: { type: String, default: '' },
  rows: [PriceRowSchema],
  contactRow: {
    label: { type: String, default: 'Từ 91 trở lên' },
    labelZh: { type: String, default: '' },
    contactInfo: { type: String, default: 'Ms Yên 098.668.6796' },
    contactInfoZh: { type: String, default: '' }
  }
});

export const PriceTable = model('PriceTable', PriceTableSchema);
export default PriceTable;
