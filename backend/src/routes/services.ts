import { Router, Request, Response } from 'express';
import { Service } from '../models/Service';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get active services (Public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    return res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get all services (Admin)
router.get('/all', authMiddleware, async (req: Request, res: Response) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    return res.json(services);
  } catch (error) {
    console.error('Get all services error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Add a service (Admin)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const newService = new Service(req.body);
    await newService.save();
    return res.status(201).json(newService);
  } catch (error) {
    console.error('Create service error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update a service (Admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }
    return res.json(service);
  } catch (error) {
    console.error('Update service error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete a service (Admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }
    return res.json({ message: 'Service deleted successfully.' });
  } catch (error) {
    console.error('Delete service error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
