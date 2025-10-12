StayWise - Property Booking Platform
A full-stack web application for listing properties and creating bookings, built with Next.js, Express.js, MongoDB, and TypeScript.

Features
✅ User authentication (JWT-based signup/login)
✅ Browse and view property listings
✅ Detailed property information pages
✅ Create and manage bookings
✅ User dashboard to view personal bookings
✅ Admin capabilities (view all bookings)
✅ Responsive design with Tailwind CSS
✅ Real-time availability checking
Tech Stack
Frontend
Next.js 14 (App Router)
TypeScript
Tailwind CSS
React Query (TanStack Query)
Axios
Backend
Node.js
Express.js
MongoDB with Mongoose
JWT for authentication
bcryptjs for password hashing
Project Structure
staywise/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth middleware
│   │   ├── types/       # TypeScript types
│   │   └── index.ts     # Entry point
│   └── package.json
│
└── frontend/         # Next.js application
    ├── src/
    │   ├── app/         # App router pages
    │   ├── components/  # React components
    │   ├── lib/         # Utilities & API client
    │   └── types/       # TypeScript types
    └── package.json
Getting Started
Prerequisites
Node.js (v18 or higher)
MongoDB (v6 or higher)
npm or yarn
Installation
1. Clone the repository
bash
git clone <repository-url>
cd staywise
2. Setup Backend
bash
cd backend
npm install
Create a .env file in the backend directory:

env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/staywise
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
Start MongoDB (if not running):

bash
# macOS (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
Start the backend server:

bash
npm run dev
The API will be available at http://localhost:5000

3. Setup Frontend
Open a new terminal window:

bash
cd frontend
npm install
Create a .env.local file in the frontend directory:

env
NEXT_PUBLIC_API_URL=http://localhost:5000
Start the frontend development server:

bash
npm run dev
The application will be available at http://localhost:3000

API Endpoints
Authentication
POST /api/auth/signup - Create new user account
POST /api/auth/login - Login user
Properties
GET /api/properties - Get all properties (public)
GET /api/properties/:id - Get single property (public)
POST /api/properties - Create property (admin only)
PUT /api/properties/:id - Update property (admin only)
DELETE /api/properties/:id - Delete property (admin only)
Bookings
GET /api/bookings/my-bookings - Get user's bookings (authenticated)
GET /api/bookings/all - Get all bookings (admin only)
POST /api/bookings - Create new booking (authenticated)
PATCH /api/bookings/:id/cancel - Cancel booking (authenticated)
Usage
Creating a User Account
Navigate to http://localhost:3000/signup
Fill in your name, email, and password
Click "Sign Up"
You'll be automatically logged in and redirected to the properties page
Browsing Properties
Visit the home page or click "Properties" in the navigation
Browse available properties
Click on a property card to view details
Making a Booking
Ensure you're logged in
Navigate to a property detail page
Select check-in and check-out dates
Choose number of guests
Click "Reserve"
You'll be redirected to "My Bookings" page
Managing Bookings
Click "My Bookings" in the navigation
View all your bookings with status
Cancel bookings if needed
Seeding Sample Data
To add sample properties for testing, you can create a seed script or use MongoDB Compass/CLI:

javascript
// Sample property data
db.properties.insertMany([
  {
    title: "Luxury Beach Villa",
    description: "Beautiful beachfront villa with stunning ocean views. Perfect for families and groups looking for a relaxing getaway.",
    price: 15000,
    location: "Goa, India",
    images: ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf"],
    amenities: ["WiFi", "Pool", "Kitchen", "Air Conditioning", "Beach Access", "Parking"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },
  {
    title: "Mountain Retreat Cabin",
    description: "Cozy cabin nestled in the mountains with breathtaking views. Ideal for nature lovers and adventure seekers.",
    price: 8000,
    location: "Manali, Himachal Pradesh",
    images: ["https://images.unsplash.com/photo-1587061949409-02df41d5e562"],
    amenities: ["WiFi", "Fireplace", "Kitchen", "Heating", "Mountain View", "Parking"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Urban Modern Apartment",
    description: "Stylish apartment in the heart of the city. Walking distance to restaurants, shops, and entertainment.",
    price: 5000,
    location: "Mumbai, Maharashtra",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
    amenities: ["WiFi", "Gym", "Air Conditioning", "Elevator", "City View", "Security"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  }
]);
Creating an Admin User
To create an admin user, you can either:

Via MongoDB directly:
javascript
   db.users.updateOne(
     { email: "admin@staywise.com" },
     { $set: { role: "admin" } }
   );
Via signup and manual update:
Sign up normally through the app
Use MongoDB Compass or CLI to update the user's role field to "admin"
Environment Variables
Backend (.env)
Variable	Description	Default
PORT	Server port	5000
MONGODB_URI	MongoDB connection string	mongodb://localhost:27017/staywise
JWT_SECRET	Secret key for JWT tokens	(required)
NODE_ENV	Environment mode	development
Frontend (.env.local)
Variable	Description	Default
NEXT_PUBLIC_API_URL	Backend API URL	http://localhost:5000
Building for Production
Backend
bash
cd backend
npm run build
npm start
Frontend
bash
cd frontend
npm run build
npm start
Project Features Checklist
✅ Authentication & Authorization
Email/password signup and login
Password hashing with bcryptjs
JWT-based authentication
Protected routes
✅ Properties
List all properties
View property details
Admin CRUD operations
✅ Bookings
Create bookings with date validation
View personal bookings
Cancel bookings
Admin view all bookings
Availability checking
✅ UI Pages
Login/Signup pages
Property list page
Property detail page
My Bookings page
Responsive design
Code Quality
TypeScript - Full type safety across frontend and backend
Clean Code - Organized folder structure with separation of concerns
Error Handling - Proper error handling and user feedback
Validation - Input validation on both client and server
Security - Password hashing, JWT authentication, protected routes
Common Issues & Solutions
MongoDB Connection Error
Error: connect ECONNREFUSED 127.0.0.1:27017
Solution: Ensure MongoDB is running on your system

CORS Error
Solution: Check that NEXT_PUBLIC_API_URL in frontend .env.local matches your backend URL

Token Expired
Solution: Login again to get a new JWT token (tokens expire after 7 days)

Contributing
Fork the repository
Create a feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
License
This project is licensed under the MIT License.

Support
For issues and questions, please open an issue on the GitHub repository.

Built with ❤️ using Next.js, Express.js, and MongoDB

