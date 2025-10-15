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
# StayWise — Property Booking Platform

Lightweight full-stack property booking app built with Next.js, Express, MongoDB and TypeScript.

## Highlights

- User signup/login (JWT)
- Browse/filter/search properties (server-side text search)
- Property detail pages with booking form (calendar shows unavailable dates)
- Create / view / cancel bookings
- Admin CRUD for properties and admin view of all bookings
- Responsive UI (Tailwind CSS)
- Server-side pagination for properties

---

## Quickstart (local)

Prerequisites

- Node.js 18+
- MongoDB 6+ (running locally or accessible via connection string)

1) Clone & install

```bash
git clone <repo-url>
cd staywise
```

2) Backend

```bash
cd backend
npm install
# create a .env with the variables below
npm run dev
```

Default dev server: http://localhost:8000 (check `backend/.env` or `PORT`)

3) Frontend

```bash
cd ../frontend
npm install
# create .env.local with NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Default dev server: http://localhost:3000

---

## Environment variables

Backend (`backend/.env`)

- PORT — server port (default 8000)
- MONGODB_URI — MongoDB connection string (default: mongodb://localhost:27017/staywise)
- JWT_SECRET — secret for signing JWTs (required)
- NODE_ENV — development/production

Frontend (`frontend/.env.local`)

- NEXT_PUBLIC_API_URL — e.g. http://localhost:8000

---

## API (important endpoints)

Authentication

- POST /api/auth/signup — sign up
- POST /api/auth/login — login

Properties

- GET /api/properties — list properties (supports filters + pagination)
  - Query params: q (text), bedrooms/minBeds/maxBeds, minPrice/maxPrice, page, limit
  - Response: { data: Property[], total, page, pages }
- GET /api/properties/:id — get property details
- POST /api/properties — create (admin)
- PUT /api/properties/:id — update (admin)
- DELETE /api/properties/:id — delete (admin)

Bookings

- GET /api/bookings/property/:propertyId — get bookings for a property (used to compute unavailable dates)
- GET /api/bookings/my-bookings — get current user's bookings (auth)
- GET /api/bookings/all — admin only
- POST /api/bookings — create booking (auth). Request body: { propertyId, checkIn, checkOut, guests }
- PATCH /api/bookings/:id/cancel — cancel booking (auth)

---

## Pagination (Properties)

The properties list supports server-side pagination. Example:

```
GET /api/properties?page=2&limit=12
```

Response shape:

```json
{
  "data": [ /* array of Property objects */ ],
  "total": 123,
  "page": 2,
  "pages": 11
}
```

The frontend `Explore Properties` page uses `page` and `limit` state and has Prev/Next controls.

---

## Booking availability / Calendar behavior

- The frontend fetches bookings for the selected property using `/api/bookings/property/:propertyId` and computes unavailable days (checkout day is exclusive).
- The booking calendar (react-datepicker) disables unavailable days and prevents overlap.
- Dates are normalized to start-of-day on the frontend to avoid timezone off-by-one issues.

---

## Common commands

Backend

```bash
cd backend
npm run dev       # development with ts-node
npm run build     # compile to dist
npm start         # start compiled dist
```

Frontend

```bash
cd frontend
npm run dev
npm run build
npm start
```

---

## Notes & Troubleshooting

- If `Cannot GET /api/...` appears, ensure the backend is running on the URL set in `NEXT_PUBLIC_API_URL` and the correct port.
- If you see timezone-related off-by-one dates in the calendar, ensure the frontend code uses start-of-day normalization (this project already does).
- For production, set strong `JWT_SECRET`, use HTTPS, and configure a proper MongoDB production instance.

---

## Contributing

Fork, branch, open a PR. Keep changes focused and add tests for new behavior when possible.

---

License: MIT
My Bookings page

