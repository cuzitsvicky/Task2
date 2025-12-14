# FitPlanHub Setup Guide

## Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Backend

Create a `.env` file in the `backend` directory with the following content:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitplanhub
JWT_SECRET=your_secret_key_change_in_production_use_a_random_string
```

**Important:** Replace `your_secret_key_change_in_production_use_a_random_string` with a strong random string for production use.

### 3. Start MongoDB

Make sure MongoDB is running on your system:

- **Windows:** MongoDB should be running as a service or start it manually
- **macOS:** `brew services start mongodb-community` (if installed via Homebrew)
- **Linux:** `sudo systemctl start mongod` or `sudo service mongod start`

Alternatively, you can use MongoDB Atlas (cloud) and update the `MONGODB_URI` in `.env`.

### 4. Start Backend Server

```bash
cd backend
npm start
```

You should see:
```
Connected to MongoDB
Server is running on port 5000
```

### 5. Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 6. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will typically run on `http://localhost:5173`

### 7. Access the Application

Open your browser and navigate to `http://localhost:5173`

## Testing the Application

1. **Sign up as a Trainer:**
   - Click "Sign Up"
   - Fill in your details
   - Select "Trainer" as your role
   - Create some fitness plans in the Dashboard

2. **Sign up as a User:**
   - Logout (or use a different browser/incognito)
   - Click "Sign Up"
   - Select "User" as your role
   - Browse plans, subscribe, and follow trainers

3. **Test Features:**
   - View plans on landing page
   - Subscribe to plans
   - Follow/unfollow trainers
   - View personalized feed
   - Access trainer dashboard (trainer role only)

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check the connection string in `.env`
- For local MongoDB, ensure it's listening on the default port (27017)

### Port Already in Use
- Backend: Change `PORT` in `.env` file
- Frontend: Vite will automatically use the next available port

### CORS Errors
- Make sure the backend is running on port 5000
- Check that the frontend API URL matches your backend URL in `frontend/src/services/api.js`

### Authentication Issues
- Clear browser localStorage
- Make sure JWT_SECRET is set in backend `.env`
- Check browser console for error messages

## Project Structure

```
FitPlanHub/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Context providers
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   └── App.jsx      # Main app component
│   └── package.json
└── README.md
```

## Development Notes

- The backend uses ES modules (type: "module" in package.json)
- Frontend uses Vite for fast development
- JWT tokens are stored in localStorage
- All API requests include authentication token in headers (when logged in)
- Subscription payment is simulated (no real payment processing)
