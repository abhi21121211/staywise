import express, { Response } from 'express';
import mongoose from 'mongoose';
import Property from '../models/Property';
import { authenticate, authorize } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// Get available property types
router.get('/types', async (req, res: Response) => {
  try {
    const types = await Property.distinct('type');
    res.json(types.filter(Boolean));
  } catch (error: any) {
    console.error('Get property types error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all properties (public)
router.get('/', async (req, res: Response) => {
  try {
    // Support simple query params for search and filtering
  const { q, type, minPrice, maxPrice, bedrooms, minBeds, maxBeds } = req.query as Record<string, string>;

    const filter: any = {};

    // text search on title or description: prefer $text for performance when available
    if (q) {
      // Use $text search (requires a text index on title & description)
      filter.$text = { $search: q };
    }

    if (type) {
      filter.type = type;
    }

    // bedrooms filters
    if (bedrooms) {
      if (bedrooms === '5plus') {
        // special value from frontend to mean 5 or more
        filter.bedrooms = { $gte: 5 };
      } else if (!Number.isNaN(Number(bedrooms))) {
        filter.bedrooms = Number(bedrooms);
      }
    }

    if (minBeds || maxBeds) {
      filter.bedrooms = filter.bedrooms || {};
      if (minBeds) filter.bedrooms.$gte = Number(minBeds);
      if (maxBeds) filter.bedrooms.$lte = Number(maxBeds);
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

  // debug: log the computed filter and incoming query
  console.debug('Get /properties query:', req.query);
  console.debug('Get /properties filter:', JSON.stringify(filter));

  // Pagination support
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 12));

  const skip = (page - 1) * limit;

  const [total, properties] = await Promise.all([
    Property.countDocuments(filter),
    Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
  ]);

  const pages = Math.ceil(total / limit) || 1;

  res.json({ data: properties, total, page, pages });
  } catch (error: any) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single property (public)
router.get('/:id', async (req, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ObjectId first to avoid CastError when a non-id path (like 'types') is requested
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid property id' });
    }

    const property = await Property.findById(id);

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