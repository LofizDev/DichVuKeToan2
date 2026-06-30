import { Router, Request, Response } from 'express';
import { Contact } from '../models/Contact';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Submit contact form (Public)
router.post('/', async (req: Request, res: Response) => {
  const { name, phone, message } = req.body;
  try {
    if (!name || !phone || !message) {
      return res.status(400).json({ message: 'Tên, Số điện thoại và Ý kiến là bắt buộc.' });
    }
    const newContact = new Contact(req.body);
    await newContact.save();
    return res.status(201).json(newContact);
  } catch (error) {
    console.error('Submit contact error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get all contact messages (Admin)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.json(contacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Mark contact message as read (Admin)
router.put('/:id/read', authMiddleware, async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!contact) {
      return res.status(404).json({ message: 'Message not found.' });
    }
    return res.json(contact);
  } catch (error) {
    console.error('Mark read error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete contact message (Admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Message not found.' });
    }
    return res.json({ message: 'Message deleted successfully.' });
  } catch (error) {
    console.error('Delete contact error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
