import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/Property';
import User from './models/User';

dotenv.config();

const sampleProperties = [
  {
    title: "Luxury Beach Villa",
    description: "Beautiful beachfront villa with stunning ocean views. Perfect for families and groups looking for a relaxing getaway. Features include a private pool, direct beach access, and modern amenities throughout.",
    price: 15000,
    location: "Goa, India",
    images: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
    ],
    amenities: ["WiFi", "Private Pool", "Kitchen", "Air Conditioning", "Beach Access", "Parking", "BBQ Grill", "Ocean View"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },
  {
    title: "Mountain Retreat Cabin",
    description: "Cozy cabin nestled in the mountains with breathtaking views. Ideal for nature lovers and adventure seekers. Enjoy hiking trails, fresh mountain air, and peaceful surroundings.",
    price: 8000,
    location: "Manali, Himachal Pradesh",
    images: [
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800",
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800"
    ],
    amenities: ["WiFi", "Fireplace", "Kitchen", "Heating", "Mountain View", "Parking", "Hiking Trails", "Garden"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Urban Modern Apartment",
    description: "Stylish apartment in the heart of the city. Walking distance to restaurants, shops, and entertainment. Perfect for business travelers or couples exploring the city.",
    price: 5000,
    location: "Mumbai, Maharashtra",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ],
    amenities: ["WiFi", "Gym", "Air Conditioning", "Elevator", "City View", "Security", "Work Desk", "Smart TV"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Heritage Haveli Stay",
    description: "Experience royal living in this beautifully restored heritage haveli. Rich in history and culture, with traditional Rajasthani architecture and modern comforts.",
    price: 12000,
    location: "Jaipur, Rajasthan",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800"
    ],
    amenities: ["WiFi", "Pool", "Restaurant", "Air Conditioning", "Heritage Property", "Cultural Tours", "Parking", "Room Service"],
    maxGuests: 10,
    bedrooms: 5,
    bathrooms: 4
  },
  {
    title: "Lake View Cottage",
    description: "Charming cottage with serene lake views. Perfect for a peaceful retreat with fishing, boating, and nature walks. Escape the hustle and bustle of city life.",
    price: 6000,
    location: "Nainital, Uttarakhand",
    images: [
      "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=800",
      "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=800"
    ],
    amenities: ["WiFi", "Lake View", "Kitchen", "Fireplace", "Boat Access", "Parking", "Garden", "Outdoor Seating"],
    maxGuests: 5,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Boutique City Hotel Room",
    description: "Elegant boutique hotel room in the city center. Combines comfort with convenience, perfect for solo travelers or couples on a city break.",
    price: 3500,
    location: "Bangalore, Karnataka",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"
    ],
    amenities: ["WiFi", "Air Conditioning", "Room Service", "Mini Bar", "Smart TV", "Work Desk", "24/7 Reception", "Breakfast Included"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1
  }
];

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/staywise';
    await mongoose.connect(mongoURI);
    
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Property.deleteMany({});
    console.log('🗑️  Cleared existing properties');

    // Insert sample properties
    const properties = await Property.insertMany(sampleProperties);
    console.log(`✅ Inserted ${properties.length} sample properties`);

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: 'admin@staywise.com' });
    if (!adminExists) {
      const admin = new User({
        email: 'admin@staywise.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Created admin user (email: admin@staywise.com, password: admin123)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create test user if doesn't exist
    const testUserExists = await User.findOne({ email: 'test@staywise.com' });
    if (!testUserExists) {
      const testUser = new User({
        email: 'test@staywise.com',
        password: 'test123',
        name: 'Test User',
        role: 'user'
      });
      await testUser.save();
      console.log('✅ Created test user (email: test@staywise.com, password: test123)');
    } else {
      console.log('ℹ️  Test user already exists');
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nYou can now login with:');
    console.log('Admin - email: admin@staywise.com, password: admin123');
    console.log('User  - email: test@staywise.com, password: test123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();