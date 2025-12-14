# FitPlanHub - Trainers & Users Platform

A full-stack fitness platform where certified trainers create fitness plans and users purchase & follow these plans.

## Features

### Authentication
- Signup & login for both trainers and regular users
- Password hashing with bcryptjs
- JWT token authentication

### Trainer Dashboard
- Create fitness plans with title, description, price, and duration
- Edit or delete their own plans
- View all plans created

### User Features
- View all available fitness plans
- Purchase/subscribe to plans (simulated payment)
- Access full plan details after subscription
- Follow/unfollow trainers
- Personalized feed showing plans from followed trainers
- View list of subscribed plans

### Access Control
- Only subscribed users can view full plan details
- Non-subscribers see preview (title, trainer name, price only)

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- Context API for state management

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitplanhub
JWT_SECRET=your_secret_key_change_in_production
```

4. Make sure MongoDB is running on your system

5. Start the backend server:
```bash
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port Vite assigns)

## Usage

1. Start MongoDB (if using local installation)
2. Start the backend server
3. Start the frontend development server
4. Open your browser and navigate to the frontend URL
5. Sign up as either a user or trainer
6. Explore the platform!

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user/trainer
- `POST /api/auth/login` - Login

### Plans
- `GET /api/plans` - Get all plans
- `GET /api/plans/:id` - Get plan by ID
- `POST /api/plans` - Create plan (trainer only)
- `PUT /api/plans/:id` - Update plan (trainer only, own plans)
- `DELETE /api/plans/:id` - Delete plan (trainer only, own plans)

### Subscriptions
- `POST /api/subscriptions/:planId` - Subscribe to a plan (user only)
- `GET /api/subscriptions/my-subscriptions` - Get user's subscriptions

### Follows
- `POST /api/follows/:trainerId` - Follow a trainer (user only)
- `DELETE /api/follows/:trainerId` - Unfollow a trainer (user only)
- `GET /api/follows/my-follows` - Get followed trainers
- `GET /api/follows/check/:trainerId` - Check if following a trainer

### Feed
- `GET /api/feed` - Get personalized feed (user only)

### Trainers
- `GET /api/trainers/:trainerId` - Get trainer profile

## Project Structure

```
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── FitnessPlan.js
│   │   ├── Subscription.js
│   │   └── Follow.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── plans.js
│   │   ├── subscriptions.js
│   │   ├── follows.js
│   │   ├── feed.js
│   │   └── trainers.js
│   ├── middleware/
│   │   └── auth.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── TrainerDashboard.jsx
│   │   │   ├── PlanDetails.jsx
│   │   │   ├── UserFeed.jsx
│   │   │   ├── TrainerProfile.jsx
│   │   │   └── MySubscriptions.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Deployment

For detailed deployment instructions, see:
- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Step-by-step deployment guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive deployment documentation
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Deployment checklist

### Quick Deployment Overview

1. **Database:** Set up MongoDB Atlas (free tier)
2. **Backend:** Deploy to Railway or Render
3. **Frontend:** Deploy to Vercel
4. **Environment Variables:** Configure in each platform

See the deployment guides for detailed instructions.

## Notes

- Make sure MongoDB is running before starting the backend
- Update the JWT_SECRET in `.env` with a secure random string for production
- The subscription payment is simulated (no real payment gateway)
- All routes except signup/login require authentication via JWT token
- For production, update `VITE_API_URL` in frontend to point to your deployed backend
