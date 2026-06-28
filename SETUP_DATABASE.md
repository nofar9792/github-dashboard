# Database & Authentication Setup Guide

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up (free account)
3. Create new project:
   - Name: `github-dashboard`
   - Region: Closest to you
   - Password: Generate strong password (save it!)
4. Wait for project to initialize (2-3 min)

## Step 2: Get Connection Details

In Supabase dashboard:

1. Navigate to **Settings** → **Database**
2. Copy:
   - **Connection string** (PostgreSQL URI)
   - Look for: `postgresql://postgres:PASSWORD@...`

3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (under Project API keys)

## Step 3: Create `.env.local`

```bash
# .env.local (Never commit this!)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-key-here
DATABASE_URL=postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres

# GitHub OAuth (optional for later)
GITHUB_CLIENT_ID=your-github-oauth-id
GITHUB_CLIENT_SECRET=your-github-oauth-secret
```

## Step 4: Initialize Prisma

```bash
# Generate Prisma schema from database
npx prisma db pull

# Generate Prisma client
npx prisma generate
```

## Step 5: Create Tables

Run the SQL in Supabase SQL Editor:

```sql
-- Users table
create table public.users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  github_username text,
  github_id integer,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Saved profiles
create table public.saved_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  github_username text not null,
  notes text,
  saved_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, github_username)
);

-- Collections
create table public.collections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Profiles in collections
create table public.profiles_in_collections (
  profile_id uuid not null references public.saved_profiles(id) on delete cascade,
  collection_id uuid not null references public.collections(id) on delete cascade,
  primary key (profile_id, collection_id)
);

-- Enable RLS (Row Level Security)
alter table public.users enable row level security;
alter table public.saved_profiles enable row level security;
alter table public.collections enable row level security;
alter table public.profiles_in_collections enable row level security;
```

## Step 6: Verify Setup

```bash
# Test database connection
npx prisma db execute --stdin < /dev/null

# Generate client
npx prisma generate

# Check schema
npx prisma studio
```

## Next Steps

Once you have:

- ✅ Supabase project created
- ✅ `.env.local` configured
- ✅ Tables created
- ✅ Prisma client generated

Run: `npm run ci` to verify everything works

Then we'll implement:

1. Authentication routes
2. Save profile UI
3. My Profiles page
4. Collections management
