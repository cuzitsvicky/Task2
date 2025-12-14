# Quick Deployment Guide - FitPlanHub

## 🚀 Quick Start (Step-by-Step)

### Prerequisites Checklist
- [ ] GitHub account
- [ ] MongoDB Atlas account (free)
- [ ] Vercel account (free)
- [ ] Railway account (free) or Render account

---

## 📦 Step 1: Set Up MongoDB Atlas (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas → Sign up (FREE)
2. Create a cluster → Choose FREE tier (M0)
3. **Create Database User:**
   - Database Access → Add New Database User
   - Username: `fitplanhub`
   - Password: Click "Autogenerate Secure Password" → **SAVE IT!**
4. **Network Access:**
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
5. **Get Connection String:**
   - Database → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your saved password
   - Replace `<dbname>` with `fitplanhub`
   - Example: `mongodb+srv://fitplanhub:YourPassword@cluster0.xxxxx.mongodb.net/fitplanhub?retryWrites=true&w=majority`

---

## 🔧 Step 2: Prepare Your Code

### 2.1 Push to GitHub (if not already)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fitplanhub.git
git push -u origin main
```

### 2.2 Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Save this output** - you'll need it for the backend!

---

## 🖥️ Step 3: Deploy Backend to Railway

### Option A: Railway (Recommended - Easiest)

1. **Sign up:** https://railway.app → Sign up with GitHub
2. **New Project:**
   - Click "New Project"
   - "Deploy from GitHub repo"
   - Select your repository
   - **Important:** In settings, set "Root Directory" to `backend`
3. **Add Environment Variables:**
   - Go to your project → Variables tab
   - Add these:
     ```
     MONGODB_URI = (your MongoDB Atlas connection string)
     JWT_SECRET = (the secret you generated)
     NODE_ENV = production
     FRONTEND_URL = (we'll add this after frontend is deployed)
     ```
4. **Deploy:**
   - Railway auto-detects and deploys
   - Wait for "Deploy Successful"
   - Copy your backend URL (e.g., `https://fitplanhub-production.up.railway.app`)

### Option B: Render (Alternative)

1. Go to https://render.com → Sign up with GitHub
2. New → Web Service
3. Connect your GitHub repo
4. Settings:
   - **Name:** fitplanhub-backend
   - **Root Directory:** backend
   - **Environment:** Node
   - **Build Command:** (leave empty)
   - **Start Command:** `npm start`
5. **Environment Variables:**
   ```
   MONGODB_URI = (your MongoDB connection string)
   JWT_SECRET = (your JWT secret)
   NODE_ENV = production
   FRONTEND_URL = (add after frontend deployment)
   ```
6. Click "Create Web Service"
7. Copy your backend URL

---

## 🎨 Step 4: Deploy Frontend to Vercel

1. **Sign up:** https://vercel.com → Sign up with GitHub
2. **New Project:**
   - Click "Add New Project"
   - Import your GitHub repository
3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` (click "Edit" and set this)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables:**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL = https://your-backend-url.railway.app/api
     ```
     (Use your actual backend URL from Step 3)
   - Make sure to add for: Production, Preview, and Development
5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your site is live! (e.g., `https://fitplanhub.vercel.app`)

---

## 🔄 Step 5: Update Backend CORS

Now that you have your frontend URL, update the backend:

1. Go back to Railway/Render
2. Add/Update environment variable:
   ```
   FRONTEND_URL = https://your-frontend-url.vercel.app
   ```
3. Redeploy the backend (Railway auto-redeploys, Render may need manual redeploy)

---

## ✅ Step 6: Test Your Deployment

1. Visit your frontend URL
2. Try signing up with a new account
3. Test features:
   - Login/Logout
   - Create plan (as trainer)
   - View plans
   - Subscribe to plan
   - Follow trainer

---

## 🐛 Troubleshooting

### "Cannot connect to API"
- Check `VITE_API_URL` in Vercel environment variables
- Verify backend is running (check Railway/Render logs)
- Make sure backend URL doesn't have trailing slash

### "CORS Error"
- Verify `FRONTEND_URL` is set in backend environment variables
- Check that frontend URL matches exactly (including https://)
- Redeploy backend after adding FRONTEND_URL

### "MongoDB Connection Error"
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas Network Access (IP whitelist)
- Ensure password in connection string is URL-encoded

### "JWT Error"
- Make sure `JWT_SECRET` is set in backend
- Use a long, random string (64+ characters)

---

## 📝 Environment Variables Summary

### Backend (Railway/Render):
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_long_random_string
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Frontend (Vercel):
```
VITE_API_URL=https://your-backend.railway.app/api
```

---

## 🎉 You're Done!

Your app should now be live and accessible from anywhere!

- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.railway.app
- **Database:** MongoDB Atlas

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com)

---

## 💡 Pro Tips

1. **Custom Domain:** Add your own domain in Vercel settings
2. **Monitoring:** Set up error tracking (Sentry, LogRocket)
3. **Backups:** MongoDB Atlas has automatic backups
4. **Environment Variables:** Never commit `.env` files to GitHub

