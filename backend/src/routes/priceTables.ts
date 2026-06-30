import { Router, Request, Response } from 'express';
import { PriceTable } from '../models/PriceTable';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get price tables (Public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const priceTables = await PriceTable.find();
    return res.json(priceTables);
  } catch (error) {
    console.error('Get price tables error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific price table (Public)
router.get('/:sectionId', async (req: Request, res: Response) => {
  try {
    const priceTable = await PriceTable.findOne({ sectionId: req.params.sectionId });
    if (!priceTable) {
      return res.status(404).json({ message: 'Price table not found.' });
    }
    return res.json(priceTable);
  } catch (error) {
    console.error('Get price table error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update or create a price table (Admin)
router.put('/:sectionId', authMiddleware, async (req: Request, res: Response) => {
  const { sectionId } = req.params;
  try {
    let priceTable = await PriceTable.findOne({ sectionId });
    if (!priceTable) {
      priceTable = new PriceTable({ sectionId, ...req.body });
    } else {
      Object.assign(priceTable, req.body);
    }
    await priceTable.save();
    return res.json(priceTable);
  } catch (error) {
    console.error('Update price table error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
