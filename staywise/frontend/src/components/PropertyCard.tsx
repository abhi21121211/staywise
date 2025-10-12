import Link from 'next/link';
import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer">
        <div className="h-48 bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center">
          {property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-6xl">🏠</span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {property.title}
          </h3>
          
          <p className="text-gray-600 mb-3 line-clamp-2">
            {property.description}
          </p>
          
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <span className="mr-4">📍 {property.location}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <span>👥 {property.maxGuests} guests</span>
            <span>🛏️ {property.bedrooms} beds</span>
            <span>🚿 {property.bathrooms} baths</span>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <span className="text-2xl font-bold text-primary-600">
                ₹{property.price}
              </span>
              <span className="text-gray-500 text-sm"> / night</span>
            </div>
            <span className="text-primary-600 font-semibold hover:text-primary-700">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}