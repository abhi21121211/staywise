'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { bookingAPI } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { Booking } from '@/types';

export default function BookingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingAPI.getMyBookings,
    enabled: isAuthenticated(),
  });

  const cancelMutation = useMutation({
    mutationFn: bookingAPI.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated()) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Failed to load bookings. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">My Bookings</h1>

      {bookings && bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 text-lg mb-4">
            You haven't made any bookings yet.
          </p>
          <button
            onClick={() => router.push('/properties')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-semibold"
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings?.map((booking: Booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  {booking.property.images.length > 0 ? (
                    <img
                      src={booking.property.images[0]}
                      alt={booking.property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center">
                      <span className="text-white text-6xl">🏠</span>
                    </div>
                  )}
                </div>

                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                        {booking.property.title}
                      </h3>
                      <p className="text-gray-600">
                        📍 {booking.property.location}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">Check-in</p>
                      <p className="font-semibold">{formatDate(booking.checkIn)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Check-out</p>
                      <p className="font-semibold">{formatDate(booking.checkOut)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Guests</p>
                      <p className="font-semibold">{booking.guests}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Total Price</p>
                      <p className="font-semibold text-primary-600">
                        ₹{booking.totalPrice}
                      </p>
                    </div>
                  </div>

                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => cancelMutation.mutate(booking._id)}
                      disabled={cancelMutation.isPending}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}