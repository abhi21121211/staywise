import mongoose from 'mongoose';
import Property from '../models/Property';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/staywise';
    
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB connected successfully');

    // Ensure model indexes are created/synced (important for $text search)
    try {
      await Property.syncIndexes();
      console.log('✅ Property indexes synced');
    } catch (err) {
      console.warn('⚠️ Failed to sync Property indexes:', err);
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});