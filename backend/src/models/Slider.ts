import { Schema, model } from 'mongoose';

const SliderSchema = new Schema({
  imageUrl: { type: String, required: true },
  altText: { type: String, default: '' },
  altTextZh: { type: String, default: '' },
  link: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

export const Slider = model('Slider', SliderSchema);
export default Slider;
