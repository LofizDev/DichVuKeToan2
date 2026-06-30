import { Schema, model } from 'mongoose';

const SectionSchema = new Schema({
  sectionId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  titleZh: { type: String, default: '' },
  content: { type: String, default: '' },
  contentZh: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now }
});

export const Section = model('Section', SectionSchema);
export default Section;
