'use client';

import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, eachDayOfInterval, startOfDay, differenceInCalendarDays } from 'date-fns';
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
  const [formData, setFormData] = useState<{
    checkIn: Date | null;
    checkOut: Date | null;
    guests: number;
  }>({
    checkIn: null,
    checkOut: null,
    guests: 1,
  });
  const [error, setError] = useState('');

  // fetch existing bookings for this property to compute unavailable dates
  const { data: existingBookings = [] } = useQuery({
    queryKey: ['property-bookings', property._id],
    queryFn: () => bookingAPI.getByProperty(property._id),
  });

  // DEBUG: log fetched bookings and property id
  console.debug('BookingForm propertyId:', property._id);
  console.debug('BookingForm existingBookings:', existingBookings);

  // compute unavailable dates (array of Date) from existing bookings
  // build a set of unavailable day timestamps at start-of-day to avoid timezone mismatches
  const unavailableSet = new Set<number>();
  const unavailableDates: Date[] = [];
  for (const b of existingBookings) {
    const rawStart = new Date(b.checkIn);
    const rawEnd = new Date(b.checkOut);
    // include each day between start and end (exclusive of checkout day)
    const days = eachDayOfInterval({ start: rawStart, end: addDays(rawEnd, -1) });
    for (const d of days) {
      const sd = startOfDay(d);
      const ts = sd.getTime();
      if (!unavailableSet.has(ts)) {
        unavailableSet.add(ts);
        unavailableDates.push(sd);
      }
    }
  }

  // helper: check if date is unavailable by comparing start-of-day timestamp
  function isDateUnavailable(date: Date) {
    return unavailableSet.has(startOfDay(date).getTime());
  }

  // DEBUG: log unavailable dates for inspection
  console.debug('BookingForm unavailableDates:', unavailableDates.map((d) => d.toISOString()));

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

      // Ensure selected dates don't overlap existing bookings
      const selectedStart = startOfDay(formData.checkIn!);
      const selectedEnd = startOfDay(formData.checkOut!);

      for (const b of existingBookings) {
  const bStart = startOfDay(new Date(b.checkIn));
  const bEnd = startOfDay(new Date(b.checkOut));
        // overlap condition
        if (!(selectedEnd <= bStart || selectedStart >= bEnd)) {
          setError('Selected dates overlap an existing booking. Please choose other dates.');
          return;
        }
      }

    if (startOfDay(formData.checkOut!).getTime() <= startOfDay(formData.checkIn!).getTime()) {
      setError('Check-out date must be after check-in date');
      return;
    }

    mutation.mutate({
      propertyId: property._id,
      // send ISO dates (UTC) to server
      checkIn: formData.checkIn!.toISOString(),
      checkOut: formData.checkOut!.toISOString(),
      guests: formData.guests,
    });
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    return Math.max(0, differenceInCalendarDays(startOfDay(formData.checkOut), startOfDay(formData.checkIn)));
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
          <DatePicker
            selected={formData.checkIn}
            onChange={(date: Date | null) => {
              // if new check-in is after current check-out, clear check-out
              if (formData.checkOut && date) {
                if (startOfDay(formData.checkOut).getTime() <= startOfDay(date).getTime()) {
                  setFormData({ ...formData, checkIn: date, checkOut: null });
                  return;
                }
              }
              setFormData({ ...formData, checkIn: date });
            }}
            minDate={new Date()}
            excludeDates={unavailableDates}
            filterDate={(d: Date) => !isDateUnavailable(d)}
            placeholderText="Select check-in"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out
          </label>
          <DatePicker
            selected={formData.checkOut}
            onChange={(date: Date | null) => {
              setFormData({ ...formData, checkOut: date });
            }}
            minDate={formData.checkIn ? addDays(startOfDay(formData.checkIn), 1) : new Date()}
            excludeDates={unavailableDates}
            filterDate={(d: Date) => !isDateUnavailable(d)}
            placeholderText="Select check-out"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        {/* Booked ranges summary */}
        {existingBookings.length > 0 && (
          <div className="mt-3 text-sm text-gray-600">
            <div className="font-medium mb-1">Booked ranges:</div>
            <ul className="list-disc ml-5">
              {existingBookings.map((b: any) => (
                <li key={b._id}>
                  {new Date(b.checkIn).toISOString().split('T')[0]} — {new Date(b.checkOut).toISOString().split('T')[0]}
                </li>
              ))}
            </ul>
          </div>
        )}

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