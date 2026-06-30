import { Schema, model } from 'mongoose';

const ContactSchema = new Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, default: '', trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, default: '', trim: true },
  message: { type: String, required: true, trim: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Contact = model('Contact', ContactSchema);
export default Contact;
