# GigFlow - Freelance Marketplace Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://gigflow.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend-API-blue)](https://gigflow-api.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/yourusername/gigflow)

##  Assignment Submission for ServiceHive Internship

A full-stack freelance marketplace platform where clients post jobs and freelancers bid on them, implementing secure authentication, complex database relationships, and transactional hiring logic.

## Live Deployment
- **Frontend:** [https://gigflow.vercel.app](https://gigflow.vercel.app)
- **Backend API:** [https://gigflow-api.onrender.com](https://gigflow-api.onrender.com)
- **API Documentation:** [See API Endpoints](#-api-endpoints)

##  Features Implemented

###  Core Requirements (100% Complete)
- **Secure Authentication:** JWT with HttpOnly cookies
- **Gig Management:** Full CRUD operations with search functionality
- **Bidding System:** Freelancers can bid on open gigs
- **Hiring Logic:** Atomic hiring with transaction safety
- **Authorization:** Role-based access control

###  Bonus Features
- ** Bonus 1:** MongoDB Transactions for race condition prevention
- ** Bonus 2:** Socket.io real-time notifications (in progress)

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js + Vite + Tailwind CSS + Redux Toolkit |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose (MongoDB Atlas) |
| **Authentication** | JWT with HttpOnly cookies |
| **State Management** | Redux Toolkit |
| **Deployment** | Vercel (Frontend) + Render (Backend) |

##  Project Structure

gigflow/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB schemas
│   │   ├── middleware/     # Auth middleware
│   │   └── routes/         # API routes
│   └── .env.example        # Environment variables template
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── features/       # Redux slices
│   │   ├── hooks/          # Custom hooks
│   │   └── store/          # Redux store
│   └── .env.example        # Frontend environment variables
└── README.md               # This file

## Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or MongoDB Atlas)
- npm or yarn

### Backend Setup
\`\`\`bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev           # Starts server on http://localhost:5001
\`\`\`

### Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run dev           # Starts app on http://localhost:5173
\`\`\`

### Environment Variables
Create \`.env\` file in both backend and frontend directories:

**Backend (.env):**
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
\`\`\`

**Frontend (.env):**
\`\`\`env
VITE_API_URL=http://localhost:5001/api
\`\`\`

##  API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | \`/api/auth/register\` | Register new user | No |
| POST | \`/api/auth/login\` | Login user | No |
| POST | \`/api/auth/logout\` | Logout user | Yes |
| GET | \`/api/gigs\` | Get all open gigs (with search) | No |
| POST | \`/api/gigs\` | Create new gig | Yes |
| POST | \`/api/bids\` | Submit bid on gig | Yes |
| GET | \`/api/bids/:gigId\` | Get bids for specific gig | Yes (Owner only) |
| PATCH | \`/api/bids/:bidId/hire\` | Hire freelancer | Yes (Owner only) |

##  Database Schema

### User Model
\`\`\`javascript
{
  name: String,
  email: String (unique),
  password: String (hashed)
}
\`\`\`

### Gig Model
\`\`\`javascript
{
  title: String,
  description: String,
  budget: Number,
  ownerId: ObjectId (ref: User),
  status: ['open', 'assigned']
}
\`\`\`

### Bid Model
\`\`\`javascript
{
  gigId: ObjectId (ref: Gig),
  freelancerId: ObjectId (ref: User),
  message: String,
  price: Number,
  status: ['pending', 'hired', 'rejected']
}
\`\`\`

##  Key Implementation Details

### Transactional Hiring Logic
The hiring process uses MongoDB transactions to prevent race conditions:
\`\`\`javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  // 1. Lock the gig
  // 2. Update bid status to 'hired'
  // 3. Reject all other bids
  // 4. Commit transaction
} catch (error) {
  await session.abortTransaction();
  throw error;
}
\`\`\`

### Security Features
- HttpOnly cookies for JWT tokens
- Password hashing with bcrypt
- Owner-only access to bid lists
- Input validation and sanitization

##  Testing Flow

1. **Register** two users (Client & Freelancer)
2. **Client** creates a gig
3. **Freelancer** bids on the gig
4. **Client** views bids and hires freelancer
5. **System** automatically rejects other bids
6. **Gig status** changes from 'open' to 'assigned'

##  Deployment

### Backend (Render.com)
1. Push code to GitHub
2. Connect repo to Render
3. Add environment variables
4. Deploy

### Frontend (Vercel)
1. Update API URLs to production
2. Build production bundle
3. Deploy to Vercel
4. Configure CORS

##  Demo Video
[Watch 2-minute demo on Loom](https://www.loom.com/share/your-video-link)

##  Submission Details
Submitted to: ritik.yadav@servicehive.tech  
CC: hiring@servicehive.tech

##  Author
Saloni Gupta 


