# Deployment Guide for FitPlanHub

This guide will help you deploy both the frontend and backend of your FitPlanHub application.

## Prerequisites

1. **GitHub Account** (for version control)
2. **MongoDB Atlas Account** (free tier available at https://www.mongodb.com/cloud/atlas)
3. **Vercel Account** (for frontend - free at https://vercel.com)
4. **Railway Account** (for backend - free tier at https://railway.app) OR **Render Account** (alternative)

---

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to https://www.mongodb.com/cloud/atlas and sign up/login
2. Create a new cluster (choose FREE tier)
3. Create a database user:
   - Go to "Database Access" → "Add New Database User"
   - Username: `fitplanhub` (or your choice)
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Atlas admin"
4. Whitelist your IP:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
5. Get your connection string:
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`)
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `fitplanhub` (or your database name)

**Save this connection string - you'll need it for the backend!**

---

## Step 2: Prepare Backend for Deployment

### 2.1 Update Backend Environment Variables

Create a `.env` file in the `backend` folder (if it doesn't exist):

```env
MONGODB_URI=your_mongodb_atlas_connection_string_here
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

**Important:** Generate a strong JWT_SECRET. You can use:
- Online generator: https://randomkeygen.com/
- Or run: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 2.2 Update CORS Settings

The backend already has CORS enabled, but we'll need to update it to allow your frontend domain.

---

## Step 3: Deploy Backend to Railway (Recommended)

### Option A: Railway (Easiest)

1. **Sign up at Railway:**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select your repository
   - Select the `backend` folder as the root directory

3. **Configure Environment Variables:**
   - In Railway dashboard, go to your project → "Variables"
   - Add these variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_jwt_secret_here
     PORT=5000
     NODE_ENV=production
     ```

4. **Deploy:**
   - Railway will automatically detect Node.js and deploy
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render (Alternative)

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** fitplanhub-backend
   - **Root Directory:** backend
   - **Environment:** Node
   - **Build Command:** (leave empty or `npm install`)
   - **Start Command:** `npm start`
5. Add Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
6. Click "Create Web Service"
7. Copy your backend URL (e.g., `https://fitplanhub-backend.onrender.com`)

---

## Step 4: Update Frontend API Configuration

Before deploying the frontend, we need to make it use environment variables for the API URL.

### 4.1 Update `frontend/src/services/api.js`

The API URL should use an environment variable that defaults to localhost for development.

### 4.2 Create `.env` files

- `frontend/.env.local` (for local development):
  ```
  VITE_API_URL=http://localhost:5000/api
  ```

- `frontend/.env.production` (will be set in Vercel):
  ```
  VITE_API_URL=https://your-backend-url.railway.app/api
  ```

---

## Step 5: Deploy Frontend to Vercel

1. **Sign up at Vercel:**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Install Vercel CLI (Optional but recommended):**
   ```bash
   npm install -g vercel
   ```

3. **Deploy via Dashboard:**
   - Go to Vercel dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset:** Vite
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`

4. **Add Environment Variable:**
   - In project settings → "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.railway.app/api`
   - Make sure to add it for "Production", "Preview", and "Development"

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment
   - Your site will be live at `https://your-app.vercel.app`

---

## Step 6: Update Backend CORS

After you have your frontend URL, update the backend CORS to allow it:

1. In Railway/Render, add environment variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```

2. Update `backend/server.js` to use this:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:5173',
     credentials: true
   }));
   ```

---

## Step 7: Test Your Deployment

1. Visit your frontend URL
2. Try signing up/logging in
3. Test all features (create plans, subscribe, etc.)
4. Check browser console for any errors
5. Check backend logs in Railway/Render dashboard

---

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Make sure backend CORS includes your frontend URL
   - Check that `FRONTEND_URL` environment variable is set correctly

2. **API Connection Errors:**
   - Verify `VITE_API_URL` is set correctly in Vercel
   - Make sure backend is deployed and running
   - Check backend logs for errors

3. **MongoDB Connection Errors:**
   - Verify `MONGODB_URI` is correct
   - Check MongoDB Atlas network access (IP whitelist)
   - Ensure database user has correct permissions

4. **Build Errors:**
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility
   - Check build logs in deployment platform

---

## Quick Reference

- **Frontend URL:** `https://your-app.vercel.app`
- **Backend URL:** `https://your-backend.railway.app` or `https://your-backend.onrender.com`
- **MongoDB:** MongoDB Atlas cluster

---

## Next Steps

1. Set up custom domain (optional)
2. Enable HTTPS (usually automatic)
3. Set up monitoring and error tracking
4. Configure backups for MongoDB

---

## Support

If you encounter issues:
1. Check deployment platform logs
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB Atlas is accessible

