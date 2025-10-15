import express, { Response } from 'express';
import Booking from '../models/Booking';
import Property from '../models/Property';
import { authenticate, authorize } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// Get user's bookings
router.get('/my-bookings', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ user: req.user!.userId })
      .populate('property')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error: any) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get bookings for a specific property (public)
router.get('/property/:propertyId', async (req, res: Response) => {
  try {
    const { propertyId } = req.params;

    const bookings = await Booking.find({ property: propertyId, status: { $ne: 'cancelled' } }).sort({ checkIn: 1 });

    res.json(bookings);
  } catch (error: any) {
    console.error('Get bookings by property error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all bookings (admin only)
router.get('/all', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate('property')
      .populate('user', '-password')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error: any) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create booking
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, checkIn, checkOut, guests } = req.body;

    // Validation
    if (!propertyId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if guests exceed max capacity
    if (guests > property.maxGuests) {
      return res.status(400).json({ 
        message: `Property can accommodate maximum ${property.maxGuests} guests` 
      });
    }

    // Calculate total price
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * property.price;

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      property: propertyId,
      status: { $ne: 'cancelled' },
      $or: [
        { checkIn: { $lte: checkOutDate }, checkOut: { $gte: checkInDate } }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ 
        message: 'Property is not available for selected dates' 
      });
    }

    // Create booking
    const booking = new Booking({
      property: propertyId,
      user: req.user!.userId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      status: 'confirmed'
    });

    await booking.save();
    await booking.populate('property');

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error: any) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel booking
router.patch('/:id/cancel', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.user.toString() !== req.user!.userId && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;