import { Router, Request, Response } from 'express';
import { Section } from '../models/Section';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get active sections sorted by order (Public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const sections = await Section.find({ isActive: true }).sort({ order: 1 });
    return res.json(sections);
  } catch (error) {
    console.error('Get sections error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get all sections including inactive ones (Admin only)
router.get('/all', authMiddleware, async (req: Request, res: Response) => {
  try {
    const sections = await Section.find().sort({ order: 1 });
    return res.json(sections);
  } catch (error) {
    console.error('Get all sections error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update a section by ID or sectionId (Admin only)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const section = await Section.findOneAndUpdate(
      { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }, { sectionId: id }] },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!section) {
      return res.status(404).json({ message: 'Section not found.' });
    }
    return res.json(section);
  } catch (error) {
    console.error('Update section error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
