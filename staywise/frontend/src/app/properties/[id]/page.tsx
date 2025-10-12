'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { propertyAPI } from '@/lib/api';
import BookingForm from '@/components/BookingForm';

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => propertyAPI.getById(propertyId),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Property not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Images */}
          <div className="mb-6">
            {property.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="col-span-2 w-full h-96 object-cover rounded-lg"
                />
                {property.images.slice(1, 5).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${property.title} ${idx + 2}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <div className="w-full h-96 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-9xl">🏠</span>
              </div>
            )}
          </div>

          {/* Title and Location */}
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {property.title}
          </h1>
          <p className="text-gray-600 mb-6 flex items-center">
            <span className="mr-2">📍</span>
            {property.location}
          </p>

          {/* Property Info */}
          <div className="flex items-center space-x-6 mb-6 pb-6 border-b">
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-800">{property.maxGuests}</p>
              <p className="text-gray-600 text-sm">Guests</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-800">{property.bedrooms}</p>
              <p className="text-gray-600 text-sm">Bedrooms</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-800">{property.bathrooms}</p>
              <p className="text-gray-600 text-sm">Bathrooms</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              About this place
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center text-gray-700">
                    <span className="mr-2">✓</span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-1">
          <BookingForm property={property} />
        </div>
      </div>
    </div>
  );
}