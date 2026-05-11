# 🚀 Deploy to Vercel - Complete Guide

## ⚠️ Important: Database Migration Required

Your app currently uses **SQLite**, which is **not supported on Vercel** (serverless platforms don't have persistent file storage).

You need to migrate to **PostgreSQL** for production deployment.

---

## Option 1: Vercel Postgres (Easiest)

### Step 1: Create Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `Keerthan-Bhat/-Expense-Revenue-Tracker-SaaS-`
4. Before deploying, go to **"Storage"** tab
5. Click **"Create Database"** → **"Postgres"**
6. Name it: `expense-tracker-db`
7. Click **"Create"**
8. Copy the `POSTGRES_URL` environment variable

### Step 2: Update Environment Variables

In Vercel project settings, add:
```
POSTGRES_URL=postgresql://...
DATABASE_URL=postgresql://...
```

### Step 3: Migrate Database Schema

Your current schema uses SQLite. You'll need to update it for PostgreSQL (see migration guide below).

---

## Option 2: Use External Database Providers

### Neon (Free PostgreSQL)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to Vercel environment variables

### Supabase (Free PostgreSQL)
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Get database connection string from Settings
4. Add to Vercel environment variables

### Railway (Free Tier)
1. Sign up at [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string
4. Add to Vercel environment variables

---

## Quick Deploy Steps (After Database Setup)

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
cd "C:\Users\User\SaaS Based Project\expense-revenue-tracker"
vercel
```

### 4. Set Environment Variables
```bash
vercel env add DATABASE_URL
# Paste your PostgreSQL connection string
```

### 5. Deploy to Production
```bash
vercel --prod
```

---

## PostgreSQL Schema Changes Needed

### Update `prisma/schema.prisma`:

Change from:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

To:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Remove SQLite-specific types:
- Remove `Decimal` type if used (use `Float` instead)
- Ensure all `String @default(cuid())` are correct

### Run migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

---

## Alternative: Deploy with SQLite (Not Recommended)

If you absolutely want to keep SQLite, you'll need to use a different hosting provider:

### Options that support SQLite:
1. **Railway.app** - Supports SQLite with persistent storage
2. **Render.com** - Supports SQLite
3. **Fly.io** - Supports SQLite with volumes
4. **DigitalOcean App Platform** - With persistent volumes

### Deploy to Railway (SQLite-friendly):
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

---

## Recommended Path

1. **Migrate to PostgreSQL** (15 minutes)
2. **Deploy to Vercel** (5 minutes)
3. **Use Vercel Postgres** (free tier: 256MB)

This gives you:
- ✅ Automatic deployments from Git
- ✅ Free SSL certificates
- ✅ Global CDN
- ✅ Serverless functions
- ✅ Free tier for hobby projects
- ✅ Easy scaling

---

## Need Help?

Run this command to get step-by-step guided migration:
```bash
# I can help you migrate the schema automatically!
# Just ask me to: "Migrate my Prisma schema from SQLite to PostgreSQL"
```
