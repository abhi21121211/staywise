import express, { Response } from 'express';
import Property from '../models/Property';
import { authenticate, authorize } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// Get all properties (public)
router.get('/', async (req, res: Response) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (error: any) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single property (public)
router.get('/:id', async (req, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error: any) {
    console.error('Get property error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create property (admin only)
router.post('/', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const propertyData = req.body;

    const property = new Property(propertyData);
    await property.save();

    res.status(201).json({
      message: 'Property created successfully',
      property
    });
  } catch (error: any) {
    console.error('Create property error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update property (admin only)
router.put('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({
      message: 'Property updated successfully',
      property
    });
  } catch (error: any) {
    console.error('Update property error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete property (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ message: 'Property deleted successfully' });
  } catch (error: any) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;