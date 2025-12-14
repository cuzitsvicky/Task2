# Deployment Checklist ✅

Use this checklist to ensure you complete all deployment steps correctly.

## Pre-Deployment

- [ ] Code is pushed to GitHub
- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] Backend API working locally

## MongoDB Atlas Setup

- [ ] Created MongoDB Atlas account
- [ ] Created free cluster (M0)
- [ ] Created database user (username + password saved)
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied and password replaced
- [ ] Connection string tested (can connect)

## Backend Deployment

- [ ] Created Railway/Render account
- [ ] Connected GitHub repository
- [ ] Set root directory to `backend`
- [ ] Added environment variable: `MONGODB_URI`
- [ ] Added environment variable: `JWT_SECRET` (generated secure key)
- [ ] Added environment variable: `NODE_ENV=production`
- [ ] Backend deployed successfully
- [ ] Backend URL copied (e.g., `https://xxx.railway.app`)

## Frontend Deployment

- [ ] Created Vercel account
- [ ] Connected GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Added environment variable: `VITE_API_URL` (with backend URL + `/api`)
- [ ] Frontend deployed successfully
- [ ] Frontend URL copied (e.g., `https://xxx.vercel.app`)

## Post-Deployment

- [ ] Updated backend `FRONTEND_URL` environment variable
- [ ] Backend redeployed (if needed)
- [ ] Tested frontend URL in browser
- [ ] Tested user signup
- [ ] Tested user login
- [ ] Tested creating plan (as trainer)
- [ ] Tested viewing plans
- [ ] Tested subscribing to plan
- [ ] Tested following trainer
- [ ] No CORS errors in console
- [ ] No API connection errors
- [ ] All features working

## Security Checklist

- [ ] `.env` files in `.gitignore`
- [ ] No secrets committed to GitHub
- [ ] JWT_SECRET is long and random (64+ chars)
- [ ] MongoDB password is strong
- [ ] CORS only allows your frontend URL

## Optional Enhancements

- [ ] Custom domain configured
- [ ] HTTPS enabled (usually automatic)
- [ ] Error tracking set up
- [ ] Analytics configured
- [ ] Database backups verified

---

## Quick Test URLs

After deployment, test these:

1. **Frontend Home:** `https://your-app.vercel.app`
2. **Signup:** `https://your-app.vercel.app/login`
3. **Backend Health:** `https://your-backend.railway.app/api/plans` (should return plans or empty array)

---

## If Something Goes Wrong

1. Check deployment platform logs
2. Check browser console (F12)
3. Verify all environment variables are set
4. Test backend URL directly in browser/Postman
5. Check MongoDB Atlas connection
6. Review error messages carefully

---

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

