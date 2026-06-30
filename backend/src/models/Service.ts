import { Schema, model } from 'mongoose';

const ServiceSchema = new Schema({
  title: { type: String, required: true },
  titleZh: { type: String, default: '' },
  description: { type: String, default: '' },
  descriptionZh: { type: String, default: '' },
  iconUrl: { type: String, required: true },
  link: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

export const Service = model('Service', ServiceSchema);
export default Service;
