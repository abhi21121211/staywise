import mongoose, { Schema, Document } from 'mongoose';

export interface IPropertyDocument extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  createdAt: Date;
}

const PropertySchema = new Schema<IPropertyDocument>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  images: [{
    type: String
  }],
  amenities: [{
    type: String
  }],
  maxGuests: {
    type: Number,
    required: [true, 'Max guests is required'],
    min: [1, 'Must accommodate at least 1 guest']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required'],
    min: [0, 'Bathrooms cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IPropertyDocument>('Property', PropertySchema);