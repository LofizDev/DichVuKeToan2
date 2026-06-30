import { Router, Request, Response } from 'express';
import { Setting } from '../models/Setting';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get settings (Public)
router.get('/', async (req: Request, res: Response) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Create default if not exists
      settings = new Setting();
      await settings.save();
    }
    return res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update settings (Admin only)
router.put('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting(req.body);
    } else {
      Object.assign(settings, req.body);
      settings.updatedAt = new Date();
    }
    await settings.save();
    return res.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
