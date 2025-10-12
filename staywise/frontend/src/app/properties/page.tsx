'use client';

import { useQuery } from '@tanstack/react-query';
import { propertyAPI } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';

export default function PropertiesPage() {
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: propertyAPI.getAll,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Failed to load properties. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Explore Properties
        </h1>
        <p className="text-gray-600">
          Find the perfect place for your next stay
        </p>
      </div>

      {properties && properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No properties available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties?.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}