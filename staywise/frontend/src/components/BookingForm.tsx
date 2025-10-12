'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { bookingAPI } from '@/lib/api';
import { Property } from '@/types';
import { isAuthenticated } from '@/lib/auth';

interface BookingFormProps {
  property: Property;
}

export default function BookingForm({ property }: BookingFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: bookingAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      router.push('/bookings');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Booking failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (!formData.checkIn || !formData.checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      setError('Check-out date must be after check-in date');
      return;
    }

    mutation.mutate({
      propertyId: property._id,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
    });
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const totalPrice = calculateNights() * property.price;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
      <div className="mb-4">
        <span className="text-3xl font-bold text-gray-800">₹{property.price}</span>
        <span className="text-gray-600"> / night</span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in
          </label>
          <input
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            value={formData.checkIn}
            onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out
          </label>
          <input
            type="date"
            required
            min={formData.checkIn || new Date().toISOString().split('T')[0]}
            value={formData.checkOut}
            onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Guests
          </label>
          <input
            type="number"
            required
            min="1"
            max={property.maxGuests}
            value={formData.guests}
            onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Maximum {property.maxGuests} guests
          </p>
        </div>

        {calculateNights() > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">
                ₹{property.price} × {calculateNights()} nights
              </span>
              <span className="text-gray-800">₹{totalPrice}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total</span>
              <span className="text-primary-600">₹{totalPrice}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? 'Booking...' : 'Reserve'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        You won't be charged yet
      </p>
    </div>
  );
}