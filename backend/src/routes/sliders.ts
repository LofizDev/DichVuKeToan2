import { Router, Request, Response } from 'express';
import { Slider } from '../models/Slider';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get active sliders (Public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const sliders = await Slider.find({ isActive: true }).sort({ order: 1 });
    return res.json(sliders);
  } catch (error) {
    console.error('Get sliders error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get all sliders (Admin)
router.get('/all', authMiddleware, async (req: Request, res: Response) => {
  try {
    const sliders = await Slider.find().sort({ order: 1 });
    return res.json(sliders);
  } catch (error) {
    console.error('Get all sliders error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create slider (Admin)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const slider = new Slider(req.body);
    await slider.save();
    return res.status(201).json(slider);
  } catch (error) {
    console.error('Create slider error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update slider (Admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const slider = await Slider.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!slider) {
      return res.status(404).json({ message: 'Slider not found.' });
    }
    return res.json(slider);
  } catch (error) {
    console.error('Update slider error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete slider (Admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const slider = await Slider.findByIdAndDelete(req.params.id);
    if (!slider) {
      return res.status(404).json({ message: 'Slider not found.' });
    }
    return res.json({ message: 'Slider deleted successfully.' });
  } catch (error) {
    console.error('Delete slider error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
