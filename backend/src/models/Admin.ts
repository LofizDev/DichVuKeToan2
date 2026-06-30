import { Schema, model } from 'mongoose';

const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  email: { type: String, required: true, trim: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

export const Admin = model('Admin', AdminSchema);
export default Admin;
