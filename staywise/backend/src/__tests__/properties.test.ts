import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Property from '../models/Property';
import { connectDB } from '../config/database';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
});

afterEach(async () => {
  await Property.deleteMany({});
});

test('filters by text search (q) using $text', async () => {
  await Property.create([
    { title: 'Cozy apartment', description: 'A cozy place', price: 50, location: 'X', images: [], amenities: [], maxGuests: 2, bedrooms: 1, bathrooms: 1, type: 'apartment' },
    { title: 'Spacious house', description: 'Large and roomy', price: 150, location: 'Y', images: [], amenities: [], maxGuests: 6, bedrooms: 3, bathrooms: 2, type: 'house' },
  ]);

  // text search for 'cozy'
  const results = await Property.find({ $text: { $search: 'cozy' } });
  expect(results.length).toBe(1);
  expect(results[0].title).toMatch(/Cozy/i);
});

test('filters by type and price range', async () => {
  await Property.create([
    { title: 'Budget room', description: 'Cheap', price: 30, location: 'A', images: [], amenities: [], maxGuests: 1, bedrooms: 1, bathrooms: 1, type: 'studio' },
    { title: 'Luxury villa', description: 'Expensive', price: 500, location: 'B', images: [], amenities: [], maxGuests: 8, bedrooms: 4, bathrooms: 4, type: 'house' },
    { title: 'Mid apartment', description: 'Mid range', price: 120, location: 'C', images: [], amenities: [], maxGuests: 3, bedrooms: 2, bathrooms: 1, type: 'apartment' },
  ]);

  // type = apartment, minPrice = 100, maxPrice = 200
  const results = await Property.find({ type: 'apartment', price: { $gte: 100, $lte: 200 } });
  expect(results.length).toBe(1);
  expect(results[0].title).toMatch(/Mid apartment/i);
});
